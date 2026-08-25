// src/errors/errors.ts
/** AR-XML 読み込み時のネットワークエラーです。 */
export class ARXMLNetworkError extends Error {
  public constructor(message: string) { super(message); this.name = "ARXMLNetworkError"; }
}
/** AR-XML の構文エラーです。 */
export class ARXMLParseError extends Error {
  public constructor(message: string) { super(message); this.name = "ARXMLParseError"; }
}
/** AR-XML の必須属性などの検証エラーです。 */
export class ARXMLValidationError extends Error {
  public constructor(message: string) { super(message); this.name = "ARXMLValidationError"; }
}
/** Action 実行時のエラーです。 */
export class ARXMLActionError extends Error {
  public constructor(message: string) { super(message); this.name = "ARXMLActionError"; }
}
