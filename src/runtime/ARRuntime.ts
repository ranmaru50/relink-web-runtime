// src/runtime/ARRuntime.ts
/** Draft 5 の Resolve / Fetch / Parse / Validate / Expose と明示 Invocation を提供します。 */

import { BrowserResourceFetcher, FetchHTTPInvoker } from "../adapters/web/BrowserFetchAdapters";
import { BrowserXMLParser } from "../adapters/web/BrowserXMLParser";
import { evaluateCapability } from "../application/evaluation";
import type { ProfileEvaluation } from "../application/evaluation";
import { invokeCapability, SameOriginNetworkPolicy, type InputValues, type InvocationResult, type InvokeOptions, type NetworkPolicy } from "../application/invocation";
import { parseManifest } from "../application/manifest";
import { buildARDocument } from "../application/validation";
import { HTTPSDowngradeError, HTTPResponseError, ManifestFetchError, NetworkPolicyError, TransportError, ValidationError } from "../domain/errors";
import type { ARDocument, ARDocumentFormat, AvailabilityState, Capability, CapabilityEvaluation } from "../domain/model";
import { EmptySemanticRegistry, evaluateProfileDocument, type SemanticRegistry } from "../ports/semantic";
import type { HTTPInvoker, ResourceFetcher, ResourceFetchOptions, ResourceFetchResult, XMLParser } from "../ports/runtime";

/** ドキュメント取得先に適用する、ブラウザ非依存なネットワークポリシーです。 */
export interface ResourceNetworkPolicy { permits(url: URL, requestedUrl: string): boolean; }
/** HTTP(S) を許可し、HTTPS 起点から HTTP への downgrade だけを拒否します。 */
export class DefaultResourceNetworkPolicy implements ResourceNetworkPolicy {
  public permits(url: URL, requestedUrl: string): boolean { const requested = new URL(requestedUrl); if (url.protocol !== "http:" && url.protocol !== "https:") return false; return requested.protocol !== "https:" || url.protocol === "https:"; }
}
/** Runtime の外部境界と semantic registry を差し替える設定です。 */
export interface ARRuntimeOptions { readonly xmlParser?: XMLParser; readonly resourceFetcher?: ResourceFetcher; readonly httpInvoker?: HTTPInvoker; readonly networkPolicy?: NetworkPolicy; readonly resourceNetworkPolicy?: ResourceNetworkPolicy; readonly resourceCredentials?: RequestCredentials; readonly semanticRegistry?: SemanticRegistry; readonly documentFormat?: ARDocumentFormat; }

/** Draft 5 AR-XML を副作用なく読み込み、明示 Invocation を別 API で提供します。 */
export class ARRuntime {
  private readonly xmlParser: XMLParser;
  private readonly resourceFetcher: ResourceFetcher;
  private readonly httpInvoker: HTTPInvoker;
  private readonly networkPolicy: NetworkPolicy;
  private readonly resourceNetworkPolicy: ResourceNetworkPolicy;
  private readonly semanticRegistry: SemanticRegistry;
  private readonly documentFormat: ARDocumentFormat;
  public constructor(options: ARRuntimeOptions = {}) { this.xmlParser = options.xmlParser ?? new BrowserXMLParser(); this.resourceFetcher = options.resourceFetcher ?? new BrowserResourceFetcher(globalThis.fetch.bind(globalThis), { credentials: options.resourceCredentials }); this.httpInvoker = options.httpInvoker ?? new FetchHTTPInvoker(); this.networkPolicy = options.networkPolicy ?? new SameOriginNetworkPolicy(); this.resourceNetworkPolicy = options.resourceNetworkPolicy ?? new DefaultResourceNetworkPolicy(); this.semanticRegistry = options.semanticRegistry ?? new EmptySemanticRegistry(); this.documentFormat = options.documentFormat ?? "draft5"; }

  /** AR-XML または明示 Manifest 経由の description を取得します。Capability は実行しません。 */
  public async load(url: string, options: { readonly signal?: AbortSignal; readonly credentials?: RequestCredentials } = {}): Promise<RuntimeDocument> {
    const requestedUrl = parseDocumentUrl(url);
    const result = await this.fetchDocumentResource(url, requestedUrl.href, options, isManifestRequestUrl(requestedUrl.href));
    if (isManifestResponse(result)) {
      const manifest = parseManifest(result.body, parseDocumentUrl(result.responseUrl).href);
      const descriptionUrl = parseDocumentUrl(manifest.descriptionLocation);
      return this.buildRuntimeDocument(await this.fetchDocumentResource(descriptionUrl.href, descriptionUrl.href, options, false));
    }
    return this.buildRuntimeDocument(result);
  }

  private async fetchDocumentResource(url: string, requestedUrl: string, options: { readonly signal?: AbortSignal; readonly credentials?: RequestCredentials }, isManifest: boolean): Promise<ResourceFetchResult> {
    const requested = parseDocumentUrl(requestedUrl); this.assertResourceRequest(parseDocumentUrl(url), requested.href);
    const fetchOptions: ResourceFetchOptions = { signal: options.signal, credentials: options.credentials, beforeRequest: (targetUrl) => this.assertResourceRequest(parseDocumentUrl(targetUrl), requested.href) };
    let result: ResourceFetchResult;
    try { result = await fetchResource(this.resourceFetcher, url, fetchOptions); } catch (error) { if (isManifest) throw new ManifestFetchError("Manifest の取得中に通信エラーが発生しました", url, undefined, error); throw error; }
    if (result.status < 200 || result.status >= 300) { if (isManifest || isManifestResponse(result)) throw new ManifestFetchError(`Manifest の取得に失敗しました (${result.status})`, result.responseUrl, result.status, new HTTPResponseError(result.status, result.responseUrl)); throw new HTTPResponseError(result.status, result.responseUrl); }
    const responseUrl = parseDocumentUrl(result.responseUrl); this.assertResourceRequest(responseUrl, requested.href); for (const redirectUrl of result.redirectUrls ?? []) this.assertResourceRequest(parseDocumentUrl(redirectUrl), requested.href); return result;
  }

  private buildRuntimeDocument(result: ResourceFetchResult): RuntimeDocument { const responseUrl = parseDocumentUrl(result.responseUrl); return new RuntimeDocument(buildARDocument(this.xmlParser.parse(result.body), responseUrl.href, { format: this.documentFormat }), this.httpInvoker, this.networkPolicy, this.semanticRegistry); }
  private assertResourceRequest(targetUrl: URL, requestedUrl: string): void { if (new URL(requestedUrl).protocol === "https:" && targetUrl.protocol === "http:") throw new HTTPSDowngradeError(requestedUrl, targetUrl.href); if (!this.resourceNetworkPolicy.permits(targetUrl, requestedUrl)) throw new NetworkPolicyError(targetUrl.href); }
}

/** JSON Manifest の Content-Type または先頭形式を判定します。 */
function isManifestResponse(result: ResourceFetchResult): boolean { const contentType = result.contentType?.split(";", 1)[0]?.trim().toLowerCase(); return contentType === "application/json" || contentType?.endsWith("+json") === true || result.body.trimStart().startsWith("{"); }
function isManifestRequestUrl(url: string): boolean { const path = new URL(url).pathname.toLowerCase(); return path.endsWith("/manifest") || path.endsWith("/manifest.json") || path.endsWith(".manifest"); }
function parseDocumentUrl(value: string): URL { let url: URL; try { url = new URL(value); } catch (error) { throw new TransportError("AR-XML のURLが不正です", error); } if (url.protocol !== "http:" && url.protocol !== "https:") throw new TransportError("AR-XML のURLにはHTTP(S)を指定してください"); return url; }
async function fetchResource(fetcher: ResourceFetcher, url: string, options: ResourceFetchOptions): Promise<ResourceFetchResult> { if (fetcher.fetchResource) return fetcher.fetchResource(url, options); if (fetcher.fetchText) return { requestedUrl: url, responseUrl: url, status: 200, body: await fetcher.fetchText(url, options.signal) }; throw new TransportError("AR-XML の取得Adapterが設定されていません"); }

/** Loaded AR-DOM と評価 snapshot を公開する Facade です。 */
export class RuntimeDocument {
  public constructor(private readonly document: ARDocument, private readonly httpInvoker: HTTPInvoker, private readonly networkPolicy: NetworkPolicy, private readonly semanticRegistry: SemanticRegistry) {}
  public get url(): string { return this.document.url; }
  public get category(): string | undefined { return this.document.category; }
  public get metadata() { return this.document.metadata; }
  public get identifiers() { return this.document.identifiers; }
  public get properties() { return this.document.properties; }
  public get propertyExtensions() { return this.document.propertyExtensions; }
  public get subjects() { return this.document.subjects; }
  public get profileClaims() { return this.document.profileClaims; }
  public get interfaces() { return this.document.interfaces; }
  public get capabilities() { return this.document.capabilities; }
  public getCapability(localId: string): RuntimeCapability | undefined { const capability = this.document.capabilities.find((item) => item.localId === localId); return capability ? new RuntimeCapability(capability, this.document, this.httpInvoker, this.networkPolicy, this.semanticRegistry) : undefined; }
  public evaluateCapability(localId: string): CapabilityEvaluation | undefined { return this.getCapability(localId)?.evaluation; }
  public evaluateProfile(identifier: string): ProfileEvaluation { return evaluateProfileDocument(this.document, identifier, this.semanticRegistry); }
}

/** Explicit Application/Human request を受けた Capability の公開 Facade です。 */
export class RuntimeCapability {
  private readonly snapshot: CapabilityEvaluation;
  public constructor(private readonly capability: Capability, private readonly document: ARDocument, private readonly httpInvoker: HTTPInvoker, private readonly networkPolicy: NetworkPolicy, semanticRegistry: SemanticRegistry) { this.snapshot = evaluateCapability(capability, document.interfaces, semanticRegistry); }
  public get definition(): Capability { return this.capability; }
  public get evaluation(): CapabilityEvaluation { return this.snapshot; }
  public get availability(): AvailabilityState | undefined { return this.snapshot.availability; }
  public async invoke(inputs: InputValues, options: InvokeOptions = {}): Promise<InvocationResult> {
    if (this.capability.legacyDraft4) {
      if (this.snapshot.availability !== "READY") throw new ValidationError(`Capability route が READY ではありません: ${this.snapshot.availability ?? "UNAVAILABLE"}`);
      return invokeCapability(this.capability, this.document.interfaces, this.document.url, inputs, options, this.httpInvoker, this.networkPolicy);
    }
    const readyRoutes = this.snapshot.routes.filter((route) => route.availability === "READY");
    const selected = options.routeId !== undefined
      ? readyRoutes.find((route) => route.routeId === options.routeId)
      : options.interfaceRef !== undefined
        ? uniqueRouteForInterfaceRef(readyRoutes, options.interfaceRef)
        : readyRoutes.length === 1 ? readyRoutes[0] : undefined;
    if (!selected) throw new ValidationError(`READY な InterfaceUse route が一意に選択されていません: ${options.routeId ?? options.interfaceRef ?? this.snapshot.availability ?? "UNAVAILABLE"}`);
    if (options.interfaceRef !== undefined && selected.interfaceRef !== options.interfaceRef) throw new ValidationError("routeId と interfaceRef が一致しません");
    return invokeCapability(this.capability, this.document.interfaces, this.document.url, inputs, { ...options, routeId: selected.routeId, interfaceRef: selected.interfaceRef }, this.httpInvoker, this.networkPolicy);
  }
}

/** 同一 Interface ref を複数 route が共有する場合は暗黙選択を行いません。 */
function uniqueRouteForInterfaceRef(routes: readonly import("../domain/model").RouteEvaluation[], interfaceRef: string): import("../domain/model").RouteEvaluation | undefined {
  const matches = routes.filter((route) => route.interfaceRef === interfaceRef);
  return matches.length === 1 ? matches[0] : undefined;
}
