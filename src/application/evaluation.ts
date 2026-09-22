// src/application/evaluation.ts
/** Draft 5 の Contract/Projection/InterfaceUse 評価を記述モデルから分離して計算します。 */

import { parseHTTPApi, parseHTTPOperation } from "./invocation";
import { routeHandleFor } from "./routes";
import type { Capability, CapabilityEvaluation, InterfaceDefinition, InterfaceUse, ProjectionValidationState, RequirementDefinition, RequirementEvaluationState, RouteEvaluation, SupportState } from "../domain/model";
import type { CapabilityContract, SemanticRegistry } from "../ports/semantic";

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
  if (!expected && capability.invocation) return "CONFLICT";
  if (expected && !capability.invocation) return "CONFLICT";
  if (!expected || !capability.invocation) return "VALIDATED";
  const contractInputs = expected.inputs ?? [];
  const entityInputs = capability.invocation.inputs;
  if (contractInputs.length !== entityInputs.length) return "CONFLICT";
  for (const item of contractInputs) {
    const actual = entityInputs.find((candidate) => candidate.name === item.name);
    if (!actual || actual.type !== item.type || actual.required !== item.required || actual.format !== item.format || actual.unit !== item.unit) return "CONFLICT";
  }
  if (Boolean(expected.result) !== Boolean(capability.invocation.result)) return "CONFLICT";
  if (expected.result && capability.invocation.result) {
    if (expected.result.outputs.length !== capability.invocation.result.outputs.length) return "CONFLICT";
    for (const output of expected.result.outputs) { const actual = capability.invocation.result.outputs.find((candidate) => candidate.name === output.name); if (!actual || actual.type !== output.type || actual.format !== output.format || actual.unit !== output.unit) return "CONFLICT"; }
    const expectedRepresentations = expected.result.representations.map((item) => item.mediaType.toLowerCase()).sort();
    const actualRepresentations = capability.invocation.result.representations.map((item) => item.mediaType.toLowerCase()).sort();
    if (expectedRepresentations.length !== actualRepresentations.length || expectedRepresentations.some((item, index) => item !== actualRepresentations[index])) return "CONFLICT";
  }
  const contractRequirements = contract.requirements ?? expected.requirements ?? [];
  const hasUnknownConstraint = contractInputs.some((item) => (item.constraints?.length ?? 0) > 0) || entityInputs.some((item) => (item.constraints?.length ?? 0) > 0) || expected.result?.outputs.some((item) => (item.constraints?.length ?? 0) > 0) === true || capability.invocation.result?.outputs.some((item) => (item.constraints?.length ?? 0) > 0) === true;
  return hasUnknownConstraint || contractRequirements.length > 0 || capability.requirements.length > 0 ? "UNVALIDATED" : "VALIDATED";
}

/** InterfaceUse を document order ではなく route 単位で評価します。 */
export function evaluateCapability(capability: Capability, interfaces: readonly InterfaceDefinition[], registry: SemanticRegistry): CapabilityEvaluation {
  if (capability.legacyDraft4) return { contractResolution: "UNRESOLVED", projectionValidation: "UNVALIDATED", availability: "READY", routes: [] };
  const contract = resolveContract(capability.semanticType, registry);
  const projectionValidation = validateProjection(capability, contract.contract, contract.state);
  if (!capability.invocation) return { contractResolution: contract.state, projectionValidation, routes: [] };
  const capabilityRequirement = evaluateRequirements(capability.requirements);
  const contractRequirements = contract.contract ? contract.contract.requirements ?? contract.contract.invocation?.requirements ?? [] : [];
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
/** Profile を exact identifier で解決し、要求 Capability の有無だけを決定的に比較します。 */
export function evaluateProfile(capabilityTypes: readonly string[], profileIdentifier: string, registry: SemanticRegistry): ProfileEvaluation {
  const candidates = registry.resolveProfile(profileIdentifier).filter((item) => item.identifier === profileIdentifier);
  if (candidates.length !== 1) return { resolution: "UNRESOLVED", conformance: "UNDETERMINED" };
  const required = candidates[0]?.requiredCapabilities ?? [];
  return { resolution: "RESOLVED", conformance: required.every((item) => capabilityTypes.includes(item)) ? "CONFORMANT" : "NON_CONFORMANT" };
}
