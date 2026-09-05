// src/application/manifest.ts
import { ManifestParseError, ManifestValidationError } from "../domain/errors";

/** Manifest 0.1 から AR-XML 取得に必要な情報だけを抽出した中間モデルです。 */
export interface ParsedManifest {
  readonly manifestVersion: "0.1";
  readonly anchorId: string;
  readonly entityId: string;
  readonly descriptionLocation: string;
  readonly lifecycleStatus: "active" | "suspended" | "retired";
}

/** Manifest JSON を構文解析し、Runtime が利用する最小の Manifest モデルへ変換します。 */
export function parseManifest(json: string, sourceUrl: string): ParsedManifest {
  let value: unknown;
  try {
    rejectDuplicateObjectMembers(json);
    value = JSON.parse(json);
  } catch (error) {
    if (error instanceof ManifestParseError) throw error;
    throw new ManifestParseError(`Manifest JSON の構文が正しくありません: ${sourceUrl}`, error);
  }

  if (!isRecord(value)) throw new ManifestValidationError("Manifest は JSON object である必要があります");
  if (value.manifestVersion !== "0.1") throw new ManifestValidationError("Manifest の manifestVersion は 0.1 である必要があります");
  const anchor = requiredRecord(value, "anchor");
  const entity = requiredRecord(value, "entity");
  const description = requiredRecord(value, "description");
  const lifecycle = requiredRecord(value, "lifecycle");
  const anchorId = requiredString(anchor, "id", "anchor");
  const entityId = requiredString(entity, "id", "entity");
  const descriptionLocation = requiredString(description, "location", "description");
  const lifecycleStatus = requiredString(lifecycle, "status", "lifecycle");

  if (!UUID_PATTERN.test(anchorId)) throw new ManifestValidationError("Manifest の anchor.id が UUID ではありません");
  if (!isAbsoluteUri(entityId)) throw new ManifestValidationError("Manifest の entity.id は絶対 URI である必要があります");
  let location: URL;
  try { location = new URL(descriptionLocation); } catch { throw new ManifestValidationError(`Manifest の description.location が不正です: ${descriptionLocation}`); }
  if (location.protocol !== "https:") throw new ManifestValidationError("Manifest の description.location は HTTPS URL である必要があります");
  if (lifecycleStatus !== "active" && lifecycleStatus !== "suspended" && lifecycleStatus !== "retired") throw new ManifestValidationError("Manifest の lifecycle.status が不正です");

  assertDeterministicEndpointBinding(anchorId, sourceUrl);
  return { manifestVersion: "0.1", anchorId, entityId, descriptionLocation: location.href, lifecycleStatus };
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function requiredRecord(parent: Record<string, unknown>, property: string): Record<string, unknown> {
  const value = parent[property];
  if (!isRecord(value)) throw new ManifestValidationError(`Manifest の ${property} は object である必要があります`);
  return value;
}

function requiredString(parent: Record<string, unknown>, property: string, section: string): string {
  const value = parent[property];
  if (typeof value !== "string" || value.length === 0) throw new ManifestValidationError(`Manifest の ${section}.${property} は必須の文字列です`);
  return value;
}

function isAbsoluteUri(value: string): boolean {
  try { return new URL(value).protocol.length > 0; } catch { return false; }
}

/** JSON.parse前のraw JSONを走査し、全objectの重複member名を検出します。 */
function rejectDuplicateObjectMembers(json: string): void {
  const scopes: Set<string>[] = [];
  let index = 0;
  while (index < json.length) {
    const character = json[index];
    if (character === "{") {
      scopes.push(new Set<string>());
      index += 1;
      continue;
    }
    if (character === "}") {
      scopes.pop();
      index += 1;
      continue;
    }
    if (character !== '"') {
      index += 1;
      continue;
    }

    const token = readJsonStringToken(json, index);
    index = token.end;
    const next = skipWhitespace(json, index);
    if (json[next] !== ":" || scopes.length === 0) continue;
    const currentScope = scopes[scopes.length - 1];
    if (!currentScope) continue;
    if (currentScope.has(token.value)) throw new ManifestParseError(`Manifest JSON に重複した member name があります: ${token.value}`);
    currentScope.add(token.value);
  }
}

/** JSON string tokenを読み取り、JSON.parseでescape表現を通常のキー名へ戻します。 */
function readJsonStringToken(json: string, start: number): { readonly value: string; readonly end: number } {
  let index = start + 1;
  while (index < json.length) {
    if (json[index] === "\\") {
      index += 2;
      continue;
    }
    if (json[index] === '"') {
      const raw = json.slice(start, index + 1);
      return { value: JSON.parse(raw) as string, end: index + 1 };
    }
    index += 1;
  }
  throw new SyntaxError("Unterminated JSON string");
}

/** JSON token間の空白を読み飛ばします。 */
function skipWhitespace(json: string, start: number): number {
  let index = start;
  while (index < json.length && /\s/.test(json[index] ?? "")) index += 1;
  return index;
}

/** 決定論的な /{uuid}/manifest URL の場合だけ anchor.id の対応を検証します。 */
function assertDeterministicEndpointBinding(anchorId: string, sourceUrl: string): void {
  let url: URL;
  try { url = new URL(sourceUrl); } catch { return; }
  const match = url.pathname.match(/\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/manifest\/?$/i);
  if (match && match[1].toLowerCase() !== anchorId.toLowerCase()) throw new ManifestValidationError("Manifest の anchor.id が取得URLの UUID と一致しません");
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
