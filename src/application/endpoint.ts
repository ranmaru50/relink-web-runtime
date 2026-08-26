// src/application/endpoint.ts
import { InterfaceError } from "../domain/errors";

/** Interface endpoint を必ず AR-XML の取得 URL を基準に解決します。 */
export function resolveEndpoint(arXmlDocumentUrl: string, endpoint: string): URL {
  try { return new URL(endpoint, arXmlDocumentUrl); } catch { throw new InterfaceError("HTTP endpoint が不正です"); }
}
