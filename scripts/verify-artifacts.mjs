// scripts/verify-artifacts.mjs
/** SourceからLibraryを2回クリーン生成し、再現性とESMのSHA-256を検証します。 */
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import { assertReleaseTag, assertReproducibleBuild, formatStandaloneChecksum } from "./distribution-policy.mjs";

const execFileAsync = promisify(execFile);
const repositoryRoot = resolve(import.meta.dirname, "..");
const distributionRoot = join(repositoryRoot, "dist");
const manifest = JSON.parse(await readFile(join(repositoryRoot, "package.json"), "utf8"));

// Release workflowではtagを指定し、異なるVersionからの成果物作成を拒否します。
if (process.argv[2] !== undefined) assertReleaseTag(process.argv[2], manifest.version);

const first = await buildSnapshot();
const second = await buildSnapshot();
assertReproducibleBuild(first, second);
const digest = second.get("relink-web-runtime.js");
if (!digest || !second.has("types/index.d.ts")) throw new Error("LibraryのESMまたはDeclarationがありません");
await writeFile(join(distributionRoot, "relink-web-runtime.js.sha256"), formatStandaloneChecksum(digest), "utf8");
console.log(`Reproducible library verification passed. SHA-256: ${digest}`);

/** @returns {Promise<Map<string, string>>} クリーン生成したLibraryのFile別SHA-256。 */
async function buildSnapshot() {
  // build:libraryが毎回生成先を消すため、残存Fileにも依存しません。
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = await execFileAsync(npmCommand, ["run", "build:library"], {
    cwd: repositoryRoot,
    maxBuffer: 10 * 1024 * 1024,
    shell: process.platform === "win32",
  });
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  const snapshot = new Map();
  await recordDigest("relink-web-runtime.js", snapshot);
  await recordDeclarations("types", snapshot);
  return snapshot;
}

/** @param {string} directory 相対Declaration directory。 @param {Map<string, string>} snapshot File別digest。 */
async function recordDeclarations(directory, snapshot) {
  for (const entry of await readdir(join(distributionRoot, directory), { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) await recordDeclarations(path, snapshot);
    else await recordDigest(path, snapshot);
  }
}

/** @param {string} path 生成先からの相対File名。 @param {Map<string, string>} snapshot File別digest。 */
async function recordDigest(path, snapshot) {
  const content = await readFile(join(distributionRoot, path));
  if (content.length === 0) throw new Error(`生成Fileが空です: ${path}`);
  snapshot.set(path, createHash("sha256").update(content).digest("hex"));
}
