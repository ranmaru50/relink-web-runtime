# RELink Web Runtime

**AR-XML Core 0.1 Draft 5** 向けの Experimental Web Browser Runtime です。

英語 README: [README.md](README.md)

## Scope

Runtime は宣言的な AR-XML を読み込み、記述された Capability を自動実行せずに公開します。

```text
Entity 解決 → Fetch → Parse → Core Validate → AR-DOM 公開
                                                    ↓
                                      Application による明示 Invocation
```

Draft 5 では Entity、Capability、Invocation、Interface、InterfaceUse、Contract、Profile、Availability、Authorization、Execution を別概念として扱います。Capability や Interface を持たない Passive / Physical Entity も有効です。

## Draft 5 の例

```xml
<ar-entity xmlns="https://relink.dev/ns/arxml/core/0.1"
           xmlns:http="https://relink.dev/ns/arxml/http/0.1"
           version="0.1">
  <interfaces>
    <interface id="web-api">
      <realization><http:api base="./api/" /></realization>
    </interface>
  </interfaces>
  <capabilities>
    <capability id="light" type="https://example.org/contracts/light/set/1">
      <invocation>
        <inputs><input name="on" type="boolean" /></inputs>
        <result>
          <outputs><output name="state" type="boolean" /></outputs>
          <representations><representation media-type="application/json" /></representations>
        </result>
      </invocation>
      <interface-uses>
        <interface-use ref="web-api">
          <mapping><http:operation method="POST" path="light/state" /></mapping>
        </interface-use>
      </interface-uses>
    </capability>
  </capabilities>
</ar-entity>
```

```ts
import { ARRuntime } from "@relink/web-runtime";

const document = await new ARRuntime().load("https://example.org/entities/light.arxml");
const light = document.getCapability("light");
const result = await light?.invoke({ on: true }, { accept: "application/json" });
```

`load()` は Capability を実行しません。`invoke()` が明示的な要求の境界で、Runtime 評価が `READY` の route を一意に選択する必要があります。READY route が複数ある場合は `RouteEvaluation.routeId` を渡し、曖昧な `interfaceRef` は拒否します。失敗した route の自動 retry は行いません。

## Runtime Model

Core Parser は root/version、閉じた Core Vocabulary、Cardinality、typed local ID、Reference、Core Data Type、exact-versioned Identifier、Extension Slot envelope を検証します。許可された Slot 内の未知 foreign Extension subtree は Core-valid のまま `OpaqueExtensionElement` として保存します。

Runtime Evaluation は Description Data と分離します。

```text
ContractResolution:    RESOLVED | UNRESOLVED
ProjectionValidation:  VALIDATED | UNVALIDATED | CONFLICT
RequirementEvaluation: SATISFIED | UNSATISFIED | UNKNOWN
Support:               SUPPORTED | UNSUPPORTED | UNKNOWN
Availability:          READY | UNAVAILABLE | UNKNOWN
```

`InMemorySemanticRegistry` と `SemanticRegistry` Port は、暗黙の Version 置換や first-wins 競合処理を行わず、exact Contract/Profile identity を解決します。

## HTTP Baseline

HTTP は Standard Interface Extension です。`http:api` は Interface の Realization に、`http:operation` は InterfaceUse の Mapping に置きます。Baseline は scalar GET Query Mapping と JSON Object の POST/PUT/PATCH Mapping をサポートします。JSON Result は宣言された Output 名をキーとする top-level object です。HTTP `2xx` は Interface success、non-`2xx` は Interface failure であり、Capability の Semantic Error へ推測変換しません。既定の HTTP adapter は redirect を拒否し、Invocation が未承認の origin へ暗黙に移動しないようにします。

## Development

```text
pnpm test
pnpm typecheck
pnpm build
pnpm verify:external
```

Public API は [docs/api.md](docs/api.md) と [docs/api.ja.md](docs/api.ja.md) に、Normative Draft 5 Reference は [docs/specs/arxml-core-0.1-draft5.md](docs/specs/arxml-core-0.1-draft5.md) にあります。
