// tests/distribution.test.ts
import { describe, expect, it } from "vitest";
import * as publicApi from "../src/index";

describe("public Runtime entry point", () => {
  it("公開対象のRuntime facadeとErrorだけをexportする", () => {
    expect(publicApi.ARRuntime).toBeDefined();
    expect(publicApi.RuntimeDocument).toBeDefined();
    expect(publicApi.RuntimeCapability).toBeDefined();
    expect(publicApi.DefaultResourceNetworkPolicy).toBeDefined();
    expect(publicApi.ValidationError).toBeDefined();
    expect(publicApi.ManifestValidationError).toBeDefined();
    expect(publicApi).not.toHaveProperty("resolveEndpoint");
    expect(publicApi).not.toHaveProperty("parseManifest");
    expect(publicApi).not.toHaveProperty("BrowserResourceFetcher");
    expect(publicApi).not.toHaveProperty("BrowserXMLParser");
  });
});
