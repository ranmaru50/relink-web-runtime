// src/domain/errors.ts
/** ランタイムの層を識別できる基底エラーです。 */
export abstract class ARRuntimeError extends Error {
  public constructor(public readonly category: string, message: string, public readonly cause?: unknown) {
    super(message);
    this.name = category;
  }
}

/** XML 構文を解釈できない場合のエラーです。 */
export class ParseError extends ARRuntimeError { public constructor(message: string, cause?: unknown) { super("ParseError", message, cause); } }
/** AR-XML Core 構造または値が不正な場合のエラーです。 */
export class ValidationError extends ARRuntimeError { public constructor(message: string) { super("ValidationError", message); } }
/** Capability Contract の解決に失敗した場合のエラーです。 */
export class ContractResolutionError extends ARRuntimeError { public constructor(message: string) { super("ContractResolutionError", message); } }
/** Contract または投影の矛盾を表すエラーです。 */
export class ContractError extends ARRuntimeError { public constructor(message: string) { super("ContractError", message); } }
/** 通信層で発生したエラーです。 */
export class TransportError extends ARRuntimeError { public constructor(message: string, cause?: unknown) { super("TransportError", message, cause); } }
/** ドキュメント取得の終端HTTP応答が成功でない場合のエラーです。 */
export class HTTPResponseError extends ARRuntimeError {
  public constructor(public readonly status: number, public readonly url: string) { super("HTTPResponseError", `AR-XML の取得に失敗しました (${status})`); }
}
/** HTTPSからHTTPへのダウングレードを拒否した場合のエラーです。 */
export class HTTPSDowngradeError extends ARRuntimeError {
  public constructor(public readonly fromUrl: string, public readonly toUrl: string) { super("HTTPSDowngradeError", "HTTPS から HTTP へのダウングレードは許可されません"); }
}
/** ドキュメント取得先がRuntimeのネットワークポリシーで拒否された場合のエラーです。 */
export class NetworkPolicyError extends ARRuntimeError { public constructor(public readonly url: string) { super("NetworkPolicyError", "Runtime のネットワークポリシーによりドキュメント取得先が拒否されました"); } }
/** Manifest の取得、構文解析、検証に関するエラーの基底クラスです。 */
export abstract class ManifestError extends ARRuntimeError { public constructor(category: string, message: string, cause?: unknown) { super(category, message, cause); } }
/** Manifest の通信または終端HTTP応答に関するエラーです。 */
export class ManifestFetchError extends ManifestError {
  public constructor(message: string, public readonly url: string, public readonly status?: number, cause?: unknown) { super("ManifestFetchError", message, cause); }
}
/** Manifest JSON の構文を解釈できない場合のエラーです。 */
export class ManifestParseError extends ManifestError { public constructor(message: string, cause?: unknown) { super("ManifestParseError", message, cause); } }
/** Manifest 0.1 の必須構造または値が不正な場合のエラーです。 */
export class ManifestValidationError extends ManifestError { public constructor(message: string) { super("ManifestValidationError", message); } }
/** HTTP Interface の非成功状態または未対応状態を表すエラーです。 */
export class InterfaceError extends ARRuntimeError { public constructor(message: string) { super("InterfaceError", message); } }
/** Response Representation または Output Mapping のエラーです。 */
export class RepresentationError extends ARRuntimeError { public constructor(message: string) { super("RepresentationError", message); } }
/** Capability が返した意味的エラーを表す予約済みのエラーです。 */
export class CapabilityError extends ARRuntimeError { public constructor(message: string) { super("CapabilityError", message); } }
