// src/ports/runtime.ts
import type { ParsedARDocument } from "../application/parsing";

/** XML を中間モデルへ変換する外部依存の境界です。 */
export interface XMLParser { parse(xml: string): ParsedARDocument; }
/** ドキュメント取得時に保持する、リダイレクト後のHTTP結果です。 */
export interface ResourceFetchResult {
  /** Runtime.load に渡された最初のURLです。 */
  readonly requestedUrl: string;
  /** 最終的に成功した表現のレスポンスURLです。 */
  readonly responseUrl: string;
  /** リダイレクト後の終端HTTPステータスです。 */
  readonly status: number;
  /** 最終レスポンスの表現本文です。 */
  readonly body: string;
  /** Adapter が追跡できる場合に保持する、事後診断用のリダイレクト先一覧です。 */
  readonly redirectUrls?: readonly string[];
}
/** リソース取得Adapterが各通信前に参照するRuntimeコンテキストです。 */
export interface ResourceFetchOptions {
  /** リソース取得を中断するシグナルです。 */
  readonly signal?: AbortSignal;
  /** 次の通信先をFetchする直前に呼び出すポリシー照会です。 */
  readonly beforeRequest?: (url: string) => void;
  /** 指定時はブラウザFetchのcredentials modeとして利用します。 */
  readonly credentials?: RequestCredentials;
}
/** AR-XML リソースの取得を抽象化します。 */
export interface ResourceFetcher {
  /** リダイレクト後の取得メタデータを返します。redirect対応AdapterはbeforeRequestを各通信前に呼び出します。 */
  fetchResource?(url: string, options?: ResourceFetchOptions): Promise<ResourceFetchResult>;
  /** 旧APIとの互換用です。実装時は fetchResource の利用を優先します。 */
  fetchText?(url: string, signal?: AbortSignal): Promise<string>;
}
/** HTTP Response をブラウザ非依存な最小形へ正規化します。 */
export interface HTTPResponse { readonly status: number; readonly headers: { get(name: string): string | null }; text(): Promise<string>; blob(): Promise<unknown>; }
/** HTTP 呼び出しを抽象化します。 */
export interface HTTPInvoker { invoke(url: URL, init: RequestInit): Promise<HTTPResponse>; }
