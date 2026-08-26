// src/ports/runtime.ts
import type { ParsedARDocument } from "../application/parsing";

/** XML を中間モデルへ変換する外部依存の境界です。 */
export interface XMLParser { parse(xml: string): ParsedARDocument; }
/** AR-XML リソースの取得を抽象化します。 */
export interface ResourceFetcher { fetchText(url: string, signal?: AbortSignal): Promise<string>; }
/** HTTP Response をブラウザ非依存な最小形へ正規化します。 */
export interface HTTPResponse { readonly status: number; readonly headers: { get(name: string): string | null }; text(): Promise<string>; blob(): Promise<unknown>; }
/** HTTP 呼び出しを抽象化します。 */
export interface HTTPInvoker { invoke(url: URL, init: RequestInit): Promise<HTTPResponse>; }
