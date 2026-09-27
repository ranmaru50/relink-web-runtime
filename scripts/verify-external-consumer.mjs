// scripts/verify-external-consumer.mjs
import { execFile } from "node:child_process";
import { cp, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { delimiter, join, resolve } from "node:path";
import { promisify } from "node:util";
import { assertPackageContents, assertPackageMetadata } from "./distribution-policy.mjs";

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
  const sourceManifest = JSON.parse(await readFile(join(repositoryRoot, "package.json"), "utf8"));
  const installedManifest = JSON.parse(await readFile(join(consumerRoot, "node_modules", "@relink", "web-runtime", "package.json"), "utf8"));
  assertPackageMetadata(installedManifest, sourceManifest);
  // Nodeの実行Pathに空白があっても動作するよう、Shellを介さず直接実行します。
  await execFileAsync(process.execPath, [join(consumerRoot, "verify.mjs")], { cwd: consumerRoot });
  await runCommand(join(binDirectory, `tsc${binSuffix}`), ["--noEmit"], consumerRoot);
  await runCommand(join(binDirectory, `vite${binSuffix}`), ["build"], consumerRoot);
  console.log("External consumer verification passed.");
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}

async function copyFixture() {
  await cp(join(fixtureRoot, "src"), join(consumerRoot, "src"), { recursive: true });
  for (const file of ["index.html", "package.json", "tsconfig.json", "verify.mjs"]) {
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
