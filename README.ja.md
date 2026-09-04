# RELink Web Runtime

**AR-XML Core 0.1 Draft 4 向け Web Browser Runtime PoC** です。

RELink（Real Entity Link）は、既存の Web Infrastructure を利用して、物理・現実世界の Entity を Addressable、Discoverable、Interactable、Operable にするための実験的 Architecture です。

このリポジトリでは、特に次の問いを検証します。

> AR-XML Core の Information Model を、通常の Web 技術だけを使った小さな Browser Runtime として実装できるか。

本 Runtime は実験段階です。実装から得られたフィードバックにより、API や AR-XML の仕様は変更される可能性があります。

[English README](README.md)

---

## このリポジトリの役割

このリポジトリは、AR-XML Core 0.1 Draft 4 の Baseline を Web Browser 上で実装・検証するための PoC です。

```text
AR-XML URL
    ↓
Fetch
    ↓
Parse / Validate
    ↓
AR-DOM
    ↓
Capability Discovery
    ↓
Contract / Requirement / Availability Evaluation
    ↓
HTTP Interface Invocation
    ↓
Decode Representation
    ↓
Map Result Outputs
    ↓
Expose Result
```

AR-XML は**主として UI Description Language ではありません**。Presentation とは独立して Semantic Capability を記述し、Runtime から呼び出せることを目的とします。

## 現在の AR-XML Model

```text
Entity
└─ Capabilities
   └─ Capability
      ├─ Local ID
      ├─ Semantic Capability Identifier
      ├─ Inputs
      ├─ Result
      │  ├─ Outputs
      │  ├─ Representations
      │  └─ Errors
      ├─ Requirements
      └─ Interfaces
```

Capability は **何ができるか** を表します。Interface は **その Capability をどの方法で呼び出すか** を表します。

Result は Invocation により生成される Semantic Data を表し、Representation はその Result を運ぶ具体的な Media Form を表します。

## AR-XML の例

```xml
<?xml version="1.0" encoding="UTF-8"?>

<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1">

  <category>environment.sensor</category>

  <capabilities>
    <capability
      id="temperature"
      type="https://example.org/capabilities/temperature/read/1">

      <result>
        <outputs>
          <output name="temperature" type="number" />
        </outputs>

        <representations>
          <representation media-type="application/json" />
        </representations>
      </result>

      <interfaces>
        <interface
          type="http"
          method="GET"
          endpoint="/api/temperature" />
      </interfaces>
    </capability>
  </capabilities>

</ar-entity>
```

この AR-XML が、

```text
https://example.org/entities/sensor.arxml
```

から取得された場合、`/api/temperature` は、

```text
https://example.org/api/temperature
```

へ解決されます。

相対 Interface Endpoint は、Host Application の現在ページではなく、**AR-XML Document 自身の URL** を Base として解決します。

## Runtime API

```ts
import { ARRuntime } from "./src";

const runtime = new ARRuntime();

const document =
  await runtime.load("http://localhost:3000/sample.arxml");

const capability =
  document.getCapability("temperature");

if (!capability) {
  throw new Error("Capability not found");
}

const result =
  await capability.invoke(
    {},
    {
      accept: "application/json"
    }
  );

console.log(result.values.temperature);
```

`ARRuntime` では XML Parser、Resource Fetcher、HTTP Invoker、Network Policy を差し替えられるようにし、Browser 固有処理を Adapter の背後へ分離しています。

### Document Loading と Resolver Core L1

`ARRuntime.load()` は、直接 AR-XML URL（L0）と Anchor / Resolver URL（L1）の両方を受け付けます。ブラウザの通常の Fetch リダイレクト処理に従い、終端の成功レスポンスについて要求 URL、最終レスポンス URL、終端 HTTP ステータス、表現本文を保持します。

`RuntimeDocument.url` は最終 AR-XML レスポンス URLです。そのため、Capability の相対 Interface Endpoint も最終 AR-XML URLを基準に解決されます。終端 non-2xx、HTTPS から HTTP へのダウングレード、設定したドキュメント取得ポリシーによる拒否は、XML Parseより前に失敗します。

既定のドキュメント取得ポリシーは、既存の直接ロード（L0）互換のため HTTP(S) を許可し、HTTPS 起点の HTTP 化を拒否します。Resolver Core L1としてHTTPSを必須にする場合は、HTTPSの入力を要求する`ResourceNetworkPolicy`を設定してください。Browser Adapterはredirect先を事前に観測できないため、ブラウザのFetch/CORS/mixed-content制約に従います。公開Resolver向けにambient credentialsを送信したくない場合は、`new BrowserResourceFetcher(fetcher, { credentials: "omit" })`または`ARRuntimeOptions.resourceCredentials`を使用できます。

Resolver / Manifest 固有の解析や Manifest 取得は行わず、ブラウザの CORS / Fetch 制約も迂回しません。

## 現在の Baseline Behavior

この PoC では Draft 4 の Web Runtime Baseline を中心に、次の機能を対象とします。

- HTTP(S) による AR-XML 取得
- XML Parse と Core Validation
- AR-DOM 相当の Runtime Model
- Profile Claim Discovery
- Semantic Capability Identifier
- Contract State `RESOLVED` / `UNRESOLVED`
- Projection State `VALIDATED` / `UNVALIDATED` / `CONFLICT`
- Availability `READY` / `UNAVAILABLE` / `UNKNOWN`
- HTTP `GET`
- `encoding="json"` の HTTP `POST`
- AR-XML Document URL 基準の相対 Endpoint 解決
- Primitive GET Input の Query Parameter Mapping
- POST Input の JSON Object Mapping
- HTTP `2xx` / `204 No Content`
- Result Representation Selection
- JSON / Text / Binary-Media Response Handling
- Single Output Mapping
- Multiple Outputs + JSON の Top-level Property Mapping
- `AbortSignal` による Cancellation
- Browser CORS Enforcement
- 差し替え可能な Runtime Network Policy
- Layered Runtime Error Model

## Web Runtime Test Harness

`test-harness/` は Runtime 固有の手動評価 UI です。外部の [RELink Testbed](https://github.com/ranmaru50/relink-testbed) は、Runtime 非依存の決定的なテスト環境として分離されています。

1. `relink-testbed` を別プロセスで起動し、Entity Origin を確認します。
2. このリポジトリで `pnpm harness` を実行します。
3. 表示された URL をブラウザで開き、Entity Origin を入力して接続します。
4. ケースを選択し、明示的に AR-XML を Load してから Capability を Invoke します。

Harness は Expected Data、Runtime Result/Error、Testbed が観測した Request を並べて表示します。`single-output-json`、`post-json`、`relative-endpoint-invocable`、`http-500`、`malformed-json`、`multi-output-json`、`http-204-no-output` を含む、公開済みの Baseline Case を扱えます。

## Architecture

Runtime は小さな **Ports-and-Adapters / Hexagonal Architecture** を採用しています。

```text
Browser / Infrastructure
        ↓
Web Adapters
        ↓
Application Services
        ↓
Domain / AR-XML Model
```

現在の責務は概ね次の構成です。

```text
src/
├─ domain/        # AR-XML model / error categories
├─ application/   # validation / endpoint resolution / invocation
├─ ports/         # Runtime abstraction interfaces
├─ adapters/web/  # DOMParser / fetch adapters
├─ runtime/       # ARRuntime / RuntimeDocument public API
└─ index.ts
```

内部の AR-XML Model は Browser DOM ではありません。Browser API は Infrastructure Adapter であり、Semantic Source of Truth ではありません。

## Result Mapping

Draft 4 は汎用 Mapping DSL ではなく、小さな Baseline Mapping を定義します。

### Single Output + JSON

```json
20.1
```

は、

```text
temperature = 20.1
```

へ Mapping されます。

### Multiple Outputs + JSON

```json
{
  "temperature": 20.1,
  "humidity": 44
}
```

Top-level JSON Property Name を Output Name に Mapping します。

JSONPath / XPath のような汎用 Mapping Language は現在の Baseline の範囲外です。

## Runtime State

```text
Contract Resolution:
RESOLVED / UNRESOLVED

Projection Validation:
VALIDATED / UNVALIDATED / CONFLICT

Capability Availability:
READY / UNAVAILABLE / UNKNOWN
```

`READY` は、Runtime が Invocation Attempt を妨げる既知のローカル理由を持っていないことだけを意味します。

Backend Authorization、Remote Service Health、Physical Safety、Business Rule Acceptance、Execution Success は保証しません。

Availability、Authorization、Execution は明確に別概念として扱います。

## Error Model

無関係な Failure を一つの汎用 Error にまとめず、Layer を分離します。

```text
ParseError
ValidationError
ContractResolutionError
ContractError
TransportError
InterfaceError
RepresentationError
CapabilityError
```

任意の HTTP non-2xx を、自動的に Semantic Capability Error として扱うことはしません。

## Security Model

AR-XML と Remote Capability Result は未信頼入力として扱います。

PoC では次の原則を採用します。

- AR-XML を JavaScript として実行しない
- AR-XML String を `innerHTML` へ直接渡さない
- Browser DOM と AR-XML Runtime State を分離する
- Network Access は Runtime が仲介する
- Browser の CORS / Fetch Security Behavior を尊重する
- Raw Credential を AR-XML に公開しない
- 無関係な Origin へ Credential を転送しない
- Side-effecting Capability を Availability Probe として実行しない
- Client-side Requirement Evaluation を Authorization とみなさない
- 最終 Authorization は Capability Provider / Backend 側を Authority とする

現在の Default Network Policy は保守的で、AR-XML と同一 Origin の Capability に制限する場合があります。これは Runtime Policy であり、AR-XML Core の Semantic Rule ではありません。

## ローカル開発

必要なもの:

- Node.js
- pnpm

Dependency を Install:

```bash
pnpm install
```

Local Sample Backend を起動:

```bash
pnpm server
```

別 Terminal で Vite Development Server を起動:

```bash
pnpm dev
```

Test / Check:

```bash
pnpm test
pnpm test:watch
pnpm typecheck
pnpm build
```

Sample Backend は AR-XML Document と最小 HTTP Capability Endpoint を提供します。

## Demo

Browser Demo は Runtime の Developer / Debugging Surface です。

AR-XML を Load し、発見した Capability と Runtime State を一覧し、安全な Sample Capability を Invoke できます。

Demo は **AR-XML Presentation 実装ではありません**。AR-XML の UI Semantic を定義するものとして扱わないでください。

## 現在の制限

次の機能は現在の Web Runtime PoC の対象外、または AR-XML Core 0.1 Draft 4 で未確定です。

- RELink Resolver
- Manifest
- Physical Anchor Handling
- NFC / BLE / UWB
- Cryptographic Trust Profiles
- Profile Definition Language
- Final Capability Contract Document Format
- Remote Contract Discovery Protocol
- General Request / Response Mapping DSL
- JSONPath / XPath Mapping
- Multipart Mapping
- Semantic HTTP Status → Capability Error Mapping
- Event Streaming
- Presentation
- Script
- Spatial / WebXR
- MCP Interface
- Serial / Native Device Interfaces
- Full OAuth Flow
- Certification

## AR-XML Core との関係

このリポジトリは **Implementation / Feedback Vehicle** であり、AR-XML の Normative Specification Repository ではありません。

現在の実装基準は、

```text
AR-XML Core 0.1 Draft 4
```

です。

Draft 4 の曖昧点が実装で判明した場合は、Runtime の暫定解釈を狭い範囲に隔離し、Test でその挙動を記録し、Specification Feedback として残し、実装上の都合を黙って Core Semantic にしない方針を取ります。

## 開発者向けドキュメント

プロジェクト全体の Architecture / Implementation Rule は [`AGENTS.md`](AGENTS.md) に置きます。

Task の順序や Milestone 単位の作業指示は [`WORK_INSTRUCTIONS.md`](WORK_INSTRUCTIONS.md) に置きます。

README はプロジェクトの目的、Runtime Model、利用方法の説明に限定します。

## Project Status

**Experimental / Proof of Concept**

Production や Safety-critical System での利用は想定していません。

AR-XML Core、RELink Architecture、Runtime API、Namespace Identifier は Stable Release 前に変更される可能性があります。

## License

**Apache License 2.0** で提供します。

詳細は [`LICENSE`](LICENSE) を参照してください。

## RELink

**RELink** は **Real Entity Link** を意味する暫定 Project Name です。

```text
Physical Entity
      ↓
Addressable
      ↓
Discoverable
      ↓
Interactable
      ↓
Operable
```

Web Runtime は、その Architecture の一つの実装です。
