# Build and Release Policy

日本語版: [ビルドとリリースの方針](build-release.ja.md)

## Development and release history

`main` is the current Runtime development line, starting with the Runtime 0.2.x / AR-XML Core 0.1 Draft 5 baseline. It is not a Draft-specific branch. Create short-lived `feature/*`, `fix/*`, or `docs/*` branches from the latest `main` and review changes through PRs to `main`.

Published versions are immutable tags and GitHub Releases. Runtime 0.1.0 / Draft 4 remains available through [v0.1.0](https://github.com/ranmaru50/relink-web-runtime/releases/tag/v0.1.0). Never move or recreate a published tag or replace its assets. After publishing 0.2.0, subsequent fixes use a new version such as 0.2.1; larger API or semantic changes may require a later minor version.

`ver.0.2.0` is a temporary promotion branch. After its PR to `main` is merged and verified, check for external workflow dependencies and delete it if none remain. Future work starts from `main`. The temporary CI trigger for `ver.0.2.0` can be removed at that point.

Draft 5 is the current parser baseline. Draft 4 is available only through `{ documentFormat: "draft4" }` for explicit migration compatibility, outside Draft 5 conformance. `load()` never invokes a Capability. See the [Public API Reference](api.md) for these contracts.

## Authoritative source and generated files

| Path | Role | Git policy |
| --- | --- | --- |
| `src/**/*.ts` | Authoritative implementation source | Tracked |
| `dist/relink-web-runtime.js` | Generated standalone browser ESM distribution | Ignored; attach the verified file to a Release |
| `dist/types/**/*.d.ts` | Generated TypeScript declarations | Ignored; include public declarations in the npm package |
| `dist/relink-web-runtime.js.sha256` | Generated standalone ESM SHA-256 checksum | Ignored; attach alongside the ESM asset |
| `dist/*.tgz` and demo output | Generated package and demo artifacts | Ignored |

All of `dist/` is generated and untracked. Do not manually edit JavaScript or declarations there. `build:library` removes its previous ESM and declaration output before compiling; it preserves demo output. `prepack` runs that same library build, so `npm pack` and `npm publish` produce artifacts from source rather than trusting a previous local build. `pnpm build` builds both the demo and library.

Public consumers import `@relink/web-runtime` from the package root. `src/`, adapters, and internal generated paths are not supported consumer imports. The package exports map points only to the standalone ESM and public declaration entry point. Declaration files describe types; their inclusion does not create extra runtime import paths.

## Local and CI verification

Use Node.js 22 and pnpm 10, with the committed dependency lockfile:

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm build
pnpm verify:external
pnpm verify:artifacts
```

CI requires all these checks. `verify:external` runs `npm pack`, checks the exact public file set and metadata, installs the tarball into an independent temporary consumer, and verifies ESM imports, rejection of private subpath imports, TypeScript declarations, and a Vite production build. Expected contents include the ESM, public declarations, LICENSE, package metadata, both READMEs, English/Japanese API and library/build guides, and both 0.1.0 and 0.2.0 release notes. Source, demo files, and private declarations must not be packaged.

`verify:artifacts` builds the library twice from clean output directories and compares SHA-256 digests and file sets for the ESM and all declarations. It fails on any difference and writes `dist/relink-web-runtime.js.sha256`. This checks repeatability under the same Node.js, OS, and locked build dependencies; it does not promise identical bytes across different toolchains. Because generated output is not committed, CI always builds it and checks the packaged consumer boundary instead of comparing against a Git copy.

## Release candidate and packaging

Runtime 0.2.0 is a release candidate until its tag and Release are finalized. First merge the promotion PR into `main`, run Reference Lab / Testbed verification, and apply any required fixes through PRs to `main`. Use the verified `main` commit as the candidate for `v0.2.0`. This repository's consumer smoke test does not replace that downstream verification.

The `Release artifacts` workflow runs on new `v*` tags or can be dispatched with an existing tag. It checks out `refs/tags/<tag>`, installs locked dependencies, runs tests/typecheck/build/consumer verification, and requires the tag to equal `v<package.json version>`. Two clean library builds must agree. It then runs `npm pack` and checks that the final standalone ESM still matches its checksum.

The workflow uploads an Actions artifact named `relink-web-runtime-<tag>` containing:

- `relink-web-runtime.js`;
- `relink-web-runtime.js.sha256`;
- the npm package tarball containing public declarations and documentation.

Download that artifact and attach the exact verified files to the GitHub Release for the same existing tag. The workflow has read-only repository permissions and does not create or publish a Release or publish to npm. Release publication is a separate maintainer action after verification. For local reproduction from a tag, check out that tag, run the verification commands above, then run `npm pack --pack-destination dist`; use the same toolchain and lockfile as the release run, and compare the ESM against the published checksum.

## Downstream pinning

The standalone asset keeps the name `relink-web-runtime.js`. Consumers such as Reference Lab pin both the versioned release URL and its SHA-256 digest:

```text
https://github.com/ranmaru50/relink-web-runtime/releases/download/v<version>/relink-web-runtime.js
```

For example, the existing v0.1.0 URL remains valid. Use the checksum asset from the same release and verify the downloaded bytes before updating a vendor copy. Do not use a moving branch URL or `latest` as a version pin. See the [Web Developer Library Guide](library-guide.md) for application usage.
