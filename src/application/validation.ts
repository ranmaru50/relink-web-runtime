// src/application/validation.ts
import type { ParsedARDocument } from "./parsing";
import { ValidationError } from "../domain/errors";
import type { ARDocument, Capability, CoreDataType, HTTPInterfaceDefinition } from "../domain/model";

/** Draft 4 Core Namespace です。 */
export const ARXML_CORE_NAMESPACE = "https://relink.dev/ns/arxml/core/0.1";
const CORE_TYPES: readonly CoreDataType[] = ["string", "number", "integer", "boolean", "binary", "object", "array"];

/** 中間構造を検証し、ランタイム非依存の AR-DOM を構築します。 */
export function buildARDocument(parsed: ParsedARDocument, url: string): ARDocument {
  if (parsed.rootName !== "ar-entity") throw new ValidationError("ar-entity 要素が必要です");
  if (parsed.namespace !== ARXML_CORE_NAMESPACE) throw new ValidationError("AR-XML Core Namespace が正しくありません");
  if (parsed.version !== "0.1") throw new ValidationError("version 属性には 0.1 が必要です");
  const ids = new Set<string>();
  const capabilities = parsed.capabilities.map((item): Capability => {
    if (!item.id) throw new ValidationError("capability 要素には id 属性が必要です");
    if (ids.has(item.id)) throw new ValidationError(`capability id が重複しています: ${item.id}`); ids.add(item.id);
    if (!item.type) throw new ValidationError("capability 要素には type 属性が必要です");
    validateDefinitions(item.inputs, "input"); validateDefinitions(item.outputs, "output");
    if (!item.hasResult) throw new ValidationError("capability 要素には result 要素が必要です");
    const outputNames = new Set<string>(); for (const output of item.outputs) { if (outputNames.has(output.name)) throw new ValidationError(`output name が重複しています: ${output.name}`); outputNames.add(output.name); }
    for (const representation of item.representations) if (!isMediaType(representation.mediaType)) throw new ValidationError("representation media-type が不正です");
    const interfaces = item.interfaces.map((entry): HTTPInterfaceDefinition => { if (entry.type !== "http") throw new ValidationError("未対応の interface type です"); if (entry.method !== "GET" && entry.method !== "POST") throw new ValidationError("interface method は GET または POST である必要があります"); if (!entry.endpoint) throw new ValidationError("http interface には endpoint 属性が必要です"); if (entry.encoding !== undefined && entry.encoding !== "json") throw new ValidationError("未対応の interface encoding です"); return { type: "http", method: entry.method, endpoint: entry.endpoint, encoding: entry.encoding, authentication: entry.authentication }; });
    if (interfaces.length === 0) throw new ValidationError("capability には interface が必要です");
    return { localId: item.id, semanticType: item.type, inputs: item.inputs, result: { outputs: item.outputs, representations: item.representations, errors: item.errors }, requirements: item.requirements, interfaces, contractResolution: "UNRESOLVED", projectionValidation: "UNVALIDATED", availability: "READY" };
  });
  for (const claim of parsed.profileClaims) if (!claim.href) throw new ValidationError("conforms-to 要素には href 属性が必要です");
  return { url, category: parsed.category, profileClaims: parsed.profileClaims, capabilities };
}
function validateDefinitions(items: readonly { readonly name: string; readonly type: CoreDataType }[], element: string): void { const names = new Set<string>(); for (const item of items) { if (!item.name || !item.type) throw new ValidationError(`${element} 要素には name と type 属性が必要です`); if (names.has(item.name)) throw new ValidationError(`${element} name が重複しています: ${item.name}`); names.add(item.name); if (!CORE_TYPES.includes(item.type)) throw new ValidationError(`${element} type が未定義です: ${item.type}`); } }
function isMediaType(value: string): boolean { return /^[^\s/]+\/[^\s/]+$/.test(value); }
