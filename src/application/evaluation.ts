// src/application/evaluation.ts
/** Draft 5 の Contract/Projection/InterfaceUse 評価を記述モデルから分離して計算します。 */

import { parseHTTPApi, parseHTTPOperation } from "./invocation";
import { routeHandleFor } from "./routes";
import type { ARDocument, Capability, CapabilityEvaluation, InterfaceDefinition, InterfaceUse, OpaqueExtensionElement, ProjectionValidationState, RequirementDefinition, RequirementEvaluationState, RouteEvaluation, SupportState } from "../domain/model";
import { evaluateProfileDocument, type CapabilityContract, type SemanticRegistry } from "../ports/semantic";

/** exact identifier で Contract を解決し、first-wins を避けます。 */
export function resolveContract(identifier: string, registry: SemanticRegistry): { readonly state: "RESOLVED" | "UNRESOLVED"; readonly contract?: CapabilityContract } {
  const candidates = registry.resolveCapability(identifier).filter((item) => item.identifier === identifier);
  if (candidates.length !== 1) return { state: "UNRESOLVED" };
  return { state: "RESOLVED", contract: candidates[0] };
}

/** Contract と Entity projection を構造的に比較します。 */
export function validateProjection(capability: Capability, contract: CapabilityContract | undefined, resolved: "RESOLVED" | "UNRESOLVED"): ProjectionValidationState {
  if (resolved !== "RESOLVED" || !contract) return "UNVALIDATED";
  const expected = contract.invocation;
  let hasConflict = false;
  let unvalidatedDifference = false;
  if (!expected && capability.invocation) hasConflict = true;
  if (expected && !capability.invocation) hasConflict = true;
  if (expected && capability.invocation) {
    const contractInputs = expected.inputs ?? [];
    const entityInputs = capability.invocation.inputs;
    if (contractInputs.length !== entityInputs.length) hasConflict = true;
    const permittedNarrowing = new Set(contract.permittedInputRequirednessNarrowing ?? []);
    for (const item of contractInputs) {
      const actual = entityInputs.find((candidate) => candidate.name === item.name);
      if (!actual || actual.type !== item.type) { hasConflict = true; continue; }
      if (item.required && !actual.required) hasConflict = true;
      if (!item.required && actual.required && !permittedNarrowing.has(item.name)) hasConflict = true;
      if (actual.format !== item.format || actual.unit !== item.unit) unvalidatedDifference = true;
    }
    if (Boolean(expected.result) !== Boolean(capability.invocation.result)) hasConflict = true;
    if (expected.result && capability.invocation.result) {
      if (expected.result.outputs.length !== capability.invocation.result.outputs.length) hasConflict = true;
      for (const output of expected.result.outputs) { const actual = capability.invocation.result.outputs.find((candidate) => candidate.name === output.name); if (!actual || actual.type !== output.type) { hasConflict = true; continue; } if (actual.format !== output.format || actual.unit !== output.unit) unvalidatedDifference = true; }
      const expectedRepresentations = expected.result.representations.map((item) => item.mediaType.toLowerCase()).sort();
      const actualRepresentations = capability.invocation.result.representations.map((item) => item.mediaType.toLowerCase()).sort();
      if (expectedRepresentations.length !== actualRepresentations.length || expectedRepresentations.some((item, index) => item !== actualRepresentations[index])) hasConflict = true;
    }
    const hasUnknownConstraint = (expected.inputs ?? []).some((item) => (item.constraints?.length ?? 0) > 0) || capability.invocation.inputs.some((item) => (item.constraints?.length ?? 0) > 0) || expected.result?.outputs.some((item) => (item.constraints?.length ?? 0) > 0) === true || capability.invocation.result?.outputs.some((item) => (item.constraints?.length ?? 0) > 0) === true;
    if (hasUnknownConstraint) unvalidatedDifference = true;
  }
  const requirementComparison = compareRequirements(getContractRequirements(contract), capability.requirements);
  if (hasConflict || requirementComparison.conflict) return "CONFLICT";
  return unvalidatedDifference || requirementComparison.unknown ? "UNVALIDATED" : "VALIDATED";
}

/** InterfaceUse を document order ではなく route 単位で評価します。 */
export function evaluateCapability(capability: Capability, interfaces: readonly InterfaceDefinition[], registry: SemanticRegistry): CapabilityEvaluation {
  if (capability.legacyDraft4) return { contractResolution: "UNRESOLVED", projectionValidation: "UNVALIDATED", availability: "READY", routes: [] };
  const contract = resolveContract(capability.semanticType, registry);
  const projectionValidation = validateProjection(capability, contract.contract, contract.state);
  if (!capability.invocation) return { contractResolution: contract.state, projectionValidation, routes: [] };
  const capabilityRequirement = evaluateRequirements(capability.requirements);
  const contractRequirements = contract.contract ? getContractRequirements(contract.contract) : [];
  const contractRequirement = contract.state === "RESOLVED" ? evaluateRequirements(contractRequirements) : "UNKNOWN";
  const routes = capability.interfaceUses.map((use) => evaluateRoute(routeHandleFor(capability.localId, use, capability.interfaceUses), use, interfaces.find((item) => item.id === use.ref), projectionValidation, capabilityRequirement, contractRequirement));
  const availability = aggregateAvailability(routes);
  return { contractResolution: contract.state, projectionValidation, ...(availability ? { availability } : {}), routes };
}

function evaluateRoute(routeId: string, use: InterfaceUse, definition: InterfaceDefinition | undefined, projection: ProjectionValidationState, capabilityRequirement: RequirementEvaluationState, contractRequirement: RequirementEvaluationState): RouteEvaluation {
  if (!definition) return { routeId, interfaceRef: use.ref, requirement: combineRequirement([capabilityRequirement, contractRequirement]), capabilityRequirement, contractRequirement, interfaceRequirement: "SATISFIED", attachment: "SATISFIED", support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "Interface が存在しません" };
  const interfaceRequirement = evaluateRequirements(definition.requirements);
  const requirement = combineRequirement([capabilityRequirement, contractRequirement, interfaceRequirement]);
  const attachment = definition.attachment ? "UNKNOWN" : "SATISFIED";
  if (!definition.realization) return { routeId, interfaceRef: use.ref, requirement, capabilityRequirement, contractRequirement, interfaceRequirement, attachment, support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "Realization がありません" };
  if (definition.realization.extension.namespace !== "https://relink.dev/ns/arxml/http/0.1" || definition.realization.extension.localName !== "api") return { routeId, interfaceRef: use.ref, requirement, capabilityRequirement, contractRequirement, interfaceRequirement, attachment, support: "UNKNOWN", availability: "UNKNOWN", reason: "未知の Realization です" };
  try { parseHTTPApi(definition.realization.extension); } catch { return { routeId, interfaceRef: use.ref, requirement, capabilityRequirement, contractRequirement, interfaceRequirement, attachment, support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "HTTP Realization が不正です" }; }
  let support: SupportState = "SUPPORTED";
  let operationMethod = "";
  const mappingExtension = use.mapping?.extension;
  if (mappingExtension && (mappingExtension.namespace !== "https://relink.dev/ns/arxml/http/0.1" || mappingExtension.localName !== "operation")) {
    support = "UNKNOWN";
  } else {
    try { const operation = parseHTTPOperation(mappingExtension); if (!operation) support = "UNSUPPORTED"; else operationMethod = operation.method; } catch { support = "UNSUPPORTED"; }
  }
  if (support === "SUPPORTED" && !["GET", "POST", "PUT", "PATCH"].includes(operationMethod)) support = "UNSUPPORTED";
  if (projection === "CONFLICT" || support === "UNSUPPORTED" || requirement === "UNSATISFIED") return { routeId, interfaceRef: use.ref, requirement, capabilityRequirement, contractRequirement, interfaceRequirement, attachment, support, availability: "UNAVAILABLE", reason: projection === "CONFLICT" ? "Capability projection が CONFLICT です" : "HTTP Mapping が未対応です" };
  if (projection === "UNVALIDATED" || requirement === "UNKNOWN" || attachment === "UNKNOWN" || support === "UNKNOWN") return { routeId, interfaceRef: use.ref, requirement, capabilityRequirement, contractRequirement, interfaceRequirement, attachment, support, availability: "UNKNOWN", reason: "必要な評価が UNKNOWN です" };
  return { routeId, interfaceRef: use.ref, requirement, capabilityRequirement, contractRequirement, interfaceRequirement, attachment, support, availability: "READY" };
}

/** Requirement に専用 evaluator がない場合は安全側の UNKNOWN を返します。 */
function evaluateRequirements(requirements: readonly RequirementDefinition[]): RequirementEvaluationState { return requirements.length === 0 ? "SATISFIED" : "UNKNOWN"; }
function combineRequirement(states: readonly RequirementEvaluationState[]): RequirementEvaluationState { if (states.includes("UNSATISFIED")) return "UNSATISFIED"; if (states.includes("UNKNOWN")) return "UNKNOWN"; return "SATISFIED"; }

function getContractRequirements(contract: CapabilityContract): readonly RequirementDefinition[] { return [...(contract.requirements ?? []), ...(contract.invocation?.requirements ?? [])]; }

interface RequirementComparison { readonly conflict: boolean; readonly unknown: boolean; }

/** Contract Requirement の omission/変更と Entity 固有の追加を分離して比較します。 */
function compareRequirements(contractItems: readonly RequirementDefinition[], entityItems: readonly RequirementDefinition[]): RequirementComparison {
  const usedEntityIndexes = new Set<number>();
  let unknown = false;
  for (const contractItem of contractItems) {
    const exactIndex = entityItems.findIndex((entityItem, index) => !usedEntityIndexes.has(index) && equivalentRequirement(contractItem, entityItem));
    if (exactIndex >= 0) { usedEntityIndexes.add(exactIndex); continue; }
    if (entityItems.some((entityItem) => entityItem.type === contractItem.type)) { unknown = true; continue; }
    return { conflict: true, unknown };
  }
  return { conflict: false, unknown };
}

/** Requirement body は opaque のため、同一構造だけを決定的な一致として扱います。 */
function equivalentRequirement(left: RequirementDefinition, right: RequirementDefinition): boolean {
  return left.type === right.type && equivalentExtensions(left.extensions, right.extensions);
}

function equivalentExtensions(left: readonly OpaqueExtensionElement[], right: readonly OpaqueExtensionElement[]): boolean {
  if (left.length !== right.length) return false;
  return left.every((leftItem, index) => {
    const rightItem = right[index];
    return leftItem.namespace === rightItem?.namespace && leftItem.localName === rightItem.localName && leftItem.text === rightItem.text && leftItem.attributes.length === (rightItem?.attributes.length ?? -1) && leftItem.attributes.every((attribute, attributeIndex) => {
      const rightAttribute = rightItem?.attributes[attributeIndex];
      return attribute.namespace === rightAttribute?.namespace && attribute.localName === rightAttribute.localName && attribute.value === rightAttribute.value;
    }) && equivalentOpaqueChildren(leftItem.children, rightItem?.children ?? []);
  });
}

function equivalentOpaqueChildren(left: readonly OpaqueExtensionElement[], right: readonly OpaqueExtensionElement[]): boolean {
  if (left.length !== right.length) return false;
  return left.every((leftItem, index) => equivalentExtensions([leftItem], right[index] ? [right[index]] : []));
}

function aggregateAvailability(routes: readonly RouteEvaluation[]): "READY" | "UNAVAILABLE" | "UNKNOWN" {
  if (routes.some((route) => route.availability === "READY")) return "READY";
  if (routes.some((route) => route.availability === "UNKNOWN")) return "UNKNOWN";
  if (routes.length > 0) return "UNAVAILABLE";
  return "UNAVAILABLE";
}

/** Profile claim と Profile 定義を分離した最小 conformance state です。 */
export type ProfileResolutionState = "RESOLVED" | "UNRESOLVED";
export type ProfileConformanceState = "CONFORMANT" | "NON_CONFORMANT" | "UNDETERMINED";
export interface ProfileEvaluation { readonly resolution: ProfileResolutionState; readonly conformance: ProfileConformanceState; }
/** 公開 Profile 評価の互換 entry point です。必ず文書全体 evaluator へ委譲します。 */
export function evaluateProfile(document: ARDocument, profileIdentifier: string, registry: SemanticRegistry): ProfileEvaluation { return evaluateProfileDocument(document, profileIdentifier, registry); }
