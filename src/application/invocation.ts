// src/application/invocation.ts
import { InterfaceError, RepresentationError, ValidationError } from "../domain/errors";
import type { Capability, CoreDataType, HTTPInterfaceDefinition, OutputDefinition, RepresentationDefinition } from "../domain/model";
import type { HTTPInvoker } from "../ports/runtime";
import { resolveEndpoint } from "./endpoint";

export type InputValues = Readonly<Record<string, unknown>>;
export interface InvokeOptions { readonly accept?: string; readonly signal?: AbortSignal; }
export interface InvocationResult { readonly values: Readonly<Record<string, unknown>>; readonly representation: string; }
export interface NetworkPolicy { permits(url: URL, documentUrl: string): boolean; }
/** PoC の既定ポリシー: AR-XML と同一 Origin のみを許可します。 */
export class SameOriginNetworkPolicy implements NetworkPolicy { public permits(url: URL, documentUrl: string): boolean { return url.origin === new URL(documentUrl).origin; } }

/** Input の検証、HTTP 呼び出し、Decode、Output Mapping を一貫して実行します。 */
export async function invokeCapability(capability: Capability, documentUrl: string, inputs: InputValues, options: InvokeOptions, invoker: HTTPInvoker, policy: NetworkPolicy): Promise<InvocationResult> {
  const representation = selectRepresentation(capability.result.representations, options.accept);
  const http = capability.interfaces[0];
  if (!http) throw new InterfaceError("呼び出し可能な HTTP Interface がありません");
  const url = resolveEndpoint(documentUrl, http.endpoint);
  if (!policy.permits(url, documentUrl)) throw new InterfaceError("Runtime のネットワークポリシーにより endpoint が拒否されました");
  const init = serializeRequest(http, url, capability, inputs, representation, options.signal);
  const response = await invoker.invoke(url, init);
  if (response.status < 200 || response.status >= 300) throw new InterfaceError(`HTTP Interface が非成功を返しました (${response.status})`);
  if (response.status === 204) { if (capability.result.outputs.length > 0) throw new RepresentationError("required Output があるため 204 Response をマッピングできません"); return { values: {}, representation: representation.mediaType }; }
  const contentType = normalizeMediaType(response.headers.get("content-type"));
  if (!mediaTypeMatches(representation.mediaType, contentType)) throw new RepresentationError(`Response Content-Type が宣言済み Representation と一致しません: ${contentType || "未指定"}`);
  const decoded = await decode(response, contentType);
  return { values: mapOutputs(capability.result.outputs, decoded, contentType), representation: representation.mediaType };
}

function serializeRequest(http: HTTPInterfaceDefinition, url: URL, capability: Capability, inputs: InputValues, representation: RepresentationDefinition, signal: AbortSignal | undefined): RequestInit {
  validateInputs(capability, inputs);
  const headers = new Headers({ Accept: representation.mediaType });
  if (http.method === "GET") { for (const input of capability.inputs) { const value = inputs[input.name]; if (value !== undefined) { if (["object", "array", "binary"].includes(input.type)) throw new InterfaceError(`GET では ${input.type} Input を直列化できません`); url.searchParams.set(input.name, String(value)); } } return { method: "GET", headers, signal }; }
  if (http.encoding !== "json") throw new InterfaceError("POST Interface には encoding=\"json\" が必要です");
  headers.set("Content-Type", "application/json");
  const body: Record<string, unknown> = {}; for (const input of capability.inputs) if (inputs[input.name] !== undefined) body[input.name] = inputs[input.name];
  return { method: "POST", headers, body: JSON.stringify(body), signal };
}
function validateInputs(capability: Capability, inputs: InputValues): void { for (const input of capability.inputs) { const value = inputs[input.name]; if (value === undefined) { if (input.required) throw new ValidationError(`required Input が不足しています: ${input.name}`); continue; } if (!matchesType(value, input.type)) throw new ValidationError(`Input の型が一致しません: ${input.name}`); } }
function matchesType(value: unknown, type: CoreDataType): boolean { switch (type) { case "string": return typeof value === "string"; case "number": return typeof value === "number" && Number.isFinite(value); case "integer": return typeof value === "number" && Number.isInteger(value); case "boolean": return typeof value === "boolean"; case "object": return typeof value === "object" && value !== null && !Array.isArray(value); case "array": return Array.isArray(value); case "binary": return value instanceof Blob; } }
function selectRepresentation(representations: readonly RepresentationDefinition[], accept: string | undefined): RepresentationDefinition { if (representations.length === 0) throw new InterfaceError("Result Representation がありません"); const selected = accept ? representations.find((item) => mediaTypeMatches(accept, item.mediaType) && isRuntimeSupported(item.mediaType)) : representations.find((item) => isRuntimeSupported(item.mediaType)); if (!selected) throw new InterfaceError("互換性のある Result Representation がありません"); return selected; }
function isRuntimeSupported(mediaType: string): boolean { return mediaType === "application/json" || mediaType === "application/octet-stream" || mediaType === "application/pdf" || mediaType.startsWith("text/") || mediaType.startsWith("image/"); }
function normalizeMediaType(value: string | null): string { return value?.split(";", 1)[0]?.trim().toLowerCase() ?? ""; }
function mediaTypeMatches(expected: string, actual: string): boolean { return expected === actual || (expected.endsWith("/*") && actual.startsWith(expected.slice(0, -1))); }
async function decode(response: { text(): Promise<string>; blob(): Promise<unknown> }, contentType: string): Promise<unknown> { if (contentType === "application/json") { try { return JSON.parse(await response.text()); } catch (error) { throw new RepresentationError("JSON Response の解析に失敗しました"); } } return contentType.startsWith("text/") ? response.text() : response.blob(); }
function mapOutputs(outputs: readonly OutputDefinition[], decoded: unknown, contentType: string): Readonly<Record<string, unknown>> { if (outputs.length === 0) return {}; if (outputs.length === 1) { const output = outputs[0]; if (!output || !matchesType(decoded, output.type)) throw new RepresentationError("Response 値が Output type と一致しません"); return { [output.name]: decoded }; } if (contentType !== "application/json" || typeof decoded !== "object" || decoded === null || Array.isArray(decoded)) throw new RepresentationError("複数 Output は JSON object でのみマッピングできます"); const values: Record<string, unknown> = {}; for (const output of outputs) { const value = (decoded as Record<string, unknown>)[output.name]; if (value === undefined) throw new RepresentationError(`Response に Output がありません: ${output.name}`); if (!matchesType(value, output.type)) throw new RepresentationError(`Output の型が一致しません: ${output.name}`); values[output.name] = value; } return values; }
