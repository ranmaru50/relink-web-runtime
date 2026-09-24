// src/application/invocation.ts
/** Draft 5 の明示的 Invocation と HTTP Standard Interface Extension を実行します。 */

import { InterfaceError, RepresentationError, ValidationError } from "../domain/errors";
import { resolveEndpoint } from "./endpoint";
import { routeHandleFor } from "./routes";
import type { Capability, CoreDataType, HTTPApiRealization, HTTPOperationMapping, InputDefinition, InterfaceDefinition, InterfaceUse, InvocationDefinition, OpaqueExtensionElement, OutputDefinition, RepresentationDefinition, ResultDefinition } from "../domain/model";
import type { HTTPInvoker } from "../ports/runtime";

/** Invocation に渡す semantic Input 値です。 */
export type InputValues = Readonly<Record<string, unknown>>;
/** HTTP 応答表現の選択と中断を指定します。 */
export interface InvokeOptions { readonly accept?: string; readonly signal?: AbortSignal; readonly interfaceRef?: string; readonly routeId?: string; }
/** semantic Output と選択された Representation です。 */
export interface InvocationResult { readonly values: Readonly<Record<string, unknown>>; readonly representation?: string; }
/** Interface endpoint の Runtime network policy です。 */
export interface NetworkPolicy { permits(url: URL, documentUrl: string): boolean; }
/** AR-XML と同一 Origin だけを既定で許可します。 */
export class SameOriginNetworkPolicy implements NetworkPolicy { public permits(url: URL, documentUrl: string): boolean { return url.origin === new URL(documentUrl).origin; } }

const HTTP_EXTENSION_NAMESPACE = "https://relink.dev/ns/arxml/http/0.1";

/** 明示された InterfaceUse を選択し、HTTP Extension の request/response mapping を行います。 */
export async function invokeCapability(capability: Capability, interfaces: readonly InterfaceDefinition[], documentUrl: string, inputs: InputValues, options: InvokeOptions, invoker: HTTPInvoker, policy: NetworkPolicy): Promise<InvocationResult> {
  if (capability.legacyDraft4) return invokeLegacyCapability(capability, documentUrl, inputs, options, invoker, policy);
  const invocation = capability.invocation;
  if (!invocation) throw new InterfaceError("Capability に Invocation がありません");
  const routes = capability.interfaceUses.map((use) => ({ routeId: routeHandleFor(capability.localId, use, capability.interfaceUses), use, definition: interfaces.find((item) => item.id === use.ref) })).filter((item): item is { routeId: string; use: InterfaceUse; definition: InterfaceDefinition } => item.definition !== undefined);
  const selected = routes.filter(({ routeId, use, definition }) => (options.routeId === undefined || routeId === options.routeId) && (options.interfaceRef === undefined || use.ref === options.interfaceRef) && isHTTPApi(definition.realization?.extension));
  if (selected.length === 0) throw new InterfaceError("指定された HTTP Extension route がありません");
  if (selected.length > 1) throw new InterfaceError("InterfaceUse route が一意に選択されていません");
  const route = selected[0]!;
  return invokeHTTPRoute(invocation, route.definition, route.use, documentUrl, inputs, options, invoker, policy);
}

/** 旧 Draft 4 の隣接 Interface を、互換用途に限って実行します。Draft 5 route には混入させません。 */
async function invokeLegacyCapability(capability: Capability, documentUrl: string, inputs: InputValues, options: InvokeOptions, invoker: HTTPInvoker, policy: NetworkPolicy): Promise<InvocationResult> {
  const invocation = capability.invocation; const http = capability.interfaces?.[0];
  if (!invocation || !http) throw new InterfaceError("呼び出し可能な HTTP Interface がありません");
  const url = resolveEndpoint(documentUrl, http.endpoint); if (!policy.permits(url, documentUrl)) throw new InterfaceError("Runtime のネットワークポリシーにより endpoint が拒否されました");
  const representation = selectLegacyRepresentation(invocation.result, options.accept); const init = serializeRequest(http.method, url, invocation, inputs, representation, options.signal); const response = await invoker.invoke(url, init);
  if (response.status < 200 || response.status >= 300) throw new InterfaceError(`HTTP Interface が非成功を返しました (${response.status})`);
  if (!invocation.result) return { values: {} };
  const contentType = response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() ?? ""; if (contentType !== representation?.mediaType.toLowerCase()) throw new RepresentationError("Response Content-Type が宣言済み Representation と一致しません");
  let decoded: unknown; try { decoded = JSON.parse(await response.text()); } catch { throw new RepresentationError("JSON Response の解析に失敗しました"); }
  if (invocation.result.outputs.length === 1) { const output = invocation.result.outputs[0]; if (!output || !matchesType(decoded, output.type)) throw new RepresentationError("Response 値が Output type と一致しません"); return { values: { [output.name]: decoded }, representation: representation?.mediaType }; }
  return { values: mapJSONOutputs(invocation.result.outputs, decoded), representation: representation?.mediaType };
}

/** HTTP route 一件の URL 解決、入力検証、送信、結果 mapping を行います。 */
async function invokeHTTPRoute(invocation: InvocationDefinition, definition: InterfaceDefinition, use: InterfaceUse, documentUrl: string, inputs: InputValues, options: InvokeOptions, invoker: HTTPInvoker, policy: NetworkPolicy): Promise<InvocationResult> {
  const api = parseHTTPApi(definition.realization?.extension);
  const operation = parseHTTPOperation(use.mapping?.extension);
  if (!operation) throw new InterfaceError("HTTP InterfaceUse に http:operation mapping がありません");
  const url = resolveHTTPTarget(documentUrl, api.base, operation.path);
  if (!policy.permits(url, documentUrl)) throw new InterfaceError("Runtime のネットワークポリシーにより endpoint が拒否されました");
  const representation = selectRepresentation(invocation.result, options.accept);
  const init = serializeRequest(operation.method, url, invocation, inputs, representation, options.signal);
  const response = await invoker.invoke(url, init);
  if (response.status < 200 || response.status >= 300) throw new InterfaceError(`HTTP Interface が非成功を返しました (${response.status})`);
  if (!invocation.result) return { values: {} };
  if (response.status === 204) throw new RepresentationError("Result が宣言されているため 204 Response をマッピングできません");
  const contentType = parseJSONContentType(response.headers.get("content-type"));
  if (!contentType) throw new RepresentationError("JSON Result に Content-Type: application/json が必要です");
  let decoded: unknown;
  try { decoded = JSON.parse(await response.text()); } catch { throw new RepresentationError("JSON Response の解析に失敗しました"); }
  return { values: mapJSONOutputs(invocation.result.outputs, decoded), representation: representation?.mediaType };
}

/** HTTP Standard Extension の method/path を用いて RequestInit を構築します。 */
function serializeRequest(method: string, url: URL, invocation: InvocationDefinition, inputs: InputValues, representation: RepresentationDefinition | undefined, signal: AbortSignal | undefined): RequestInit {
  validateInputs(invocation.inputs, inputs);
  const headers = new Headers(); if (representation) headers.set("Accept", representation.mediaType);
  if (method === "GET") {
    for (const input of invocation.inputs) { const value = inputs[input.name]; if (value !== undefined) { if (!["string", "number", "integer", "boolean"].includes(input.type)) throw new InterfaceError(`GET では ${input.type} Input を直列化できません`); if (url.searchParams.has(input.name)) throw new InterfaceError(`既存 query と Input name が衝突しています: ${input.name}`); url.searchParams.append(input.name, lexicalValue(value, input.type)); } }
    return { method, headers, signal };
  }
  if (method !== "POST" && method !== "PUT" && method !== "PATCH") throw new InterfaceError(`HTTP method の Input mapping に対応していません: ${method}`);
  const body: Record<string, unknown> = {};
  for (const input of invocation.inputs) { const value = inputs[input.name]; if (value !== undefined) { if (input.type === "binary") throw new InterfaceError("binary Input の JSON mapping は未対応です"); body[input.name] = value; } }
  headers.set("Content-Type", "application/json"); return { method, headers, body: JSON.stringify(body), signal };
}

/** required/type validation は transport request の前に行います。 */
function validateInputs(inputs: readonly InputDefinition[], values: InputValues): void { for (const input of inputs) { const value = values[input.name]; if (value === undefined) { if (input.required) throw new ValidationError(`required Input が不足しています: ${input.name}`); continue; } if (!matchesType(value, input.type)) throw new ValidationError(`Input の型が一致しません: ${input.name}`); } }
function lexicalValue(value: unknown, type: CoreDataType): string { if (type === "boolean") return value === true ? "true" : "false"; return String(value); }
function matchesType(value: unknown, type: CoreDataType): boolean { switch (type) { case "string": return typeof value === "string"; case "number": return typeof value === "number" && Number.isFinite(value); case "integer": return typeof value === "number" && Number.isInteger(value); case "boolean": return typeof value === "boolean"; case "object": return typeof value === "object" && value !== null && !Array.isArray(value); case "array": return Array.isArray(value); case "binary": return typeof Blob !== "undefined" && value instanceof Blob; } }
function selectRepresentation(result: ResultDefinition | undefined, accept: string | undefined): RepresentationDefinition | undefined { if (!result) return undefined; const declared = result.representations.find((item) => item.mediaType.toLowerCase() === "application/json"); if (!declared) throw new InterfaceError("Draft 5 HTTP JSON baseline には application/json Representation が必要です"); if (accept && !accept.split(",").some((item) => mediaTypeMatches(item.trim().toLowerCase(), declared.mediaType.toLowerCase()))) throw new InterfaceError("指定された Accept と Representation が一致しません"); return declared; }
function selectLegacyRepresentation(result: ResultDefinition | undefined, accept: string | undefined): RepresentationDefinition | undefined { if (!result) return undefined; const representation = result.representations[0]; if (!representation) throw new InterfaceError("Result Representation がありません"); if (accept && !mediaTypeMatches(accept.toLowerCase(), representation.mediaType.toLowerCase())) throw new InterfaceError("指定された Accept と Representation が一致しません"); return representation; }
function mapJSONOutputs(outputs: readonly OutputDefinition[], decoded: unknown): Readonly<Record<string, unknown>> { if (typeof decoded !== "object" || decoded === null || Array.isArray(decoded)) throw new RepresentationError("JSON Result は top-level object である必要があります"); const object = decoded as Record<string, unknown>; const values: Record<string, unknown> = {}; for (const output of outputs) { if (!(output.name in object)) throw new RepresentationError(`Response に Output がありません: ${output.name}`); const value = object[output.name]; if (!matchesType(value, output.type)) throw new RepresentationError(`Output の型が一致しません: ${output.name}`); values[output.name] = value; } return values; }

/** HTTP API Realization を認識します。未知 Extension は実行対象にしません。 */
export function parseHTTPApi(extension: OpaqueExtensionElement | undefined): HTTPApiRealization { if (!extension || extension.namespace !== HTTP_EXTENSION_NAMESPACE || extension.localName !== "api") throw new InterfaceError("http:api Realization がありません"); const base = extension.attributes.find((item) => item.namespace === "" && item.localName === "base")?.value; if (extension.attributes.some((item) => item.namespace === "" && item.localName !== "base")) throw new InterfaceError("http:api の未知属性です"); if (extension.text || extension.children.length > 0) throw new InterfaceError("http:api に子要素や文字データは指定できません"); return { kind: "http:api", ...(base !== undefined ? { base } : {}), extension }; }
/** HTTP operation Mapping を認識します。 */
export function parseHTTPOperation(extension: OpaqueExtensionElement | undefined): HTTPOperationMapping | undefined { if (!extension) return undefined; if (extension.namespace !== HTTP_EXTENSION_NAMESPACE || extension.localName !== "operation") throw new InterfaceError("未対応の HTTP Mapping です"); const method = extension.attributes.find((item) => item.namespace === "" && item.localName === "method")?.value; const path = extension.attributes.find((item) => item.namespace === "" && item.localName === "path")?.value; if (!method || !/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(method) || path === undefined) throw new InterfaceError("http:operation の method/path が不正です"); if (extension.attributes.some((item) => item.namespace === "" && item.localName !== "method" && item.localName !== "path")) throw new InterfaceError("http:operation の未知属性です"); if (extension.text || extension.children.length > 0 || !isValidURIReference(path) || hasAuthorityOrScheme(path)) throw new InterfaceError("http:operation path が不正です"); return { kind: "http:operation", method, path, extension }; }
/** RFC 3986 の base + path 解決結果を HTTP target として検証します。 */
export function resolveHTTPTarget(documentUrl: string, base: string | undefined, path: string): URL { if (!isValidURIReference(documentUrl) || !isValidURIReference(base ?? "" ) || !isValidURIReference(path) || hasAuthorityOrScheme(path)) throw new InterfaceError("HTTP URI reference が不正です"); let document: URL; try { document = new URL(documentUrl); } catch { throw new InterfaceError("AR-XML retrieval URL が不正です"); } const baseUrl = new URL(base ?? "", document); if ((baseUrl.protocol !== "http:" && baseUrl.protocol !== "https:") || !baseUrl.hostname) throw new InterfaceError("HTTP base context が不正です"); const target = new URL(path, baseUrl); target.hash = ""; if ((target.protocol !== "http:" && target.protocol !== "https:") || !target.hostname) throw new InterfaceError("HTTP target が不正です"); return target; }
function isHTTPApi(extension: OpaqueExtensionElement | undefined): boolean { return extension?.namespace === HTTP_EXTENSION_NAMESPACE && extension.localName === "api"; }
function parseJSONContentType(value: string | null): boolean { if (!value) return false; const parts = value.split(";"); if (parts[0]?.trim().toLowerCase() !== "application/json") return false; const seen = new Set<string>(); for (const parameter of parts.slice(1)) { const match = /^\s*([^=\s;]+)\s*=\s*(?:"(?:[^"\\]|\\.)*"|[^\s;]+)\s*$/.exec(parameter); if (!match || seen.has(match[1]!.toLowerCase())) return false; seen.add(match[1]!.toLowerCase()); } return true; }
function mediaTypeMatches(actual: string, declared: string): boolean { return actual === declared || actual === "*/*" || (actual.endsWith("/*") && declared.startsWith(actual.slice(0, -1))); }
function isValidURIReference(value: string): boolean { return !/[^\x00-\x7f]/.test(value) && !/[\\\s\u0000-\u001f\u007f]/.test(value) && !/(?:^|[^%])%(?![0-9A-Fa-f]{2})/.test(value); }
function hasAuthorityOrScheme(value: string): boolean { return value.startsWith("//") || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(value); }
