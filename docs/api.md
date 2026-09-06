# RELink Web Runtime Public API Reference

This is the canonical Public API Reference for Runtime `0.1.0`, which is **Beta / Experimental**. Versions below `1.0.0` do not guarantee backward compatibility between releases.

日本語訳: [Public API Reference（日本語）](api.ja.md)

This document classifies the APIs used by typical Web applications, advanced integration and extension points, data model types, and errors. The public package entry point is:

```ts
import { ARRuntime } from "@relink/web-runtime";
```

Modules under `src/`, concrete parser or adapter implementations, `resolveEndpoint`, and `parseManifest` are not public APIs.

## Runtime / specification baseline

| Runtime | AR-XML Core | Resolver Core | Manifest |
| --- | --- | --- | --- |
| 0.1.0 | 0.1 Draft 4 | 0.1 | 0.1 |

## Typical application API

### `ARRuntime`

Loads an AR-XML URL and returns a parsed and validated Runtime document.

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

`load()` performs URL resolution, resource fetching, AR-XML parsing, validation, and exposure through the Runtime API. `load()` does not automatically execute a Capability.

### `RuntimeDocument`

The public facade for the loaded AR-DOM returned by `ARRuntime.load()`.

```ts
readonly url: string
readonly category: string | undefined
readonly profileClaims: readonly ProfileClaim[]
readonly capabilities: readonly Capability[]
getCapability(localId: string): RuntimeCapability | undefined
```

### `RuntimeCapability`

A public facade for a Capability in the document. It sends an explicit execution request from an application or human.

```ts
readonly definition: Capability
invoke(inputs: InputValues, options?: InvokeOptions): Promise<InvocationResult>
```

`invoke()` validates inputs, selects an interface, sends the HTTP request, decodes the response, and maps outputs. The current baseline supports HTTP `GET` and `POST` interfaces.

### `DefaultResourceNetworkPolicy`

The default policy for document retrieval. It handles HTTP(S) and rejects a downgrade from HTTPS to HTTP. Supply a stricter policy through `ARRuntimeOptions.resourceNetworkPolicy` when needed.

```ts
new DefaultResourceNetworkPolicy()
permits(url: URL, requestedUrl: string): boolean
```

## Advanced / integration API

### Invocation types

- `InputValues`: `Readonly<Record<string, unknown>>` values passed to a Capability.
- `InvokeOptions`: accepts `accept?: string` and `signal?: AbortSignal`.
- `InvocationResult`: contains `values` (mapped outputs) and `representation` (the selected media type).
- `NetworkPolicy`: implements `permits(url, documentUrl)` to allow or reject Capability interface URLs. The default is same-origin.

### `ARRuntimeOptions`

Configuration for replacing browser-specific processing and network policies.

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

- `ResourceNetworkPolicy`: implements `permits(url, requestedUrl)` for document retrieval targets.
- `ResourceFetcher`: `fetchResource(url, options?)` returns the body, status, and response URL. The legacy `fetchText(url, signal?)` form is also supported for compatibility.
- `XMLParser`: `parse(xml)` returns the intermediate XML model passed to Runtime validation.
- `HTTPInvoker`: `invoke(url, init)` provides the minimal HTTP response port.
- `HTTPResponse`: provides `status`, `headers.get()`, `text()`, and `blob()`.
- `ResourceFetchOptions` / `ResourceFetchResult`: input and result types for the resource-fetch port.

These ports can be used for test fakes, alternative fetch implementations, and custom network policies. Concrete browser adapter classes are not exposed as public APIs.

## Data model / type definitions

These type-only public APIs represent the AR-DOM and AR-XML Core data model.

- `ARDocument`: document URL, category, profile claims, and Capabilities.
- `Capability`: local ID, semantic type, inputs, result, requirements, interfaces, and Runtime state.
- `CapabilityLocalId` / `SemanticCapabilityIdentifier`: Capability identifiers.
- `InputDefinition` / `OutputDefinition`: input or output name, type, format, and unit.
- `ResultDefinition`: output, representation, and Capability error definitions.
- `RepresentationDefinition`: response media type definition.
- `InterfaceDefinition` / `HTTPInterfaceDefinition`: the current HTTP interface (`GET` / `POST`) definition.
- `RequirementDefinition`: Capability requirement definition.
- `ProfileClaim`: profile URI claim.
- `CoreDataType`: `string`, `number`, `integer`, `boolean`, `binary`, `object`, or `array`.
- `CapabilityErrorDefinition`: Capability error type definition.
- `ContractResolutionState`, `ProjectionValidationState`, `AvailabilityState`: Runtime state union types.

## Errors

All Runtime errors derive from `ARRuntimeError`. Use `category` to identify the failure layer.

- `ParseError`: XML parsing failure.
- `ValidationError`: AR-XML Core or input validation failure.
- `TransportError`: network or response-reading failure.
- `HTTPResponseError`: non-2xx response while retrieving a document.
- `HTTPSDowngradeError`: HTTPS-to-HTTP downgrade.
- `NetworkPolicyError`: document retrieval rejected by policy.
- `InterfaceError`: invalid HTTP interface, non-success response, or invocation rejection.
- `RepresentationError`: response representation or output mapping failure.
- `ContractResolutionError` / `ContractError`: contract resolution failure or conflict.
- `CapabilityError`: reserved error for a semantic Capability error.
- `ManifestError`: base class for Manifest errors.
- `ManifestFetchError`: Manifest retrieval failure.
- `ManifestParseError`: Manifest JSON parsing failure.
- `ManifestValidationError`: Manifest 0.1 validation failure.

## Responsibility boundary

```text
ARRuntime.load()
  = Resolve / Fetch / Parse / Validate / Expose

RuntimeCapability.invoke()
  = An explicit execution request from an application or human

load() does not automatically execute Capabilities
```

Exposing a document or Capability through the Runtime does not imply automatic execution, authorization, or backend success. Execution occurs only when `RuntimeCapability.invoke()` is called explicitly.
