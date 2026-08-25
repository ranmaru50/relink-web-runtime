// src/actions/HTTPActionExecutor.ts
import { ARActionElement } from "../dom/ARDocument";
import { ARXMLActionError } from "../errors/errors";

/** HTTP Action を安全な範囲で実行します。 */
export async function executeHTTPAction(action: ARActionElement, baseUrl: string, fetcher: typeof fetch = fetch): Promise<void> {
  let url: URL;
  try { url = new URL(action.endpoint, baseUrl); } catch { throw new ARXMLActionError("action endpoint が不正です"); }
  if (url.origin !== new URL(baseUrl).origin) throw new ARXMLActionError("同一オリジン以外の action endpoint は許可されません");
  try {
    const response = await fetcher(url, action.method === "POST" ? { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" } : { method: "GET" });
    if (!response.ok) throw new ARXMLActionError(`Action に失敗しました (${response.status})`);
  } catch (error) {
    if (error instanceof ARXMLActionError) throw error;
    throw new ARXMLActionError(`Action 実行中にネットワークエラーが発生しました: ${String(error)}`);
  }
}
