# RELink Web Runtime

**RELink Web Runtime** は、RELink（Real Entity Link）と AR-XML のための実験的な Web Runtime です。

本リポジトリはプロダクション利用を目的とせず、通常の Web 技術だけで最小の RELink 操作ループを成立させるための Proof of Concept（PoC）です。

## コンセプト

RELink は、物理世界とデジタル空間が相互に観測・影響・反応できる状態を、拡張現実として広く捉える実験的なアーキテクチャです。この最初のPoCは、物理的な入口から通常のWeb技術を用いて、動的に配信されるデジタルインターフェースへ到達できることを検証します。

## 現在のPoC範囲

対応するのは AR-XML のHTTP(S)取得、XML解析、最小AR-DOM、テキスト・ボタン描画、クリックイベント、HTTP GET/POST、Action結果に伴う表示更新です。Chrome系ブラウザと、可能な範囲でモバイルブラウザを対象とします。

Resolver、Anchor UUID解決、Manifest、署名、信頼プロファイル、NFC/BLE/UWB/GPS、カスタムスタイル、外部JavaScript、Worker Sandbox、3D/WebXR、MCP、AI、ロボット、デバイス認証、高度な認可は、初期PoCの対象外です。

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

相対 `endpoint` は、AR-XML を取得した URL を基準に解決します。たとえば `https://warehouse.example/container.arxml` 内の `endpoint="/api/register"` は `https://warehouse.example/api/register` を指します。

## AR-DOM

AR-XMLはブラウザDOMを直接の内部表現として使用しません。Parserが独立したAR-DOMを生成し、RendererがブラウザDOMへ描画します。AR-DOMを状態の正とすることで、レンダラーの差し替えや将来のヘッドレス・ネイティブRuntimeへの拡張余地を保ちます。

```text
AR-XML → Parser → AR-DOM → Renderer → Browser DOM
```

## アーキテクチャ

```text
RELink Web Runtime
├─ Resource Loader
├─ AR-XML Parser
├─ AR-DOM
├─ Event Engine
├─ Action Executor
└─ HTML Renderer
```

プラットフォーム固有の入力はCoreの外側に置きます。将来のQR、NFC、BLE、センサー、ネイティブ端末の対応は、URLをRuntimeへ渡すアダプターとして実装する想定です。

## 設計原則

- **Web Native**: HTTP、DNS、TLS、既存Webサーバー、標準ブラウザAPIを利用します。
- **Permissionless**: 将来的には中央のRELink権限に依存せず、任意の開発者が自らのインフラで公開できることを目指します。
- **Decentralized**: 特定のRELinkクラウドサービスを必須にしません。
- **Implementation Independent**: 特定のブラウザ、ベンダー、クラウド、Runtimeだけに依存しません。
- **Minimal Core**: 将来必要になるかもしれない機能を、初期Coreへ早期導入しません。

## PoCの完了条件

通常のWebブラウザで、AR-XML URLの読込、ダウンロード、解析、AR-DOM生成、テキストとボタンの表示、ボタンクリック、HTTP POST、成功応答、AR-DOM更新、更新後テキストの表示までが連続して動作することを初期マイルストーンとします。

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

## リポジトリ構成

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
- Action endpoint は、AR-XML取得URLと同一オリジンの場合だけを許可します。
- HTTP の 2xx 応答だけを成功と扱います。

## 現時点の制限

この PoC は `text`、`button`、`click`、同一オリジンの HTTP GET/POST のみを対象にします。QR 読み取り、NFC、センサー、WebXR、3D 描画、認証、オフライン対応、外部スクリプト、RELink Resolver は実装していません。

## 拡張しやすい箇所

`src/core/loader.ts`、`src/actions/HTTPActionExecutor.ts`、`src/renderer/HTMLRenderer.ts` は責務を分離しています。将来の Resource Loader、Action 実行器、非 HTML Renderer は、AR-DOM を維持したまま差し替えられます。

## 将来のアーキテクチャ

長期的には、物理エンティティ、RELink Anchor、AR-XML、Runtimeを起点に、人間向けブラウザRuntimeだけでなく、AI/Agent、MCP、ロボット、ドローン等との連携を検討する余地があります。これらはすべて将来の概念であり、現在のWeb Runtime PoCの実装対象ではありません。

## RELinkの名称

RELink は暫定的なプロジェクト名であり、**Real Entity Link** を表します。名称、仕様、インターフェース、構成は安定版まで変更される可能性があります。

## ライセンス

ライセンスは現在検討中です。明示的なライセンスが追加されるまで、リポジトリ内容をオープンソースライセンスで利用できるものと見なさないでください。

## コントリビューション

プロジェクトは初期の実験段階です。貢献ガイドラインと仕様ガバナンスは、アーキテクチャの安定後に定義する予定です。

## 免責事項

RELink と AR-XML は実験的な概念であり、現在認定された標準ではありません。本リポジトリは技術的な実現可能性を検証するためのものです。

## ステータス

実験的な Proof of Concept です。AR-XML と RELink は認定標準ではなく、API と仕様は変更される可能性があります。本ソフトウェアをプロダクション用途または安全性が重要な用途に使用しないでください。
