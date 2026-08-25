// src/core/loader.ts
import { ARXMLNetworkError } from "../errors/errors";

/** URL から AR-XML 文字列を取得する責務です。 */
export async function loadARXML(url: string, fetcher: typeof fetch = fetch): Promise<string> {
  try {
    const response = await fetcher(url);
    if (!response.ok) throw new ARXMLNetworkError(`AR-XML の取得に失敗しました (${response.status})`);
    return await response.text();
  } catch (error) {
    if (error instanceof ARXMLNetworkError) throw error;
    throw new ARXMLNetworkError(`AR-XML の取得中にネットワークエラーが発生しました: ${String(error)}`);
  }
}
