// scripts/clean-library.mjs
/** Library生成先だけを削除し、過去のDeclarationが包装へ混入するのを防ぎます。 */
import { rm } from "node:fs/promises";
import { join, resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");
// 両方ともWorkspace内の固定された生成先です。Demoの成果物は残します。
const libraryPaths = [join(repositoryRoot, "dist", "types"), join(repositoryRoot, "dist", "relink-web-runtime.js")];
for (const path of libraryPaths) await rm(path, { recursive: true, force: true });
