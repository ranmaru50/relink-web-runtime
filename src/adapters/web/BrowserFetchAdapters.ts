// src/adapters/web/BrowserFetchAdapters.ts
import { HTTPResponseError, TransportError } from "../../domain/errors";
import type { HTTPInvoker, HTTPResponse, ResourceFetcher, ResourceFetchOptions, ResourceFetchResult } from "../../ports/runtime";

/** 標準 fetch でAR-XMLリソースと最終レスポンス情報を取得するAdapterです。 */
export class BrowserResourceFetcher implements ResourceFetcher {
  /** 既定の fetch はブラウザの globalThis に束縛して Illegal invocation を防ぎます。 */
  public constructor(private readonly fetcher: typeof fetch = globalThis.fetch.bind(globalThis), private readonly defaultOptions: { readonly credentials?: RequestCredentials } = {}) {}
  /** ブラウザのFetchリダイレクト処理後のレスポンス情報をRuntimeへ渡します。redirect先の制御はブラウザのFetch/CORS/mixed-contentに委ねます。 */
  public async fetchResource(url: string, options: ResourceFetchOptions = {}): Promise<ResourceFetchResult> {
    let response: Response;
    const init: RequestInit = { signal: options.signal, redirect: "follow" };
    const credentials = options.credentials ?? this.defaultOptions.credentials;
    if (credentials !== undefined) init.credentials = credentials;
    try { response = await this.fetcher(url, init); } catch (error) { throw new TransportError("AR-XML の取得中に通信エラーが発生しました", error); }
    const responseUrl = response.url || url;
    const contentType = response.headers.get("content-type") ?? undefined;
    if (!response.ok) return { requestedUrl: url, responseUrl, status: response.status, body: "", contentType };
    try { return { requestedUrl: url, responseUrl, status: response.status, body: await response.text(), contentType }; } catch (error) { throw new TransportError("AR-XML 応答の読み取り中に通信エラーが発生しました", error); }
  }
  /** 旧ResourceFetcher APIを維持し、成功時の本文だけを返します。 */
  public async fetchText(url: string, signal?: AbortSignal): Promise<string> {
    const result = await this.fetchResource(url, { signal });
    if (result.status < 200 || result.status >= 300) throw new HTTPResponseError(result.status, result.responseUrl);
    return result.body;
  }
}

/** 標準 fetch を HTTPInvoker port として公開する Adapter です。 */
export class FetchHTTPInvoker implements HTTPInvoker {
  /** 既定の fetch はブラウザの globalThis に束縛して Illegal invocation を防ぎます。 */
  public constructor(private readonly fetcher: typeof fetch = globalThis.fetch.bind(globalThis)) {}
  public async invoke(url: URL, init: RequestInit): Promise<HTTPResponse> {
    try { return await this.fetcher(url, init); } catch (error) { throw new TransportError("HTTP 呼び出し中に通信エラーが発生しました", error); }
  }
}
