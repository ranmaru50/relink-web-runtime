// tests/runtime.test.ts
import { describe, expect, it, vi } from "vitest";
import { BrowserXMLParser } from "../src/adapters/web/BrowserXMLParser";
import { BrowserResourceFetcher, FetchHTTPInvoker } from "../src/adapters/web/BrowserFetchAdapters";
import { resolveEndpoint } from "../src/application/endpoint";
import { buildARDocument } from "../src/application/validation";
import { InterfaceError, ParseError, RepresentationError, ValidationError } from "../src/domain/errors";
import { isSameCapabilityLocalId } from "../src/domain/model";
import { ARRuntime } from "../src/runtime/ARRuntime";

const xml = `<?xml version="1.0"?><ar-entity xmlns="https://relink.dev/ns/arxml/core/0.1" version="0.1"><category>environment.sensor</category><profiles><conforms-to href="https://example.test/profile"/></profiles><capabilities><capability id="temperature" type="https://example.test/capabilities/temperature/1"><inputs><input name="unit" type="string" required="false"/></inputs><result><outputs><output name="temperature" type="number"/></outputs><representations><representation media-type="application/json"/></representations></result><interfaces><interface type="http" method="GET" endpoint="api/temperature"/></interfaces></capability></capabilities></ar-entity>`;
const parser = new BrowserXMLParser();
const response = (body: string, status = 200, contentType = "application/json") => ({ status, headers: new Headers({ "content-type": contentType }), text: async () => body, blob: async () => new Blob([body]) });

describe("Draft 4 XML parsing and validation", () => {
  it("Local ID は文字列として厳密比較し、Semantic Identifier と分離する", () => {
    const document = buildARDocument(parser.parse(xml), "https://example.test/entities/ar.xml");
    expect(isSameCapabilityLocalId("temperature", "temperature")).toBe(true);
    expect(document.capabilities[0]?.localId).toBe("temperature");
    expect(document.capabilities[0]?.semanticType).toBe("https://example.test/capabilities/temperature/1");
    expect(document.capabilities[0]?.contractResolution).toBe("UNRESOLVED");
    expect(document.capabilities[0]?.projectionValidation).toBe("UNVALIDATED");
    expect(document.capabilities[0]?.availability).toBe("READY");
  });
  it("XML 構文エラーと AR-XML 検証エラーを分離する", () => {
    expect(() => parser.parse("<ar-entity>")).toThrow(ParseError);
    expect(() => buildARDocument(parser.parse("<ar-content/>"), "https://example.test/a.xml")).toThrow(ValidationError);
  });
  it("必須属性、Namespace、Capability ID、Output name を検証する", () => {
    expect(() => buildARDocument(parser.parse("<ar-entity xmlns=\"https://relink.dev/ns/arxml/core/0.1\" version=\"0.1\"/>"), "https://example.test/a.xml")).not.toThrow();
    expect(() => buildARDocument(parser.parse(xml.replace('id="temperature"', '')), "https://example.test/a.xml")).toThrow(ValidationError);
    expect(() => buildARDocument(parser.parse(xml.replace('name="temperature"', 'name="x"/><output name="x"')), "https://example.test/a.xml")).toThrow(ValidationError);
  });
});

describe("endpoint resolution", () => {
  it("AR-XML の URL だけを基準に標準 URL 解決する", () => {
    const base = "https://example.org/entities/device/ar.xml";
    expect(resolveEndpoint(base, "/api/start").href).toBe("https://example.org/api/start");
    expect(resolveEndpoint(base, "api/start").href).toBe("https://example.org/entities/device/api/start");
    expect(resolveEndpoint(base, "../start").href).toBe("https://example.org/entities/start");
    expect(resolveEndpoint(base, "https://api.example.net/start").href).toBe("https://api.example.net/start");
  });
});

describe("browser fetch adapters", () => {
  it("既定 fetch を globalThis に束縛して呼び出す", async () => {
    const nativeLikeFetch = vi.fn(function (this: unknown): Promise<Response> {
      if (this !== globalThis) throw new TypeError("Illegal invocation");
      return Promise.resolve(new Response("AR-XML", { status: 200 }));
    });
    vi.stubGlobal("fetch", nativeLikeFetch);

    try {
      await expect(new BrowserResourceFetcher().fetchText("https://example.test/document.arxml")).resolves.toBe("AR-XML");
      await expect(new FetchHTTPInvoker().invoke(new URL("https://example.test/api"), { method: "GET" })).resolves.toBeInstanceOf(Response);
      expect(nativeLikeFetch).toHaveBeenCalledTimes(2);
    } finally {
      // 後続テストへブラウザAPIの差し替え状態を持ち越さないようにします。
      vi.unstubAllGlobals();
    }
  });
});

describe("ARRuntime first vertical slice", () => {
  function runtimeWith(invoker: { invoke: ReturnType<typeof vi.fn> }): ARRuntime { return new ARRuntime({ xmlParser: parser, resourceFetcher: { fetchText: vi.fn().mockResolvedValue(xml) }, httpInvoker: invoker }); }
  it("load、GET query serialization、single JSON Output mapping を実行する", async () => {
    const invoke = vi.fn().mockResolvedValue(response("20.1")); const runtime = runtimeWith({ invoke });
    const document = await runtime.load("https://example.test/entities/ar.xml"); const capability = document.getCapability("temperature");
    await expect(capability?.invoke({ unit: "Cel" })).resolves.toEqual({ values: { temperature: 20.1 }, representation: "application/json" });
    expect(invoke.mock.calls[0]?.[0].href).toBe("https://example.test/entities/api/temperature?unit=Cel");
  });
  it("required Input、非 2xx、壊れた JSON を層別エラーにする", async () => {
    const requiredXml = xml.replace('required="false"', 'required="true"');
    const missing = new ARRuntime({ xmlParser: parser, resourceFetcher: { fetchText: vi.fn().mockResolvedValue(requiredXml) }, httpInvoker: { invoke: vi.fn() } });
    await expect((await missing.load("https://example.test/a.xml")).getCapability("temperature")?.invoke({})).rejects.toBeInstanceOf(ValidationError);
    const failure = runtimeWith({ invoke: vi.fn().mockResolvedValue(response("", 500)) });
    await expect((await failure.load("https://example.test/a.xml")).getCapability("temperature")?.invoke({ unit: "C" })).rejects.toBeInstanceOf(InterfaceError);
    const invalidJson = runtimeWith({ invoke: vi.fn().mockResolvedValue(response("nope")) });
    await expect((await invalidJson.load("https://example.test/a.xml")).getCapability("temperature")?.invoke({ unit: "C" })).rejects.toBeInstanceOf(RepresentationError);
  });
  it("同一 Origin 以外の Interface は既定ポリシーで拒否する", async () => {
    const runtime = new ARRuntime({ xmlParser: parser, resourceFetcher: { fetchText: vi.fn().mockResolvedValue(xml.replace('endpoint="api/temperature"', 'endpoint="https://other.test/api"')) }, httpInvoker: { invoke: vi.fn() } });
    await expect((await runtime.load("https://example.test/a.xml")).getCapability("temperature")?.invoke({})).rejects.toBeInstanceOf(InterfaceError);
  });
});
