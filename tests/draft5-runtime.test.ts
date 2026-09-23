// tests/draft5-runtime.test.ts
/** Draft 5 の Core 構造、Extension preservation、評価分離、HTTP route を検証します。 */

import { describe, expect, it, vi } from "vitest";
import { FetchHTTPInvoker } from "../src/adapters/web/BrowserFetchAdapters";
import { BrowserXMLParser } from "../src/adapters/web/BrowserXMLParser";
import { buildARDocument } from "../src/application/validation";
import { resolveHTTPTarget } from "../src/application/invocation";
import { ARRuntime, InMemorySemanticRegistry, evaluateProfileDocument } from "../src/index";
import { InterfaceError, RepresentationError, ValidationError } from "../src/domain/errors";

const parser = new BrowserXMLParser();
const core = "https://relink.dev/ns/arxml/core/0.1";
const http = "https://relink.dev/ns/arxml/http/0.1";
const base = `<?xml version="1.0"?><ar-entity xmlns="${core}" xmlns:http="${http}" version="0.1">`;

describe("AR-XML Core 0.1 Draft 5", () => {
  it("empty/passive/Properties-only Entity を公開する", () => {
    for (const xml of [`<ar-entity xmlns="${core}" version="0.1"/>`, `<ar-entity xmlns="${core}" version="0.1"><properties><property type="urn:property:name" value="lab"/></properties></ar-entity>`]) {
      expect(buildARDocument(parser.parse(xml), "https://example.test/entity.arxml")).toBeDefined();
    }
  });

  it("unknown foreign Extension を opaque に保持する", () => {
    const document = buildARDocument(parser.parse(`${base}<properties><meta:location xmlns:meta="urn:meta" value="lab"><meta:child/></meta:location></properties></ar-entity>`), "https://example.test/entity.arxml");
    expect(document.propertyExtensions[0]).toMatchObject({ namespace: "urn:meta", localName: "location", children: [{ localName: "child" }] });
  });

  it("Attachment-only Interface、Invocationなし Capability、複数 InterfaceUse を受け入れる", () => {
    const document = buildARDocument(parser.parse(`${base}<interfaces><interface id="connector"><attachment><phys:connector xmlns:phys="urn:physical" type="hdmi"/></attachment></interface><interface id="api"><realization><http:api/></realization></interface></interfaces><capabilities><capability id="observe" type="https://example.test/contracts/observe/1"/><capability id="read" type="https://example.test/contracts/read/1"><invocation/><interface-uses><interface-use ref="api"/><interface-use ref="api"/></interface-uses></capability></capabilities></ar-entity>`), "https://example.test/entity.arxml");
    expect(document.capabilities[0]?.invocation).toBeUndefined();
    expect(document.capabilities[1]?.interfaceUses).toHaveLength(2);
  });

  it("dangling ref、空 Interface、未知 Core child を拒否する", () => {
    expect(() => buildARDocument(parser.parse(`${base}<interfaces><interface id="empty"/></interfaces></ar-entity>`), "https://example.test/entity.arxml")).toThrow(ValidationError);
    expect(() => buildARDocument(parser.parse(`${base}<capabilities><capability id="x" type="https://example.test/contracts/x/1"><interface-uses><interface-use ref="missing"/></interface-uses></capability></capabilities></ar-entity>`), "https://example.test/entity.arxml")).toThrow(ValidationError);
    expect(() => buildARDocument(parser.parse(`${base}<unknown/></ar-entity>`), "https://example.test/entity.arxml")).toThrow(ValidationError);
  });

  it("Draft 4 Capability grammar はDraft 5 validatorで暗黙受理せず、明示modeだけで移行する", async () => {
    const legacyXml = `${base}<capabilities><capability id="legacy" type="https://example.test/contracts/legacy/1"><inputs><input name="value" type="string"/></inputs><interfaces><interface type="http" method="GET" endpoint="./legacy"/></interfaces></capability></capabilities></ar-entity>`;
    expect(() => buildARDocument(parser.parse(legacyXml), "https://example.test/entity.arxml")).toThrow(ValidationError);
    expect(buildARDocument(parser.parse(legacyXml), "https://example.test/entity.arxml", { format: "draft4" }).capabilities[0]?.legacyDraft4).toBe(true);
    const draft5Runtime = new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(legacyXml) } });
    await expect(draft5Runtime.load("https://example.test/entity.arxml")).rejects.toBeInstanceOf(ValidationError);
    const migrationRuntime = new ARRuntime({ documentFormat: "draft4", resourceFetcher: { fetchText: vi.fn().mockResolvedValue(legacyXml) } });
    await expect(migrationRuntime.load("https://example.test/entity.arxml")).resolves.toBeDefined();
  });

  it("typed ID の重複、入力名の重複、未知属性、許可外 foreign child を検証する", () => {
    expect(() => buildARDocument(parser.parse(`${base}<interfaces><interface id="same"><realization><http:api/></realization></interface><interface id="same"><realization><http:api/></realization></interface></interfaces></ar-entity>`), "https://example.test/entity.arxml")).toThrow(ValidationError);
    expect(() => buildARDocument(parser.parse(`${base}<capabilities><capability id="x" type="https://example.test/contracts/x/1"><invocation><inputs><input name="x" type="string"/><input name="x" type="string"/></inputs></invocation></capability></capabilities></ar-entity>`), "https://example.test/entity.arxml")).toThrow(ValidationError);
    expect(() => buildARDocument(parser.parse(`${base}<category bad="x">lab</category></ar-entity>`), "https://example.test/entity.arxml")).toThrow(ValidationError);
    expect(() => buildARDocument(parser.parse(`${base}<capabilities><capability id="x" type="https://example.test/contracts/x/1"><foreign:child xmlns:foreign="urn:foreign"/></capability></capabilities></ar-entity>`), "https://example.test/entity.arxml")).toThrow(ValidationError);
    const metadataXml = base.replace('version="0.1">', 'version="0.1" xmlns:meta="urn:meta" meta:source="catalog">') + '<subjects><subject id="same"/></subjects><interfaces><interface id="same"><realization><http:api/></realization></interface></interfaces><identifiers><identifier type="urn:id" value="1" subject-ref="same"/></identifiers></ar-entity>';
    expect(buildARDocument(parser.parse(metadataXml), "https://example.test/entity.arxml").metadata?.[0]?.localName).toBe("source");
  });

  it("Requirement/Attachment/Mapping の未知 Extension を Core-valid のまま保存し、評価を UNKNOWN にする", () => {
    const xml = `${base}<interfaces><interface id="unknown-realization"><realization><vendor:bus xmlns:vendor="urn:vendor"/></realization></interface><interface id="unknown-requirement"><realization><http:api/></realization><requirements><requirement type="urn:requirement"><vendor:credential xmlns:vendor="urn:vendor"/></requirement></requirements></interface><interface id="unknown-attachment"><attachment><vendor:connector xmlns:vendor="urn:vendor"/></attachment></interface></interfaces><capabilities><capability id="a" type="https://example.test/contracts/a/1"><invocation/><interface-uses><interface-use ref="unknown-realization"><mapping><vendor:map xmlns:vendor="urn:vendor"/></mapping></interface-use></interface-uses></capability><capability id="b" type="https://example.test/contracts/b/1"><invocation/><interface-uses><interface-use ref="unknown-requirement"><mapping><http:operation method="GET" path="b"/></mapping></interface-use></interface-uses></capability><capability id="c" type="https://example.test/contracts/c/1"><invocation/><interface-uses><interface-use ref="unknown-attachment"/></interface-uses></capability></capabilities></ar-entity>`;
    const runtime = new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(xml) } });
    return runtime.load("https://example.test/entity.arxml").then((document) => {
      expect(document.getCapability("a")?.evaluation.routes[0]).toMatchObject({ support: "UNKNOWN", availability: "UNKNOWN" });
      expect(document.getCapability("b")?.evaluation.routes[0]).toMatchObject({ requirement: "UNKNOWN", availability: "UNKNOWN" });
      expect(document.getCapability("c")?.evaluation.routes[0]).toMatchObject({ attachment: "UNKNOWN", availability: "UNAVAILABLE" });
    });
  });

  it("Capability Requirement は証拠なしで READY に丸めない", async () => {
    const xml = `${base}<interfaces><interface id="web"><realization><http:api/></realization></interface></interfaces><capabilities><capability id="secured" type="https://example.test/contracts/secured/1"><requirements><requirement type="urn:credential"><vendor:credential xmlns:vendor="urn:vendor"/></requirement></requirements><invocation/><interface-uses><interface-use ref="web"><mapping><http:operation method="GET" path="secured"/></mapping></interface-use></interface-uses></capability></capabilities></ar-entity>`;
    const document = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(xml) }, semanticRegistry: new InMemorySemanticRegistry([{ identifier: "https://example.test/contracts/secured/1", invocation: {} }]) }).load("https://example.test/entity.arxml");
    expect(document.getCapability("secured")?.evaluation).toMatchObject({ availability: "UNKNOWN", routes: [{ requirement: "UNKNOWN", capabilityRequirement: "UNKNOWN" }] });
  });
});

describe("Draft 5 HTTP Extension", () => {
  it("共有 Interface と http:operation を使い、load では HTTP を呼び出さない", async () => {
    const xml = `${base}<interfaces><interface id="web"><realization><http:api base="./api/"/></realization></interface></interfaces><capabilities><capability id="light" type="https://example.test/contracts/light/1"><invocation><inputs><input name="on" type="boolean"/></inputs><result><outputs><output name="state" type="boolean"/></outputs><representations><representation media-type="application/json"/></representations></result></invocation><interface-uses><interface-use ref="web"><mapping><http:operation method="POST" path="light/state"/></mapping></interface-use></interface-uses></capability></capabilities></ar-entity>`;
    const invoke = vi.fn().mockResolvedValue({ status: 200, headers: new Headers({ "content-type": "application/json" }), text: async () => '{"state":true}', blob: async () => new Blob() });
    const contract = { identifier: "https://example.test/contracts/light/1", invocation: { inputs: [{ name: "on", type: "boolean", required: true }], result: { outputs: [{ name: "state", type: "boolean" }], representations: [{ mediaType: "application/json" }] } } } as const;
    const runtime = new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(xml) }, httpInvoker: { invoke }, semanticRegistry: new InMemorySemanticRegistry([contract]) });
    const document = await runtime.load("https://example.test/entities/entity.arxml");
    expect(invoke).not.toHaveBeenCalled();
    expect(document.getCapability("light")?.evaluation.availability).toBe("READY");
    await expect(document.getCapability("light")?.invoke({ on: true })).resolves.toEqual({ values: { state: true }, representation: "application/json" });
    expect(invoke.mock.calls[0]?.[0].href).toBe("https://example.test/entities/api/light/state");
  });

  it("Contract が未解決なら projection と availability を UNKNOWN にする", async () => {
    const xml = `${base}<interfaces><interface id="web"><realization><http:api/></realization></interface></interfaces><capabilities><capability id="x" type="https://example.test/contracts/x/1"><invocation/><interface-uses><interface-use ref="web"><mapping><http:operation method="GET" path="x"/></mapping></interface-use></interface-uses></capability></capabilities></ar-entity>`;
    const runtime = new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(xml) } });
    const capability = (await runtime.load("https://example.test/entity.arxml")).getCapability("x");
    expect(capability?.evaluation).toMatchObject({ contractResolution: "UNRESOLVED", projectionValidation: "UNVALIDATED", availability: "UNKNOWN" });
  });

  it("GET scalar query mapping は既存 query を保持し、衝突を拒否する", async () => {
    const xml = `${base}<interfaces><interface id="web"><realization><http:api base="./api/"/></realization></interface></interfaces><capabilities><capability id="read" type="https://example.test/contracts/read/1"><invocation><inputs><input name="q" type="string" required="false"/><input name="active" type="boolean" required="false"/></inputs><result><outputs><output name="value" type="number"/></outputs><representations><representation media-type="application/json"/></representations></result></invocation><interface-uses><interface-use ref="web"><mapping><http:operation method="GET" path="read?mode=read"/></mapping></interface-use></interface-uses></capability></capabilities></ar-entity>`;
    const invoke = vi.fn().mockResolvedValue({ status: 200, headers: new Headers({ "content-type": "application/json" }), text: async () => '{"value":1}', blob: async () => new Blob() });
    const contract = { identifier: "https://example.test/contracts/read/1", invocation: { inputs: [{ name: "q", type: "string", required: false }, { name: "active", type: "boolean", required: false }], result: { outputs: [{ name: "value", type: "number" }], representations: [{ mediaType: "application/json" }] } } } as const;
    const document = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(xml) }, httpInvoker: { invoke }, semanticRegistry: new InMemorySemanticRegistry([contract]) }).load("https://example.test/entities/entity.arxml");
    await document.getCapability("read")?.invoke({ q: "a b", active: true });
    const requestUrl = invoke.mock.calls[0]?.[0] as URL;
    expect(requestUrl.href).toBe("https://example.test/entities/api/read?mode=read&q=a+b&active=true");
    const collisionXml = xml.replace("mode=read", "q=existing");
    const collision = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(collisionXml) }, httpInvoker: { invoke }, semanticRegistry: new InMemorySemanticRegistry([contract]) }).load("https://example.test/entities/entity.arxml");
    await expect(collision.getCapability("read")?.invoke({ q: "new" })).rejects.toBeInstanceOf(InterfaceError);
  });

  it("同一 Interface ref の複数 route は一意選択を要求し、失敗後に別 route を実行しない", async () => {
    const xml = `${base}<interfaces><interface id="web"><realization><http:api/></realization></interface></interfaces><capabilities><capability id="write" type="https://example.test/contracts/write/1"><invocation><inputs><input name="level" type="integer"/></inputs><result><outputs><output name="ok" type="boolean"/></outputs><representations><representation media-type="application/json"/></representations></result></invocation><interface-uses><interface-use ref="web"><mapping><http:operation method="POST" path="first"/></mapping></interface-use><interface-use ref="web"><mapping><http:operation method="POST" path="second"/></mapping></interface-use></interface-uses></capability></capabilities></ar-entity>`;
    const contract = { identifier: "https://example.test/contracts/write/1", invocation: { inputs: [{ name: "level", type: "integer", required: true }], result: { outputs: [{ name: "ok", type: "boolean" }], representations: [{ mediaType: "application/json" }] } } } as const;
    const invoke = vi.fn().mockResolvedValue({ status: 200, headers: new Headers({ "content-type": "application/json" }), text: async () => "{", blob: async () => new Blob() });
    const document = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(xml) }, httpInvoker: { invoke }, semanticRegistry: new InMemorySemanticRegistry([contract]) }).load("https://example.test/entity.arxml");
    const capability = document.getCapability("write")!;
    expect(capability.evaluation.routes).toHaveLength(2);
    expect(capability.evaluation.routes[0]?.routeId).not.toBe(capability.evaluation.routes[1]?.routeId);
    await expect(capability.invoke({ level: 2 })).rejects.toBeInstanceOf(ValidationError);
    await expect(capability.invoke({ level: 2 }, { routeId: capability.evaluation.routes[0]!.routeId })).rejects.toBeInstanceOf(RepresentationError);
    expect(invoke).toHaveBeenCalledTimes(1);
  });

  it("POST/PUT/PATCH JSON mapping と 204 no-Result を処理する", async () => {
    const template = (method: string, result: string) => `${base}<interfaces><interface id="web"><realization><http:api/></realization></interface></interfaces><capabilities><capability id="write" type="https://example.test/contracts/write/1"><invocation><inputs><input name="level" type="integer"/></inputs>${result}</invocation><interface-uses><interface-use ref="web"><mapping><http:operation method="${method}" path="write"/></mapping></interface-use></interface-uses></capability></capabilities></ar-entity>`;
    const result = `<result><outputs><output name="ok" type="boolean"/></outputs><representations><representation media-type="application/json"/></representations></result>`;
    const contract = { identifier: "https://example.test/contracts/write/1", invocation: { inputs: [{ name: "level", type: "integer", required: true }], result: { outputs: [{ name: "ok", type: "boolean" }], representations: [{ mediaType: "application/json" }] } } } as const;
    for (const method of ["POST", "PUT", "PATCH"]) {
      const invoke = vi.fn().mockResolvedValue({ status: 200, headers: new Headers({ "content-type": "application/json" }), text: async () => '{"ok":true}', blob: async () => new Blob() });
      const document = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(template(method, result)) }, httpInvoker: { invoke }, semanticRegistry: new InMemorySemanticRegistry([contract]) }).load("https://example.test/entity.arxml");
      await document.getCapability("write")?.invoke({ level: 2 });
      expect(invoke.mock.calls[0]?.[1]).toMatchObject({ method, body: '{"level":2}' });
    }
    const noResultXml = template("POST", "");
    const noResultContract = { identifier: "https://example.test/contracts/write/1", invocation: { inputs: [{ name: "level", type: "integer", required: true }] } } as const;
    const noResult = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(noResultXml) }, httpInvoker: { invoke: vi.fn().mockResolvedValue({ status: 204, headers: new Headers(), text: async () => "", blob: async () => new Blob() }) }, semanticRegistry: new InMemorySemanticRegistry([noResultContract]) }).load("https://example.test/entity.arxml");
    await expect(noResult.getCapability("write")?.invoke({ level: 2 })).resolves.toEqual({ values: {} });
  });

  it("JSON Result の Content-Type、malformed JSON、missing Output、204 を層別化する", async () => {
    const xml = `${base}<interfaces><interface id="web"><realization><http:api/></realization></interface></interfaces><capabilities><capability id="read" type="https://example.test/contracts/read/1"><invocation><result><outputs><output name="value" type="number"/></outputs><representations><representation media-type="application/json"/></representations></result></invocation><interface-uses><interface-use ref="web"><mapping><http:operation method="GET" path="read"/></mapping></interface-use></interface-uses></capability></capabilities></ar-entity>`;
    const contract = { identifier: "https://example.test/contracts/read/1", invocation: { result: { outputs: [{ name: "value", type: "number" }], representations: [{ mediaType: "application/json" }] } } } as const;
    for (const response of [
      { status: 200, headers: new Headers({ "content-type": "application/json" }), text: async () => "{", blob: async () => new Blob() },
      { status: 200, headers: new Headers({ "content-type": "application/json" }), text: async () => "{}", blob: async () => new Blob() },
      { status: 200, headers: new Headers({ "content-type": "text/plain" }), text: async () => '{"value":1}', blob: async () => new Blob() },
      { status: 204, headers: new Headers(), text: async () => "", blob: async () => new Blob() },
    ]) {
      const runtime = new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(xml) }, httpInvoker: { invoke: vi.fn().mockResolvedValue(response) }, semanticRegistry: new InMemorySemanticRegistry([contract]) });
      const capability = (await runtime.load("https://example.test/entity.arxml")).getCapability("read");
      await expect(capability?.invoke({})).rejects.toBeInstanceOf(RepresentationError);
    }
    const failure = new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(xml) }, httpInvoker: { invoke: vi.fn().mockResolvedValue({ status: 500, headers: new Headers(), text: async () => "", blob: async () => new Blob() }) }, semanticRegistry: new InMemorySemanticRegistry([contract]) });
    await expect((await failure.load("https://example.test/entity.arxml")).getCapability("read")?.invoke({})).rejects.toBeInstanceOf(InterfaceError);
  });

  it("未対応 method は構文validでも route を UNAVAILABLE とし、URI resolution は strict に行う", async () => {
    const xml = `${base}<interfaces><interface id="web"><realization><http:api/></realization></interface></interfaces><capabilities><capability id="read" type="https://example.test/contracts/read/1"><invocation/><interface-uses><interface-use ref="web"><mapping><http:operation method="DELETE" path="read"/></mapping></interface-use></interface-uses></capability></capabilities></ar-entity>`;
    const document = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(xml) } }).load("https://example.test/entity.arxml");
    expect(document.getCapability("read")?.evaluation).toMatchObject({ availability: "UNAVAILABLE" });
    expect(resolveHTTPTarget("https://example.test/entities/lab/ar.xml?rev=5", "./api/", "light/state#result").href).toBe("https://example.test/entities/lab/api/light/state");
    expect(() => resolveHTTPTarget("https://example.test/ar.xml", undefined, "https://other.example/action")).toThrow(InterfaceError);
  });

  it("Projection CONFLICT、制約の未知状態、Profile の三値結果を分離する", async () => {
    const xml = `${base}<properties><property type="urn:site" value="lab"/></properties><interfaces><interface id="web"><realization><http:api/></realization></interface></interfaces><capabilities><capability id="x" type="https://example.test/contracts/x/1"><invocation><inputs><input name="required" type="boolean"><constraints><vendor:range xmlns:vendor="urn:vendor"/></constraints></input></inputs></invocation><interface-uses><interface-use ref="web"><mapping><http:operation method="GET" path="x"/></mapping></interface-use></interface-uses></capability></capabilities></ar-entity>`;
    const fixedXml = xml;
    const contract = { identifier: "https://example.test/contracts/x/1", invocation: { inputs: [{ name: "other", type: "boolean", required: true }] } } as const;
    const document = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(fixedXml) }, semanticRegistry: new InMemorySemanticRegistry([contract], [{ identifier: "https://example.test/profiles/lab/1", requiredCapabilities: ["https://example.test/contracts/x/1"] }]) }).load("https://example.test/entity.arxml");
    expect(document.getCapability("x")?.evaluation).toMatchObject({ projectionValidation: "CONFLICT", availability: "UNAVAILABLE" });
    const uncertainXml = fixedXml;
    const uncertain = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(uncertainXml) }, semanticRegistry: new InMemorySemanticRegistry([{ identifier: "https://example.test/contracts/x/1", invocation: { inputs: [{ name: "required", type: "boolean", required: true }] } }]) }).load("https://example.test/entity.arxml");
    expect(uncertain.getCapability("x")?.evaluation).toMatchObject({ projectionValidation: "UNVALIDATED", availability: "UNKNOWN" });
    const contractRequirement = { identifier: "https://example.test/contracts/x/1", requirements: [{ type: "urn:credential", extensions: [] }], invocation: { inputs: [{ name: "required", type: "boolean", required: true }] } } as const;
    const requirementDocument = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(uncertainXml) }, semanticRegistry: new InMemorySemanticRegistry([contractRequirement]) }).load("https://example.test/entity.arxml");
    expect(requirementDocument.getCapability("x")?.evaluation).toMatchObject({ projectionValidation: "CONFLICT", availability: "UNAVAILABLE", routes: [{ contractRequirement: "UNKNOWN" }] });
    const requirementBaseXml = uncertainXml.replace("<constraints><vendor:range xmlns:vendor=\"urn:vendor\"/></constraints>", "");
    const entityRequirementXml = requirementBaseXml.replace("<invocation>", "<requirements><requirement type=\"urn:credential\"/></requirements><invocation>");
    const entityRequirementDocument = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(entityRequirementXml) }, semanticRegistry: new InMemorySemanticRegistry([contractRequirement]) }).load("https://example.test/entity.arxml");
    expect(entityRequirementDocument.getCapability("x")?.evaluation).toMatchObject({ projectionValidation: "VALIDATED", availability: "UNKNOWN", routes: [{ contractRequirement: "UNKNOWN", capabilityRequirement: "UNKNOWN" }] });
    const additionalRequirementDocument = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(requirementBaseXml.replace("<invocation>", "<requirements><requirement type=\"urn:entity-auth\"/></requirements><invocation>")) }, semanticRegistry: new InMemorySemanticRegistry([{ identifier: "https://example.test/contracts/x/1", invocation: { inputs: [{ name: "required", type: "boolean", required: true }] } }]) }).load("https://example.test/entity.arxml");
    expect(additionalRequirementDocument.getCapability("x")?.evaluation).toMatchObject({ projectionValidation: "VALIDATED", availability: "UNKNOWN" });
    const representationXml = fixedXml.replace("</inputs></invocation>", "</inputs><result><outputs><output name=\"value\" type=\"boolean\"/></outputs><representations><representation media-type=\"text/plain\"/></representations></result></invocation>");
    const representationContract = { identifier: "https://example.test/contracts/x/1", invocation: { inputs: [{ name: "required", type: "boolean", required: true }], result: { outputs: [{ name: "value", type: "boolean" }], representations: [{ mediaType: "application/json" }] } } } as const;
    const representationDocument = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(representationXml) }, semanticRegistry: new InMemorySemanticRegistry([representationContract]) }).load("https://example.test/entity.arxml");
    expect(representationDocument.getCapability("x")?.evaluation).toMatchObject({ projectionValidation: "CONFLICT", availability: "UNAVAILABLE" });
    expect(document.evaluateProfile("https://example.test/profiles/missing/1")).toEqual({ resolution: "UNRESOLVED", conformance: "UNDETERMINED" });
    const structural = buildARDocument(parser.parse(fixedXml), "https://example.test/entity.arxml");
    expect(evaluateProfileDocument(structural, "https://example.test/profiles/lab/1", new InMemorySemanticRegistry([], [{ identifier: "https://example.test/profiles/lab/1", requiredCapabilities: ["https://example.test/contracts/x/1"] }]))).toEqual({ resolution: "RESOLVED", conformance: "CONFORMANT" });
    const characteristicProfile = new InMemorySemanticRegistry([], [{ identifier: "https://example.test/profiles/characteristics/1", propertyRequirements: [{ type: "urn:site", value: "lab" }], interfaceRequirements: [{ id: "web", requireRealization: true }] }]);
    expect(evaluateProfileDocument(structural, "https://example.test/profiles/characteristics/1", characteristicProfile)).toEqual({ resolution: "RESOLVED", conformance: "CONFORMANT" });
    const nonConformantProfile = new InMemorySemanticRegistry([], [{ identifier: "https://example.test/profiles/missing-identifier/1", identifierRequirements: [{ type: "urn:serial" }] }]);
    expect(evaluateProfileDocument(structural, "https://example.test/profiles/missing-identifier/1", nonConformantProfile)).toEqual({ resolution: "RESOLVED", conformance: "NON_CONFORMANT" });
    const conflictRegistry = new InMemorySemanticRegistry([contract, contract]);
    const conflicted = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(fixedXml) }, semanticRegistry: conflictRegistry }).load("https://example.test/entity.arxml");
    expect(conflicted.getCapability("x")?.evaluation).toMatchObject({ contractResolution: "UNRESOLVED", projectionValidation: "UNVALIDATED", availability: "UNKNOWN" });
    const profileDocument = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(fixedXml) }, semanticRegistry: characteristicProfile }).load("https://example.test/entity.arxml");
    expect(profileDocument.evaluateProfile("https://example.test/profiles/characteristics/1")).toEqual({ resolution: "RESOLVED", conformance: "CONFORMANT" });
    const unknownProfile = new InMemorySemanticRegistry([], [{ identifier: "https://example.test/profiles/invocation/1", capabilityRequirements: [{ contractIdentifier: "https://example.test/contracts/x/1", requiredInputNames: ["required"] }] }]);
    const unknownProfileDocument = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(`${base}<capabilities><capability id="x" type="https://example.test/contracts/x/1"/></capabilities></ar-entity>`) }, semanticRegistry: unknownProfile }).load("https://example.test/entity.arxml");
    expect(unknownProfileDocument.evaluateProfile("https://example.test/profiles/invocation/1")).toEqual({ resolution: "RESOLVED", conformance: "UNDETERMINED" });
  });

  it("Profile Capability candidate を全件評価し、document order に依存しない", () => {
    const candidate = (id: string, input: string) => `<capability id="${id}" type="https://example.test/contracts/candidate/1"><invocation><inputs><input name="${input}" type="boolean"/></inputs></invocation></capability>`;
    const profile = new InMemorySemanticRegistry([], [{ identifier: "https://example.test/profiles/candidate/1", capabilityRequirements: [{ contractIdentifier: "https://example.test/contracts/candidate/1", requiredInputNames: ["required"] }] }]);
    const ordered = buildARDocument(parser.parse(`${base}<capabilities>${candidate("bad", "other")}${candidate("good", "required")}</capabilities></ar-entity>`), "https://example.test/entity.arxml");
    const reversed = buildARDocument(parser.parse(`${base}<capabilities>${candidate("good", "required")}${candidate("bad", "other")}</capabilities></ar-entity>`), "https://example.test/entity.arxml");
    expect(evaluateProfileDocument(ordered, "https://example.test/profiles/candidate/1", profile)).toEqual({ resolution: "RESOLVED", conformance: "CONFORMANT" });
    expect(evaluateProfileDocument(reversed, "https://example.test/profiles/candidate/1", profile)).toEqual({ resolution: "RESOLVED", conformance: "CONFORMANT" });
    const indeterminate = buildARDocument(parser.parse(`${base}<capabilities>${candidate("bad", "other")}<capability id="unknown" type="https://example.test/contracts/candidate/1"/></capabilities></ar-entity>`), "https://example.test/entity.arxml");
    expect(evaluateProfileDocument(indeterminate, "https://example.test/profiles/candidate/1", profile)).toEqual({ resolution: "RESOLVED", conformance: "UNDETERMINED" });
  });

  it("Input requiredness の方向と明示許可を ProjectionValidation に反映する", async () => {
    const xml = `${base}<interfaces><interface id="web"><realization><http:api/></realization></interface></interfaces><capabilities><capability id="x" type="https://example.test/contracts/x/1"><invocation><inputs><input name="value" type="boolean" required="true"/></inputs></invocation><interface-uses><interface-use ref="web"><mapping><http:operation method="GET" path="x"/></mapping></interface-use></interface-uses></capability></capabilities></ar-entity>`;
    const strengtheningContract = { identifier: "https://example.test/contracts/x/1", invocation: { inputs: [{ name: "value", type: "boolean", required: false }] } } as const;
    const strengthening = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(xml) }, semanticRegistry: new InMemorySemanticRegistry([strengtheningContract]) }).load("https://example.test/entity.arxml");
    expect(strengthening.getCapability("x")?.evaluation).toMatchObject({ projectionValidation: "CONFLICT", availability: "UNAVAILABLE" });
    const permitted = { ...strengtheningContract, permittedInputRequirednessNarrowing: ["value"] } as const;
    const permittedDocument = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(xml) }, semanticRegistry: new InMemorySemanticRegistry([permitted]) }).load("https://example.test/entity.arxml");
    expect(permittedDocument.getCapability("x")?.evaluation).toMatchObject({ projectionValidation: "VALIDATED", availability: "READY" });
    const weakeningXml = xml.replace('required="true"', 'required="false"');
    const weakeningContract = { identifier: "https://example.test/contracts/x/1", invocation: { inputs: [{ name: "value", type: "boolean", required: true }] } } as const;
    const weakening = await new ARRuntime({ resourceFetcher: { fetchText: vi.fn().mockResolvedValue(weakeningXml) }, semanticRegistry: new InMemorySemanticRegistry([weakeningContract]) }).load("https://example.test/entity.arxml");
    expect(weakening.getCapability("x")?.evaluation).toMatchObject({ projectionValidation: "CONFLICT", availability: "UNAVAILABLE" });
  });

  it("既定の HTTP Invoker は redirect を fail-closed にする", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    await new FetchHTTPInvoker(fetcher as unknown as typeof fetch).invoke(new URL("https://example.test/api"), { method: "POST", body: "{}" });
    expect(fetcher).toHaveBeenCalledWith(new URL("https://example.test/api"), expect.objectContaining({ method: "POST", redirect: "error" }));
  });
});
