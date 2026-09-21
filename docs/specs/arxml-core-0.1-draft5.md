# AR-XML Core 0.1 Draft Specification — Draft 5

**Status:** Working Draft  
**Version:** 0.1-draft5  
**Target:** AR-XML Core 0.1  
**Issue:** [#10 — AR-XML Core 0.1 Draft 5: specification and runtime migration](https://github.com/ranmaru50/relink-web-runtime/issues/10)

---

# Table of Contents

- [1. Status of This Document](#1-status-of-this-document)
- [2. Abstract](#2-abstract)
- [3. Conformance and Normative Language](#3-conformance-and-normative-language)
- [4. Scope](#4-scope)
- [5. Design Principles](#5-design-principles)
- [6. Terminology](#6-terminology)
- [Part I — Core Information Model](#part-i--core-information-model)
  - [7. Core Model Overview](#7-core-model-overview)
  - [8. AR Entity](#8-ar-entity)
  - [9. Category](#9-category)
  - [10. Identifier](#10-identifier)
  - [11. Property](#11-property)
  - [12. Subject](#12-subject)
  - [13. Profile Claim](#13-profile-claim)
  - [14. Capability](#14-capability)
  - [15. Invocation](#15-invocation)
  - [16. Input, Result, Output, and Representation](#16-input-result-output-and-representation)
  - [17. Requirement](#17-requirement)
  - [18. Interface and InterfaceUse](#18-interface-and-interfaceuse)
- [Part II — XML Serialization](#part-ii--xml-serialization)
  - [19. XML Namespace and Version](#19-xml-namespace-and-version)
  - [20. Root Element](#20-root-element)
  - [21. Core Containers and Child Order](#21-core-containers-and-child-order)
  - [22. Category Serialization](#22-category-serialization)
  - [23. Identifier Serialization](#23-identifier-serialization)
  - [24. Property Serialization](#24-property-serialization)
  - [25. Subject Serialization](#25-subject-serialization)
  - [26. Capability Serialization](#26-capability-serialization)
  - [27. Invocation and Result Serialization](#27-invocation-and-result-serialization)
  - [28. Requirement Serialization](#28-requirement-serialization)
  - [29. Interface and InterfaceUse Serialization](#29-interface-and-interfaceuse-serialization)
  - [30. Profile Claim Serialization](#30-profile-claim-serialization)
- [Part III — Extension Model](#part-iii--extension-model)
  - [31. Extension Architecture](#31-extension-architecture)
  - [32. Extension Slots](#32-extension-slots)
  - [33. Attachment](#33-attachment)
  - [34. Realization](#34-realization)
  - [35. Mapping](#35-mapping)
  - [36. Unknown Extension Processing](#36-unknown-extension-processing)
- [Part IV — Capability Contracts](#part-iv--capability-contracts)
  - [37. Capability Contract Model](#37-capability-contract-model)
  - [38. Contract Identity and Resolution](#38-contract-identity-and-resolution)
  - [39. Entity-side Capability Projection](#39-entity-side-capability-projection)
  - [40. Projection Compatibility](#40-projection-compatibility)
  - [41. Projection Validation States](#41-projection-validation-states)
- [Part V — Profiles](#part-v--profiles)
  - [42. Profile Model](#42-profile-model)
  - [43. Profile Identity and Resolution](#43-profile-identity-and-resolution)
  - [44. Capability Requirements](#44-capability-requirements)
  - [45. Property and Identifier Requirements](#45-property-and-identifier-requirements)
  - [46. Interface Requirements](#46-interface-requirements)
  - [47. Requirement and Extension Policies](#47-requirement-and-extension-policies)
  - [48. Profile Narrowing Rules](#48-profile-narrowing-rules)
  - [49. Profile Conformance](#49-profile-conformance)
- [Part VI — Semantic Identification and Resolution](#part-vi--semantic-identification-and-resolution)
  - [50. Semantic Identifiers](#50-semantic-identifiers)
  - [51. Exact Versioned Identity](#51-exact-versioned-identity)
  - [52. Semantic Registry](#52-semantic-registry)
  - [53. Resolution Sources](#53-resolution-sources)
  - [54. Conflicting Definitions](#54-conflicting-definitions)
  - [55. Entity Resolver Separation](#55-entity-resolver-separation)
- [Part VII — Validation and Processing](#part-vii--validation-and-processing)
  - [56. Processing Model](#56-processing-model)
  - [57. Core Structural Validation](#57-core-structural-validation)
  - [58. Reference and Uniqueness Validation](#58-reference-and-uniqueness-validation)
  - [59. Extension Validation](#59-extension-validation)
  - [60. Preservation and Exposure](#60-preservation-and-exposure)
- [Part VIII — Runtime Evaluation](#part-viii--runtime-evaluation)
  - [61. Description and Runtime State](#61-description-and-runtime-state)
  - [62. Contract Resolution](#62-contract-resolution)
  - [63. Projection Validation](#63-projection-validation)
  - [64. Requirement Evaluation](#64-requirement-evaluation)
  - [65. Runtime Support](#65-runtime-support)
  - [66. InterfaceUse Route Evaluation](#66-interfaceuse-route-evaluation)
  - [67. Capability Availability Aggregation](#67-capability-availability-aggregation)
  - [68. Profile Resolution and Conformance](#68-profile-resolution-and-conformance)
  - [69. Availability, Authorization, and Execution](#69-availability-authorization-and-execution)
  - [70. Load and Explicit Invocation](#70-load-and-explicit-invocation)
- [Part IX — Standard Extensions / HTTP](#part-ix--standard-extensions--http)
  - [71. HTTP Extension Scope](#71-http-extension-scope)
  - [72. HTTP Interface Realization](#72-http-interface-realization)
  - [73. HTTP Operation Mapping](#73-http-operation-mapping)
  - [74. HTTP Request Mapping](#74-http-request-mapping)
  - [75. HTTP Response and Result Mapping](#75-http-response-and-result-mapping)
- [Part X — Conformance Classes](#part-x--conformance-classes)
  - [76. Conformance Overview](#76-conformance-overview)
  - [77. Core Document Conformance](#77-core-document-conformance)
  - [78. Core Processor Conformance](#78-core-processor-conformance)
  - [79. Extension Processor Conformance](#79-extension-processor-conformance)
  - [80. Runtime and HTTP Extension Conformance](#80-runtime-and-http-extension-conformance)
- [Part XI — Examples](#part-xi--examples)
  - [81. Empty Passive Entity](#81-empty-passive-entity)
  - [82. Properties-only Entity](#82-properties-only-entity)
  - [83. Identifier and Subject](#83-identifier-and-subject)
  - [84. Attachment-only Interface](#84-attachment-only-interface)
  - [85. Capability without Invocation](#85-capability-without-invocation)
  - [86. Capability without InterfaceUse](#86-capability-without-interfaceuse)
  - [87. Shared HTTP Interface](#87-shared-http-interface)
  - [88. Multiple InterfaceUses](#88-multiple-interfaceuses)
  - [89. Unknown Foreign Extension](#89-unknown-foreign-extension)
  - [90. Reference Lab Light Control](#90-reference-lab-light-control)
  - [91. Reference Lab Temperature Reading](#91-reference-lab-temperature-reading)
- [Part XII — Security and Privacy Considerations](#part-xii--security-and-privacy-considerations)
  - [92. Security Considerations](#92-security-considerations)
  - [93. Privacy Considerations](#93-privacy-considerations)
- [Part XIII — Namespace, Registry, and Evolution Considerations](#part-xiii--namespace-registry-and-evolution-considerations)
  - [94. Namespace Considerations](#94-namespace-considerations)
  - [95. Registry Considerations](#95-registry-considerations)
  - [96. Evolution and Compatibility](#96-evolution-and-compatibility)
- [Appendix A. AR-DOM Summary](#appendix-a-ar-dom-summary)
- [Appendix B. Cardinality Table](#appendix-b-cardinality-table)
- [Appendix C. Validation Error Categories](#appendix-c-validation-error-categories)
- [Appendix D. Draft 4 → Draft 5 Changes](#appendix-d-draft-4--draft-5-changes)
- [Appendix E. Non-goals](#appendix-e-non-goals)

---

# 1. Status of This Document

This document is a Working Draft of AR-XML Core 0.1 Draft 5. It is not a final standard. Implementations may use it for review and experimentation, but MUST NOT represent Draft 5 behavior as final AR-XML Core 0.1 conformance.

Draft 5 is reconstructed from the current `main` branch's Draft 4 specification and the decisions recorded in Issue #10. Earlier Draft 5 work branches are historical review material only and are not normative sources for this document.

The specification text is developed before Runtime implementation changes. A rule described here does not imply that the current Runtime implements it. Specification capability and Runtime implementation capability are distinct.

Draft 5 may introduce syntax incompatible with earlier drafts. Compatibility with an earlier draft is retained only where it does not compromise machine readability, semantic certainty, or contradiction-free extensibility.

# 2. Abstract

AR-XML is a declarative XML format for describing an AR Entity: its declared category, identifiers, properties, lightweight subjects, profile claims, shared interaction interfaces, and semantic capabilities.

AR-XML describes what an Entity declares and how an explicit request may be routed. It does not execute a capability, issue credentials, decide authorization, certify a profile claim, or make issuer-declared data an absolute truth.

Draft 5 separates:

- an Entity from its location;
- a semantic Capability from an Interface and from an Invocation;
- a semantic Result from its wire Representation;
- a shared Interface from a capability-specific InterfaceUse;
- a normative Capability Contract from an Entity-side projection;
- Entity resolution from semantic-definition resolution; and
- description data from Runtime evaluation state.

The Core defines stable semantic slots and deterministic structural rules. Domain- and transport-specific semantics are supplied by namespaced Extensions. HTTP is specified as a Standard Interface Extension rather than as Core Capability semantics.

An AR Entity may be physical, digital, active, passive, networked, disconnected, or incapable of computation. A valid document may describe an Entity with no Capability or Interface. AI or LLM assistance may be used by applications, but deterministic parsing, validation, resolution-state reporting, and conformance evaluation MUST NOT require AI.

# 3. Conformance and Normative Language

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **NOT RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in BCP 14 (RFC 2119 and RFC 8174) when, and only when, they appear in all capitals.

Normative requirements apply only to the conformance class named or clearly implied by their context. Part X defines the conformance classes used by this specification.

XML fragments, data-model diagrams, algorithms, and examples are normative only where the surrounding text explicitly states a requirement. Otherwise they are informative illustrations. An example does not weaken a normative rule.

Conformance is evaluated in distinct layers:

1. **Core structural validity** determines whether an AR-XML document obeys the Core grammar and Core reference rules.
2. **Extension validity** is determined separately for each understood Extension.
3. **Capability projection validation** compares an Entity-side Capability projection with its resolved Capability Contract.
4. **Profile conformance** evaluates an Entity against a resolved Profile.
5. **Runtime availability** evaluates whether an explicit invocation attempt is locally ready, unavailable, or indeterminate.

Success or failure in one layer MUST NOT be silently substituted for a result in another layer. In particular:

```text
Core validity ≠ Extension support
Profile Claim ≠ Verified Conformance ≠ Certification
Profile Conformance ≠ Runtime Availability
Availability ≠ Authorization ≠ Execution
```

When the Core permits a foreign Extension element but the processor does not understand it, the document remains Core-valid if the element occurs in a permitted Extension Slot. Unsupported or unknown semantics MUST be reported through the applicable extension, validation, or evaluation state; they MUST NOT be guessed.

# 4. Scope

AR-XML Core 0.1 Draft 5 defines:

- the abstract Core Information Model for an AR Entity;
- the XML serialization of that model under the AR-XML Core namespace;
- explicit Extension Slots and rules for foreign namespaced content;
- Capability Contract identity and Entity-side projection semantics;
- Profile claims and the conceptual Profile conformance model;
- semantic identifier and registry resolution principles;
- Core structural validation and layered processing;
- Runtime evaluation states without embedding mutable Runtime state in the description;
- conformance classes; and
- the baseline HTTP Standard Interface Extension.

AR-XML is declarative. It may describe a possible interaction, but parsing or loading a document MUST NOT initiate that interaction.

Conceptually:

```text
ARRuntime.load()
= Resolve Entity / Fetch / Parse / Validate / Expose
```

Here, `Resolve Entity` means locating the requested AR-XML resource through an Entity Resolver. It does not mean resolving every semantic identifier, authenticating a party, deciding authorization, or invoking a Capability.

A side-effecting operation MUST begin only in response to an explicit request from an Application or Human. The act of fetching an AR-XML document is a load-time network operation, not a described Capability invocation.

The Core supports physical and passive Entities. An Entity remains valid when it has no CPU, network connection, API, Interface, Capability, or current Runtime presence.

The following are outside the scope of the Draft 5 Core:

- robot manipulation semantics;
- a general connector ontology;
- relation inference or component hierarchy;
- an AI planner or skill/workflow language;
- credential issuance, storage, refresh, or authorization enforcement;
- a new transport protocol;
- reimplementation of W3C WoT, GS1, OPC UA, or Asset Administration Shell;
- a generic mapping DSL;
- a JSON serialization of AR-XML;
- automatic execution during loading; and
- a mandatory centralized registry.

Extensions and separate specifications MAY address out-of-scope domains, but MUST NOT redefine Core semantics.

# 5. Design Principles

## 5.1 Priority Order

When requirements conflict, Draft 5 uses this priority order:

1. Machine readability
2. Semantic certainty
3. Future extensibility without contradiction
4. Convenience
5. Compatibility with the current specification

Backward syntax compatibility with earlier drafts is not guaranteed. Unnecessary changes SHOULD nevertheless be avoided.

## 5.2 Separation of Concerns

The following separations are fundamental:

```text
Entity ≠ Location
Capability ≠ Interface
Capability ≠ Invocation
Description ≠ Execution
Resolution ≠ Authentication
Authentication ≠ Authorization
Availability ≠ Authorization ≠ Execution
Spec Capability ≠ Runtime Implementation Capability
Profile Claim ≠ Verified Conformance ≠ Certification
Capability Contract ≠ Entity-side Capability Projection
Interface ≠ InterfaceUse
Identifier ≠ Locator ≠ Canonical Entity Identity
Result ≠ Representation
```

A processor MUST NOT infer equality between concepts separated above unless another applicable specification supplies an explicit, deterministic rule.

## 5.3 Declarative and Non-executing

An AR-XML document describes issuer declarations and possible interactions. It is not executable code. Loading, parsing, validating, inspecting, resolving semantic definitions, or evaluating availability MUST NOT automatically invoke a described Capability.

## 5.4 Capability-oriented, Transport-independent Core

A Capability denotes a semantic function or functional affordance. It is not an API endpoint, HTTP method, BLE characteristic, WoT affordance, or invocation attempt. Transport-specific realizations and mappings belong to Extensions.

When one semantic Capability Contract is available through multiple transports, the normal model is one Capability with multiple InterfaceUses. A producer SHOULD NOT duplicate the Capability solely to represent each transport.

## 5.5 Shared Interfaces and Explicit Use

An Interface is an Entity-shared interaction surface or realization context. An InterfaceUse states that a particular Capability uses a referenced Interface, optionally with an Extension-defined Mapping.

An Interface MAY exist without a Capability. A Capability MAY exist without an Invocation or InterfaceUse. Interface and InterfaceUse document order MUST NOT imply preference.

## 5.6 Extensible but Closed Core

The Core vocabulary is closed: unknown Core-namespace elements and unknown Core or unqualified attributes are invalid. Extensibility is explicit: foreign namespaced elements are accepted only in defined Extension Slots.

Core validation and Extension-specific validation are separate. A processor SHOULD preserve an unknown Extension subtree as opaque data when practical.

## 5.7 Deterministic Interoperability

Deterministic interoperability and conformance evaluation MUST NOT depend on AI, an LLM, heuristic semantic matching, or human interpretation at processing time. An application MAY use such assistance outside normative processing, but MUST distinguish assisted conclusions from conformant deterministic results.

## 5.8 Safe Uncertainty

Lack of knowledge is not proof of incompatibility or readiness. Unknown semantics, unresolved definitions, or unsupported evaluators produce the specified indeterminate state, such as `UNVALIDATED`, `UNKNOWN`, or `UNDETERMINED`; they MUST NOT be guessed into a definitive result.

# 6. Terminology

**AR Entity**  
The single Entity described by the root `ar-entity` element. It may be physical or digital, active or passive.

**AR-DOM**  
The abstract, implementation-independent data model exposed after successful Core parsing and validation. It is not the browser DOM.

**Application**  
A consumer that loads, inspects, evaluates, or explicitly requests use of an AR Entity's Capability through a Runtime.

**Attachment**  
An explicit Interface Extension Slot for a physical, spatial, or contact-oriented access boundary. If present, it contains exactly one foreign Extension semantic root.

**Availability**  
A Runtime evaluation of whether an invocation attempt is locally `READY`, `UNAVAILABLE`, or `UNKNOWN`. Availability does not grant authorization or predict execution success.

**Capability**  
An Entity-side declaration of a semantic function or functional affordance, identified locally by `id` and semantically by `type`. It is an explicit local projection of a Capability Contract when that Contract is resolved.

**Capability Contract**  
An exact-versioned normative semantic definition of a Capability, including any Invocation inputs, Result outputs, Requirements, constraints, and Extension semantics. It contains no Interface or transport binding.

**Canonical Entity Identity**  
An identity selected under an explicit identity policy. Core does not automatically derive it from an Identifier or Locator.

**Category**  
An optional issuer-declared classification of the described Entity. It is descriptive metadata, not a Capability, Profile, identity, or proof of conformance.

**Core**  
The vocabulary, information model, XML grammar, and processing requirements defined by this specification under the AR-XML Core namespace.

**Entity Resolver**  
A component that maps an Entity identity or other application-supplied entity reference to an AR-XML location. It does not resolve Capability Contracts or Profiles and does not execute Capabilities.

**Execution**  
The performance of an operation after an explicit invocation request. Execution is outside document loading and may have side effects.

**Extension**  
A specification using a non-Core XML namespace to define semantics within an Extension Slot.

**Extension Slot**  
A Core-defined location in which foreign namespaced Extension content is permitted. The principal slots include Property-related extension areas, Requirement bodies, Attachment, Realization, Mapping, and constraint areas defined by later sections.

**Identifier**  
An issuer-declared typed identifier value, optionally scoped to a Subject. It is not automatically a Locator, credential, or Canonical Entity Identity.

**Interface**  
An Entity-shared interaction surface or realization context with a document-local `id`, optional Attachment, optional Realization, and zero or more Requirements. An Interface must contain an Attachment or Realization.

**InterfaceUse**  
A Capability's reference to a shared Interface, optionally containing an Extension-defined Mapping. More than one InterfaceUse may reference the same Interface.

**Invocation**  
An optional request-oriented interaction contract containing zero or more Inputs and an optional Result. An empty Invocation is valid. Observation, subscription, event, and stream semantics are not generalized into Invocation by the Core.

**Locator**  
Information used to locate a resource or interaction target. A URI-shaped Identifier is not necessarily a Locator.

**Mapping**  
An explicit InterfaceUse Extension Slot describing how a Capability uses a referenced Interface. If present, it contains exactly one foreign Extension semantic root.

**Profile**  
An exact-versioned interoperability constraint set over Capability Contracts and other Entity characteristics. A Profile may narrow applicable semantics but may not widen, weaken, or redefine them.

**Profile Claim**  
An issuer declaration that the Entity conforms to the Profile identified by `conforms-to/@href`. It is not verified conformance or certification.

**Projection**  
The Entity-side Capability declaration compared with a resolved Capability Contract. It is explicit document content; Contract content is not structurally merged into AR-XML.

**Property**  
An issuer-declared typed characteristic or state value, with an optional unit. It is not guaranteed absolute truth or current Runtime state.

**Realization**  
An explicit Interface Extension Slot for a concrete interaction mechanism. If present, it contains exactly one foreign Extension semantic root.

**Representation**  
A declared wire or media representation of a Result. Its order does not imply preference.

**Requirement**  
A typed prerequisite declaration with Extension-defined data. Placement determines scope: a Capability Requirement is a Capability prerequisite; an Interface Requirement is an Interface prerequisite.

**Result**  
The semantic result contract of an Invocation, containing zero or more Outputs and zero or more Representations. Result and Representation are distinct.

**Runtime**  
A processor that may load AR-XML, expose AR-DOM, resolve definitions, evaluate routes, and perform explicitly requested invocations according to its implemented capabilities and policies.

**Semantic Identifier**  
An identifier denoting a semantic definition. It is identity, not necessarily a network location. Capability Contract and Profile identifiers are exact-versioned absolute identifiers.

**Semantic Registry**  
A component that maps a Semantic Identifier to a semantic definition using one or more sources and detects conflicting definitions. It is separate from an Entity Resolver.

**Subject**  
A lightweight document-local target descriptor with required `id` and optional `type`. It is neither a nested Entity nor a component hierarchy. If `Capability.subjectRef` is absent, the described Entity itself is the subject.

---

# Part I — Core Information Model

# 7. Core Model Overview

The Core Information Model describes one AR Entity. The following tree is normative with respect to containment and cardinality:

```text
AR Entity
├─ Category?                         0..1
├─ Identifiers*                      0..*
│  └─ Identifier
│     ├─ type                        1
│     ├─ value                       1
│     └─ subjectRef?                 0..1
├─ Properties*                       0..*
│  └─ Property
│     ├─ type                        1
│     ├─ value                       1
│     └─ unit?                       0..1
├─ Subjects*                         0..*
│  └─ Subject
│     ├─ id                          1
│     └─ type?                       0..1
├─ ProfileClaims*                    0..*
│  └─ ConformsTo
│     └─ href                        1
├─ Interfaces*                       0..*
│  └─ Interface
│     ├─ id                          1
│     ├─ Attachment?                 0..1
│     ├─ Realization?                0..1
│     └─ Requirements*               0..*
└─ Capabilities*                     0..*
   └─ Capability
      ├─ id                          1
      ├─ type                        1
      ├─ subjectRef?                 0..1
      ├─ Requirements*               0..*
      ├─ Invocation?                 0..1
      │  ├─ Inputs*                  0..*
      │  └─ Result?                  0..1
      │     ├─ Outputs*              0..*
      │     └─ Representations*      0..*
      └─ InterfaceUses*              0..*
         └─ InterfaceUse
            ├─ ref                   1
            └─ Mapping?              0..1
```

`?` denotes zero or one occurrence and `*` denotes zero or more occurrences. The plural labels in this conceptual tree identify collections; Part II defines their XML containers.

Every item in the model is description data. Runtime observations, resolved definitions, validation results, support information, credentials, authorization decisions, selected routes, invocation state, and execution results are not mutable children of the AR Entity model.

All collections MAY be empty. Consequently, an empty or passive AR Entity is valid. Core validity MUST NOT depend on the described Entity having a processor, power source, network connection, API, or executable Capability.

The Core has no Relation collection in Draft 5. A Subject reference expresses only the explicit scoping defined in Sections 10, 12, and 14; it MUST NOT be interpreted as a general relation, ownership graph, component hierarchy, or containment inference.

# 8. AR Entity

An AR Entity is the sole top-level object described by an AR-XML document. The document root remains `ar-entity`; the Core does not introduce an `ar-document`, `entities`, or equivalent wrapper.

The AR Entity MAY contain the optional Category and any number of Identifiers, Properties, Subjects, Profile Claims, Interfaces, and Capabilities defined by this Part. The absence of any or all optional content does not make the Entity incomplete or invalid.

An AR Entity is not a network location. The location from which its AR-XML representation was obtained is document retrieval context, not an implicit Identifier, Property, Interface, or Canonical Entity Identity.

A processor MUST NOT infer that the Entity is digital, active, online, controllable, or capable of executing code merely because an AR-XML document describes it. Physical objects, printed objects, passive tags, connector-only objects, and objects with no computation are valid AR Entities.

The issuer of a document is responsible for its declarations. Core parsing establishes structure, not the truth, provenance, authority, freshness, safety, or certification of those declarations.

# 9. Category

Category is an optional, issuer-declared classification of the described Entity. It has one non-empty string value.

Category is descriptive metadata. A consumer MUST NOT use Category as a substitute for:

- an Identifier or Canonical Entity Identity;
- a Capability type or Capability Contract;
- a Profile Claim or verified Profile conformance;
- an Interface or Runtime availability; or
- an authorization decision.

The Core does not define a closed Category vocabulary and does not infer hierarchy, equivalence, or compatibility between Category values. A separate vocabulary or Profile MAY constrain Category values without changing the Core meaning of Category.

An Entity has at most one Core Category. Applications requiring additional classifications MAY use an appropriate Extension or declared Properties.

# 10. Identifier

An Identifier is an issuer-declared typed identifier value. It consists of:

```text
Identifier
├─ type        1
├─ value       1
└─ subjectRef? 0..1
```

`type` is a non-empty Semantic Identifier naming the identifier scheme or identifier semantics. `value` is the non-empty lexical identifier value under that scheme. The Core does not enumerate or redefine schemes such as GTIN, VIN, MAC, IPv6, or IMEI.

If `subjectRef` is absent, the Identifier applies to the described Entity. If present, it MUST reference the `id` of a Subject in the same document and the Identifier applies to that Subject.

The same `type` MAY occur in more than one Identifier. Multiple occurrences do not imply that the values are equivalent, aliases, ordered by preference, or jointly form a composite identifier unless the identified scheme or an applicable Profile explicitly defines that meaning.

Core processors MUST NOT automatically infer any of the following from an Identifier:

- Canonical Entity Identity;
- an AR-XML or network Locator;
- a dereferenceable resource;
- an authentication credential;
- authorization;
- ownership; or
- trust.

A Semantic Identifier may itself use URI syntax. URI syntax alone does not make the Identifier's `value` or `type` a network location that must be fetched.

# 11. Property

A Property is an issuer-declared characteristic or state of the described Entity or of the Entity description. It consists of:

```text
Property
├─ type  1
├─ value 1
└─ unit? 0..1
```

`type` is a non-empty Semantic Identifier that defines the meaning and value interpretation of the Property. `value` is the declared lexical value. `unit`, when present, is a non-empty identifier or term whose interpretation is defined by the Property vocabulary, applicable Profile, or Extension.

A Property declaration is not an assertion of absolute truth. Core validity does not establish that a Property is accurate, current, observed, verified, or authoritative. Applications that require provenance, timestamps, confidence, signatures, or observation semantics MUST obtain them from an applicable Extension or external mechanism.

More than one Property MAY use the same `type`. Document order and repetition do not imply priority, recency, aggregation, or conflict resolution. The Property definition or an applicable Profile MAY impose additional deterministic constraints.

The Core does not add direct latitude or longitude fields. A stable declared location MAY be expressed by a Geo Extension or another suitable semantic Property definition. The current position of a moving Entity belongs in Runtime Context or may be obtained through a Capability such as `position.read`; it MUST NOT be inferred from Entity resolution or document retrieval location.

# 12. Subject

A Subject is a lightweight document-local target descriptor. It consists of:

```text
Subject
├─ id    1
└─ type? 0..1
```

`id` is a non-empty local identifier unique within the document's Subject collection. `type`, when present, is a Semantic Identifier describing the Subject's kind.

A Subject is not a nested AR Entity, embedded AR-XML document, component description, relation node, ownership assertion, or hierarchy. It does not inherit or contain Category, Identifiers, Properties, Profile Claims, Interfaces, or Capabilities.

Subjects exist only so that Core declarations with a `subjectRef` can explicitly scope themselves to a lightweight described target. The absence of a Subject collection is valid.

A Runtime-selected target is invocation data and MUST be modeled as an Invocation Input when selection occurs per request. It MUST NOT be represented by mutating `Capability.subjectRef` or by treating `subjectRef` as a Runtime variable.

# 13. Profile Claim

A Profile Claim is an issuer declaration that the described Entity conforms to an identified Profile. Its information item is:

```text
ConformsTo
└─ href 1
```

`href` MUST be an exact-versioned absolute Semantic Identifier for a Profile. A moving alias such as `latest` MUST NOT be used as normative Profile identity.

The same Profile MAY be claimed more than once only when the resulting declarations are semantically identical; producers SHOULD avoid redundant claims. Document order MUST NOT imply priority.

A Profile Claim is data supplied by the issuer. It is not proof that the Profile resolved, that conformance was evaluated, that the Entity is conformant, or that a third party certified it.

```text
Profile Claim
≠ Profile Resolution
≠ Verified Conformance
≠ Certification
```

Profile resolution and conformance states are defined separately in Parts V and VIII.

# 14. Capability

A Capability is an Entity-side declaration of a semantic function or functional affordance. It consists of:

```text
Capability
├─ id             1
├─ type           1
├─ subjectRef?    0..1
├─ Requirements*  0..*
├─ Invocation?    0..1
└─ InterfaceUses* 0..*
```

`id` is a non-empty local identifier unique within the document's Capability collection. `type` MUST be the exact-versioned absolute Semantic Identifier of the Capability Contract implemented by the Entity-side projection.

If `subjectRef` is absent, the subject of the Capability is the described Entity itself. If present, it MUST reference the `id` of a Subject in the same document.

Capability denotes what function or affordance is declared. It is not:

- an Interface or transport binding;
- an endpoint, HTTP method, BLE characteristic, or WoT affordance;
- an invocation request or execution record;
- proof of Runtime support, availability, authorization, or successful execution; or
- the normative Capability Contract itself.

A Capability MAY omit Invocation. A Capability MAY omit all InterfaceUses. Either omission is valid and may represent a descriptive, non-request-oriented, not-currently-routable, or externally realized semantic capability.

When multiple InterfaceUses implement the same Capability Contract, they are alternative or additional routes for the one Capability. A producer SHOULD NOT duplicate the Capability solely because HTTP, BLE, a physical connector, or another realization is also available.

The Entity-side Capability is an explicit local projection of its Capability Contract. Contract content is not implicitly copied or structurally merged into the AR-XML document. Projection rules are defined in Part IV.

# 15. Invocation

Invocation is an optional request-oriented interaction contract of a Capability. It consists of:

```text
Invocation
├─ Inputs* 0..*
└─ Result? 0..1
```

An empty Invocation is valid. It states that the Capability has a request-oriented interaction shape without declaring Core Inputs or a Core Result. It does not mean that loading the document should perform a request.

Inputs describe semantic values supplied by the caller for a specific invocation. Result describes the semantic result expected from that invocation. Neither defines the transport serialization; Interface Extensions and InterfaceUse Mappings perform that role.

Invocation is intentionally not a general interaction-pattern abstraction. Observation, subscription, event, notification, and stream semantics are not forced into Invocation. A future Core revision or Extension MAY define those patterns without changing the request-oriented meaning defined here.

The presence of Invocation does not guarantee an InterfaceUse, Runtime implementation support, authorization, route availability, or successful execution.

# 16. Input, Result, Output, and Representation

## 16.1 Core Data Types

Input and Output use one of the following Core structural data types:

```text
string
number
integer
boolean
binary
object
array
```

These types describe data shape, not domain meaning. A semantic name, Capability Contract, unit, format, or Extension supplies domain semantics. A processor MUST NOT infer, for example, that a `number` is a temperature or that a `string` uses `text/plain` representation.

## 16.2 Input

An Input is a semantic value supplied by the caller. Its Core information is:

```text
Input
├─ name        1
├─ type        1
├─ required?   0..1, default false
├─ format?     0..1
├─ unit?       0..1
└─ constraints 0..*
```

`name` is a non-empty semantic field name unique among Inputs in the same Invocation. `type` is one Core data type. `required`, when absent, is `false`. `format`, `unit`, and constraints refine interpretation but MUST NOT contradict the Input semantics defined by the resolved Capability Contract.

Input constraints are expressed only in the explicit constraint area defined by Parts II and III. Unknown constraint semantics affect projection or Runtime evaluation as specified later; they MUST NOT be guessed.

## 16.3 Result

Result is the semantic result contract of an Invocation. It consists of:

```text
Result
├─ Outputs*         0..*
└─ Representations* 0..*
```

An empty Result is valid. Result is distinct from a successful Runtime execution result, HTTP response, decoded payload, or Capability error.

Draft 5 Core does not include the Draft 4 `errors` collection in the Entity-side Result model. Semantic error definitions and mappings require an applicable Capability Contract or Extension and MUST NOT be inferred solely from transport status.

## 16.4 Output

An Output is a semantic value in a Result. Its Core information is:

```text
Output
├─ name        1
├─ type        1
├─ format?     0..1
├─ unit?       0..1
└─ constraints 0..*
```

`name` is a non-empty semantic field name unique among Outputs in the same Result. `type` is one Core data type. `format`, `unit`, and constraints refine interpretation but MUST NOT contradict the Output semantics defined by the resolved Capability Contract.

An Output is not a wire field until an applicable Mapping defines or the relevant Interface Extension specifies that correspondence.

## 16.5 Representation

A Representation declares a concrete media representation of the Result as a whole. It has a required `mediaType` value identifying an IANA media type and MAY contain only the additional Core information explicitly defined by Part II.

```text
Result ≠ Representation
```

One Representation MAY carry multiple Outputs. Conversely, declaring a single Output does not permit a processor to assume a scalar wire representation.

Representation document order MUST NOT imply preference. Selection, when supported, is based on explicit caller preference, Runtime support, applicable Interface Extension rules, and Entity declarations.

Multiple Representations SHOULD describe materially equivalent Result content. A summary, translation, simplified version, or other semantic transformation is not automatically an alternative Core Representation of the same Result.

# 17. Requirement

A Requirement is a typed prerequisite declaration. It consists of:

```text
Requirement
├─ type                   1
└─ extension-defined data 0..1
```

`type` is a non-empty Semantic Identifier identifying the Requirement semantics. The Core does not define a closed `kind` enumeration. An Extension-defined body, when present, supplies data governed by the Requirement definition and Extension processing rules.

Requirement scope is determined by placement:

```text
Capability.Requirements
→ prerequisites for the Capability

Interface.Requirements
→ prerequisites for use of the Interface
```

A producer MUST NOT use a Core `scope` value to override placement.

Authentication and authorization prerequisites MAY be declared as Requirements. AR-XML does not issue, store, refresh, disclose, or enforce credentials or authorization. A document MUST NOT embed passwords, session identifiers, bearer tokens, refresh tokens, private keys, API secrets, or equivalent secrets in Requirement data or elsewhere in AR-XML.

A Requirement is description data, not current Runtime state. It does not assert that the prerequisite is presently satisfied. Runtime evaluation uses `SATISFIED`, `UNSATISFIED`, or `UNKNOWN` as defined in Part VIII.

An unknown Requirement type or unknown Requirement Extension does not by itself invalidate a Core-valid document:

```text
Core validity = valid
RequirementEvaluation = UNKNOWN
```

This uncertainty MUST NOT be converted into authorization or treated as satisfied.

# 18. Interface and InterfaceUse

## 18.1 Interface

An Interface is an Entity-shared interaction surface or realization context. It consists of:

```text
Interface
├─ id            1
├─ Attachment?   0..1
├─ Realization?  0..1
└─ Requirements* 0..*
```

`id` is a non-empty local identifier unique within the document's Interface collection.

Attachment describes a physical, spatial, or contact-oriented access boundary. Realization describes a concrete interaction mechanism. Their specific semantics are defined by foreign namespaced Extensions, not by Core. Examples include connector descriptions, BLE realizations, HTTP APIs, or WoT-based realizations.

An Interface MUST contain at least one of Attachment or Realization:

```text
Attachment absent
AND Realization absent
→ invalid Interface
```

An Attachment-only Interface and a Realization-only Interface are both valid. This permits descriptions such as a passive HDMI connector without requiring a Capability, network API, or executable operation.

If Attachment or Realization is present, its wrapper contains exactly one foreign namespaced Extension semantic root. Part III defines Extension processing and validation.

An Interface MAY exist even when no Capability references it. Interface order MUST NOT imply preference.

## 18.2 InterfaceUse

InterfaceUse declares how a specific Capability uses a shared Interface. It consists of:

```text
InterfaceUse
├─ ref      1
└─ Mapping? 0..1
```

`ref` MUST reference the `id` of an Interface in the same document. A dangling reference is a Core structural error.

Mapping, when present, contains exactly one foreign namespaced Extension semantic root that describes the Capability-specific use of the referenced Interface. A plain InterfaceUse with no Mapping is valid when the Interface realization or applicable Extension semantics require no capability-specific mapping.

One Capability MAY contain more than one InterfaceUse with the same `ref`. This supports multiple mappings or uses of the same shared Interface. Processors MUST NOT collapse such InterfaceUses merely because their `ref` values match.

InterfaceUse order MUST NOT imply route preference. Route support and availability are evaluated independently for each applicable InterfaceUse and aggregated as defined in Part VIII.

## 18.3 Separation Rules

Interface and InterfaceUse MUST remain distinct:

```text
Interface
= shared attachment / realization context

InterfaceUse
= capability-specific reference and optional mapping
```

A Capability Contract MUST NOT contain Interface, InterfaceUse, Attachment, Realization, Mapping, endpoint, or transport information. Those items describe an Entity implementation projection and its available interaction routes, not the normative semantic function.

---

# Part II — XML Serialization

# 19. XML Namespace and Version

The AR-XML Core 0.1 namespace is:

```text
https://relink.dev/ns/arxml/core/0.1
```

Draft 5 documents MUST use this namespace as the namespace name of every Core element. Examples use it as the default namespace.

The root `version` attribute is REQUIRED and its value for this draft is exactly:

```text
0.1-draft5
```

The namespace identifies the Core 0.1 vocabulary family; `version` makes the Draft 5 grammar machine-distinguishable from earlier grammars that used the same provisional namespace. A processor MUST NOT interpret `version="0.1"`, `version="0.1-draft4"`, or an absent version as Draft 5.

Extension elements MUST use a non-Core namespace. Namespace prefix spelling has no semantic significance. A namespace declaration is not an information-model attribute.

Core processors MUST perform namespace-aware XML processing. Matching an element by local name while ignoring its namespace is non-conforming.

# 20. Root Element

The document element MUST be `ar-entity` in the Core namespace. No Core wrapper is permitted around it.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1-draft5">
  <!-- Core children, if any -->
</ar-entity>
```

An empty Entity is valid:

```xml
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1-draft5" />
```

The root permits only the Core children defined in Section 21 and the required unqualified `version` attribute. Unknown Core-namespace children and unknown unqualified or Core-namespace attributes are invalid.

Foreign namespaced children are not accepted directly under `ar-entity`. They are permitted only in the explicit Extension Slots defined by Part III.

# 21. Core Containers and Child Order

## 21.1 Singleton Containers

The following optional collection containers may occur directly under `ar-entity`, each at most once:

```text
identifiers
properties
subjects
profiles
interfaces
capabilities
```

`category` is an optional singleton value element, not a collection container, and may occur at most once.

Repeating a singleton container is invalid even when one occurrence is empty. An empty collection container is valid and has the same collection cardinality as absence. Canonical serializers SHOULD omit empty collection containers.

Nested singleton containers defined by this Part, including `requirements`, `invocation`, `inputs`, `result`, `outputs`, `representations`, `interface-uses`, `attachment`, `realization`, `mapping`, and `constraints`, may each occur no more than once within their owning element unless a later section explicitly states otherwise.

## 21.2 Order-insensitive Validation

The order of permitted Core child elements is not semantically significant for Core validation. A validator MUST accept permitted children in any order, subject to cardinality and containment rules.

Collection item order is preserved as document data but MUST NOT imply preference, priority, recency, fallback, or execution order unless an applicable non-Core specification explicitly defines such semantics.

## 21.3 Canonical Serializer Order

A canonical Draft 5 serializer MUST emit root children in this order when present:

```text
category
identifiers
properties
subjects
profiles
interfaces
capabilities
```

Within a Capability it MUST emit:

```text
requirements
invocation
interface-uses
```

Within an Interface it MUST emit:

```text
attachment
realization
requirements
```

Canonical order provides stable output; it does not change the order-insensitive validation rule and does not assign preference to collection items.

## 21.4 Closed Core Content

Core elements that contain only attributes MUST NOT contain element children or non-whitespace character data. Core container elements MUST NOT contain non-whitespace character data. The `category` element is the only Core element in this Part whose value is element character data.

Unless explicitly declared by this specification:

- an unknown Core-namespace element is invalid;
- an unknown unqualified attribute on a Core element is invalid;
- an unknown Core-namespace attribute is invalid; and
- a foreign namespaced element is invalid outside an Extension Slot.

Foreign subtree content inside an Extension Slot is governed by Part III rather than by Core child grammar.

# 22. Category Serialization

Category is serialized as the character content of `category`:

```xml
<category>environment.sensor</category>
```

`category` MUST contain a non-empty value after excluding XML markup-only whitespace. It MUST NOT contain child elements or attributes.

Core does not otherwise normalize Category content. Producers SHOULD avoid leading or trailing whitespace. Vocabulary-specific comparison and normalization are outside Core unless an applicable Profile defines them.

# 23. Identifier Serialization

Identifiers are serialized in the optional `identifiers` container:

```xml
<identifiers>
  <identifier
    type="https://example.org/identifier-schemes/asset-id/1"
    value="A-1042" />

  <identifier
    type="https://example.org/identifier-schemes/serial/1"
    value="S-77"
    subject-ref="sensor-module" />
</identifiers>
```

Each `identifier` MUST have the unqualified attributes `type` and `value`. It MAY have `subject-ref`. No other Core or unqualified attributes or Core children are permitted.

`type` and `value` MUST be non-empty. When present, `subject-ref` MUST be non-empty and MUST match the `id` of a `subject` in the same document. A forward reference is valid; a dangling reference is invalid after whole-document validation.

More than one `identifier` MAY use the same `type`. Identifier order has no Core preference semantics.

# 24. Property Serialization

Properties are serialized in the optional `properties` container:

```xml
<properties>
  <property
    type="https://example.org/properties/manufacturer/1"
    value="Example Devices" />

  <property
    type="https://example.org/properties/rated-voltage/1"
    value="5"
    unit="V" />
</properties>
```

Each `property` MUST have the unqualified attributes `type` and `value`. It MAY have `unit`. No other Core or unqualified attributes or Core children are permitted by this Part.

`type` and `value` MUST be non-empty. When present, `unit` MUST be non-empty. Core preserves lexical values and does not coerce them into a numeric, boolean, date, location, or other Runtime type without an applicable semantic definition.

More than one `property` MAY use the same `type`. Property order has no Core preference or recency semantics.

# 25. Subject Serialization

Subjects are serialized in the optional `subjects` container:

```xml
<subjects>
  <subject
    id="sensor-module"
    type="https://example.org/subject-types/sensor/1" />
</subjects>
```

Each `subject` MUST have the unqualified `id` attribute and MAY have `type`. It MUST NOT contain child elements or non-whitespace character data.

`id` MUST be non-empty and unique within the document's Subject collection. `type`, when present, MUST be non-empty. Subject IDs and Interface IDs or Capability IDs occupy separate typed collections; the same lexical value MAY occur in different typed collections.

Subject serialization does not permit nested `ar-entity`, `subjects`, relationship, component, or hierarchy content.

# 26. Capability Serialization

Capabilities are serialized in the optional `capabilities` container:

```xml
<capabilities>
  <capability
    id="temperature-read"
    type="https://example.org/capabilities/temperature/read/1"
    subject-ref="sensor-module">

    <requirements />
    <invocation />
    <interface-uses />
  </capability>
</capabilities>
```

Each `capability` MUST have the unqualified attributes `id` and `type`. It MAY have `subject-ref`. `id` MUST be non-empty and unique within the document's Capability collection. `type` MUST be a non-empty exact-versioned absolute Capability Contract identifier.

When present, `subject-ref` MUST match a Subject ID in the same document. When absent, the described Entity is the subject.

The only Core children of `capability` are optional singleton `requirements`, `invocation`, and `interface-uses`. All three MAY be absent. A Capability without Invocation and a Capability without InterfaceUse are valid.

# 27. Invocation and Result Serialization

## 27.1 Invocation and Inputs

Invocation is serialized as the optional `invocation` child of a Capability. An empty element is valid:

```xml
<invocation />
```

Inputs, when present, are serialized in one `inputs` container:

```xml
<invocation>
  <inputs>
    <input
      name="on"
      type="boolean"
      required="true" />
  </inputs>
</invocation>
```

Each `input` MUST have `name` and `type`. It MAY have `required`, `format`, and `unit`. Input `name` values MUST be non-empty and unique within that Invocation. `type` MUST be one of `string`, `number`, `integer`, `boolean`, `binary`, `object`, or `array`.

If `required` is absent its value is `false`. If present, its lexical value MUST be exactly `true` or `false`. `format` and `unit`, when present, MUST be non-empty.

An `input` MAY contain one optional `constraints` Extension Slot. The slot contains foreign namespaced constraint elements as defined by Part III. No other children are permitted.

## 27.2 Result and Outputs

Result is serialized as the optional `result` child of `invocation`. An empty Result is valid.

```xml
<result>
  <outputs>
    <output
      name="temperature"
      type="number"
      unit="Cel" />
  </outputs>

  <representations>
    <representation media-type="application/json" />
  </representations>
</result>
```

`result` MAY contain one `outputs` container and one `representations` container. Each `output` MUST have `name` and `type` and MAY have `format` and `unit`. Output `name` values MUST be non-empty and unique within that Result. Output `type`, `format`, and `unit` follow the Input rules above, except Output has no Core `required` attribute.

An `output` MAY contain one optional `constraints` Extension Slot. No other children are permitted.

Draft 5 Core has no `errors` child in `result`. An `errors` element in the Core namespace is invalid.

## 27.3 Representations

Each `representation` MUST have exactly one Core-defined attribute, `media-type`, whose non-empty value is an IANA media type:

```xml
<representations>
  <representation media-type="application/json" />
  <representation media-type="text/plain" />
</representations>
```

A `representation` MUST NOT contain Core or foreign child elements. Representation order does not express preference.

# 28. Requirement Serialization

Requirements are serialized in an optional `requirements` container owned by either a Capability or an Interface:

```xml
<requirements>
  <require type="https://example.org/requirements/authentication/1">
    <auth:oauth2
      xmlns:auth="https://example.org/ns/auth/1"
      scope="light.write" />
  </require>
</requirements>
```

Each `require` MUST have the unqualified `type` attribute. `type` MUST be non-empty. No Core `kind` or `scope` attribute is defined.

The `require` element is an Extension Slot. It MAY be empty. If it contains semantic data, it MUST contain exactly one foreign namespaced semantic root; that foreign subtree is processed under Part III. Non-whitespace character data directly inside `require` is invalid.

Placement determines scope. The identical XML shape under a Capability declares a Capability prerequisite; under an Interface it declares an Interface prerequisite.

# 29. Interface and InterfaceUse Serialization

## 29.1 Interface

Interfaces are serialized in the optional root-level `interfaces` container:

```xml
<interfaces>
  <interface id="web-api">
    <realization>
      <http:api
        xmlns:http="https://relink.dev/ns/arxml/http/0.1"
        base="./api/" />
    </realization>
  </interface>
</interfaces>
```

Each `interface` MUST have the unqualified `id` attribute. It MUST be non-empty and unique within the Interface collection. The only Core children are optional singleton `attachment`, optional singleton `realization`, and optional singleton `requirements`.

At least one of `attachment` or `realization` MUST be present. Therefore `<interface id="x"/>` and an Interface containing only `requirements` are invalid.

`attachment` and `realization` are explicit Extension wrappers. Each wrapper, when present, MUST contain exactly one foreign namespaced semantic root and no direct non-whitespace character data.

An Attachment-only Interface is valid:

```xml
<interface id="display-port">
  <attachment>
    <phys:connector
      xmlns:phys="https://example.org/ns/physical/1"
      type="hdmi" />
  </attachment>
</interface>
```

## 29.2 InterfaceUse

InterfaceUses are serialized inside a Capability's optional `interface-uses` container:

```xml
<interface-uses>
  <interface-use ref="web-api">
    <mapping>
      <http:operation
        xmlns:http="https://relink.dev/ns/arxml/http/0.1"
        method="POST"
        path="light/state" />
    </mapping>
  </interface-use>
</interface-uses>
```

Each `interface-use` MUST have the unqualified `ref` attribute. `ref` MUST be non-empty and match an Interface ID in the same document. A forward reference is permitted; a dangling reference is invalid after whole-document validation.

`interface-use` MAY contain one `mapping` wrapper. `mapping`, when present, MUST contain exactly one foreign namespaced semantic root and no direct non-whitespace character data.

A plain reference is valid:

```xml
<interface-use ref="display-port" />
```

More than one InterfaceUse in the same Capability MAY have the same `ref`. InterfaceUse order does not express preference.

# 30. Profile Claim Serialization

Profile Claims are serialized in the optional `profiles` container:

```xml
<profiles>
  <conforms-to href="https://example.org/profiles/reference-lab/1" />
</profiles>
```

Each `conforms-to` MUST have the unqualified `href` attribute and no child elements or non-whitespace character data. `href` MUST be a non-empty exact-versioned absolute Profile identifier. Relative references and moving version aliases such as `latest` are invalid as normative Profile identity.

Profile Claim order does not express preference, verification status, or certification level.

# Part III — Extension Model

Sections 31–36 are reserved for the staged Extension Model draft.

# Part IV — Capability Contracts

Sections 37–41 are reserved for the staged Capability Contracts draft.

# Part V — Profiles

Sections 42–49 are reserved for the staged Profiles draft.

# Part VI — Semantic Identification and Resolution

Sections 50–55 are reserved for the staged Semantic Identification and Resolution draft.

# Part VII — Validation and Processing

Sections 56–60 are reserved for the staged Validation and Processing draft.

# Part VIII — Runtime Evaluation

Sections 61–70 are reserved for the staged Runtime Evaluation draft.

# Part IX — Standard Extensions / HTTP

Sections 71–75 are reserved for the staged HTTP Extension draft.

# Part X — Conformance Classes

Sections 76–80 are reserved for the staged Conformance Classes draft.

# Part XI — Examples

Sections 81–91 are reserved for the staged Examples draft.

# Part XII — Security and Privacy Considerations

Sections 92–93 are reserved for the staged Security and Privacy draft.

# Part XIII — Namespace, Registry, and Evolution Considerations

Sections 94–96 are reserved for the staged Namespace, Registry, and Evolution draft.

# Appendix A. AR-DOM Summary

_To be specified in a later staged update._

# Appendix B. Cardinality Table

_To be specified in a later staged update._

# Appendix C. Validation Error Categories

_To be specified in a later staged update._

# Appendix D. Draft 4 → Draft 5 Changes

_To be specified in a later staged update._

# Appendix E. Non-goals

_To be specified in a later staged update._
