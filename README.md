# RELink Web Runtime

Experimental Web Browser Runtime for **AR-XML Core 0.1 Draft 5**.

日本語 README: [README.ja.md](README.ja.md)

## Scope

The Runtime loads and exposes declarative AR-XML without executing described Capabilities:

```text
Resolve Entity → Fetch → Parse → Core Validate → Expose AR-DOM
                                               ↓
                                  Explicit Application Invocation
```

Draft 5 keeps Entity, Capability, Invocation, Interface, InterfaceUse, Contract, Profile, Availability, Authorization, and Execution as separate concepts. Passive and physical Entities remain valid even when they contain no Capability or Interface. Draft 5 is the default parser mode; Draft 4 is available only as an explicit migration compatibility mode via `documentFormat: "draft4"` and is not a Draft 5 conformance mode.

## Draft 5 example

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

`load()` never invokes a Capability. `invoke()` is the explicit request boundary and requires one uniquely selected route whose Runtime evaluation is `READY`. When multiple READY routes exist, pass `RouteEvaluation.routeId`; an ambiguous `interfaceRef` is rejected and a failed route is never retried automatically.

## Runtime model

The Core parser validates root/version, closed Core vocabulary, cardinality, typed local IDs, references, Core data types, exact-versioned identifiers, and Extension Slot envelopes. Unknown foreign Extension subtrees in permitted Slots remain Core-valid and are preserved as `OpaqueExtensionElement`.

Runtime evaluation is separate from description data:

```text
ContractResolution:    RESOLVED | UNRESOLVED
ProjectionValidation:  VALIDATED | UNVALIDATED | CONFLICT
RequirementEvaluation: SATISFIED | UNSATISFIED | UNKNOWN
Support:               SUPPORTED | UNSUPPORTED | UNKNOWN
Availability:          READY | UNAVAILABLE | UNKNOWN
```

`InMemorySemanticRegistry` and the `SemanticRegistry` port provide exact Contract/Profile resolution without implicit version substitution or first-wins conflict handling.

## HTTP baseline

HTTP is a Standard Interface Extension. `http:api` belongs in an Interface Realization and `http:operation` belongs in an InterfaceUse Mapping. The baseline supports scalar GET query mapping and JSON-object POST/PUT/PATCH mapping. A JSON Result is a top-level object keyed by declared Output names. HTTP `2xx` is Interface success; non-`2xx` is Interface failure and is not inferred to be a Capability semantic error. The default HTTP adapter rejects redirects so an invocation cannot silently cross an unapproved origin.

## Development

```text
pnpm test
pnpm typecheck
pnpm build
pnpm verify:external
```

The public API is documented in [docs/api.md](docs/api.md) and [docs/api.ja.md](docs/api.ja.md). The normative Draft 5 reference is [docs/specs/arxml-core-0.1-draft5.md](docs/specs/arxml-core-0.1-draft5.md).
