# RELink Web Runtime

**RELink Web Runtime** は、RELink（Real Entity Link）と AR-XML のための実験的な Web Runtime です。

本リポジトリはプロダクション利用を目的とせず、通常の Web 技術だけで最小の RELink 操作ループを成立させるための Proof of Concept（PoC）です。

## 実装済みの操作ループ

```text
AR-XML URL
  ↓
HTTP fetch
  ↓
AR-XML parse
  ↓
AR-DOM 生成
  ↓
Text / Button 表示
  ↓
Button click
  ↓
HTTP GET / POST
  ↓
AR-DOM 更新
  ↓
画面表示更新
```

AR-DOM はブラウザ DOM とは独立した内部モデルです。状態変更は必ず AR-DOM に反映してから Renderer を通じて画面へ反映します。

## 対応する AR-XML

以下の要素だけをサポートします。

```text
ar-content
outputs
text
button
actions
action
events
event
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ar-content version="0.1">
  <outputs>
    <text id="message">コンテナを認識しました</text>
    <button id="register">入庫する</button>
  </outputs>
  <actions>
    <action id="register-action" type="http" method="POST" endpoint="/api/register" />
  </actions>
  <events>
    <event
      on="click"
      target="register"
      action="register-action"
      success-target="message"
      success-text="入庫しました"
      error-target="message"
      error-text="入庫に失敗しました" />
  </events>
</ar-content>
```

`text` と `button` は `id` 属性が必須です。`action` には `id`、`type`、`method`、`endpoint`、`event` には `on`、`target`、`action` が必要です。不明な要素は無視します。

## ローカルデモの起動

Node.js と pnpm を用意してから、依存関係をインストールします。

```powershell
pnpm install
```

最初のターミナルでデモ用 Backend を起動します。

```powershell
pnpm server
```

別のターミナルで Web 開発サーバーを起動します。

```powershell
pnpm dev
```

表示された URL をブラウザで開き、入力欄の初期値 `/sample.arxml` のまま **Load** を押してください。「入庫する」を押すと `POST /api/register` が実行され、表示が「入庫しました」に変わります。

Vite の開発サーバーは `/sample.arxml` と `/api` をローカル Backend（ポート 3000）へプロキシします。

## テストとビルド

```powershell
pnpm test
pnpm build
```

テストでは、テキスト・ボタンの解析、ID 解決、イベントと Action の結合、HTTP 成功・失敗時の状態更新、不正 XML、必須属性、不明要素、安全なテキスト描画を確認します。

## 構成

```text
src/
  actions/      HTTP Action の実行
  core/         Loader、Parser、Runtime
  dom/          ブラウザ DOM と独立した AR-DOM
  errors/       エラー型
  renderer/     AR-DOM から HTML への安全な描画
demo/           URL 入力を含むデモ画面
server/         ローカルデモ用 Backend とサンプル AR-XML
tests/          ユニットテスト
```

## 安全性に関する方針

- AR-XML は未信頼入力として扱います。
- テキストは `textContent` で描画し、`innerHTML` は使用しません。
- `eval`、`new Function`、AR-XML 内 JavaScript の実行は行いません。
- HTTP Action は `GET` と `POST` に限定します。
- Action endpoint は同一オリジンだけを許可します。
- HTTP の 2xx 応答だけを成功と扱います。

## 現時点の制限

この PoC は `text`、`button`、`click`、同一オリジンの HTTP GET/POST のみを対象にします。QR 読み取り、NFC、センサー、WebXR、3D 描画、認証、オフライン対応、外部スクリプト、RELink Resolver は実装していません。

## 拡張しやすい箇所

`src/core/loader.ts`、`src/actions/HTTPActionExecutor.ts`、`src/renderer/HTMLRenderer.ts` は責務を分離しています。将来の Resource Loader、Action 実行器、非 HTML Renderer は、AR-DOM を維持したまま差し替えられます。

## ステータス

実験的な Proof of Concept です。AR-XML と RELink は認定標準ではなく、API と仕様は変更される可能性があります。
