// tests/document-loading.test.ts
import { describe, expect, it, vi } from "vitest";
import { BrowserResourceFetcher } from "../src/adapters/web/BrowserFetchAdapters";
import { BrowserXMLParser } from "../src/adapters/web/BrowserXMLParser";
import { HTTPSDowngradeError, HTTPResponseError, ManifestFetchError, ManifestParseError, ManifestValidationError, NetworkPolicyError, TransportError } from "../src/domain/errors";
import { ARRuntime } from "../src/runtime/ARRuntime";

const documentXml = `<?xml version="1.0"?><ar-entity xmlns="https://relink.dev/ns/arxml/core/0.1" version="0.1"><category>environment.sensor</category><capabilities><capability id="start" type="https://example.test/capabilities/start/1"><result><outputs><output name="status" type="string"/></outputs><representations><representation media-type="application/json"/></representations></result><interfaces><interface type="http" method="GET" endpoint="./actions/start"/></interfaces></capability></capabilities></ar-entity>`;
const manifestUrl = "https://resolver.example/relink/550e8400-e29b-41d4-a716-446655440000/manifest";
const descriptionUrl = "https://entity.example/descriptions/entity.xml";
const manifestJson = JSON.stringify({ manifestVersion: "0.1", anchor: { id: "550e8400-e29b-41d4-a716-446655440000" }, entity: { id: "https://identity.example/entities/12345" }, description: { location: descriptionUrl }, lifecycle: { status: "active" } });

/** テスト用の最小ResourceFetchResultを作成します。 */
function resourceResult(responseUrl: string, status = 200, redirectUrls: readonly string[] = [], body = documentXml, contentType = "application/xml") {
  return { requestedUrl: "https://anchor.example/relink/entity", responseUrl, status, body, contentType, redirectUrls };
}

/** ResourceFetcherを差し替えたARRuntimeを作成します。 */
function runtimeWith(result: ReturnType<typeof resourceResult>, fetchResource = vi.fn().mockResolvedValue(result), options: ConstructorParameters<typeof ARRuntime>[0] = {}) {
  return { runtime: new ARRuntime({ ...options, resourceFetcher: { fetchResource } }), fetchResource };
}

describe("Resolver Core 0.1 L1 document loading", () => {
  it("BrowserResourceFetcherはFetch後のresponse.urlとstatusを返す", async () => {
    const finalUrl = "https://cdn.example/entity.xml";
    const response = new Response(documentXml, { status: 200 });
    Object.defineProperty(response, "url", { value: finalUrl });
    const fetcher = vi.fn().mockResolvedValue(response);

    await expect(new BrowserResourceFetcher(fetcher).fetchResource("https://resolver.example/relink/entity")).resolves.toMatchObject({ requestedUrl: "https://resolver.example/relink/entity", responseUrl: finalUrl, status: 200, body: documentXml, contentType: "text/plain;charset=UTF-8" });
    expect(fetcher).toHaveBeenCalledWith("https://resolver.example/relink/entity", { signal: undefined, redirect: "follow" });
  });

  it("BrowserResourceFetcherはcredentials modeを明示設定できる", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(documentXml, { status: 200 }));

    await new BrowserResourceFetcher(fetcher, { credentials: "omit" }).fetchResource("https://resolver.example/relink/entity");
    expect(fetcher).toHaveBeenCalledWith("https://resolver.example/relink/entity", { signal: undefined, redirect: "follow", credentials: "omit" });
  });

  it("RT-001 / RT-018: direct AR-XML load remains supported", async () => {
    const { runtime, fetchResource } = runtimeWith(resourceResult("https://entity.example/descriptions/entity.xml"));
    const document = await runtime.load("https://entity.example/descriptions/entity.xml");

    expect(document.url).toBe("https://entity.example/descriptions/entity.xml");
    expect(fetchResource).toHaveBeenCalledWith("https://entity.example/descriptions/entity.xml", expect.objectContaining({ signal: undefined, credentials: undefined, beforeRequest: expect.any(Function) }));
  });

  it("RT-002: Resolver 303 handoff converges at the final representation", async () => {
    const finalUrl = "https://entity.example/descriptions/current.xml";
    const { runtime } = runtimeWith(resourceResult(finalUrl, 200, ["https://resolver.example/relink/entity"]));

    await expect(runtime.load("https://resolver.example/relink/entity")).resolves.toMatchObject({ url: finalUrl });
  });

  it("RT-003 / RT-004: pre- and post-Resolver HTTPS redirects succeed", async () => {
    const finalUrl = "https://cdn.example/entity/a/entity.xml";
    const redirects = [
      "https://resolver.example/relink/entity",
      "https://entity.example/descriptions/current.xml",
      finalUrl,
    ];
    const { runtime } = runtimeWith(resourceResult(finalUrl, 200, redirects));

    await expect(runtime.load("https://anchor.example/qr/entity")).resolves.toMatchObject({ url: finalUrl });
  });

  it("RT-005 / RT-006: final response URL is the AR-XML base URL", async () => {
    const finalUrl = "https://cdn.example/entity/a/entity.xml";
    const httpInvoker = { invoke: vi.fn().mockResolvedValue({ status: 200, headers: new Headers({ "content-type": "application/json" }), text: async () => JSON.stringify("started"), blob: async () => new Blob() }) };
    const document = await new ARRuntime({ resourceFetcher: { fetchResource: vi.fn().mockResolvedValue(resourceResult(finalUrl)) }, httpInvoker }).load("https://resolver.example/relink/entity");

    expect(document.url).toBe(finalUrl);
    await expect(document.getCapability("start")?.invoke({})).resolves.toEqual({ values: { status: "started" }, representation: "application/json" });
    expect(httpInvoker.invoke.mock.calls[0]?.[0].href).toBe("https://cdn.example/entity/a/actions/start");
  });

  it("RT-007: HTTPSからHTTPへのダウングレードを拒否する", async () => {
    const { runtime } = runtimeWith(resourceResult("http://cdn.example/entity.xml"));

    await expect(runtime.load("https://resolver.example/relink/entity")).rejects.toBeInstanceOf(HTTPSDowngradeError);
  });

  it("カスタムポリシーがHTTPを許可してもHTTPSダウングレードは拒否する", async () => {
    const { runtime } = runtimeWith(resourceResult("http://cdn.example/entity.xml"), vi.fn().mockResolvedValue(resourceResult("http://cdn.example/entity.xml")), { resourceNetworkPolicy: { permits: vi.fn().mockReturnValue(true) } });

    await expect(runtime.load("https://resolver.example/relink/entity")).rejects.toBeInstanceOf(HTTPSDowngradeError);
  });

  it("RT-008: 設定したドキュメント取得ポリシーの拒否前にfetchしない", async () => {
    const fetchResource = vi.fn().mockResolvedValue(resourceResult("https://entity.example/entity.xml"));
    const resourceNetworkPolicy = { permits: vi.fn().mockReturnValue(false) };
    const runtime = new ARRuntime({ resourceFetcher: { fetchResource }, resourceNetworkPolicy });

    await expect(runtime.load("https://resolver.example/relink/entity")).rejects.toBeInstanceOf(NetworkPolicyError);
    expect(fetchResource).not.toHaveBeenCalled();
  });

  it("redirectを事前観測できるAdapterは拒否先へ通信しない", async () => {
    const networkCalls: string[] = [];
    const fetchResource = vi.fn(async (_url: string, options: { beforeRequest?: (url: string) => void }) => {
      options.beforeRequest?.("https://allowed.example/resolver");
      options.beforeRequest?.("https://denied.example/entity.xml");
      networkCalls.push("denied.example");
      return resourceResult("https://denied.example/entity.xml");
    });
    const resourceNetworkPolicy = { permits: vi.fn((url: URL) => url.hostname !== "denied.example") };
    const runtime = new ARRuntime({ resourceFetcher: { fetchResource }, resourceNetworkPolicy });

    await expect(runtime.load("https://anchor.example/relink/entity")).rejects.toBeInstanceOf(NetworkPolicyError);
    expect(networkCalls).toEqual([]);
  });

  it("RT-009: Fetch/CORSの失敗をプロキシで迂回せずTransportErrorとして伝える", async () => {
    const fetchResource = vi.fn().mockRejectedValue(new TransportError("CORSで拒否されました"));
    const runtime = new ARRuntime({ resourceFetcher: { fetchResource } });

    await expect(runtime.load("https://resolver.example/relink/entity")).rejects.toBeInstanceOf(TransportError);
  });

  it("RT-010: Manifestがなくても基線L1ロードは成功する", async () => {
    const fetchResource = vi.fn().mockResolvedValue(resourceResult("https://entity.example/entity.xml"));
    const runtime = new ARRuntime({ resourceFetcher: { fetchResource } });

    await expect(runtime.load("https://resolver.example/relink/entity")).resolves.toBeDefined();
    expect(fetchResource).toHaveBeenCalledTimes(1);
  });

  it("Manifest URLからManifestを検証し、description.locationのAR-XMLを取得する", async () => {
    const fetchResource = vi.fn((url: string) => Promise.resolve(url === manifestUrl ? resourceResult(manifestUrl, 200, [], manifestJson, "application/json; charset=utf-8") : resourceResult(descriptionUrl)));
    const runtime = new ARRuntime({ resourceFetcher: { fetchResource } });

    const document = await runtime.load(manifestUrl);

    expect(document.url).toBe(descriptionUrl);
    expect(fetchResource).toHaveBeenNthCalledWith(1, manifestUrl, expect.objectContaining({ beforeRequest: expect.any(Function) }));
    expect(fetchResource).toHaveBeenNthCalledWith(2, descriptionUrl, expect.objectContaining({ beforeRequest: expect.any(Function) }));
    expect(document.getCapability("start")).toBeDefined();
  });

  it("Content-TypeがなくてもJSON Manifestを判定し、AR-XMLのURLを最終URLにする", async () => {
    const fetchResource = vi.fn((url: string) => Promise.resolve(url === manifestUrl ? resourceResult(manifestUrl, 200, [], manifestJson, "") : resourceResult(descriptionUrl)));
    const document = await new ARRuntime({ resourceFetcher: { fetchResource } }).load(manifestUrl);

    expect(document.url).toBe(descriptionUrl);
    expect(fetchResource).toHaveBeenCalledTimes(2);
  });

  it("ManifestのJSON構文エラーをManifestParseErrorとして返し、XML parserを呼び出さない", async () => {
    const parser = { parse: vi.fn((xml: string) => new BrowserXMLParser().parse(xml)) };
    const fetchResource = vi.fn().mockResolvedValue(resourceResult(manifestUrl, 200, [], "{", "application/json"));
    const runtime = new ARRuntime({ resourceFetcher: { fetchResource }, xmlParser: parser });

    await expect(runtime.load(manifestUrl)).rejects.toBeInstanceOf(ManifestParseError);
    expect(parser.parse).not.toHaveBeenCalled();
  });

  it("Manifestの必須フィールドとdescription.locationを検証する", async () => {
    const invalid = JSON.stringify({ ...JSON.parse(manifestJson), description: { location: "http://entity.example/entity.xml" } });
    const fetchResource = vi.fn().mockResolvedValue(resourceResult(manifestUrl, 200, [], invalid, "application/json"));

    await expect(new ARRuntime({ resourceFetcher: { fetchResource } }).load(manifestUrl)).rejects.toBeInstanceOf(ManifestValidationError);
    expect(fetchResource).toHaveBeenCalledTimes(1);
  });

  it("ManifestのHTTP取得失敗をManifestFetchErrorとして返す", async () => {
    const fetchResource = vi.fn().mockResolvedValue(resourceResult(manifestUrl, 404, [], "", "application/json"));

    await expect(new ARRuntime({ resourceFetcher: { fetchResource } }).load(manifestUrl)).rejects.toMatchObject({ constructor: ManifestFetchError, status: 404, url: manifestUrl });
  });

  it("Manifestが示すdescription.locationにもネットワークポリシーを適用する", async () => {
    const fetchResource = vi.fn((url: string) => Promise.resolve(url === manifestUrl ? resourceResult(manifestUrl, 200, [], manifestJson, "application/json") : resourceResult(descriptionUrl)));
    const resourceNetworkPolicy = { permits: vi.fn((url: URL) => url.hostname !== "entity.example") };
    const runtime = new ARRuntime({ resourceFetcher: { fetchResource }, resourceNetworkPolicy });

    await expect(runtime.load(manifestUrl)).rejects.toBeInstanceOf(NetworkPolicyError);
    expect(fetchResource).toHaveBeenCalledTimes(1);
    expect(resourceNetworkPolicy.permits).toHaveBeenCalledWith(new URL(descriptionUrl), manifestUrl);
  });

  it("RT-015: 終端HTTP失敗をXML parserへ渡さない", async () => {
    const parser = { parse: vi.fn((xml: string) => new BrowserXMLParser().parse(xml)) };
    const fetchResource = vi.fn().mockResolvedValue(resourceResult("https://resolver.example/not-found", 404));
    const runtime = new ARRuntime({ resourceFetcher: { fetchResource }, xmlParser: parser });

    await expect(runtime.load("https://resolver.example/relink/entity")).rejects.toBeInstanceOf(HTTPResponseError);
    expect(parser.parse).not.toHaveBeenCalled();
  });

  it("中間リダイレクトにHTTPダウングレードがあれば最終URLがHTTPSでも拒否する", async () => {
    const { runtime } = runtimeWith(resourceResult("https://cdn.example/entity.xml", 200, ["http://resolver.example/entity"]));

    await expect(runtime.load("https://resolver.example/relink/entity")).rejects.toBeInstanceOf(HTTPSDowngradeError);
  });
});
