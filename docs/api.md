# RELink Web Runtime Public API Reference

Runtime `0.1.0` の **Beta / Experimental** Public API Referenceです。`1.0.0`未満では、Version間のBackward Compatibilityを保証しません。

このDocumentは、通常のWeb Applicationが使うAPI、Integration向けの拡張Point、Data Model、Errorを区分して説明します。PackageのPublic Entry Pointは次のImportです。

```ts
import { ARRuntime } from "@relink/web-runtime";
```

`src/`以下のModule、Parser / AdapterのConcrete実装、`resolveEndpoint`、`parseManifest`はPublic APIではありません。

## Runtime / Specification Baseline

| Runtime | AR-XML Core | Resolver Core | Manifest |
| --- | --- | --- | --- |
| 0.1.0 | 0.1 Draft 4 | 0.1 | 0.1 |

## Typical application API

### `ARRuntime`

AR-XML URLをLoadし、Parse・Validation済みのRuntime Documentを返すEntry Pointです。

```ts
new ARRuntime(options?: ARRuntimeOptions)
load(
  url: string,
  options?: { signal?: AbortSignal; credentials?: RequestCredentials },
): Promise<RuntimeDocument>
```

```ts
const runtime = new ARRuntime();
const document = await runtime.load(anchorUrl);
const capability = document.getCapability("temperature");

if (!capability) {
  throw new Error("Capability not found");
}

const result = await capability.invoke({}, { accept: "application/json" });
console.log(result.values.temperature);
```

`load()`は、URLのResolve、Resource Fetch、AR-XML Parse、Validation、Runtime APIによるExposeを担当します。`load()`はCapabilityを自動実行しません。

### `RuntimeDocument`

`ARRuntime.load()`の結果として得られる、読み込み済みAR-DOMへのPublic Facadeです。

```ts
readonly url: string
readonly category: string | undefined
readonly profileClaims: readonly ProfileClaim[]
readonly capabilities: readonly Capability[]
getCapability(localId: string): RuntimeCapability | undefined
```

### `RuntimeCapability`

Document内のCapabilityを検索し、ApplicationまたはHumanの明示的な実行要求を送るPublic Facadeです。

```ts
readonly definition: Capability
invoke(inputs: InputValues, options?: InvokeOptions): Promise<InvocationResult>
```

`invoke()`は、Input検証、Interface選択、HTTP Request、Response Decode、Output Mappingを実行します。現在のBaselineで実行できるInterfaceはHTTP `GET` / `POST`です。

### `DefaultResourceNetworkPolicy`

Document取得時の既定Policyです。HTTP(S)を扱い、HTTPSからHTTPへのDowngradeを拒否します。より厳しいPolicyが必要な場合は`ARRuntimeOptions.resourceNetworkPolicy`へ指定します。

```ts
new DefaultResourceNetworkPolicy()
permits(url: URL, requestedUrl: string): boolean
```

## Advanced / integration API

### Invocation types

- `InputValues`: `Readonly<Record<string, unknown>>`。Capabilityへ渡すInput値です。
- `InvokeOptions`: `accept?: string`と`signal?: AbortSignal`を指定します。
- `InvocationResult`: `values`（Output値）と`representation`（選択されたMedia Type）を持ちます。
- `NetworkPolicy`: Capability InterfaceのURLを許可する`permits(url, documentUrl)`を実装します。既定は同一Origin Policyです。

### `ARRuntimeOptions`

Browser固有の処理やNetwork Policyを差し替えるConfigurationです。

```ts
interface ARRuntimeOptions {
  xmlParser?: XMLParser;
  resourceFetcher?: ResourceFetcher;
  httpInvoker?: HTTPInvoker;
  networkPolicy?: NetworkPolicy;
  resourceNetworkPolicy?: ResourceNetworkPolicy;
  resourceCredentials?: RequestCredentials;
}
```

### Extension ports

- `ResourceNetworkPolicy`: Document取得先の`permits(url, requestedUrl)`を実装します。
- `ResourceFetcher`: `fetchResource(url, options?)`で本文・Status・Response URLを返します。旧`fetchText(url, signal?)`も互換用に利用できます。
- `XMLParser`: `parse(xml)`でRuntimeがValidationに渡すXML中間Modelを返します。
- `HTTPInvoker`: `invoke(url, init)`でHTTP Responseの最小Portを提供します。
- `HTTPResponse`: `status`、`headers.get()`、`text()`、`blob()`を持つResponse Portです。
- `ResourceFetchOptions` / `ResourceFetchResult`: Resource Fetch Portの入力・結果型です。

これらのPortは、テスト用のFake、別のFetch実装、Network Policyの差し替えに利用できます。Browser AdapterのConcrete ClassそのものはPublic APIとして公開していません。

## Data model / type definitions

AR-DOMとAR-XML CoreのData Modelを表す、Type-onlyのPublic APIです。

- `ARDocument`: Document URL、Category、Profile Claim、Capabilityの集合。
- `Capability`: Local ID、Semantic Type、Input、Result、Requirement、Interface、Runtime State。
- `CapabilityLocalId` / `SemanticCapabilityIdentifier`: Capabilityの識別子。
- `InputDefinition` / `OutputDefinition`: Input / OutputのName、Type、Format、Unit。
- `ResultDefinition`: Output、Representation、Capability Errorの定義。
- `RepresentationDefinition`: Response Media Typeの定義。
- `InterfaceDefinition` / `HTTPInterfaceDefinition`: 現在のHTTP Interface（`GET` / `POST`）の定義。
- `RequirementDefinition`: Capability Requirementの定義。
- `ProfileClaim`: Profile URIのClaim。
- `CoreDataType`: `string`、`number`、`integer`、`boolean`、`binary`、`object`、`array`。
- `CapabilityErrorDefinition`: Capability Error Typeの定義。
- `ContractResolutionState`、`ProjectionValidationState`、`AvailabilityState`: Runtime StateのUnion Type。

## Errors

全てのRuntime Errorは`ARRuntimeError`を基底とし、`category`でFailure Layerを識別できます。

- `ParseError`: XML Parse失敗。
- `ValidationError`: AR-XML CoreまたはInputのValidation失敗。
- `TransportError`: NetworkまたはResponse読取失敗。
- `HTTPResponseError`: Document取得のnon-2xx Response。
- `HTTPSDowngradeError`: HTTPSからHTTPへのDowngrade。
- `NetworkPolicyError`: Document取得先のPolicy拒否。
- `InterfaceError`: HTTP Interfaceの不備、非成功Response、Invocation拒否。
- `RepresentationError`: Response RepresentationまたはOutput Mapping失敗。
- `ContractResolutionError` / `ContractError`: Contract解決または矛盾のError。
- `CapabilityError`: Capability固有の意味的Errorを表す予約済みError。
- `ManifestError`: Manifest Errorの基底Class。
- `ManifestFetchError`: Manifest取得失敗。
- `ManifestParseError`: Manifest JSON Parse失敗。
- `ManifestValidationError`: Manifest 0.1のValidation失敗。

## 責務境界

```text
ARRuntime.load()
  = Resolve / Fetch / Parse / Validate / Expose

RuntimeCapability.invoke()
  = Application / Humanによる明示的な実行要求

load()はCapabilityを自動実行しない
```

RuntimeがDocumentやCapabilityをExposeしたことは、Capabilityの自動実行、Authorization、Backendの成功を意味しません。実行は`RuntimeCapability.invoke()`を明示的に呼び出した場合だけ発生します。
