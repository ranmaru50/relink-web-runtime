# AGENTS.md

## 1. 目的

このリポジトリは、**AR-XML Core 0.1 Draft 4 向け Web Browser Runtime PoC** を実装します。

ブラウザにおいて、次の Draft 4 処理モデルを検証することが主目的です。

```text
Fetch → Parse → Validate → Resolve → Evaluate → Invoke → Decode → Map → Expose Result
```

本リポジトリは Draft 4 の実装およびフィードバック手段であり、AR-XML の規範仕様リポジトリではありません。仕様の曖昧さ、不整合、安全でない挙動、意味論の不足を発見した場合は、ランタイム固有の恒久仕様として黙って解決せず、仕様フィードバックとして記録してください。

---

## 2. 正とする仕様

この PoC の規範となる動作仕様は **AR-XML Core 0.1 Draft Specification — Draft 4** です。実装判断が Draft 4 と衝突する場合は、明示的な要件を優先し、曖昧な場合は狭い抽象化の背後に解釈を隔離してください。暫定解釈を表すテストを追加し、Draft 5 候補として記録します。実装上の都合を AR-XML 意味論にしてはいけません。

---

## 3. 対象範囲

### 対象

- AR-XML リソース取得、XML 解析、Core Namespace／構造検証、AR-DOM 抽象モデル構築
- Profile Claim の発見と Semantic Capability Identifier の処理
- Contract 状態（`RESOLVED`／`UNRESOLVED`）、Projection 状態（`VALIDATED`／`UNVALIDATED`／`CONFLICT`）
- Runtime Context と、実装済み要件に十分な Requirement 評価
- Availability（`READY`／`UNAVAILABLE`／`UNKNOWN`）
- HTTP 基本 Interface、AR-XML 文書 URL 基準の相対 Endpoint 解決
- GET の primitive Input の query serialization、POST `encoding="json"`
- HTTP 2xx／204、Representation 選択、レスポンス decode、Result から Output への map
- Single Output および複数 Output + `application/json` の map
- `AbortSignal` によるキャンセル、ブラウザ CORS と追加 Runtime Policy、明示的なエラー分類

### 明示的な追加指示なしでは対象外

- Resolver、Manifest、Trust Profile、Certification、Profile Definition Language、Capability Contract 定義形式
- 汎用 Mapping DSL、JSONPath／XPath、multipart、任意 request header mapping、HTTP status の semantic Capability Error mapping
- Event streaming、Presentation、Script、Spatial rendering、MCP、Serial／BLE／native device Interface、完全な OAuth、汎用 UI 生成

有用に見えても、対象外の機能を実装してはいけません。

---

## 4. アーキテクチャ様式

小さな Domain Core を持つ **レイヤード Hexagonal / Ports-and-Adapters** を使用します。DDD 用語は責務を明確にする場合だけ使い、儀式的な Enterprise DDD は避けます。

> AR-XML の意味論は Domain/Core に属します。Browser、Fetch、DOMParser、Storage、UI、Network の詳細は Adapter に属します。

依存方向は内側へ向けます。

```text
Browser / Infrastructure → Adapters → Application Services → Domain / AR-XML Core Model
```

Domain 層は `window`、`document`、`HTMLElement`、`DOMParser`、`fetch`、`localStorage`、Cookie API などのブラウザ API を import してはいけません。ブラウザ機能は Port/Adapter で提供します。

---

## 5. 推奨モジュール境界

```text
src/
├─ domain/       # AR-XML model、errors、validation、types
├─ application/  # load、contract resolve、evaluate、invoke、representation select
├─ ports/        # ResourceFetcher、XMLParser、ContractRegistry、RequirementProvider、CredentialProvider、HTTPInvoker
├─ adapters/web/ # BrowserResourceFetcher、BrowserXMLParser、FetchHTTPInvoker、RuntimeContext、SecurityPolicy
├─ runtime/      # ARRuntime、ARDocument、CapabilityHandle
└─ index.ts
```

これは固定のディレクトリ構成ではありません。ファイル名が変わっても責務境界を保ってください。

---

## 6. Domain Model 規則

次の概念を区別します。

```text
Entity / Capability Contract / Profile / Profile Claim / Entity Capability Implementation
Input / Result / Output / Representation / Requirement / Interface
Runtime Context / Availability / Authorization / Execution
```

これらを汎用的な `action` や `request` モデルへ統合してはいけません。

### Capability Identity

Capability は文書ローカル ID と Semantic Capability Identifier を持ちます。ローカル ID から意味的互換性を推論してはいけません。

### Capability Contract

Capability Contract は規範となる意味的ソースです。Entity 側の宣言は実装宣言／Local Projection です。Projection は参照 Contract を再定義・弱化してはいけません。Contract 状態と Projection validation 状態は文書の parse 妥当性と独立です。

### Result Model

```text
Result
├─ Outputs
├─ Representations
└─ Errors
```

Representation は Result 全体の具体的 Media 表現であり、個々の Output の意味的 identity ではありません。

---

## 7. Runtime 状態モデル

次の状態次元を分離してください。

```text
Contract Resolution:    RESOLVED / UNRESOLVED
Projection Validation:  VALIDATED / UNVALIDATED / CONFLICT
Availability:           READY / UNAVAILABLE / UNKNOWN
```

`READY` は、呼び出しを妨げる既知のローカル理由がないことだけを意味します。認可、リモートサービスの健全性、物理的安全性、実行成功を保証してはいけません。`idle`、`running`、`completed`、`failed` は実装上の Invocation 状態であって、AR-XML 文書の意味論ではありません。

---

## 8. HTTP 基本規則

### Endpoint 解決

相対 Endpoint は**取得した AR-XML リソースの URL**を基準に解決します。ホストアプリの現在ページ URL、`window.location`、Runtime bundle URL を基準にしてはいけません。

### GET と POST JSON

GET の primitive Input は標準 URL encoding で query parameter へ map します。対象型は `string`、`number`、`integer`、`boolean` です。`object`、`array`、`binary` の基本 GET mapping を創作してはいけません。

`method="POST"` かつ `encoding="json"` の場合、Input 名を JSON property 名にし、一つの JSON object として serialize します。

### HTTP 成功と Response mapping

- HTTP `2xx` は Interface-level success、`204 No Content` も有効な成功です。
- 必須 Result data を 204 から作れない場合は Result／Representation mapping error にします。
- Single Output + JSON は parse 済みトップレベル JSON 値を Output へ map します。
- 複数 Output + JSON はトップレベル property 名を Output 名へ map します。
- 未知の JSON property はより厳しい Contract がなければ無視できます。必須 Output property の欠如は mapping error です。
- Single Output + `text/*` は本文 text、Single Output + binary/media は本文全体を map します。
- 複数 Output + non-JSON の Core 0.1 基本 mapping を推測してはいけません。

---

## 9. Representation の扱い

Representation の選択を XML 文書順に依存させてはいけません。概念上は次の共通部分から選びます。

```text
Caller Preference ∩ Runtime Support ∩ Entity Representation Support
```

HTTP では標準の `Accept`／`Content-Type` を使用します。宣言された Media Type を安全性・信頼性の証明として扱ってはいけません。JSON は JSON として parse し、text は text として扱い、`text/html` を DOM へ直接注入せず、binary は安全な利用者がいない限り不透明に扱います。

---

## 10. セキュリティ規則

AR-XML とリモート出力はすべて未信頼入力です。

- AR-XML 文字列を `innerHTML` で描画しない
- AR-DOM／Runtime state と Browser DOM を分離する
- すべての network access を仲介する
- raw credential を AR-XML へ露出・無関係 origin へ転送しない
- ブラウザ CORS／Fetch の security behavior を尊重し、Runtime Policy はさらに厳格にしてよい
- Contract が許す範囲で Input を serialize 前に検証し、decode 後の Output を Core Data Type で検証する
- Availability 確認のために副作用 Capability を実行しない
- クライアント Requirement 評価を authorization とみなさない。最終 authorization は backend が行う
- 最小権限を適用する

初期 PoC は保守的な network policy を既定にすべきです。同一 Origin 限定を選ぶ場合も、AR-XML 意味論へ固定せず置換可能な Runtime policy にしてください。

---

## 11. エラーモデル

無関係な失敗を汎用 `Error` にまとめてはいけません。少なくとも以下を保持します。

```text
ParseError / ValidationError / ContractResolutionError / ContractError
TransportError / InterfaceError / RepresentationError / CapabilityError
```

- `ParseError`: 不正 XML
- `ValidationError`: 不正な AR-XML Core 構造
- `ContractResolutionError`: optional/required semantic Contract の取得不能
- `ContractError`: Projection conflict または Contract-level 非互換
- `TransportError`: fetch、network、CORS、abort、connectivity
- `InterfaceError`: HTTP-level 非成功または未対応 binding
- `RepresentationError`: Media Type、decode、mapping、Output type の失敗
- `CapabilityError`: Capability Contract が明示的に定義する semantic/domain error

明示的な semantic mapping 仕様がない限り、HTTP non-2xx を `CapabilityError` に map してはいけません。

---

## 12. テスト方針

規範的かつバグを生みやすい挙動には **TDD** を使用します。

```text
Red → minimal implementation → Green → Refactor
```

些細な機械的変更まで不自然な test-first を強制しませんが、規範的挙動はテストなしに完了と見なせません。テストは Domain unit、fake port を用いた Application service、Adapter integration、少数の browser/E2E の順で優先し、ほとんどのテストを実ブラウザ・実 HTTP server に依存させないでください。

最低限、次を網羅します。

- parse／validation: malformed XML、namespace、version、capability ID/type、重複 local ID／Output 名、不正 Interface、未対応の必須挙動
- URL: absolute、root-relative、path-relative、parent-relative、AR-XML URL 基準、host app URL を使わないこと
- request: GET primitive query、URL encoding、POST JSON、GET complex type の拒否
- response: single/multiple JSON、unknown/missing Output、text、binary、204（Output 有無）、Content-Type 不一致、malformed JSON、type mismatch
- state: unresolved Contract と `UNVALIDATED`、`CONFLICT`、`READY` が成功を保証しないこと
- security: HTML を Browser DOM へ暗黙注入しない、origin 越し credential leakage 防止、availability probe が副作用を起こさないこと
- cancellation: `AbortSignal` による in-flight request 中断と正しいエラー分類

修正したすべての不具合には regression test を追加します。

---

## 13. テスト Fixture

小さく意図が明確な AR-XML fixture を使用します。次のように valid、invalid、edge を分けます。

```text
fixtures/
├─ valid/  # single-output-json、multi-output-json、text-result、get-search、relative-endpoint
├─ invalid/# missing-type、duplicate-capability-id、invalid-namespace
└─ edge/   # unresolved-contract、projection-conflict、unsupported-representation
```

無関係な意味論を一つの巨大 fixture に混在させないでください。

---

## 14. 依存関係方針

依存関係を小さく保ち、Web Platform API と焦点の絞られたライブラリを優先します。プラットフォームに十分な primitive がある場合、framework や dependency を追加してはいけません。URL 処理には `URL`／`URLSearchParams`、Adapter 経由の fetch、`AbortController`／`AbortSignal`、標準 XML parser を使います。Domain 層への dependency 追加には Adapter-only の場合より強い根拠が必要です。

---

## 15. コーディング規則

- strict type checking を有効にした TypeScript を使う
- 実用的な範囲で immutable domain value を優先する
- `any` を避け、信頼境界では `unknown` と検証／narrowing を用いる
- parser や network data の検証を type assertion で回避しない
- 意味上の責務が明確な小さな関数、明示的な discriminated union、分離された pure transformation と I/O を優先する
- global mutable state、意図的設計なしの singleton Runtime、Domain interface への browser type 漏出を避ける
- 公開 API 名は Draft 4 の AR-XML 用語に合わせる

---

## 16. Public API 方針

Public API は小さく保ちます。

```ts
const document = await runtime.load(url);
const capability = document.getCapability("environment");
const result = await capability.invoke({}, { accept: "application/json", signal });
```

これは例示であり規範要件ではありません。呼び出し側が必要に応じて Semantic Capability Identifier、Contract resolution state、Projection state、Availability、Interface、Representation を検査できるようにします。Browser DOM node を AR-DOM API として公開してはいけません。

---

## 17. DDD 指針

DDD は選択的に使います。`SemanticCapabilityIdentifier`、`CapabilityLocalId`、`MediaType`、`Availability`、各 state、`ARDocumentUrl`、`ResolvedEndpoint` は有用な domain concept/value object 候補です。一方、すべての class の repository、具体的需要のない domain event、単純 constructor の factory、用語のためだけの複雑な aggregate boundary を導入してはいけません。パターン中心ではなく domain 中心にしてください。

---

## 18. 仕様フィードバック規律

Draft 4 で回答できない実装上の問いに直面した場合は、恒久意味論を創作せず、PoC に必要な最小の暫定規則を function、policy、strategy、adapter の背後へ隔離し、テストで記録します。さらに専用の仕様フィードバック文書または issue tracker に記録します。

```text
Title: Draft 4 ambiguity: <topic>
Relevant section: <section number / concept>
Implementation question: <precise ambiguity>
PoC interpretation: <temporary behavior>
Why this may belong in Draft 5: <interoperability impact>
```

Runtime 固有 extension を Core semantics のように見せてはいけません。

---

## 19. 完了の定義

変更は、該当する場合に次を満たして完了です。

- Draft 4 と整合し、アーキテクチャ境界を保つ
- 規範的挙動と regression bug が自動テストで守られている
- エラーが適切な層で分類され、Domain/Core に browser dependency が漏れない
- security rule を回避しない
- Public API の変更と暫定仕様解釈が文書化されている
- lint、typecheck、test suite が通過する

---

## 20. Agent のリポジトリ運用

このリポジトリを変更する Agent は、実装前に root `AGENTS.md` を読み、より具体的な nested `AGENTS.md` を追加制約として扱います。無関係な変更で仕様意味論を変えず、広い refactor を避け、変更・コミットを概念的に集中させ、明示指示なしに後方互換を壊さず、発見した Draft 4 の曖昧さを記載し、投機的な構造より狭く可逆的な実装を優先してください。

このファイルには task 固有の実装 plan を書きません。**作業指示、milestone、機能順序、task 固有 acceptance criteria は別の task 文書に置きます。**

---

## 21. アーキテクチャ判断の要約

```text
Language: TypeScript
Architecture: Layered Hexagonal / Ports-and-Adapters
Domain approach: DDD-lite / domain-centered modeling
Development method: normative behavior と regression のための TDD
Core principles: Dependency inversion / Browser isolation / Pure domain transformations
                 Explicit state machines / Explicit layered error model / Specification-first behavior
Primary goal: Web Browser Runtime における AR-XML Core 0.1 Draft 4 の検証
```

アーキテクチャ自体が PoC の主題になるのではなく、AR-XML の意味論を明らかにできる程度に小さく保ちます。

---

## ライセンス

このプロジェクトは [Apache License 2.0](LICENSE) の下で提供されます。
