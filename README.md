# RELink Web Runtime

Experimental **Web Browser Runtime PoC for AR-XML Core 0.1 Draft 4**.

RELink (Real Entity Link) is an experimental architecture for making physical and real-world entities addressable, discoverable, interactable, and operable through existing Web infrastructure.

This repository focuses on one concrete question:

> Can the AR-XML Core information model be implemented as a small, browser-native runtime using ordinary Web technologies?

The runtime is experimental. APIs and AR-XML semantics may change as implementation feedback is incorporated into later drafts.

[日本語 README](README.ja.md)

---

## Project Scope

This repository implements a browser runtime for the AR-XML Core 0.1 Draft 4 baseline.

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

AR-XML is **not primarily a UI description language**. The runtime describes and invokes semantic Capabilities independently from presentation.

## Current AR-XML Model

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

A Capability answers **what can be done**. An Interface answers **how that Capability can be invoked**.

A Result describes the semantic data produced by invocation, while a Representation describes the concrete media form used to carry that Result.

## Example AR-XML

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

If this document is loaded from:

```text
https://example.org/entities/sensor.arxml
```

then `/api/temperature` resolves to:

```text
https://example.org/api/temperature
```

Relative Interface endpoints are resolved against the **AR-XML document URL**, not the host application's page URL.

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

`ARRuntime` supports dependency injection for the XML parser, resource fetcher, HTTP invoker, and network policy so browser-specific behavior remains behind adapters.

### Document Loading and Resolver Core L1

`ARRuntime.load()` accepts both a direct AR-XML URL (L0) and an Anchor / Resolver URL (L1). It uses the browser's ordinary Fetch redirect behavior and preserves the requested URL, final response URL, terminal HTTP status, and representation body.

`RuntimeDocument.url` is the final successful AR-XML response URL. Relative Capability Interface endpoints are therefore resolved against that final URL, never against the original Anchor or Resolver URL. A terminal non-2xx response, an HTTPS-to-HTTP downgrade, or a configured document resource-policy rejection fails before XML parsing.

The default document policy allows HTTP(S) for compatibility with direct (L0) loading and rejects HTTP after an HTTPS request. Callers using Resolver Core L1 should configure a `ResourceNetworkPolicy` that requires an HTTPS input. The Browser Adapter cannot observe redirect targets before the browser does, so it relies on browser Fetch/CORS/mixed-content enforcement. For public Resolver requests where ambient credentials should not be sent, use `new BrowserResourceFetcher(fetcher, { credentials: "omit" })` or `ARRuntimeOptions.resourceCredentials`.

Resolver / Manifest-specific parsing and Manifest retrieval are not added to the baseline path, and browser CORS / Fetch restrictions are not bypassed.

## Current Baseline Behavior

The current PoC targets the Draft 4 browser-runtime baseline, including:

- AR-XML loading over HTTP(S)
- XML parsing and Core validation
- AR-DOM-style runtime model
- Profile Claim discovery
- Semantic Capability Identifiers
- `RESOLVED` / `UNRESOLVED` Contract state
- `VALIDATED` / `UNVALIDATED` / `CONFLICT` Projection state
- `READY` / `UNAVAILABLE` / `UNKNOWN` Availability state
- HTTP `GET`
- HTTP `POST` with `encoding="json"`
- relative endpoint resolution against the AR-XML document URL
- primitive GET inputs mapped to query parameters
- JSON POST inputs mapped to a JSON object
- HTTP `2xx` and `204 No Content`
- Result Representation selection
- JSON, text, and binary/media response handling
- Single Output mapping
- Multiple Outputs + JSON top-level property mapping
- `AbortSignal` cancellation
- browser CORS enforcement
- replaceable Runtime network policy
- layered Runtime error categories

## Architecture

The runtime uses a small **Ports-and-Adapters / Hexagonal** architecture.

```text
Browser / Infrastructure
        ↓
Web Adapters
        ↓
Application Services
        ↓
Domain / AR-XML Model
```

Current responsibilities are organized approximately as:

```text
src/
├─ domain/        # AR-XML model and error categories
├─ application/   # validation, endpoint resolution, invocation
├─ ports/         # runtime abstraction interfaces
├─ adapters/web/  # DOMParser / fetch based adapters
├─ runtime/       # public ARRuntime / RuntimeDocument API
└─ index.ts
```

The internal AR-XML model is not the Browser DOM. Browser APIs are infrastructure adapters, not the semantic source of truth.

## Result Mapping

Draft 4 defines a small baseline mapping model rather than a general mapping DSL.

### Single Output + JSON

```json
20.1
```

maps to:

```text
temperature = 20.1
```

### Multiple Outputs + JSON

```json
{
  "temperature": 20.1,
  "humidity": 44
}
```

Top-level JSON property names map to Output names.

A general JSONPath/XPath-style mapping language is intentionally outside the current baseline.

## Runtime States

```text
Contract Resolution:
RESOLVED / UNRESOLVED

Projection Validation:
VALIDATED / UNVALIDATED / CONFLICT

Capability Availability:
READY / UNAVAILABLE / UNKNOWN
```

`READY` means only that the Runtime has no known local reason preventing an invocation attempt.

It does **not** guarantee backend authorization, remote service health, physical safety, business-rule acceptance, or successful execution.

Availability, authorization, and execution are deliberately separate concepts.

## Error Model

The runtime keeps different failure layers separate.

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

An arbitrary HTTP non-2xx response is not automatically treated as a semantic Capability Error.

## Security Model

AR-XML and remote Capability results must be treated as untrusted input.

The PoC follows these principles:

- do not execute AR-XML as JavaScript
- do not pass AR-XML strings directly to `innerHTML`
- keep Browser DOM and AR-XML runtime state separate
- mediate network access through the Runtime
- respect browser CORS and Fetch security behavior
- do not expose raw credentials to AR-XML
- do not forward credentials to unrelated origins
- do not use side-effecting Capability invocation as an availability probe
- do not treat client-side Requirement evaluation as authorization
- keep final authorization authoritative on the Capability provider/backend

The current default network policy is conservative and may restrict Capability invocation to the AR-XML origin. This is a Runtime policy, not an AR-XML semantic rule.

## Local Development

Requirements:

- Node.js
- pnpm

```bash
pnpm install
pnpm server
```

In another terminal:

```bash
pnpm dev
```

Run tests and checks:

```bash
pnpm test
pnpm test:watch
pnpm typecheck
pnpm build
```

The sample backend serves an AR-XML document and a minimal HTTP Capability endpoint.

## Demo

The browser demo is a developer/debugging surface for the Runtime.

It loads AR-XML, lists discovered Capabilities and runtime state, and allows a safe sample Capability to be invoked.

The demo is **not** an AR-XML Presentation implementation and should not be interpreted as defining UI semantics for AR-XML.

## Web Runtime Test Harness

`test-harness/` is a Runtime-specific manual evaluation UI. The external [RELink Testbed](https://github.com/ranmaru50/relink-testbed) remains a Runtime-independent deterministic test environment.

1. Start `relink-testbed` separately and note its Entity Origin.
2. Run `pnpm harness` in this repository.
3. Open the displayed URL, enter the Entity Origin, and connect.
4. Select a case, explicitly load its AR-XML, then explicitly invoke its Capability.

The Harness keeps expected data, Runtime result/error, and Testbed-observed requests visible side-by-side. It currently supports all exposed baseline cases, including `single-output-json`, `post-json`, `relative-endpoint-invocable`, `http-500`, `malformed-json`, `multi-output-json`, and `http-204-no-output`.

## Current Limitations

The following are intentionally outside the current Web Runtime PoC or are not yet standardized by AR-XML Core 0.1 Draft 4:

- RELink Resolver
- Manifest
- physical Anchor handling
- NFC / BLE / UWB
- cryptographic Trust Profiles
- Profile Definition Language
- finalized Capability Contract document format
- remote Contract discovery protocol
- general request/response mapping DSL
- JSONPath / XPath mapping
- multipart mapping
- semantic HTTP status → Capability Error mapping
- event streaming
- Presentation
- Script
- Spatial / WebXR
- MCP Interface
- serial / native device Interfaces
- full OAuth flows
- certification

## Relationship to AR-XML Core

This repository is an **implementation and feedback vehicle**, not the normative AR-XML specification.

The current implementation target is:

```text
AR-XML Core 0.1 Draft 4
```

When implementation exposes an ambiguity in Draft 4, the preferred response is to isolate the provisional runtime interpretation, cover it with a test, record it as specification feedback, and avoid silently turning implementation convenience into Core semantics.

## Development Guidance

Project-wide implementation and architecture rules belong in [`AGENTS.md`](AGENTS.md).

Task ordering and milestone instructions belong in [`WORK_INSTRUCTIONS.md`](WORK_INSTRUCTIONS.md).

The README intentionally remains focused on the project, its runtime model, and how to use it.

## Project Status

**Experimental / Proof of Concept**

This project should not currently be used for production or safety-critical systems.

AR-XML Core, RELink architecture, runtime APIs, and namespace identifiers may change before a stable release.

## License

Licensed under the **Apache License 2.0**.

See [`LICENSE`](LICENSE).

## RELink

**RELink** is a provisional project name meaning **Real Entity Link**.

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

The Web Runtime is one implementation of that broader architecture.
