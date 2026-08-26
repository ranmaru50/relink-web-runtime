# AGENTS.md

## 1. Purpose

This repository implements a **Web Browser Runtime PoC for AR-XML Core 0.1 Draft 4**.

The primary objective is to validate the Draft 4 processing model in a browser environment:

```text
Fetch
→ Parse
→ Validate
→ Resolve
→ Evaluate
→ Invoke
→ Decode
→ Map
→ Expose Result
```

This repository is an implementation and feedback vehicle for AR-XML Core 0.1 Draft 4. It is **not** the normative AR-XML specification repository.

Implementation findings that expose ambiguity, inconsistency, unsafe behavior, or missing semantics in Draft 4 should be recorded as specification feedback rather than silently resolved as permanent runtime-specific behavior.

---

## 2. Source of Truth

The normative behavioral reference for this PoC is:

**AR-XML Core 0.1 Draft Specification — Draft 4**

When implementation choices conflict with Draft 4:

1. Follow explicit Draft 4 requirements.
2. If Draft 4 is ambiguous, isolate the interpretation behind a narrow abstraction.
3. Add or update a test that documents the chosen provisional interpretation.
4. Record the ambiguity as a Draft 5 candidate.
5. Do not silently promote implementation convenience into AR-XML semantics.

Repository documentation may describe runtime-specific behavior, but must not redefine AR-XML Core semantics.

---

## 3. Scope

### In scope

The PoC should support the Draft 4 Web Runtime baseline, including:

- AR-XML resource fetching.
- XML parsing.
- Core namespace and structure validation.
- AR-DOM abstract-model construction.
- Profile Claim discovery.
- Semantic Capability Identifier handling.
- Capability Contract resolution state:
  - `RESOLVED`
  - `UNRESOLVED`
- Entity-side Projection validation state:
  - `VALIDATED`
  - `UNVALIDATED`
  - `CONFLICT`
- Runtime Context abstraction.
- Requirement evaluation sufficient for implemented baseline requirements.
- Capability Availability:
  - `READY`
  - `UNAVAILABLE`
  - `UNKNOWN`
- HTTP baseline Interface.
- Relative endpoint resolution against the **AR-XML document URL**.
- GET primitive Input serialization to query parameters.
- POST `encoding="json"` serialization.
- HTTP 2xx success handling.
- HTTP 204 handling.
- Result Representation selection.
- Baseline response decoding and Result-to-Output mapping.
- Single Output mapping.
- Multiple Outputs + `application/json` mapping by top-level property name.
- Browser-native cancellation using `AbortSignal`.
- Browser CORS enforcement plus optional stricter Runtime policy.
- Explicit runtime error categories.

### Out of scope unless a separate task explicitly adds them

- Resolver.
- Manifest.
- Trust Profile infrastructure.
- Certification.
- Profile Definition Language.
- Capability Contract Definition format.
- General mapping DSL.
- JSONPath / XPath mapping.
- Multipart mapping.
- Arbitrary request-header mapping.
- Semantic HTTP-status-to-Capability-Error mapping.
- Event streaming.
- Presentation.
- Script.
- Spatial rendering.
- MCP Interface.
- Serial / BLE / native device Interfaces.
- Full OAuth implementation.
- General-purpose UI generation.

Do not implement an out-of-scope feature merely because it appears useful.

---

## 4. Architectural Style

Use a **layered Hexagonal / Ports-and-Adapters architecture** with a small Domain Core.

DDD terminology may be used where it clarifies responsibility, but this PoC must avoid ceremony-heavy enterprise DDD.

The principal rule is:

> AR-XML semantics belong to the Domain/Core. Browser, Fetch, DOMParser, storage, UI, and network details belong to adapters.

Recommended dependency direction:

```text
Browser / Infrastructure
        ↓
Adapters
        ↓
Application Services
        ↓
Domain / AR-XML Core Model
```

Dependencies must point inward.

The Domain layer must not import browser-specific APIs such as:

- `window`
- `document`
- `HTMLElement`
- `DOMParser`
- `fetch`
- `localStorage`
- browser Cookies APIs

Browser-specific functionality must be supplied through ports/adapters.

---

## 5. Suggested Module Boundaries

A recommended initial structure is:

```text
src/
├─ domain/
│  ├─ arxml/
│  │  ├─ model/
│  │  ├─ errors/
│  │  ├─ validation/
│  │  └─ types/
│  ├─ capability/
│  ├─ contracts/
│  ├─ requirements/
│  └─ result/
│
├─ application/
│  ├─ loadARDocument.ts
│  ├─ resolveCapabilityContract.ts
│  ├─ evaluateCapability.ts
│  ├─ invokeCapability.ts
│  └─ selectRepresentation.ts
│
├─ ports/
│  ├─ ResourceFetcher.ts
│  ├─ XMLParser.ts
│  ├─ ContractRegistry.ts
│  ├─ RequirementProvider.ts
│  ├─ CredentialProvider.ts
│  └─ HTTPInvoker.ts
│
├─ adapters/
│  └─ web/
│     ├─ BrowserResourceFetcher.ts
│     ├─ BrowserXMLParser.ts
│     ├─ FetchHTTPInvoker.ts
│     ├─ BrowserRuntimeContext.ts
│     └─ BrowserSecurityPolicy.ts
│
├─ runtime/
│  ├─ ARRuntime.ts
│  ├─ ARDocument.ts
│  └─ CapabilityHandle.ts
│
└─ index.ts
```

This is a guideline, not a frozen package layout. Preserve the responsibility boundaries even if filenames change.

---

## 6. Domain Model Rules

The implementation must preserve the Draft 4 separation of concerns.

Treat these as distinct concepts:

```text
Entity
Capability Contract
Profile
Profile Claim
Entity Capability Implementation
Input
Result
Output
Representation
Requirement
Interface
Runtime Context
Availability
Authorization
Execution
```

Do not merge them into one generic "action" or "request" model.

### Capability identity

A Capability has:

- a document-local ID;
- a Semantic Capability Identifier.

Never infer semantic compatibility from local IDs.

### Capability Contract

The Capability Contract is the normative semantic source.

An Entity-side declaration is an implementation declaration / Local Projection.

A Local Projection must not redefine or weaken the referenced contract.

Contract state and projection-validation state are independent of document parse validity.

### Result model

Use the Draft 4 model:

```text
Result
├─ Outputs
├─ Representations
└─ Errors
```

A Representation describes the concrete media representation of the Result, not the semantic identity of an individual Output.

---

## 7. Runtime State Model

Keep the following state dimensions separate.

### Contract Resolution

```text
RESOLVED
UNRESOLVED
```

### Projection Validation

```text
VALIDATED
UNVALIDATED
CONFLICT
```

### Availability

```text
READY
UNAVAILABLE
UNKNOWN
```

`READY` means only that the Runtime has no known local reason preventing an invocation attempt.

It must never mean:

- authorization is guaranteed;
- the remote service is healthy;
- physical state is safe;
- execution will succeed.

### Invocation lifecycle

Runtime implementation may use:

```text
idle
running
completed
failed
```

This is runtime state, not AR-XML document semantics.

---

## 8. HTTP Baseline Rules

The Web Runtime PoC must implement Draft 4 HTTP behavior literally unless a task explicitly changes the baseline.

### Endpoint resolution

Relative endpoints are resolved against the **URL of the fetched AR-XML resource**.

Never resolve relative Interface endpoints against:

- the host application's current page URL;
- `window.location`;
- the Runtime bundle URL.

### GET

Primitive Inputs map to query parameters using standard URL encoding.

Supported baseline GET Input types:

- `string`
- `number`
- `integer`
- `boolean`

Do not invent baseline mappings for:

- `object`
- `array`
- `binary`

### POST JSON

For `method="POST"` with `encoding="json"`:

- Input names map to JSON property names.
- Values are serialized as one JSON object.

### HTTP success

- HTTP `2xx` is Interface-level success.
- `204 No Content` is valid success.
- If required Result data cannot be produced from a `204`, return a Result/Representation mapping error.

### Response mapping

Baseline rules:

- Single Output + JSON: map the parsed top-level JSON value to the Output.
- Multiple Outputs + JSON: map top-level JSON property names to Output names.
- Unknown JSON properties may be ignored unless a stricter Capability Contract requires otherwise.
- Missing required Output property is a mapping error.
- Single Output + `text/*`: map decoded body text to the Output.
- Single Output + binary/media response: map the entire response body to that Output.
- Multiple Outputs + non-JSON has no Core 0.1 baseline mapping and must not be guessed.

---

## 9. Representation Handling

Representation selection must not depend on XML document order.

Conceptually select from:

```text
Caller Preference
∩ Runtime Support
∩ Entity Representation Support
```

For HTTP, use standard `Accept` / `Content-Type` semantics where applicable.

Do not treat a declared Media Type as proof that response content is safe or trustworthy.

Examples:

- parse JSON as JSON;
- treat plain text as text;
- never inject `text/html` directly into application DOM;
- treat binary content as opaque unless an explicit safe consumer handles it.

---

## 10. Security Rules

AR-XML and all remote outputs are untrusted input.

Mandatory PoC rules:

- Never render AR-XML strings using `innerHTML`.
- Keep AR-DOM/runtime state separate from Browser DOM.
- Mediate all network access.
- Do not expose raw credentials to AR-XML.
- Do not forward credentials to unrelated origins.
- Respect browser CORS and Fetch security behavior.
- Runtime policy may be stricter than browser policy.
- Validate Inputs before serialization where the Core contract allows validation.
- Validate decoded Outputs against declared Core Data Types where feasible.
- Do not execute side-effecting Capabilities during availability checks.
- Do not interpret client-side Requirement evaluation as authorization.
- Server/backend remains authoritative for final authorization.
- Use least privilege.

The initial PoC SHOULD default to a conservative network policy. If same-origin-only is chosen, implement it as a replaceable Runtime policy rather than hard-coding it into AR-XML semantics.

---

## 11. Error Model

Do not collapse unrelated failures into a generic `Error`.

At minimum preserve these categories:

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

Recommended meanings:

- `ParseError`: malformed XML.
- `ValidationError`: invalid AR-XML Core structure.
- `ContractResolutionError`: inability to obtain an optional/required semantic contract.
- `ContractError`: projection conflict or contract-level incompatibility.
- `TransportError`: fetch/network/CORS/abort/connectivity failure.
- `InterfaceError`: HTTP-level non-success or unsupported binding behavior.
- `RepresentationError`: media-type, decoding, mapping, or output-type failure.
- `CapabilityError`: semantic/domain error explicitly defined by a Capability Contract.

Do not map arbitrary HTTP non-2xx responses into `CapabilityError` unless an explicit semantic mapping specification exists.

---

## 12. Testing Strategy

Use **TDD for normative and bug-prone behavior**.

The expected loop is:

```text
Red
→ minimal implementation
→ Green
→ Refactor
```

Do not require artificial test-first ceremony for trivial mechanical edits, but normative behavior must be protected by tests before it is considered complete.

### Test pyramid

Prefer:

1. Domain unit tests.
2. Application-service tests with fake ports.
3. Adapter integration tests.
4. A small number of browser/end-to-end tests.

Avoid making most tests depend on a real browser or real HTTP server.

### Required test classes

At minimum cover:

#### Parsing / validation

- malformed XML;
- invalid namespace;
- missing version;
- missing capability `id`;
- missing capability `type`;
- duplicate capability local ID;
- duplicate Output names;
- invalid Interface declaration;
- unsupported required behavior.

#### URL resolution

- absolute endpoint;
- root-relative endpoint;
- path-relative endpoint;
- parent-relative endpoint;
- AR-XML URL used as base;
- host application URL must not be used as base.

#### HTTP request mapping

- GET primitive query mapping;
- correct URL encoding;
- POST JSON serialization;
- GET unsupported complex type rejection.

#### Response mapping

- single JSON Output;
- multiple JSON Outputs;
- unknown JSON properties;
- missing Output property;
- text response;
- binary response;
- 204 without Outputs;
- 204 with required Output;
- incompatible Content-Type;
- malformed JSON;
- type mismatch.

#### State separation

- unresolved Contract does not invalidate the document;
- unresolved Contract produces `UNVALIDATED` projection where applicable;
- detected conflict produces `CONFLICT`;
- `READY` does not imply successful invocation.

#### Security

- HTML output is never implicitly inserted into Browser DOM;
- credential leakage across origins is prevented by Runtime policy;
- side-effecting Capability is never invoked as availability probe.

#### Cancellation

- `AbortSignal` aborts an in-flight request and produces the expected Runtime error classification.

Every fixed bug should receive a regression test.

---

## 13. Test Fixtures

Use small, intention-revealing AR-XML fixture files.

Prefer fixtures such as:

```text
fixtures/
├─ valid/
│  ├─ single-output-json.xml
│  ├─ multi-output-json.xml
│  ├─ text-result.xml
│  ├─ get-search.xml
│  └─ relative-endpoint.xml
├─ invalid/
│  ├─ missing-type.xml
│  ├─ duplicate-capability-id.xml
│  └─ invalid-namespace.xml
└─ edge/
   ├─ unresolved-contract.xml
   ├─ projection-conflict.xml
   └─ unsupported-representation.xml
```

Do not build one enormous fixture that exercises unrelated semantics.

---

## 14. Dependency Policy

Keep dependencies minimal.

Prefer Web Platform APIs and small focused libraries.

Do not add a framework or dependency when the platform already supplies an adequate primitive.

Examples:

- use `URL` / `URLSearchParams` for URL handling;
- use `fetch` through an adapter;
- use `AbortController` / `AbortSignal`;
- use standards-based XML parsing through an adapter.

Any dependency added to the Domain layer requires stronger justification than an adapter-only dependency.

---

## 15. Coding Rules

- Use TypeScript with strict type checking.
- Prefer immutable domain values where practical.
- Avoid `any`; use `unknown` at trust boundaries and validate/narrow explicitly.
- Do not use type assertions to bypass parser or network-data validation.
- Keep functions small enough that semantic responsibility is obvious.
- Prefer explicit discriminated unions for state and error categories.
- Avoid global mutable state.
- Avoid singleton Runtime state unless required by a deliberate design.
- Separate pure transformation logic from I/O.
- Do not let browser-specific types leak into Domain interfaces.
- Public API names should reflect AR-XML terminology used by Draft 4.

---

## 16. Public API Philosophy

The PoC public API should remain small.

A conceptual shape may resemble:

```ts
const document = await runtime.load(url);

const capability = document.getCapability("environment");

const result = await capability.invoke(
  {},
  {
    accept: "application/json",
    signal
  }
);
```

This is illustrative, not a normative requirement.

The public API must expose semantic distinctions rather than hide them.

For example, callers should be able to inspect, where relevant:

- semantic Capability Identifier;
- contract resolution state;
- projection state;
- availability;
- supported Interfaces;
- supported Representations.

Do not expose Browser DOM nodes as the AR-DOM API.

---

## 17. DDD Guidance

Use DDD selectively.

Good candidates for domain concepts / value objects:

- `SemanticCapabilityIdentifier`
- `CapabilityLocalId`
- `MediaType`
- `Availability`
- `ContractResolutionState`
- `ProjectionValidationState`
- `ARDocumentUrl`
- `ResolvedEndpoint`

Potential aggregates should remain lightweight.

Do not introduce:

- repositories for every class;
- domain events without a concrete need;
- factories for trivial constructors;
- complex aggregate boundaries merely to satisfy DDD terminology.

The architecture should be domain-centered, not pattern-centered.

---

## 18. Specification Feedback Discipline

When an implementation question cannot be answered by Draft 4:

1. Do not silently invent permanent semantics.
2. Implement the minimum provisional rule required for the PoC.
3. Isolate that rule behind a function, policy, strategy, or adapter.
4. Add a test documenting the provisional behavior.
5. Record the issue in a dedicated specification-feedback document or issue tracker.

Recommended issue format:

```text
Title:
Draft 4 ambiguity: <topic>

Relevant section:
<section number / concept>

Implementation question:
<precise ambiguity>

PoC interpretation:
<temporary behavior>

Why this may belong in Draft 5:
<interoperability impact>
```

Runtime-specific extensions must never masquerade as Core semantics.

---

## 19. Definition of Done

A change is complete when applicable conditions are met:

- behavior is consistent with Draft 4;
- architecture boundaries remain intact;
- normative behavior has automated tests;
- regression bugs have regression tests;
- errors are classified at the correct layer;
- no browser-specific dependency leaks into Domain/Core;
- no security rule is bypassed;
- public API changes are documented;
- provisional specification interpretations are explicitly documented;
- lint, typecheck, and test suite pass.

---

## 20. Repository Governance for Agents

Agents modifying this repository must:

- read this root `AGENTS.md` before implementation;
- treat more specific nested `AGENTS.md` files as additional local constraints;
- avoid changing specification semantics as part of unrelated implementation work;
- avoid broad refactors unless required by the assigned task;
- keep commits/changes conceptually focused;
- preserve backward behavior unless the task explicitly changes it;
- state any Draft 4 ambiguity encountered;
- prefer a narrow, reversible implementation over speculative architecture.

Do not create task-specific implementation plans in this file.

**Work instructions, milestones, feature order, and task-specific acceptance criteria belong in separate task documents.**

---

## 21. Architectural Decision Summary

For this PoC, use the following baseline:

```text
Language:
TypeScript

Architecture:
Layered Hexagonal / Ports-and-Adapters

Domain approach:
DDD-lite / domain-centered modeling

Development method:
TDD for normative behavior and regressions

Core principles:
Dependency inversion
Browser isolation
Pure domain transformations
Explicit state machines
Explicit layered error model
Specification-first behavior

Primary goal:
Validate AR-XML Core 0.1 Draft 4 in a Web Browser Runtime
```

The project should remain small enough that the architecture helps expose AR-XML semantics rather than becoming the main subject of the PoC.

---

## License

This project is licensed under the [Apache License 2.0](LICENSE).
