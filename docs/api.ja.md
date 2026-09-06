# RELink Web Runtime Public API Reference（日本語）

Runtime `0.1.0`の**Beta / Experimental** Public API Referenceです。`1.0.0`未満では、Release間のBackward Compatibilityを保証しません。

英語正本: [Public API Reference](api.md)

このDocumentは、通常のWeb Applicationが使うAPI、AdvancedなIntegrationとExtension Point、Data Model Type、Errorを分類して説明します。PackageのPublic Entry Pointは次のImportです。

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

AR-XML URLをLoadし、Parse・Validation済みのRuntime Documentを返します。

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

`load()`はURL Resolve、Resource Fetch、AR-XML Parse、Validation、Runtime APIによるExposeを担当します。`load()`はCapabilityを自動実行しません。

### `RuntimeDocument`

`ARRuntime.load()`が返す、Load済みAR-DOMのPublic Facadeです。

```ts
readonly url: string
readonly category: string | undefined
readonly profileClaims: readonly ProfileClaim[]
readonly capabilities: readonly Capability[]
getCapability(localId: string): RuntimeCapability | undefined
```

### `RuntimeCapability`

Document内のCapabilityに対するPublic Facadeです。ApplicationまたはHumanからの明示的なExecution Requestを送ります。

```ts
readonly definition: Capability
invoke(inputs: InputValues, options?: InvokeOptions): Promise<InvocationResult>
```

`invoke()`はInput Validation、Interface選択、HTTP Request、Response Decode、Output Mappingを実行します。現在のBaselineはHTTP `GET` / `POST` Interfaceをサポートします。

### `DefaultResourceNetworkPolicy`

Document Retrievalの既定Policyです。HTTP(S)を扱い、HTTPSからHTTPへのDowngradeを拒否します。必要な場合は`ARRuntimeOptions.resourceNetworkPolicy`へより厳しいPolicyを指定します。

```ts
new DefaultResourceNetworkPolicy()
permits(url: URL, requestedUrl: string): boolean
```

## Advanced / integration API

### Invocation types

- `InputValues`: Capabilityへ渡すInput値`Readonly<Record<string, unknown>>`です。
- `InvokeOptions`: `accept?: string`と`signal?: AbortSignal`を指定します。
- `InvocationResult`: Map済みOutputの`values`と、選択したMedia Typeの`representation`を持ちます。
- `NetworkPolicy`: Capability Interface URLの許可・拒否を`permits(url, documentUrl)`で実装します。既定は同一Originです。

### `ARRuntimeOptions`

Browser固有処理とNetwork Policyを差し替えるConfigurationです。

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

- `ResourceNetworkPolicy`: Document Retrieval先の`permits(url, requestedUrl)`を実装します。
- `ResourceFetcher`: `fetchResource(url, options?)`で本文、Status、Response URLを返します。互換性のため旧`fetchText(url, signal?)`形式も利用できます。
- `XMLParser`: `parse(xml)`でRuntime Validationへ渡すXML中間Modelを返します。
- `HTTPInvoker`: `invoke(url, init)`で最小HTTP Response Portを提供します。
- `HTTPResponse`: `status`、`headers.get()`、`text()`、`blob()`を提供します。
- `ResourceFetchOptions` / `ResourceFetchResult`: Resource Fetch PortのInput / Result Typeです。

これらのPortは、Test Fake、別のFetch実装、Custom Network Policyに利用できます。Browser AdapterのConcrete ClassはPublic APIとして公開していません。

## Data model / type definitions

AR-DOMとAR-XML CoreのData Modelを表すType-onlyのPublic APIです。

- `ARDocument`: Document URL、Category、Profile Claim、Capability。
- `Capability`: Local ID、Semantic Type、Input、Result、Requirement、Interface、Runtime State。
- `CapabilityLocalId` / `SemanticCapabilityIdentifier`: Capability Identifier。
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

全てのRuntime Errorは`ARRuntimeError`を継承します。`category`でFailure Layerを識別できます。

- `ParseError`: XML Parse失敗。
- `ValidationError`: AR-XML CoreまたはInput Validation失敗。
- `TransportError`: NetworkまたはResponse読取失敗。
- `HTTPResponseError`: Document Retrieval中のnon-2xx Response。
- `HTTPSDowngradeError`: HTTPSからHTTPへのDowngrade。
- `NetworkPolicyError`: Document RetrievalがPolicyで拒否された場合。
- `InterfaceError`: HTTP Interface不備、非成功Response、Invocation拒否。
- `RepresentationError`: Response RepresentationまたはOutput Mapping失敗。
- `ContractResolutionError` / `ContractError`: Contract Resolution失敗またはConflict。
- `CapabilityError`: Semantic Capability Error用の予約Error。
- `ManifestError`: Manifest Errorの基底Class。
- `ManifestFetchError`: Manifest Retrieval失敗。
- `ManifestParseError`: Manifest JSON Parse失敗。
- `ManifestValidationError`: Manifest 0.1 Validation失敗。

## Responsibility boundary

```text
ARRuntime.load()
  = Resolve / Fetch / Parse / Validate / Expose

RuntimeCapability.invoke()
  = Application / Humanによる明示的なExecution Request

load()はCapabilityを自動実行しない
```

Runtimeを通じてDocumentやCapabilityをExposeしても、自動Execution、Authorization、Backend Successを意味しません。Executionは`RuntimeCapability.invoke()`を明示的に呼び出した場合だけ発生します。
