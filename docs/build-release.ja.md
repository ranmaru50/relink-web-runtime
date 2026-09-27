# ビルドとリリースの方針

英語版: [Build and Release Policy](build-release.md)

## 開発とリリース履歴

`main` は Runtime 0.2.x / AR-XML Core 0.1 Draft 5 を基準とする現在の Runtime 開発ラインです。Draft ごとのブランチではありません。最新の `main` から短命な `feature/*`、`fix/*`、`docs/*` ブランチを作成し、`main` 向け PR で変更をレビューします。

公開済み Version は不変の tag と GitHub Release で保持します。Runtime 0.1.0 / Draft 4 は [v0.1.0](https://github.com/ranmaru50/relink-web-runtime/releases/tag/v0.1.0) から取得できます。公開済み tag の移動・再作成や asset の置換を行いません。0.2.0 公開後の修正は 0.2.1 などの新しい Version を使い、大きな API や意味の変更では後続の minor Version を検討します。

`ver.0.2.0` は昇格用の一時ブランチです。`main` 向け PR のマージと検証後に外部 workflow の依存を確認し、残っていなければ削除します。以後の作業は `main` から開始します。その時点で `ver.0.2.0` 用の一時的な CI trigger も削除できます。

現在の parser baseline は Draft 5 です。Draft 4 は `{ documentFormat: "draft4" }` を指定する明示的な移行互換機能としてのみ利用でき、Draft 5 conformance の対象外です。`load()` は Capability を実行しません。これらの契約は [Public API Reference](api.ja.md) を参照してください。

## 正本の Source と生成ファイル

| Path | 役割 | Git の方針 |
| --- | --- | --- |
| `src/**/*.ts` | 実装の正本 | 追跡する |
| `dist/relink-web-runtime.js` | 生成した standalone browser ESM 配布物 | 無視し、検証済み File を Release に添付する |
| `dist/types/**/*.d.ts` | 生成した TypeScript Declaration | 無視し、公開 Declaration を npm Package に含める |
| `dist/relink-web-runtime.js.sha256` | standalone ESM の生成 SHA-256 checksum | 無視し、ESM asset と一緒に添付する |
| `dist/*.tgz` と demo output | 生成した Package と demo 成果物 | 無視する |

`dist/` 全体を生成物とし、追跡しません。その JavaScript や Declaration を手動編集しません。`build:library` はコンパイル前に以前の ESM と Declaration を削除し、demo output は保持します。`prepack` も同じ Library build を実行するため、`npm pack` と `npm publish` は以前のローカル build に依存せず Source から成果物を作成します。`pnpm build` は demo と Library の両方をビルドします。

公開利用者は Package root の `@relink/web-runtime` を import します。`src/`、Adapter、内部生成 Path はサポートする consumer import ではありません。Package の exports map は standalone ESM と公開 Declaration entry point のみを指します。Declaration File は型を記述するもので、同梱によって Runtime の import Path が増えることはありません。

## ローカルと CI の検証

Node.js 22 と pnpm 10 を使い、コミット済みの依存 lockfile を使用します。

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm build
pnpm verify:external
pnpm verify:artifacts
```

CI はこれらすべてを必須とします。`verify:external` は `npm pack` を実行し、公開 File 集合と metadata の完全一致を検証したうえで、tarball を独立した一時 consumer に install します。そこで ESM import、非公開 subpath import の拒否、TypeScript Declaration、Vite production build を検証します。期待する内容は ESM、公開 Declaration、LICENSE、Package metadata、両言語 README、英日 API と Library/Build Guide、0.1.0 と 0.2.0 の両言語 release notes です。Source、demo File、非公開 Declaration を包装しません。

`verify:artifacts` は生成先を空にして Library を2回ビルドし、ESM と全 Declaration の SHA-256 digest と File 集合を比較します。差異があれば失敗し、成功時に `dist/relink-web-runtime.js.sha256` を作成します。同じ Node.js、OS、lock 済み build 依存のもとでの再現性を確認するもので、異なる toolchain 間の byte 一致を保証しません。生成物はコミットしないため、CI は Git 内のコピーとの比較ではなく、毎回 build して包装済み consumer の境界を検証します。

## リリース候補と包装

Runtime 0.2.0 は tag と Release の確定までリリース候補です。まず昇格 PR を `main` にマージし、Reference Lab / Testbed で検証して、必要な修正を `main` 向け PR で反映します。検証済み `main` commit を `v0.2.0` の候補とします。このリポジトリの consumer smoke test は downstream の検証を代替しません。

`Release artifacts` workflow は新しい `v*` tag で実行され、既存 tag を指定した手動実行もできます。`refs/tags/<tag>` を checkout し、lock 済み依存を install して、test/typecheck/build/consumer 検証を実行します。tag は `v<package.json version>` と一致する必要があります。2回のクリーンな Library build が一致することを確認してから `npm pack` を実行し、最終 standalone ESM が checksum と一致することも確認します。

Workflow は `relink-web-runtime-<tag>` という Actions artifact に次の File を保存します。

- `relink-web-runtime.js`
- `relink-web-runtime.js.sha256`
- 公開 Declaration と文書を含む npm Package tarball

その artifact をダウンロードし、検証済み File をそのまま同じ既存 tag の GitHub Release に添付します。Workflow のリポジトリ権限は読み取り専用で、Release の作成・公開や npm publish は行いません。Release 公開は検証後の別の maintainer 操作です。tag からローカル再生成する場合は、その tag を checkout して上記検証コマンドを実行し、続けて `npm pack --pack-destination dist` を実行します。Release 実行と同じ toolchain と lockfile を使い、ESM を公開 checksum と比較します。

## Downstream の固定

Standalone asset の名前は `relink-web-runtime.js` を維持します。Reference Lab などの consumer は Version を含む Release URL と SHA-256 digest の両方を固定します。

```text
https://github.com/ranmaru50/relink-web-runtime/releases/download/v<version>/relink-web-runtime.js
```

例えば既存の v0.1.0 URL は引き続き有効です。同じ Release の checksum asset を利用し、vendor copy を更新する前にダウンロードした byte を検証します。移動する branch URL や `latest` を Version 固定に使いません。アプリケーションでの使い方は [Web開発者向けライブラリ利用ガイド](library-guide.ja.md) を参照してください。
