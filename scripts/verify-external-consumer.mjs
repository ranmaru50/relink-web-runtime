// scripts/verify-external-consumer.mjs
import { execFile } from "node:child_process";
import { cp, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { delimiter, join, resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const repositoryRoot = resolve(import.meta.dirname, "..");
const fixtureRoot = join(repositoryRoot, "examples", "external-consumer");
const temporaryRoot = await mkdtemp(join(tmpdir(), "relink-web-runtime-consumer-"));
const consumerRoot = join(temporaryRoot, "consumer");

try {
  await copyFixture();
  const packOutput = await runNpm(["pack", "--pack-destination", temporaryRoot, "--json"], repositoryRoot);
  const packResult = parsePackResult(packOutput.stdout);
  const packageFile = join(temporaryRoot, packResult.filename);
  assertPackageContents(packResult.files);

  await runNpm(
    [
      "install",
      "--no-package-lock",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      packageFile,
      "typescript@^5",
      "vite@^6",
    ],
    consumerRoot,
  );

  const binDirectory = join(consumerRoot, "node_modules", ".bin");
  const binSuffix = process.platform === "win32" ? ".cmd" : "";
  await runCommand(join(binDirectory, `tsc${binSuffix}`), ["--noEmit"], consumerRoot);
  await runCommand(join(binDirectory, `vite${binSuffix}`), ["build"], consumerRoot);
  console.log("External consumer verification passed.");
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}

async function copyFixture() {
  await cp(join(fixtureRoot, "src"), join(consumerRoot, "src"), { recursive: true });
  for (const file of ["index.html", "package.json", "tsconfig.json"]) {
    await cp(join(fixtureRoot, file), join(consumerRoot, file));
  }
}

async function runNpm(arguments_, cwd) {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  return execFileAsync(npmCommand, arguments_, {
    cwd,
    env: { ...process.env, PATH: `${process.env.PATH ?? ""}${delimiter}${join(repositoryRoot, "node_modules", ".bin")}` },
    maxBuffer: 10 * 1024 * 1024,
    shell: process.platform === "win32",
  });
}

async function runCommand(command, arguments_, cwd) {
  return execFileAsync(command, arguments_, { cwd, maxBuffer: 10 * 1024 * 1024, shell: process.platform === "win32" });
}

function parsePackResult(output) {
  const jsonMarker = output.match(/(?:^|\r?\n)\[\r?\n\s*\{/);
  if (!jsonMarker || jsonMarker.index === undefined) throw new Error("npm packのJSON結果を読み取れませんでした");
  const jsonStart = jsonMarker.index + jsonMarker[0].lastIndexOf("[");
  const result = JSON.parse(output.slice(jsonStart));
  const packageResult = result[0];
  if (!packageResult?.filename || !Array.isArray(packageResult.files)) throw new Error("npm packの結果が不正です");
  return packageResult;
}

function assertPackageContents(files) {
  const paths = files.map((file) => file.path);
  if (paths.some((path) => path === "src" || path.startsWith("src/"))) throw new Error("配布Packageにsrc/が含まれています");
  if (paths.some((path) => path === "dist/index.html" || path.startsWith("dist/assets/"))) throw new Error("配布Packageにdemo成果物が含まれています");
  if (paths.some((path) => path.startsWith("dist/types/adapters/") || path.endsWith("/manifest.d.ts") || path.endsWith("/endpoint.d.ts") || path.endsWith("/validation.d.ts"))) throw new Error("配布Packageに未公開ModuleのDeclarationが含まれています");
  for (const required of ["dist/relink-web-runtime.js", "dist/types/index.d.ts", "package.json"]) {
    if (!paths.includes(required)) throw new Error(`配布Packageに必要なFileがありません: ${required}`);
  }
}
