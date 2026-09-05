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
    value = JSON.parse(json);
  } catch (error) {
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

/** 決定論的な /{uuid}/manifest URL の場合だけ anchor.id の対応を検証します。 */
function assertDeterministicEndpointBinding(anchorId: string, sourceUrl: string): void {
  let url: URL;
  try { url = new URL(sourceUrl); } catch { return; }
  const match = url.pathname.match(/\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/manifest\/?$/i);
  if (match && match[1].toLowerCase() !== anchorId.toLowerCase()) throw new ManifestValidationError("Manifest の anchor.id が取得URLの UUID と一致しません");
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
