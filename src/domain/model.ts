// src/domain/model.ts
/** AR-XML Core 0.1 Draft 5 のブラウザ非依存な記述モデルです。 */

/** Core が定義する構造データ型です。 */
export type CoreDataType = "string" | "number" | "integer" | "boolean" | "binary" | "object" | "array";
/** AR-XML を解釈する明示的な grammar mode です。 */
export type ARDocumentFormat = "draft5" | "draft4";
/** 文書内で Capability を識別する型です。 */
export type CapabilityLocalId = string;
/** Capability Contract を識別する、完全な Semantic Identifier です。 */
export type SemanticCapabilityIdentifier = string;
/** Contract の意味定義の解決状態です。 */
export type ContractResolutionState = "RESOLVED" | "UNRESOLVED";
/** Entity 側の Capability 投影を比較した結果です。 */
export type ProjectionValidationState = "VALIDATED" | "UNVALIDATED" | "CONFLICT";
/** InterfaceUse route の可用性です。 */
export type AvailabilityState = "READY" | "UNAVAILABLE" | "UNKNOWN";
/** Requirement などの Runtime 評価結果です。 */
export type RequirementEvaluationState = "SATISFIED" | "UNSATISFIED" | "UNKNOWN";
/** Extension の Runtime 対応状態です。 */
export type SupportState = "SUPPORTED" | "UNSUPPORTED" | "UNKNOWN";

/** Extension subtree を DOM に依存せず保持するための不透明な XML ノードです。 */
export interface OpaqueExtensionElement {
  readonly namespace: string;
  readonly localName: string;
  readonly attributes: readonly OpaqueExtensionAttribute[];
  readonly children: readonly OpaqueExtensionElement[];
  readonly text?: string;
}
/** Foreign metadata attribute の展開名と値です。 */
export interface OpaqueExtensionAttribute { readonly namespace: string; readonly localName: string; readonly value: string; }
/** Core 要素上の未知または未処理の foreign metadata です。 */
export interface ForeignMetadataAttribute extends OpaqueExtensionAttribute {}

/** Issuer が宣言した typed identifier です。 */
export interface Identifier { readonly type: string; readonly value: string; readonly subjectRef?: string; readonly metadata?: readonly ForeignMetadataAttribute[]; }
/** Issuer が宣言した文字列値の Property です。 */
export interface Property { readonly type: string; readonly value: string; readonly unit?: string; readonly extensions?: readonly OpaqueExtensionElement[]; readonly metadata?: readonly ForeignMetadataAttribute[]; }
/** 軽量な document-local target descriptor です。 */
export interface Subject { readonly id: string; readonly type?: string; readonly metadata?: readonly ForeignMetadataAttribute[]; }
/** Profile の issuer-authored claim です。 */
export interface ProfileClaim { readonly href: string; readonly metadata?: readonly ForeignMetadataAttribute[]; }

/** Input の宣言です。constraints は opaque Extension として保持します。 */
export interface InputDefinition {
  readonly name: string;
  readonly type: CoreDataType;
  readonly required: boolean;
  readonly format?: string;
  readonly unit?: string;
  readonly constraints?: readonly OpaqueExtensionElement[];
  readonly metadata?: readonly ForeignMetadataAttribute[];
}
/** Output の宣言です。 */
export interface OutputDefinition {
  readonly name: string;
  readonly type: CoreDataType;
  readonly format?: string;
  readonly unit?: string;
  readonly constraints?: readonly OpaqueExtensionElement[];
  readonly metadata?: readonly ForeignMetadataAttribute[];
}
/** Invocation が返す Result の表現宣言です。 */
export interface RepresentationDefinition { readonly mediaType: string; readonly metadata?: readonly ForeignMetadataAttribute[]; }
/** Draft 4 の errors を受け取る既存利用者のための型 alias です。Draft 5 Result では使用しません。 */
export interface CapabilityErrorDefinition { readonly type: string; }
/** Invocation の Result です。Draft 5 では outputs が必須です。 */
export interface ResultDefinition { readonly outputs: readonly OutputDefinition[]; readonly representations: readonly RepresentationDefinition[]; }
/** Requirement の typed declaration と opaque body です。 */
export interface RequirementDefinition { readonly type: string; readonly extensions: readonly OpaqueExtensionElement[]; readonly metadata?: readonly ForeignMetadataAttribute[]; }

/** Core の Attachment/Realization wrapper に入る Extension です。 */
export interface InterfaceExtension { readonly extension: OpaqueExtensionElement; }
/** Entity-shared Interface の記述です。 */
export interface InterfaceDefinition {
  readonly id: string;
  readonly attachment?: InterfaceExtension;
  readonly realization?: InterfaceExtension;
  readonly requirements: readonly RequirementDefinition[];
  readonly metadata?: readonly ForeignMetadataAttribute[];
}
/** Capability 固有の InterfaceUse Mapping です。 */
export interface InterfaceUse {
  readonly ref: string;
  readonly mapping?: InterfaceExtension;
  readonly metadata?: readonly ForeignMetadataAttribute[];
}
/** Invocation の request/response 記述です。 */
export interface InvocationDefinition {
  readonly inputs: readonly InputDefinition[];
  readonly result?: ResultDefinition;
  readonly metadata?: readonly ForeignMetadataAttribute[];
}
/** Entity-side Capability の記述データです。Runtime 状態は含めません。 */
export interface Capability {
  readonly localId: CapabilityLocalId;
  readonly semanticType: SemanticCapabilityIdentifier;
  readonly subjectRef?: string;
  readonly requirements: readonly RequirementDefinition[];
  readonly invocation?: InvocationDefinition;
  readonly interfaceUses: readonly InterfaceUse[];
  readonly metadata?: readonly ForeignMetadataAttribute[];
  /** Draft 4 文書を読み取る既存利用者向けの明示的な移行 marker です。 */
  readonly legacyDraft4?: boolean;
  /** @deprecated Draft 4 compatibility view. Use invocation?.inputs. */
  readonly inputs?: readonly InputDefinition[];
  /** @deprecated Draft 4 compatibility view. Use invocation?.result. */
  readonly result?: ResultDefinition;
  /** @deprecated Draft 4 compatibility view. Use document.interfaces and interfaceUses. */
  readonly interfaces?: readonly LegacyHTTPInterfaceDefinition[];
  /** @deprecated Runtime state is exposed by RuntimeCapability.evaluation. */
  readonly contractResolution?: ContractResolutionState;
  /** @deprecated Runtime state is exposed by RuntimeCapability.evaluation. */
  readonly projectionValidation?: ProjectionValidationState;
  /** @deprecated Runtime state is exposed by RuntimeCapability.evaluation. */
  readonly availability?: AvailabilityState;
}
/** Loaded AR-XML の記述モデルです。 */
export interface ARDocument {
  readonly url: string;
  readonly metadata?: readonly ForeignMetadataAttribute[];
  readonly category?: string;
  readonly identifiers: readonly Identifier[];
  readonly properties: readonly Property[];
  readonly propertyExtensions: readonly OpaqueExtensionElement[];
  readonly subjects: readonly Subject[];
  readonly profileClaims: readonly ProfileClaim[];
  readonly interfaces: readonly InterfaceDefinition[];
  readonly capabilities: readonly Capability[];
}

/** Draft 5 の Runtime-derived Capability 評価です。 */
export interface CapabilityEvaluation {
  readonly contractResolution: ContractResolutionState;
  readonly projectionValidation: ProjectionValidationState;
  readonly availability?: AvailabilityState;
  readonly routes: readonly RouteEvaluation[];
}
/** InterfaceUse 一件の独立した Runtime 評価です。 */
export interface RouteEvaluation {
  /** 同一 Interface ref を共有する route も区別する、安定した実行選択キーです。 */
  readonly routeId: string;
  readonly interfaceRef: string;
  /** Capability、Contract、Interface の Requirement を合成した状態です。 */
  readonly requirement: RequirementEvaluationState;
  readonly capabilityRequirement: RequirementEvaluationState;
  readonly contractRequirement: RequirementEvaluationState;
  readonly interfaceRequirement: RequirementEvaluationState;
  readonly attachment: RequirementEvaluationState;
  readonly support: SupportState;
  readonly availability: AvailabilityState;
  readonly reason?: string;
}

/** HTTP Extension の認識済み Realization です。 */
export interface HTTPApiRealization { readonly kind: "http:api"; readonly base?: string; readonly extension: OpaqueExtensionElement; }
/** HTTP Extension の認識済み Mapping です。 */
export interface HTTPOperationMapping { readonly kind: "http:operation"; readonly method: string; readonly path: string; readonly extension: OpaqueExtensionElement; }
/** 旧 API が参照する HTTP Interface の移行用型です。 */
export interface LegacyHTTPInterfaceDefinition { readonly type: "http"; readonly method: "GET" | "POST" | "PUT" | "PATCH"; readonly endpoint: string; readonly encoding?: "json"; readonly authentication?: { readonly type: string; readonly scope?: string }; }
/** 旧公開 API の型名を保つための移行用 alias です。 */
export type HTTPInterfaceDefinition = LegacyHTTPInterfaceDefinition;
/** Local ID は coercion せず文字列として比較します。 */
export function isSameCapabilityLocalId(left: CapabilityLocalId, right: CapabilityLocalId): boolean { return left === right; }
