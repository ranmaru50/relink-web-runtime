# RELink Web Runtime Public API Reference

これは Draft 5 Runtime 移行版の正式な Public API Reference です。Experimental API のため、`1.0.0`未満では Release 間の後方互換性を保証しません。

英語版: [Public API Reference](api.md)

```ts
import { ARRuntime } from "@relink/web-runtime";
```

## Runtime / Specification Baseline

| Runtime | AR-XML Core | Resolver Core | Manifest |
| --- | --- | --- | --- |
| Draft 5 migration | 0.1 Draft 5 | 0.1 | 0.1 |

## Loading と明示 Invocation

`ARRuntime.load()` は Entity 解決、リソース取得、XML Parsing、Core Validation、AR-DOM の公開を行います。Capability を自動実行することはありません。

```ts
const runtime = new ARRuntime();
const document = await runtime.load("https://example.test/entity.arxml");
const capability = document.getCapability("light");
const result = await capability?.invoke({ on: true }, { accept: "application/json" });
```

`RuntimeCapability.invoke()` が Application/Human による明示的な要求の境界です。Input を検証し、一意な READY Route（複数ある場合は `routeId`、または一意な `interfaceRef` を明示）を選択し、対応する Extension Mapping を1回だけ実行して semantic Output を返します。Transport、Interface、Representation、Capability error の後に別 Route を自動 retry しません。

既定の `ARRuntime` document format は Draft 5 です。Draft 4 compatibility は明示的な migration mode として `{ documentFormat: "draft4" }` を指定します。既定の Draft 5 validator は Draft 4 Capability child を拒否します。

## RuntimeDocument

```ts
readonly url: string
readonly category: string | undefined
readonly identifiers: readonly Identifier[]
readonly properties: readonly Property[]
readonly propertyExtensions: readonly OpaqueExtensionElement[]
readonly subjects: readonly Subject[]
readonly profileClaims: readonly ProfileClaim[]
readonly interfaces: readonly InterfaceDefinition[]
readonly capabilities: readonly Capability[]
getCapability(localId: string): RuntimeCapability | undefined
evaluateCapability(localId: string): CapabilityEvaluation | undefined
evaluateProfile(identifier: string): ProfileEvaluation
```

`url` は最終的な AR-XML 取得 URL です。相対 HTTP `http:api` / `http:operation` URI の解決基準になります。

READY な `InterfaceUse` route が複数ある場合、呼び出し側は `routeId` を指定する必要があります。Route handle は `RouteEvaluation.routeId` で公開され、同じ `interfaceRef` を共有する route を document order で暗黙選択しません。

## Draft 5 Description Model

- `Capability` は issuer-authored な `Invocation` と `InterfaceUse` の記述データを持ちます。変更可能な Runtime 状態は持ちません。
- `InterfaceDefinition` は Entity 共有の Interface で、foreign `Attachment` または `Realization` Extension と Interface Requirements を持てます。
- `InterfaceUse` は Interface を参照し、任意で1つの Mapping Extension を持ちます。同じ Interface への複数参照が可能で、順序は Preference を示しません。
- `OpaqueExtensionElement` は許可された Extension Slot 内の未知 foreign subtree を保存します。
- `Result` は1件以上の名前付き Output と任意の Representation を持ちます。Draft 4 の `errors` child は Draft 5 Core にありません。

Runtime から導出された状態は `CapabilityEvaluation` で公開します。

```ts
interface CapabilityEvaluation {
  contractResolution: "RESOLVED" | "UNRESOLVED";
  projectionValidation: "VALIDATED" | "UNVALIDATED" | "CONFLICT";
  availability?: "READY" | "UNAVAILABLE" | "UNKNOWN";
  routes: readonly RouteEvaluation[];
}
```

Invocation がない Capability には Availability 値がありません。Load、Inspection、Contract Resolution、Availability Evaluation は Capability の副作用を発生させません。

## Semantic Registry

Contract と Profile は exact identity で解決します。`latest` の置換や first-wins の競合処理は行いません。

```ts
new ARRuntime({
  semanticRegistry: new InMemorySemanticRegistry([contract], [profile]),
});
```

既定の `EmptySemanticRegistry` は Contract/Profile を `UNRESOLVED` とします。Registry の解決は定義の認証や Authorization を意味しません。

`RuntimeDocument.evaluateProfile()` は、Capability、Property、Identifier、Interface 要件を含むロード済み文書全体を評価します。必須の Invocation/Output 制約について証拠が不足する場合は、誤って適合とせず `UNDETERMINED` を返します。

## HTTP Standard Interface Extension

Draft 5 の HTTP 動作は Core Interface の構文ではありません。次の2つを認識します。

```xml
<interface id="web">
  <realization>
    <http:api base="./api/" />
  </realization>
</interface>
<interface-use ref="web">
  <mapping>
    <http:operation method="POST" path="light/state" />
  </mapping>
</interface-use>
```

Baseline は GET の scalar query mapping と、POST/PUT/PATCH の JSON object mapping をサポートします。JSON Result を宣言した場合は `application/json` が必須で、Response は全 Output を含む top-level JSON object でなければなりません。`2xx` は HTTP success、non-`2xx` は Interface failure です。HTTP status を Capability の semantic error へ推測変換しません。既定の Browser HTTP adapter は `redirect: "error"` を使用し、未承認の redirect origin へ Invocation が暗黙に移動しないようにします。

## Ports と Errors

`XMLParser`、`ResourceFetcher`、`HTTPInvoker`、`NetworkPolicy`、`ResourceNetworkPolicy` は Browser Adapter と Test のために差し替え可能です。`SemanticRegistry` は exact-identity definition の境界です。

すべての Error は `ARRuntimeError` を継承します。`ParseError`、`ValidationError`、`TransportError`、`InterfaceError`、`RepresentationError`、`ContractResolutionError`、`ContractError` は別カテゴリです。許可された Slot 内の未知 Extension は Core-valid のまま保持されますが、Runtime support を推測しません。
