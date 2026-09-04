// src/adapters/web/BrowserFetchAdapters.ts
import { HTTPResponseError, TransportError } from "../../domain/errors";
import type { HTTPInvoker, HTTPResponse, ResourceFetcher, ResourceFetchResult } from "../../ports/runtime";

/** 標準 fetch でAR-XMLリソースと最終レスポンス情報を取得するAdapterです。 */
export class BrowserResourceFetcher implements ResourceFetcher {
  /** 既定の fetch はブラウザの globalThis に束縛して Illegal invocation を防ぎます。 */
  public constructor(private readonly fetcher: typeof fetch = globalThis.fetch.bind(globalThis)) {}
  /** ブラウザのFetchリダイレクト処理後のレスポンス情報をRuntimeへ渡します。 */
  public async fetchResource(url: string, signal?: AbortSignal): Promise<ResourceFetchResult> {
    let response: Response;
    try { response = await this.fetcher(url, { signal, redirect: "follow" }); } catch (error) { throw new TransportError("AR-XML の取得中に通信エラーが発生しました", error); }
    if (!response.ok) return { requestedUrl: url, responseUrl: response.url || url, status: response.status, body: "" };
    try { return { requestedUrl: url, responseUrl: response.url || url, status: response.status, body: await response.text() }; } catch (error) { throw new TransportError("AR-XML 応答の読み取り中に通信エラーが発生しました", error); }
  }
  /** 旧ResourceFetcher APIを維持し、成功時の本文だけを返します。 */
  public async fetchText(url: string, signal?: AbortSignal): Promise<string> {
    const result = await this.fetchResource(url, signal);
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
