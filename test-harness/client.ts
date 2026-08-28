// test-harness/client.ts
import { normalizeOrigin, parseCases, parseInfo, type ObservedRequest, type TestCase, type TestbedInfo } from "./logic";

/** Testbed 診断 API への HTTP 接続を担当します。 */
export class TestbedClient {
  public constructor(public readonly origin: string, private readonly fetcher: typeof fetch = fetch) {}
  /** Origin を検証して Client を作成します。 */
  public static create(origin: string, fetcher?: typeof fetch): TestbedClient { return new TestbedClient(normalizeOrigin(origin), fetcher); }
  /** Testbed の接続情報を取得します。 */
  public async info(): Promise<TestbedInfo> { return parseInfo(await this.json("/__testbed/info")); }
  /** 実行中 Testbed が公開するケース一覧を取得します。 */
  public async cases(): Promise<readonly TestCase[]> { return parseCases(await this.json("/__testbed/cases")); }
  /** 受信済みリクエストを endpointId で必要に応じて絞り込みます。 */
  public async requests(endpointId?: string): Promise<readonly ObservedRequest[]> { const path = endpointId ? `/__testbed/requests/${encodeURIComponent(endpointId)}` : "/__testbed/requests"; const value = await this.json(path); if (!Array.isArray(value)) throw new Error("Testbed の requests 応答は配列ではありません。"); return value as ObservedRequest[]; }
  /** Testbed の観測履歴を消去します。 */
  public async reset(): Promise<void> { const response = await this.fetcher(new URL("/__testbed/reset", this.origin), { method: "POST" }); if (!response.ok) throw new Error(`Testbed reset に失敗しました (${response.status})。`); }
  /** JSON 応答と HTTP 失敗を一貫して扱います。 */
  private async json(path: string): Promise<unknown> { const response = await this.fetcher(new URL(path, this.origin)); if (!response.ok) throw new Error(`Testbed API ${path} に失敗しました (${response.status})。`); return response.json(); }
}
