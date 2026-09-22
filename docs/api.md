# RELink Web Runtime Public API Reference

This is the canonical Public API Reference for the Draft 5 Runtime migration. The package remains experimental and versions below `1.0.0` do not guarantee backward compatibility.

日本語訳: [Public API Reference（日本語）](api.ja.md)

```ts
import { ARRuntime } from "@relink/web-runtime";
```

## Runtime / specification baseline

| Runtime | AR-XML Core | Resolver Core | Manifest |
| --- | --- | --- | --- |
| Draft 5 migration | 0.1 Draft 5 | 0.1 | 0.1 |

## Loading and explicit invocation

`ARRuntime.load()` performs Entity resolution, resource fetching, XML parsing, Core validation, and AR-DOM exposure. It never invokes a Capability.

```ts
const runtime = new ARRuntime();
const document = await runtime.load("https://example.test/entity.arxml");
const capability = document.getCapability("light");
const result = await capability?.invoke({ on: true }, { accept: "application/json" });
```

`RuntimeCapability.invoke()` is the explicit Application/Human request boundary. It validates Inputs, requires a unique READY route (or an explicit `routeId`/unambiguous `interfaceRef`), performs the supported Extension mapping once, and returns semantic Outputs. It never retries another route after transport, Interface, Representation, or Capability errors.

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

`url` is the final AR-XML retrieval URL and is the base for relative HTTP `http:api` and `http:operation` URI resolution.

When multiple READY `InterfaceUse` routes exist, the caller must pass `routeId`. A route handle is exposed as `RouteEvaluation.routeId`; routes sharing an `interfaceRef` are not implicitly selected by document order.

## Draft 5 description model

- `Capability` contains issuer-authored `Invocation` and `InterfaceUse` description data. It does not contain mutable Runtime state.
- `InterfaceDefinition` is an Entity-shared Interface with an optional foreign `Attachment` or `Realization` Extension and Interface Requirements.
- `InterfaceUse` references an Interface and optionally contains one Mapping Extension. Multiple uses may reference the same Interface; order is never preference.
- `OpaqueExtensionElement` preserves unknown foreign subtrees in permitted Extension Slots.
- `Result` contains one or more named Outputs and optional Representations. Draft 5 does not define the Draft 4 `errors` child.

Runtime-derived state is exposed through `CapabilityEvaluation`:

```ts
interface CapabilityEvaluation {
  contractResolution: "RESOLVED" | "UNRESOLVED";
  projectionValidation: "VALIDATED" | "UNVALIDATED" | "CONFLICT";
  availability?: "READY" | "UNAVAILABLE" | "UNKNOWN";
  routes: readonly RouteEvaluation[];
}
```

An absent Invocation has no Capability availability value. Loading, inspection, Contract resolution, and availability evaluation have no Capability side effects.

## Semantic Registry

Contract and Profile identifiers are resolved by exact identity. No `latest` substitution or first-wins conflict handling is performed.

```ts
new ARRuntime({
  semanticRegistry: new InMemorySemanticRegistry([contract], [profile]),
});
```

`EmptySemanticRegistry` is the default and produces `UNRESOLVED` Contract/Profile states. Registry resolution does not authenticate definitions or grant authorization.

`RuntimeDocument.evaluateProfile()` evaluates the complete loaded document, including Capability, Property, Identifier, and Interface requirements. Missing evidence for a required invocation/output constraint produces `UNDETERMINED` rather than false conformance.

## HTTP Standard Interface Extension

Draft 5 HTTP behavior is not Core Interface syntax. It recognizes:

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

The baseline supports GET scalar query mapping and POST/PUT/PATCH JSON-object mapping. A declared JSON Result requires `application/json`; the response must be a top-level JSON object containing every declared Output. Any `2xx` status is HTTP success, while non-`2xx` is an Interface failure. HTTP status is never inferred as a Capability semantic error. The default browser HTTP adapter uses `redirect: "error"` so an invocation cannot silently cross an unapproved redirect origin.

## Ports and errors

`XMLParser`, `ResourceFetcher`, `HTTPInvoker`, `NetworkPolicy`, and `ResourceNetworkPolicy` are injectable boundaries for browser adapters and tests. `SemanticRegistry` is the exact-identity definition boundary.

All errors derive from `ARRuntimeError`. `ParseError`, `ValidationError`, `TransportError`, `InterfaceError`, `RepresentationError`, `ContractResolutionError`, and `ContractError` remain separate categories. Unknown Extensions remain Core-valid when they occur in a permitted Slot, but their Runtime support is not guessed.
