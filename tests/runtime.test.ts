// tests/runtime.test.ts
import { describe, expect, it, vi } from "vitest";
import { ARRuntime } from "../src/core/runtime";
import { parseARXML } from "../src/core/parser";
import { loadARXML } from "../src/core/loader";
import { executeHTTPAction } from "../src/actions/HTTPActionExecutor";
import { HTMLRenderer } from "../src/renderer/HTMLRenderer";
import { ARActionElement, ARButtonElement, ARTextElement } from "../src/dom/ARDocument";
import { ARXMLActionError, ARXMLNetworkError, ARXMLParseError, ARXMLValidationError } from "../src/errors/errors";

const xml = `<ar-content><outputs><text id="message">初期値</text><button id="register">登録</button><unknown id="ignored">無視</unknown></outputs><actions><action id="action" type="http" method="POST" endpoint="/api/register"/></actions><events><event on="click" target="register" action="action" success-target="message" success-text="成功" error-target="message" error-text="失敗"/></events></ar-content>`;

describe("AR-XML parser", () => {
  it("text、button、binding を AR-DOM に変換し、未知要素を無視する", () => {
    const document = parseARXML(xml);
    expect(document.getElementById("message")).toBeInstanceOf(ARTextElement);
    expect(document.getElementById("register")).toBeInstanceOf(ARButtonElement);
    expect(document.getElementById("ignored")).toBeUndefined();
    expect(document.eventBindings).toHaveLength(1);
  });
  it("不正な XML を Parse Error にする", () => expect(() => parseARXML("<ar-content>")).toThrow(ARXMLParseError));
  it("必須属性不足を Validation Error にする", () => expect(() => parseARXML("<ar-content><outputs><text>text</text></outputs></ar-content>")).toThrow(ARXMLValidationError));
  it("重複 ID を Validation Error にする", () => expect(() => parseARXML("<ar-content><outputs><text id=\"same\">a</text><button id=\"same\">b</button></outputs></ar-content>")).toThrow(ARXMLValidationError));
  it("script のような未知要素を無視し、実行対象にしない", () => {
    const arDocument = parseARXML("<ar-content><outputs><text id=\"safe\">安全</text><script>alert(1)</script></outputs></ar-content>");
    expect(arDocument.getElementById("safe")).toBeInstanceOf(ARTextElement);
    expect(arDocument.getElementById("script")).toBeUndefined();
  });
});

describe("loader と HTTP action", () => {
  it("AR-XML 取得の HTTP 失敗を Network Error にする", async () => {
    await expect(loadARXML("https://warehouse.example/bad.arxml", vi.fn().mockResolvedValue(new Response("", { status: 404 })))).rejects.toBeInstanceOf(ARXMLNetworkError);
  });
  it("AR-XML URL を基準に相対 endpoint を解決する", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response("", { status: 200 }));
    await executeHTTPAction(new ARActionElement("get", "http", "GET", "/api/status"), "https://warehouse.example/path/container.arxml", fetcher);
    expect(fetcher).toHaveBeenCalledWith(new URL("https://warehouse.example/api/status"), { method: "GET" });
  });
  it("cross-origin endpoint と不正 endpoint を拒否する", async () => {
    await expect(executeHTTPAction(new ARActionElement("external", "http", "GET", "https://other.example/api"), "https://warehouse.example/document.arxml")).rejects.toBeInstanceOf(ARXMLActionError);
    await expect(executeHTTPAction(new ARActionElement("invalid", "http", "GET", "http://[invalid"), "https://warehouse.example/document.arxml")).rejects.toBeInstanceOf(ARXMLActionError);
  });
});

describe("AR runtime", () => {
  it("成功時は AR-DOM と安全な表示を更新する", async () => {
    const container = document.createElement("div"); const arDocument = parseARXML(xml);
    const fetcher = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    new ARRuntime(arDocument, new HTMLRenderer(container), "https://example.test/page", fetcher).mount();
    const button = container.querySelector("button")!; button.click(); await vi.waitFor(() => expect(container.textContent).toContain("成功"));
    expect((arDocument.getElementById("message") as ARTextElement).text).toBe("成功");
    expect(fetcher).toHaveBeenCalledWith(new URL("/api/register", "https://example.test/page"), expect.objectContaining({ method: "POST" }));
  });
  it("HTTP 失敗時はエラー表示へ更新する", async () => {
    const container = document.createElement("div"); const arDocument = parseARXML(xml);
    new ARRuntime(arDocument, new HTMLRenderer(container), "https://example.test", vi.fn().mockResolvedValue(new Response("", { status: 500 }))).mount();
    container.querySelector("button")!.click(); await vi.waitFor(() => expect(container.textContent).toContain("失敗"));
    expect((arDocument.getElementById("message") as ARTextElement).text).toBe("失敗");
  });
  it("HTML 風テキストを HTML として解釈しない", () => {
    const container = document.createElement("div"); const arDocument = parseARXML("<ar-content><outputs><text id=\"x\">&lt;img src=x onerror=alert(1)&gt;</text></outputs></ar-content>");
    new HTMLRenderer(container).render(arDocument, () => undefined);
    expect(container.querySelector("img")).toBeNull(); expect(container.textContent).toContain("<img");
  });
});
