// examples/external-consumer/verify.mjs
/** Workspaceから独立した包装済みPackageのESMとimport境界を検証します。 */
import assert from "node:assert/strict";
import * as runtime from "@relink/web-runtime";

assert.equal(typeof new runtime.ARRuntime().load, "function");
assert.equal(typeof runtime.InMemorySemanticRegistry, "function");
assert.equal(typeof runtime.evaluateProfileDocument, "function");
assert.equal(runtime.BrowserXMLParser, undefined);

// exportsでSourceや内部生成Fileへのsubpath importを拒否する契約です。
for (const subpath of ["src/index.ts", "dist/relink-web-runtime.js", "dist/types/index.d.ts"]) {
  await assert.rejects(import(`@relink/web-runtime/${subpath}`), { code: "ERR_PACKAGE_PATH_NOT_EXPORTED" });
}
