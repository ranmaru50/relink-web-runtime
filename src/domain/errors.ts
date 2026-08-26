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
/** HTTP Interface の非成功状態または未対応状態を表すエラーです。 */
export class InterfaceError extends ARRuntimeError { public constructor(message: string) { super("InterfaceError", message); } }
/** Response Representation または Output Mapping のエラーです。 */
export class RepresentationError extends ARRuntimeError { public constructor(message: string) { super("RepresentationError", message); } }
/** Capability が返した意味的エラーを表す予約済みのエラーです。 */
export class CapabilityError extends ARRuntimeError { public constructor(message: string) { super("CapabilityError", message); } }
