# Web開発者向けライブラリ利用ガイド

このガイドは、ブラウザアプリケーションまたはバンドラーからコンパイル済みの `@relink/web-runtime` パッケージを利用するWeb開発者を対象にしています。インストールからAR-XMLの読み込み、Capabilityの明示的な実行までを、最短の手順で説明します。

English version: [Web Developer Library Guide](library-guide.md)

## このライブラリでできること

RuntimeはAR-XMLの記述を読み込み、`RuntimeDocument` として公開します。読み込みは受動的な処理です。記述の解析・検証は行いますが、Capabilityは実行しません。ネットワーク副作用が発生するのは、アプリケーションが `RuntimeCapability.invoke()` を明示的に呼び出したときだけです。

必要なものは次のとおりです。

- Vite、Webpack、Rollupなどを使うブラウザアプリケーションまたはバンドラー
- AR-XML文書のHTTP(S) URL
- 文書またはHTTP endpointが別originにある場合のCORS許可

## 1. インストールとimport

```bash
npm install @relink/web-runtime
```

パッケージにはコンパイル済みのブラウザ用bundleとTypeScript declarationが含まれています。パッケージrootからimportします。

```ts
import { ARRuntime, InMemorySemanticRegistry } from "@relink/web-runtime";
```

JavaScriptでも同じAPIを利用できます。その場合はTypeScriptの型注釈を削除してください。

## 2. 文書を読み込む

RuntimeのAvailability評価とInvocationを利用する場合は、文書が使用するContractをexact identifierで登録します。既定の空RegistryではContractが未解決となるため、通常routeは `UNKNOWN` のままです。

```ts
const contract = {
  identifier: "https://example.org/contracts/light/set/1",
  invocation: {
    inputs: [{ name: "on", type: "boolean", required: true }],
    result: {
      outputs: [{ name: "state", type: "boolean" }],
      representations: [{ mediaType: "application/json" }],
    },
  },
};

const runtime = new ARRuntime({
  semanticRegistry: new InMemorySemanticRegistry([contract]),
});

const documentUrl = new URL(
  "/entities/light.arxml",
  window.location.href,
).href;
const document = await runtime.load(documentUrl);

console.log(document.url);
console.log(document.capabilities.map((item) => item.localId));
```

`load()` はリソース取得、XML解析、Core検証、AR-DOM公開を行います。`light` や他のCapabilityを実行することはありません。

## 3. Capabilityを確認して実行する

```ts
const capability = document.getCapability("light");
if (!capability) throw new Error("Capability 'light' was not found");

console.log(capability.evaluation.availability);

if (capability.availability !== "READY") {
  throw new Error("The Capability is not ready for invocation");
}

const result = await capability.invoke(
  { on: true },
  { accept: "application/json" },
);

console.log(result.values.state);
```

`invoke()` はrequest送信前に宣言されたInputを検証します。JSON Resultは、宣言されたOutput名をkeyとする `result.values` として返ります。

READYな `InterfaceUse` routeが複数ある場合は、明示的に1つを選択します。

```ts
const route = capability.evaluation.routes.find(
  (item) => item.availability === "READY",
);
if (!route) throw new Error("No READY route");

const result = await capability.invoke(
  { on: true },
  { routeId: route.routeId, accept: "application/json" },
);
```

routeはXMLの順番で選択されず、失敗したrouteを自動再実行することもありません。`interfaceRef` は、READYなrouteを一意に特定できる場合だけ利用できます。

## 4. 最小のAR-XML構造

次の記述は、上のContractとコード例に対応します。

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
    <capability id="light"
                type="https://example.org/contracts/light/set/1">
      <invocation>
        <inputs><input name="on" type="boolean" /></inputs>
        <result>
          <outputs><output name="state" type="boolean" /></outputs>
          <representations>
            <representation media-type="application/json" />
          </representations>
        </result>
      </invocation>
      <interface-uses>
        <interface-use ref="web-api">
          <mapping>
            <http:operation method="POST" path="light/state" />
          </mapping>
        </interface-use>
      </interface-uses>
    </capability>
  </capabilities>
</ar-entity>
```

Capabilityの `type` は、アプリケーションに登録したContract identifierと完全一致しなければなりません。`http:api` は共有InterfaceのRealizationに、`http:operation` はCapabilityのInterfaceUse Mappingに配置します。

## 5. エラーを処理する

エラーのカテゴリから失敗した層を判定できます。

```ts
import {
  InterfaceError,
  RepresentationError,
  TransportError,
  ValidationError,
} from "@relink/web-runtime";

try {
  await capability.invoke({ on: true });
} catch (error) {
  if (error instanceof ValidationError) {
    // Inputまたはroute選択が不正です。
  } else if (error instanceof InterfaceError) {
    // HTTP routeまたはHTTP statusが失敗しました。
  } else if (error instanceof RepresentationError) {
    // responseが宣言されたResultと一致しません。
  } else if (error instanceof TransportError) {
    // AR-XML resourceを取得できませんでした。
  }
  throw error;
}
```

既定のブラウザHTTP adapterは、scalar GET query InputとJSON objectのPOST/PUT/PATCH bodyに対応します。宣言されたJSON Resultには `application/json` と、すべてのOutputを含むtop-level objectが必要です。redirectは既定で拒否されます。

## 重要な既定値

- 文書formatの既定値はDraft 5です。Draft 4は `{ documentFormat: "draft4" }` を指定した場合だけ利用でき、Draft 5 conformance modeではありません。
- Invocationの既定network policyは、文書と同じoriginだけを許可します。
- `load()` はCapabilityを実行しません。
- このパッケージはexperimentalであり、`1.0.0` 未満のversionでは後方互換性を保証しません。

完全なAPI契約は [Public API Reference](api.ja.md) を、規範的なformat規則は [AR-XML Core 0.1 Draft 5](specs/arxml-core-0.1-draft5-ja.md) を参照してください。
