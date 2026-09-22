// src/ports/semantic.ts
/** Capability Contract と Profile の exact identity 解決を抽象化する Port です。 */

import type { ARDocument, CoreDataType, InputDefinition, OutputDefinition, RequirementDefinition, ResultDefinition } from "../domain/model";

/** Draft 5 の自動比較に必要な最小 Capability Contract です。 */
export interface CapabilityContract {
  readonly identifier: string;
  readonly requirements?: readonly RequirementDefinition[];
  readonly invocation?: { readonly inputs?: readonly InputDefinition[]; readonly result?: ResultDefinition; readonly requirements?: readonly RequirementDefinition[] };
}
/** Profile の exact identity と、最小限の Capability 要件です。 */
export interface ProfileCapabilityRequirement { readonly contractIdentifier: string; readonly required?: boolean; readonly requiredInputNames?: readonly string[]; readonly requiredOutputNames?: readonly string[]; }
export interface ProfilePropertyRequirement { readonly type: string; readonly required?: boolean; readonly value?: string; }
export interface ProfileIdentifierRequirement { readonly type: string; readonly required?: boolean; readonly value?: string; }
export interface ProfileInterfaceRequirement { readonly id?: string; readonly requireRealization?: boolean; readonly required?: boolean; }
export interface ProfileDefinition {
  readonly identifier: string;
  readonly requiredCapabilities?: readonly string[];
  readonly capabilityRequirements?: readonly ProfileCapabilityRequirement[];
  readonly propertyRequirements?: readonly ProfilePropertyRequirement[];
  readonly identifierRequirements?: readonly ProfileIdentifierRequirement[];
  readonly interfaceRequirements?: readonly ProfileInterfaceRequirement[];
}
/** 同一 identifier に対する候補定義を返す Semantic Registry です。 */
export interface SemanticRegistry {
  resolveCapability(identifier: string): readonly CapabilityContract[];
  resolveProfile(identifier: string): readonly ProfileDefinition[];
}
/** 空の registry。未解決を明示的に表します。 */
export class EmptySemanticRegistry implements SemanticRegistry {
  public resolveCapability(_identifier: string): readonly CapabilityContract[] { return []; }
  public resolveProfile(_identifier: string): readonly ProfileDefinition[] { return []; }
}
/** application が明示登録した定義を deterministic に返す registry です。 */
export class InMemorySemanticRegistry implements SemanticRegistry {
  private readonly capabilities: readonly CapabilityContract[];
  private readonly profiles: readonly ProfileDefinition[];
  public constructor(capabilities: readonly CapabilityContract[] = [], profiles: readonly ProfileDefinition[] = []) { this.capabilities = capabilities; this.profiles = profiles; }
  public resolveCapability(identifier: string): readonly CapabilityContract[] { return this.capabilities.filter((item) => item.identifier === identifier); }
  public resolveProfile(identifier: string): readonly ProfileDefinition[] { return this.profiles.filter((item) => item.identifier === identifier); }
}

/** Contract の Projection 比較で必要な semantic type を明示する helper です。 */
export function sameCoreType(left: CoreDataType, right: CoreDataType): boolean { return left === right; }
/** Output 型を比較する helper です。 */
export function sameOutputShape(left: OutputDefinition, right: OutputDefinition): boolean { return left.name === right.name && sameCoreType(left.type, right.type) && left.format === right.format && left.unit === right.unit; }

/** Profile の Entity characteristic 要件を決定的に比較します。 */
export function evaluateProfileDocument(document: ARDocument, profileIdentifier: string, registry: SemanticRegistry): { readonly resolution: "RESOLVED" | "UNRESOLVED"; readonly conformance: "CONFORMANT" | "NON_CONFORMANT" | "UNDETERMINED" } {
  const candidates = registry.resolveProfile(profileIdentifier).filter((item) => item.identifier === profileIdentifier);
  if (candidates.length !== 1) return { resolution: "UNRESOLVED", conformance: "UNDETERMINED" };
  const profile = candidates[0]!;
  const capabilityTypes = new Set(document.capabilities.map((item) => item.semanticType));
  for (const required of profile.requiredCapabilities ?? []) if (!capabilityTypes.has(required)) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  for (const required of profile.capabilityRequirements ?? []) {
    const capability = document.capabilities.find((item) => item.semanticType === required.contractIdentifier);
    if (!capability) { if (required.required !== false) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" }; continue; }
    if ((required.requiredInputNames?.length ?? 0) > 0 && !capability.invocation) return { resolution: "RESOLVED", conformance: "UNDETERMINED" };
    if ((required.requiredOutputNames?.length ?? 0) > 0 && !capability.invocation?.result) return { resolution: "RESOLVED", conformance: "UNDETERMINED" };
    const inputNames = new Set(capability.invocation?.inputs.map((item) => item.name)); for (const name of required.requiredInputNames ?? []) if (!inputNames.has(name)) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
    const outputNames = new Set(capability.invocation?.result?.outputs.map((item) => item.name)); for (const name of required.requiredOutputNames ?? []) if (!outputNames.has(name)) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  }
  for (const required of profile.propertyRequirements ?? []) { const found = document.properties.some((item) => item.type === required.type && (required.value === undefined || item.value === required.value)); if (!found && required.required !== false) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" }; }
  for (const required of profile.identifierRequirements ?? []) { const found = document.identifiers.some((item) => item.type === required.type && (required.value === undefined || item.value === required.value)); if (!found && required.required !== false) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" }; }
  for (const required of profile.interfaceRequirements ?? []) { const found = document.interfaces.some((item) => (required.id === undefined || item.id === required.id) && (!required.requireRealization || item.realization !== undefined)); if (!found && required.required !== false) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" }; }
  return { resolution: "RESOLVED", conformance: "CONFORMANT" };
}
