# AR-XML Core 0.1 Draft 5 Compliance Checklist

**Checked:** 2026-09-23  
**Branch:** `codex/issue-12-draft5-runtime`  
**Normative source:** [`docs/specs/arxml-core-0.1-draft5.md`](specs/arxml-core-0.1-draft5.md)

## Purpose and evidence

This checklist records the Draft 5 requirements that are implemented by the current Runtime, the requirements that are only partially covered, and the requirements that still need work. It is an implementation review aid, not a claim that the Runtime is fully conformant with the working draft.

The primary automated evidence is:

- `tests/draft5-runtime.test.ts`: Draft 5-specific Core, Extension, evaluation, Profile, and HTTP behavior.
- `tests/document-loading.test.ts`, `tests/runtime.test.ts`, `tests/distribution.test.ts`, and `tests/harness.test.ts`: regression coverage for the existing public Runtime surface.
- Latest result: 5 test files passed, 51 tests passed.

Status values:

- **PASS** — the relevant baseline is implemented and has a focused automated check.
- **PARTIAL** — a useful baseline exists, but the complete normative surface or a focused test is still missing.
- **GAP** — the requirement is not implemented or is not yet covered by an executable test.

## Checklist

| ID | Draft 5 sections | Requirement area | Status | Implementation and test evidence / remaining work |
|---|---|---|---|---|
| D5-01 | 4–8, 81–82 | An Entity may be empty, passive, or Properties-only; loading does not imply execution. | **PASS** | `ARDocument` accepts these forms; `empty/passive/Properties-only Entity` and `load では HTTP を呼び出さない` are covered. |
| D5-02 | 7, 14–18 | Capability, Interface, InterfaceUse, Invocation, Result, and Representation remain separate concepts. | **PASS** | Separate domain types and parsers are used; Attachment-only Interface and Capability without Invocation are tested. |
| D5-03 | 9–13 | Category, Identifier, Property, Subject, and Profile Claim are represented with Core fields. | **PARTIAL** | Category, Identifier, Property, and Subject parsing/validation exist. Dedicated positive/negative tests for every Profile Claim rule are still missing. |
| D5-04 | 19–21 | Core namespace/version/root and order-insensitive Core containers are validated. | **PARTIAL** | Namespace, version, root, closed child grammar, and singleton checks exist. A complete order-permutation matrix and all Appendix B cardinalities are not yet tested. |
| D5-05 | 22–30 | Core XML serialization rules, attributes, required fields, and empty-element restrictions are enforced. | **PARTIAL** | The validator covers the main model and rejects unknown Core attributes/children. The full section-by-section serialization fixture set is not yet present. |
| D5-06 | 23, 26, 29, 50–51, 58 | Typed local IDs, exact references, exact-versioned Contract/Profile identifiers, and duplicate IDs are checked. | **PASS** | Duplicate typed IDs, dangling references, exact identifier handling, and moving `latest` rejection are covered by validation and registry tests. |
| D5-07 | 11, 24, 60 | Foreign metadata and permitted opaque Extension content are preserved without changing Core meaning. | **PARTIAL** | Foreign attributes and property Extension roots are preserved as opaque data. There is no lossless serializer, so round-trip preservation is not proven. |
| D5-08 | 31–36, 59 | Extension Slots are explicit; unknown foreign elements remain Core-valid only in permitted slots. | **PASS** | Attachment, Realization, Requirement, and Mapping unknown Extensions are accepted in their slots and retained. Invalid foreign children outside slots are rejected. |
| D5-09 | 32, 36, 79 | Extension processing is isolated from Core validation and can report unsupported semantics. | **PARTIAL** | `ExtensionRegistry` and opaque Extension model exist, and HTTP support is isolated. The registry is not yet wired into Runtime evaluation for arbitrary Extensions. |
| D5-10 | 33–35 | Attachment, Realization, and Mapping have distinct slot semantics and do not redefine Core. | **PASS** | Slot-specific parsing and evaluation distinguish Attachment, Realization, and Mapping; attachment-only routes are not treated as executable HTTP routes. |
| D5-11 | 37–41, 62–63 | Contract resolution uses exact identity; unresolved and conflicting definitions are not first-wins; projection states are separate. | **PASS** | Exact registry resolution, duplicate-definition conflict, `CONFLICT`, and `UNVALIDATED` projection cases are tested. |
| D5-12 | 39–40 | Entity-side Capability projection is checked against Contract inputs, outputs, types, requiredness, format, unit, and Result presence. | **PARTIAL** | The baseline exact comparison is implemented. Full requirement compatibility, narrowing rules, constraint semantics, and Contract definition defect reporting are not implemented. |
| D5-13 | 42–49, 68 | Profile identity and required Capability/Property/Identifier/Interface matching are evaluated independently from Runtime availability. | **PARTIAL** | Exact Profile resolution and basic conformance/non-conformance checks are tested. Full candidate aggregation, optional semantics, subject scoping, claims, narrowing, and Extension policies remain incomplete. |
| D5-14 | 50–55 | Semantic identifiers use exact code-point identity and resolution is separate from Entity loading. | **PARTIAL** | Exact registry lookup and conflict handling are implemented. The registry Source model, definition validation, and all resolution-source/error states are not implemented. |
| D5-15 | 56–60 | Processing is layered: Core validity, Extension validity, preservation, and exposure are not silently conflated. | **PARTIAL** | Core validation and HTTP Extension validation are separate from Contract/Profile evaluation. A complete categorized error/result API is still needed. |
| D5-16 | 61, 69–70 | Description data is separate from mutable Runtime state; availability is not authorization or execution. | **PASS** | Runtime evaluation is computed separately, load performs no Capability invocation, and HTTP failures are reported as Interface errors rather than Core invalidity. |
| D5-17 | 64–67 | Requirements, Support, route evaluation, and availability aggregation use explicit states. | **PARTIAL** | `SATISFIED/UNKNOWN`, `SUPPORTED/UNKNOWN/UNSUPPORTED`, and `READY/UNKNOWN/UNAVAILABLE` are represented and tested for unknown Requirement/Attachment/Realization/Mapping. A pluggable evidence provider is not implemented. |
| D5-18 | 66–67, 70 | Multiple InterfaceUse routes are evaluated without document-order availability preference; invocation selects an eligible route explicitly. | **PARTIAL** | Routes are evaluated independently, sorted deterministically for invocation, and `interfaceRef` is supported. A caller-supplied selection policy and a complete multi-ready-route test matrix are still needed. |
| D5-19 | 71–73 | HTTP is an Extension; `http:api` and `http:operation` have strict namespace, attribute, method, and path rules. | **PASS** | HTTP roots, unknown attributes/children, method token syntax, relative path restrictions, URI syntax, and fragment removal are validated. |
| D5-20 | 72–73 | HTTP base/path resolution follows RFC 3986 using the final retrieval URL and rejects scheme/authority changes in operation paths. | **PARTIAL** | Relative base, query retention, fragment removal, invalid URI characters, and absolute operation rejection are tested. Encoded dot-segment preservation and redirected final-URL integration are not tested. |
| D5-21 | 74 | Baseline HTTP request mapping supports scalar GET query inputs and JSON POST/PUT/PATCH bodies with input/type validation. | **PASS** | GET query mapping/collision, scalar validation, JSON methods, required inputs, and binary JSON rejection are implemented and tested. Full wire-equivalent serialization options are outside this baseline. |
| D5-22 | 75 | HTTP Result mapping distinguishes successful status, non-success status, JSON Content-Type, malformed JSON, missing outputs, type mismatch, and 204. | **PASS** | Focused tests cover malformed JSON, missing Output, wrong Content-Type, 204 with/without Result, output type mapping, and non-2xx errors. |
| D5-23 | 76–80 | Producer, Consumer, Extension, Runtime, and Profile Evaluator conformance classes are independently demonstrable. | **PARTIAL** | The runtime has separate Core/Extension/evaluation modules and regression tests. A formal conformance-class harness and producer/consumer fixture suite are not yet available. |
| D5-24 | 81–91 | Normative examples and issue-level reference scenarios are executable regression fixtures. | **PARTIAL** | Empty, Properties-only, Attachment-only, no-Invocation, shared HTTP, multiple-use, and unknown-Extension patterns are represented in tests. All reference lab examples and dedicated fixture files are not yet covered. |
| D5-25 | 92–96, Appendices C–E | Security/privacy, namespace evolution, registry guidance, compatibility, error categories, and Draft 4→5 migration are documented and tested. | **PARTIAL** | Same-origin default, no load-time side effect, Draft 4 compatibility path, and layered errors exist. There is no complete security test suite, namespace evolution test matrix, or Appendix C/D/E conformance harness. |

## Explicit non-goals

The following are intentionally not treated as missing implementation for Issue #12 because Draft 5 places them outside the Core baseline: AI inference, credential issuance/storage/refresh, authorization decisions, a generic mapping DSL, a mandatory centralized registry, a JSON serialization of AR-XML, and transport protocols other than the baseline HTTP Extension.

## Next implementation priorities

1. Add an order/cardinality fixture suite covering every Core container and Appendix B row.
2. Add round-trip serialization or an explicit lossless-preservation limitation to the public API.
3. Complete Contract/Profile definition validation and the unresolved/defective/conflicting source states.
4. Integrate Extension processors and requirement evidence providers into Runtime evaluation.
5. Add RFC 3986 edge-case fixtures, including encoded dot segments and final redirected retrieval URLs.
6. Add conformance-class fixtures for the normative examples and the two reference lab scenarios.
