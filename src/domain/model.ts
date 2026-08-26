// src/domain/model.ts
/** Core 0.1 Draft 4 が定義する基本データ型です。 */
export type CoreDataType = "string" | "number" | "integer" | "boolean" | "binary" | "object" | "array";
/** 文書ローカルな Capability 識別子です。 */
export type CapabilityLocalId = string;
/** Contract を識別する意味的 Capability Identifier です。 */
export type SemanticCapabilityIdentifier = string;
export type ContractResolutionState = "RESOLVED" | "UNRESOLVED";
export type ProjectionValidationState = "VALIDATED" | "UNVALIDATED" | "CONFLICT";
export type AvailabilityState = "READY" | "UNAVAILABLE" | "UNKNOWN";

export interface ProfileClaim { readonly href: string; }
export interface InputDefinition { readonly name: string; readonly type: CoreDataType; readonly required: boolean; readonly format?: string; readonly unit?: string; }
export interface OutputDefinition { readonly name: string; readonly type: CoreDataType; readonly format?: string; readonly unit?: string; }
export interface RepresentationDefinition { readonly mediaType: string; }
export interface CapabilityErrorDefinition { readonly type: string; }
export interface ResultDefinition { readonly outputs: readonly OutputDefinition[]; readonly representations: readonly RepresentationDefinition[]; readonly errors: readonly CapabilityErrorDefinition[]; }
export interface RequirementDefinition { readonly type: string; }
export interface HTTPInterfaceDefinition { readonly type: "http"; readonly method: "GET" | "POST"; readonly endpoint: string; readonly encoding?: "json"; readonly authentication?: { readonly type: string; readonly scope?: string }; }
export type InterfaceDefinition = HTTPInterfaceDefinition;
export interface Capability {
  readonly localId: CapabilityLocalId; readonly semanticType: SemanticCapabilityIdentifier;
  readonly inputs: readonly InputDefinition[]; readonly result: ResultDefinition;
  readonly requirements: readonly RequirementDefinition[]; readonly interfaces: readonly InterfaceDefinition[];
  readonly contractResolution: ContractResolutionState; readonly projectionValidation: ProjectionValidationState; readonly availability: AvailabilityState;
}
/** ブラウザ DOM と独立した、読み込み済み AR-XML の不変 AR-DOM です。 */
export interface ARDocument { readonly url: string; readonly category?: string; readonly profileClaims: readonly ProfileClaim[]; readonly capabilities: readonly Capability[]; }

/** Local ID を文字列として厳密比較します。 */
export function isSameCapabilityLocalId(left: CapabilityLocalId, right: CapabilityLocalId): boolean { return left === right; }
