// scripts/distribution-policy.mjs
/** 包装した配布物、Release tag、再ビルド結果の境界を検証します。 */
import assert from "node:assert/strict";

// 配布を許可する公開成果物です。SourceやAdapterの型を公開経路にしません。
const publicPackageFiles = [
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
];

/** @param {readonly { path: string, size: number }[]} files npm packのファイル一覧。 */
export function assertPackageContents(files) {
  assert.deepEqual(files.map((file) => file.path).sort(), [...publicPackageFiles].sort(), "配布Packageのファイル集合が公開契約と一致しません");
  for (const file of files) {
    assert.ok(file.size > 0, `配布Packageに空のFileがあります: ${file.path}`);
  }
}

/**
 * @param {{ name: string, version: string, type: string, main: string, module: string, types: string, exports: unknown }} manifest 包装後のPackage metadata。
 * @param {{ name: string, version: string }} source SourceのPackage識別情報。
 */
export function assertPackageMetadata(manifest, source) {
  assert.equal(manifest.name, source.name, "配布Package名がSourceと一致しません");
  assert.equal(manifest.version, source.version, "配布VersionがSourceと一致しません");
  assert.equal(manifest.type, "module");
  assert.equal(manifest.main, "./dist/relink-web-runtime.js");
  assert.equal(manifest.module, "./dist/relink-web-runtime.js");
  assert.equal(manifest.types, "./dist/types/index.d.ts");
  assert.deepEqual(manifest.exports, {
    ".": {
      types: "./dist/types/index.d.ts",
      import: "./dist/relink-web-runtime.js",
      default: "./dist/relink-web-runtime.js",
    },
  }, "公開importは生成済みESMとDeclarationを指すPackage rootだけです");
}

/** @param {string} tag Release tag。 @param {string} version SourceのPackage Version。 */
export function assertReleaseTag(tag, version) {
  assert.equal(tag, `v${version}`, "Release tagとPackage Versionが一致しません");
}

/** @param {Map<string, string>} first 初回のFile別digest。 @param {Map<string, string>} second 再ビルド後のdigest。 */
export function assertReproducibleBuild(first, second) {
  assert.deepEqual(second, first, "再ビルドでESMまたはDeclarationが変わりました");
}

/** @param {string} digest standalone ESMのSHA-256。 @returns {string} sha256sumで読み取る単一行。 */
export function formatStandaloneChecksum(digest) {
  // GNU sha256sumがCRをFile名に含めないよう、改行なしの単一行にします。
  return `${digest}  relink-web-runtime.js`;
}
