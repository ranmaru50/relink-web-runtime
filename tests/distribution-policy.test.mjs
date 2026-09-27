// tests/distribution-policy.test.mjs
/** 配布境界、タグとVersionの対応、再ビルドの一致を検証するテストです。 */
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  assertPackageContents,
  assertPackageMetadata,
  assertReleaseTag,
  assertReproducibleBuild,
  formatStandaloneChecksum,
} from "../scripts/distribution-policy.mjs";

// npm packが含めるべき公開ファイルの契約を、Packageの設定とは独立に検証します。
const publicFiles = [
  "dist/relink-web-runtime.js", "dist/types/index.d.ts",
  "dist/types/application/evaluation.d.ts", "dist/types/application/invocation.d.ts",
  "dist/types/application/parsing.d.ts", "dist/types/domain/errors.d.ts",
  "dist/types/domain/model.d.ts", "dist/types/ports/extension.d.ts",
  "dist/types/ports/runtime.d.ts", "dist/types/ports/semantic.d.ts",
  "dist/types/runtime/ARRuntime.d.ts", "LICENSE", "package.json",
  "README.md", "README.ja.md", "docs/api.md", "docs/api.ja.md",
  "docs/library-guide.md", "docs/library-guide.ja.md",
  "docs/build-release.md", "docs/build-release.ja.md",
  "docs/releases/0.1.0.md", "docs/releases/0.1.0.ja.md",
  "docs/releases/0.2.0.md", "docs/releases/0.2.0.ja.md",
].map((path) => ({ path, size: 1 }));

const manifest = {
  name: "@relink/web-runtime", version: "0.2.0", type: "module",
  main: "./dist/relink-web-runtime.js", module: "./dist/relink-web-runtime.js",
  types: "./dist/types/index.d.ts",
  exports: { ".": {
    types: "./dist/types/index.d.ts", import: "./dist/relink-web-runtime.js",
    default: "./dist/relink-web-runtime.js",
  } },
};

test("公開ESM、Declaration、両言語の文書とリリース履歴を包装する", () => {
  assert.doesNotThrow(() => assertPackageContents(publicFiles));
  for (const required of publicFiles) {
    assert.throws(() => assertPackageContents(publicFiles.filter((file) => file !== required)));
  }
  assert.throws(() => assertPackageContents(publicFiles.map((file) => ({ ...file, size: 0 }))));
});

test("実装Source、非公開Declaration、Demo、その他の混入を拒否する", () => {
  for (const path of ["src/index.ts", "dist/types/adapters/web/BrowserXMLParser.d.ts", "dist/assets/demo.js", "scripts/private.mjs"]) {
    assert.throws(() => assertPackageContents([...publicFiles, { path, size: 1 }]));
  }
});

test("ESMと型をPackage rootだけから公開し、SourceとVersionを一致させる", () => {
  assert.doesNotThrow(() => assertPackageMetadata(manifest, manifest));
  assert.throws(() => assertPackageMetadata({ ...manifest, version: "0.1.0" }, manifest));
  assert.throws(() => assertPackageMetadata({ ...manifest, types: "./src/index.ts" }, manifest));
  assert.throws(() => assertPackageMetadata({ ...manifest, exports: { ...manifest.exports, "./src/*": "./src/*" } }, manifest));
});

test("Release tagはPackage Versionと一致するv形式だけを受理する", () => {
  assert.doesNotThrow(() => assertReleaseTag("v0.2.0", "0.2.0"));
  for (const tag of ["main", "ver.0.2.0", "v0.1.0", "v0.2.0-extra"]) {
    assert.throws(() => assertReleaseTag(tag, "0.2.0"));
  }
});

test("再ビルドでESM・Declarationの内容やファイル集合が変わったら失敗する", () => {
  const original = new Map([["relink-web-runtime.js", "esm"], ["types/index.d.ts", "types"]]);
  assert.doesNotThrow(() => assertReproducibleBuild(original, new Map([...original].reverse())));
  assert.throws(() => assertReproducibleBuild(original, new Map([["relink-web-runtime.js", "changed"], ["types/index.d.ts", "types"]])));
  assert.throws(() => assertReproducibleBuild(original, new Map([["relink-web-runtime.js", "esm"], ["types/index.d.ts", "changed"]])));
  assert.throws(() => assertReproducibleBuild(original, new Map([["relink-web-runtime.js", "esm"]])));
  assert.throws(() => assertReproducibleBuild(original, new Map([...original, ["types/stale.d.ts", "stale"]])));
});

test("ChecksumのFile名にGNU sha256sumが改行文字を含めない形式で出力する", () => {
  const digest = "0123456789abcdef".repeat(4);
  // sha256sumの行終端処理はLFを除きますが、CRはFile名に残ります。
  const [actualDigest, filename] = formatStandaloneChecksum(digest).replace(/\n$/, "").split("  ");
  assert.equal(actualDigest, digest);
  assert.equal(filename, "relink-web-runtime.js");
});
