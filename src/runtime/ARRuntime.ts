// src/runtime/ARRuntime.ts
import { BrowserResourceFetcher, FetchHTTPInvoker } from "../adapters/web/BrowserFetchAdapters";
import { BrowserXMLParser } from "../adapters/web/BrowserXMLParser";
import { invokeCapability, SameOriginNetworkPolicy, type InputValues, type InvocationResult, type InvokeOptions, type NetworkPolicy } from "../application/invocation";
import { buildARDocument } from "../application/validation";
import { HTTPSDowngradeError, HTTPResponseError, NetworkPolicyError, TransportError, ValidationError } from "../domain/errors";
import type { ARDocument, Capability } from "../domain/model";
import type { HTTPInvoker, ResourceFetcher, ResourceFetchOptions, ResourceFetchResult, XMLParser } from "../ports/runtime";

/** ドキュメント取得先に適用する、ブラウザ非依存なネットワークポリシーです。 */
export interface ResourceNetworkPolicy { permits(url: URL, requestedUrl: string): boolean; }
/** L0互換のためHTTP(S)を許可し、HTTPS起点のHTTP化だけを拒否する既定ポリシーです。L1でHTTPSを必須にする場合は専用ポリシーを設定してください。 */
export class DefaultResourceNetworkPolicy implements ResourceNetworkPolicy {
  /** 初回URLと最終URLを検査し、HTTPS起点のHTTP化を拒否します。 */
  public permits(url: URL, requestedUrl: string): boolean {
    const requested = new URL(requestedUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    return requested.protocol !== "https:" || url.protocol === "https:";
  }
}
export interface ARRuntimeOptions { readonly xmlParser?: XMLParser; readonly resourceFetcher?: ResourceFetcher; readonly httpInvoker?: HTTPInvoker; readonly networkPolicy?: NetworkPolicy; readonly resourceNetworkPolicy?: ResourceNetworkPolicy; readonly resourceCredentials?: RequestCredentials; }
/** ブラウザ向け Draft 4 PoC の公開 API です。 */
export class ARRuntime {
  private readonly xmlParser: XMLParser; private readonly resourceFetcher: ResourceFetcher; private readonly httpInvoker: HTTPInvoker; private readonly networkPolicy: NetworkPolicy; private readonly resourceNetworkPolicy: ResourceNetworkPolicy;
  public constructor(options: ARRuntimeOptions = {}) { this.xmlParser = options.xmlParser ?? new BrowserXMLParser(); this.resourceFetcher = options.resourceFetcher ?? new BrowserResourceFetcher(globalThis.fetch.bind(globalThis), { credentials: options.resourceCredentials }); this.httpInvoker = options.httpInvoker ?? new FetchHTTPInvoker(); this.networkPolicy = options.networkPolicy ?? new SameOriginNetworkPolicy(); this.resourceNetworkPolicy = options.resourceNetworkPolicy ?? new DefaultResourceNetworkPolicy(); }
  /** URL から AR-XML を取得、解析、検証して公開用 Document を返します。 */
  public async load(url: string, options: { readonly signal?: AbortSignal; readonly credentials?: RequestCredentials } = {}): Promise<RuntimeDocument> {
    const requestedUrl = parseDocumentUrl(url);
    this.assertResourceRequest(requestedUrl, url);
    const fetchOptions: ResourceFetchOptions = { signal: options.signal, credentials: options.credentials, beforeRequest: (targetUrl) => this.assertResourceRequest(parseDocumentUrl(targetUrl), url) };
    const result = await fetchResource(this.resourceFetcher, url, fetchOptions);
    if (result.status < 200 || result.status >= 300) throw new HTTPResponseError(result.status, result.responseUrl);
    const responseUrl = parseDocumentUrl(result.responseUrl);
    this.assertResourceRequest(responseUrl, url);
    for (const redirectUrl of result.redirectUrls ?? []) {
      const redirect = parseDocumentUrl(redirectUrl);
      this.assertResourceRequest(redirect, url);
    }
    return new RuntimeDocument(buildARDocument(this.xmlParser.parse(result.body), responseUrl.href), this.httpInvoker, this.networkPolicy);
  }

  /** 通信前および取得後に、HTTPS不変条件とRuntimeのリソースポリシーを検証します。 */
  private assertResourceRequest(targetUrl: URL, requestedUrl: string): void { if (new URL(requestedUrl).protocol === "https:" && targetUrl.protocol === "http:") throw new HTTPSDowngradeError(requestedUrl, targetUrl.href); if (!this.resourceNetworkPolicy.permits(targetUrl, requestedUrl)) throw new NetworkPolicyError(targetUrl.href); }
}

/** URL形式を検証し、HTTP(S)ドキュメントURLへ変換します。 */
function parseDocumentUrl(value: string): URL { let url: URL; try { url = new URL(value); } catch (error) { throw new TransportError("AR-XML のURLが不正です", error); } if (url.protocol !== "http:" && url.protocol !== "https:") throw new TransportError("AR-XML のURLにはHTTP(S)を指定してください"); return url; }
/** 新しい取得結果を優先し、既存のfetchText注入を後方互換で扱います。 */
async function fetchResource(fetcher: ResourceFetcher, url: string, options: ResourceFetchOptions): Promise<ResourceFetchResult> { if (fetcher.fetchResource) return fetcher.fetchResource(url, options); if (fetcher.fetchText) return { requestedUrl: url, responseUrl: url, status: 200, body: await fetcher.fetchText(url, options.signal) }; throw new TransportError("AR-XML の取得Adapterが設定されていません"); }
/** Capability の検索と呼び出しを提供する公開用 AR-DOM Facade です。 */
export class RuntimeDocument {
  public constructor(private readonly document: ARDocument, private readonly httpInvoker: HTTPInvoker, private readonly networkPolicy: NetworkPolicy) {}
  public get url(): string { return this.document.url; } public get category(): string | undefined { return this.document.category; } public get profileClaims() { return this.document.profileClaims; } public get capabilities() { return this.document.capabilities; }
  public getCapability(localId: string): RuntimeCapability | undefined { const capability = this.document.capabilities.find((item) => item.localId === localId); return capability ? new RuntimeCapability(capability, this.document.url, this.httpInvoker, this.networkPolicy) : undefined; }
}
/** 呼び出し可能な Capability の公開用 Facade です。 */
export class RuntimeCapability {
  public constructor(private readonly capability: Capability, private readonly documentUrl: string, private readonly httpInvoker: HTTPInvoker, private readonly networkPolicy: NetworkPolicy) {}
  public get definition(): Capability { return this.capability; }
  public async invoke(inputs: InputValues, options: InvokeOptions = {}): Promise<InvocationResult> { if (this.capability.availability !== "READY") throw new ValidationError("Capability は READY ではありません"); return invokeCapability(this.capability, this.documentUrl, inputs, options, this.httpInvoker, this.networkPolicy); }
}
