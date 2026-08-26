// src/adapters/web/BrowserFetchAdapters.ts
import { TransportError } from "../../domain/errors";
import type { HTTPInvoker, HTTPResponse, ResourceFetcher } from "../../ports/runtime";

/** 標準 fetch で AR-XML テキストを取得する Adapter です。 */
export class BrowserResourceFetcher implements ResourceFetcher {
  public constructor(private readonly fetcher: typeof fetch = fetch) {}
  public async fetchText(url: string, signal?: AbortSignal): Promise<string> {
    let response: Response;
    try { response = await this.fetcher(url, { signal }); } catch (error) { throw new TransportError("AR-XML の取得中に通信エラーが発生しました", error); }
    if (!response.ok) throw new TransportError(`AR-XML の取得に失敗しました (${response.status})`);
    return response.text();
  }
}

/** 標準 fetch を HTTPInvoker port として公開する Adapter です。 */
export class FetchHTTPInvoker implements HTTPInvoker {
  public constructor(private readonly fetcher: typeof fetch = fetch) {}
  public async invoke(url: URL, init: RequestInit): Promise<HTTPResponse> {
    try { return await this.fetcher(url, init); } catch (error) { throw new TransportError("HTTP 呼び出し中に通信エラーが発生しました", error); }
  }
}
