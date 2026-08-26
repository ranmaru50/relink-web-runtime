// src/runtime/ARRuntime.ts
import { BrowserResourceFetcher, FetchHTTPInvoker } from "../adapters/web/BrowserFetchAdapters";
import { BrowserXMLParser } from "../adapters/web/BrowserXMLParser";
import { invokeCapability, SameOriginNetworkPolicy, type InputValues, type InvocationResult, type InvokeOptions, type NetworkPolicy } from "../application/invocation";
import { buildARDocument } from "../application/validation";
import { ValidationError } from "../domain/errors";
import type { ARDocument, Capability } from "../domain/model";
import type { HTTPInvoker, ResourceFetcher, XMLParser } from "../ports/runtime";

export interface ARRuntimeOptions { readonly xmlParser?: XMLParser; readonly resourceFetcher?: ResourceFetcher; readonly httpInvoker?: HTTPInvoker; readonly networkPolicy?: NetworkPolicy; }
/** ブラウザ向け Draft 4 PoC の公開 API です。 */
export class ARRuntime {
  private readonly xmlParser: XMLParser; private readonly resourceFetcher: ResourceFetcher; private readonly httpInvoker: HTTPInvoker; private readonly networkPolicy: NetworkPolicy;
  public constructor(options: ARRuntimeOptions = {}) { this.xmlParser = options.xmlParser ?? new BrowserXMLParser(); this.resourceFetcher = options.resourceFetcher ?? new BrowserResourceFetcher(); this.httpInvoker = options.httpInvoker ?? new FetchHTTPInvoker(); this.networkPolicy = options.networkPolicy ?? new SameOriginNetworkPolicy(); }
  /** URL から AR-XML を取得、解析、検証して公開用 Document を返します。 */
  public async load(url: string, options: { readonly signal?: AbortSignal } = {}): Promise<RuntimeDocument> { const xml = await this.resourceFetcher.fetchText(url, options.signal); return new RuntimeDocument(buildARDocument(this.xmlParser.parse(xml), url), this.httpInvoker, this.networkPolicy); }
}
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
