// test-harness/logic.ts
/** Testbed に依存しない Harness 内部の診断データ型と状態遷移を定義します。 */
export interface TestbedInfo { readonly name: string; readonly version: string; readonly entityOrigin: string; readonly crossOrigin?: string; }
export interface TestCase { readonly id: string; readonly group: string; readonly description: string; readonly documentUrl?: string; readonly capabilityId?: string; readonly inputs?: Readonly<Record<string, unknown>>; readonly expected?: unknown; }
export interface ObservedRequest { readonly method: string; readonly pathname: string; readonly query: Readonly<Record<string, string[]>>; readonly json?: unknown; readonly endpointId: string; readonly timestamp: number; readonly [key: string]: unknown; }
export interface RequestComparison { readonly status: "PASS" | "FAIL" | "NOT_AVAILABLE"; readonly differences: readonly string[]; }

/** Invocation 前後の履歴から、その Invocation 中に追加された観測だけを取り出します。 */
export function requestsAddedSince(before: readonly ObservedRequest[], after: readonly ObservedRequest[]): readonly ObservedRequest[] {
  return after.length > before.length ? after.slice(before.length) : [];
}

/** Origin 入力を HTTP(S) の origin へ正規化します。 */
export function normalizeOrigin(value: string): string {
  const url = new URL(value);
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Testbed Origin は HTTP(S) URL で指定してください。");
  if (url.pathname !== "/" || url.search || url.hash) throw new Error("Testbed Origin にはパス、クエリ、フラグメントを含められません。");
  return url.origin;
}

/** Testbed の JSON 応答が接続情報として最低限必要な形か検証します。 */
export function parseInfo(value: unknown): TestbedInfo {
  if (!isRecord(value) || typeof value.name !== "string" || typeof value.version !== "string" || typeof value.entityOrigin !== "string") throw new Error("Testbed の info 応答形式が不正です。");
  return { name: value.name, version: value.version, entityOrigin: value.entityOrigin, ...(typeof value.crossOrigin === "string" ? { crossOrigin: value.crossOrigin } : {}) };
}

/** Testbed のケース一覧を、Harness が利用する最小の公開型として検証します。 */
export function parseCases(value: unknown): readonly TestCase[] {
  if (!Array.isArray(value)) throw new Error("Testbed の cases 応答は配列ではありません。");
  return value.map((item) => {
    if (!isRecord(item) || typeof item.id !== "string" || typeof item.group !== "string" || typeof item.description !== "string") throw new Error("Testbed の case 応答形式が不正です。");
    return { id: item.id, group: item.group, description: item.description, ...(typeof item.documentUrl === "string" ? { documentUrl: item.documentUrl } : {}), ...(typeof item.capabilityId === "string" ? { capabilityId: item.capabilityId } : {}), ...(isRecord(item.inputs) ? { inputs: item.inputs } : {}), ...(item.expected !== undefined ? { expected: item.expected } : {}) };
  });
}

/** JSON エディタの内容を Invocation 用 object として検証します。 */
export function parseInputs(value: string): Record<string, unknown> {
  const parsed: unknown = JSON.parse(value);
  if (!isRecord(parsed)) throw new Error("入力 JSON は object である必要があります。");
  return parsed;
}

/** 共有 conformance データである HTTP リクエストの明確なフィールドだけを比較します。 */
export function compareRequest(expected: unknown, observed: ObservedRequest | undefined): RequestComparison {
  if (!isRecord(expected) || !isRecord(expected.request) || !observed) return { status: "NOT_AVAILABLE", differences: ["比較可能な Expected Request または Observed Request がありません。"] };
  const request = expected.request; const differences: string[] = [];
  for (const field of ["method", "pathname", "query", "json"] as const) {
    if (request[field] !== undefined && !sameJson(request[field], observed[field])) differences.push(`${field} が一致しません。`);
  }
  return { status: differences.length === 0 ? "PASS" : "FAIL", differences };
}

/** JSON で表現可能な診断値を構造比較します。 */
function sameJson(left: unknown, right: unknown): boolean { return JSON.stringify(left) === JSON.stringify(right); }
/** object だけを受け入れる軽量な型ガードです。 */
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
