// tests/harness.test.ts
import { describe, expect, it, vi } from "vitest";
import { TestbedClient } from "../test-harness/client";
import { compareRequest, normalizeOrigin, parseCases, parseInputs, requestsAddedSince } from "../test-harness/logic";

describe("Test Harness logic", () => {
  it("Testbed のケース一覧を検証して選択に必要なデータを保持する", () => {
    const cases = parseCases([{ id: "single-output-json", group: "response", description: "value", documentUrl: "http://test/a.arxml", capabilityId: "read", inputs: {} }]);
    expect(cases[0]?.capabilityId).toBe("read");
    expect(() => parseCases([{ id: 1 }])).toThrow("case");
  });
  it("Expected Request と Observed Request の共有フィールドだけを比較する", () => {
    const expected = { request: { method: "POST", pathname: "/api", query: {}, json: { a: 1 } } };
    expect(compareRequest(expected, { method: "POST", pathname: "/api", query: {}, json: { a: 1 }, endpointId: "echo", timestamp: 1 }).status).toBe("PASS");
    expect(compareRequest(expected, { method: "GET", pathname: "/api", query: {}, endpointId: "echo", timestamp: 1 }).status).toBe("FAIL");
  });
  it("現在の Invocation で増えなかった古い観測を比較対象にしない", () => {
    const old = { method: "POST", pathname: "/api", query: {}, json: { a: 1 }, endpointId: "echo", timestamp: 1 };
    const expected = { request: { method: "POST", pathname: "/api", json: { a: 1 } } };
    const none = requestsAddedSince([old], [old]);
    expect(none).toEqual([]);
    expect(compareRequest(expected, none.at(-1)).status).toBe("NOT_AVAILABLE");
    const fresh = { ...old, timestamp: 2 };
    expect(requestsAddedSince([old], [old, fresh]).at(-1)).toEqual(fresh);
  });
  it("不正な入力 JSON と Origin を拒否する", () => {
    expect(() => parseInputs("[]")).toThrow("object"); expect(() => parseInputs("{")).toThrow(); expect(() => normalizeOrigin("ftp://example.test")).toThrow("HTTP");
  });
  it("接続失敗と reset を HTTP 応答として扱う", async () => {
    const failedFetch = vi.fn().mockResolvedValue(new Response("", { status: 500 })); const client = TestbedClient.create("http://example.test", failedFetch);
    await expect(client.info()).rejects.toThrow("500"); await expect(client.reset()).rejects.toThrow("500");
  });
  it("reset は POST を送信する", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 204 })); await TestbedClient.create("http://example.test", fetcher).reset(); expect(fetcher.mock.calls[0]?.[1]).toEqual({ method: "POST" });
  });
  it("既定の browser fetch を globalThis に束縛して呼び出す", async () => {
    const nativeLikeFetch = vi.fn(function (this: unknown): Promise<Response> {
      if (this !== globalThis) throw new TypeError("Illegal invocation");
      return Promise.resolve(new Response(JSON.stringify({ name: "RELink Testbed", version: "0.1.0", entityOrigin: "http://example.test" })));
    });
    vi.stubGlobal("fetch", nativeLikeFetch);
    try {
      await expect(TestbedClient.create("http://example.test").info()).resolves.toMatchObject({ name: "RELink Testbed" });
    } finally {
      // 後続テストへブラウザ API の差し替え状態を持ち越さないようにします。
      vi.unstubAllGlobals();
    }
  });
});
