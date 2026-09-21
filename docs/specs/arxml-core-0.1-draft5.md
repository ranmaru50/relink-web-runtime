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

# 31. Extension Architecture

AR-XML Core defines a closed vocabulary and a finite set of explicit Extension Slots. An Extension supplies domain-, device-, attachment-, constraint-, security-, or transport-specific semantics in a foreign XML namespace.

An Extension MUST NOT redefine, weaken, or contradict Core semantics. In particular, an Extension MUST NOT:

- change the meaning or cardinality of a Core information item;
- make an invalid Core structure valid;
- reinterpret a Core `id`, reference, data type, or Semantic Identifier;
- turn document order into preference where Core declares order insignificant;
- treat description as execution;
- equate availability with authorization or execution success; or
- cause document loading to invoke a Capability.

An Extension MAY add semantics only through a slot that permits its semantic root. The same foreign namespace MAY define roots for more than one slot, but each root's meaning is determined by both its expanded XML name and its slot context.

Extension specifications SHOULD define:

- a stable, versioned namespace URI;
- the Extension roots permitted in each slot;
- child and attribute grammar;
- semantic meaning and constraints;
- Extension-specific validation errors;
- processor support criteria;
- interaction with Capability Contracts and Profiles; and
- Runtime evaluation behavior where applicable.

Namespace prefix text is not semantic identity. Processors MUST identify an Extension element by namespace URI and local name, not by prefix.

The presence of Extension content does not establish that a Runtime implements it. Specification-defined Extension capability and Runtime implementation capability remain distinct.

# 32. Extension Slots

## 32.1 Defined Slots

Draft 5 Core defines the following Extension Slots:

| Slot | XML location | Foreign semantic roots | Purpose |
|---|---|---:|---|
| Property slot | direct child of `properties` | 0..* | Extension-defined Entity characteristics or declared state |
| Requirement body | direct child of `require` | 0..1 | Data for the Requirement identified by `require/@type` |
| Attachment | direct child of `attachment` | exactly 1 | Physical, spatial, or contact-oriented access boundary |
| Realization | direct child of `realization` | exactly 1 | Concrete interaction mechanism |
| Mapping | direct child of `mapping` | exactly 1 | Capability-specific use of an Interface |
| Constraint area | direct child of `constraints` | 1..* | Extension-defined constraints on an Input or Output |

`attachment`, `realization`, and `mapping` are explicit Core wrappers. If a wrapper is present but contains no foreign semantic root, it is invalid. If it contains more than one foreign semantic root, it is invalid.

`constraints` is also an explicit Core wrapper. If present, it MUST contain at least one foreign namespaced constraint element. Multiple constraint roots are allowed because each root may state an independently evaluable constraint.

The `properties` container is both the collection container for Core `property` elements and the Property Extension Slot. It MAY contain Core `property` children and foreign namespaced property roots in any order. Each foreign child is one Extension-defined property item; it does not become a Core `Property` and is not assigned implicit Core `type`, `value`, or `unit` fields.

Example:

```xml
<properties
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  xmlns:geo="https://example.org/ns/arxml/geo/1">

  <property
    type="https://example.org/properties/site-name/1"
    value="Reference Lab" />

  <geo:declared-location
    latitude="35.6812"
    longitude="139.7671" />
</properties>
```

The Core does not define a generic `extensions` container and does not permit arbitrary foreign content at the root or inside other Core elements. New Extension Slots require a future Core revision.

## 32.2 Slot Envelope Validation

Core validation checks the envelope of an Extension Slot:

- that the slot occurs in a permitted Core location;
- that wrapper cardinality is satisfied;
- that each semantic root uses a non-Core namespace; and
- that no prohibited direct character data or extra Core content occurs.

Core validation does not validate the internal grammar or domain meaning of a foreign subtree. That is Extension-specific validation.

An Extension root in the Core namespace is never foreign content, even if a processor does not recognize its local name. It is an unknown Core element and is invalid.

## 32.3 No Foreign Attribute Escape

Extension Slots admit foreign elements, not arbitrary foreign attributes on Core elements. A foreign namespaced attribute attached to a Core element is invalid unless a future Core revision explicitly defines that attribute location as an Extension Slot.

Attributes on a foreign Extension element are part of the foreign subtree and are governed by that Extension.

# 33. Attachment

Attachment describes a physical, spatial, contact-oriented, or otherwise direct access boundary associated with an Interface. The `attachment` wrapper MUST contain exactly one foreign namespaced semantic root.

```xml
<interface
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  id="display-connector">

  <attachment>
    <phys:connector
      xmlns:phys="https://example.org/ns/arxml/physical/1"
      family="hdmi"
      form="type-a" />
  </attachment>
</interface>
```

Core does not define connector families, pinouts, orientation, mating rules, spatial tolerances, safety limits, or compatibility. Those semantics belong to the Attachment Extension.

Attachment does not imply that the Interface supports programmatic Invocation. An Attachment-only Interface is valid and may describe a passive connector, contact point, marker, access region, or other non-network boundary.

An Attachment Extension MUST NOT implicitly create a Capability, Capability Contract, Invocation, or InterfaceUse. Such Core declarations must remain explicit where applicable.

Document order of Interfaces or Attachment content MUST NOT be treated as preference unless the Extension itself defines ordering inside its foreign subtree.

# 34. Realization

Realization describes the concrete interaction mechanism shared by an Interface. The `realization` wrapper MUST contain exactly one foreign namespaced semantic root.

```xml
<interface
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  id="web-api">

  <realization>
    <http:api
      xmlns:http="https://relink.dev/ns/arxml/http/0.1"
      base="./api/" />
  </realization>
</interface>
```

A Realization Extension may define transport-, protocol-, or mechanism-level configuration shared by every applicable InterfaceUse. Capability-specific operation information belongs in Mapping, not Realization.

Realization MUST NOT redefine the semantic function, Inputs, Result, Outputs, Requirements, or constraints of a Capability Contract. It describes how an Entity exposes an interaction surface, not what the Capability means.

The presence of a Realization does not prove that a Runtime supports it, that its target is reachable, that authentication succeeds, or that any Capability is authorized or executable.

An Interface has at most one Realization wrapper. If an Entity exposes distinct realization contexts, it SHOULD declare distinct Interfaces and reference them through the applicable InterfaceUses.

# 35. Mapping

Mapping describes how one Capability uses a referenced Interface. The `mapping` wrapper occurs only inside `interface-use` and MUST contain exactly one foreign namespaced semantic root.

```xml
<interface-use
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  ref="web-api">

  <mapping>
    <http:operation
      xmlns:http="https://relink.dev/ns/arxml/http/0.1"
      method="POST"
      path="light/state" />
  </mapping>
</interface-use>
```

Mapping is capability-specific. Shared connection or mechanism configuration belongs in the referenced Interface's Realization.

A Mapping Extension MAY define deterministic correspondence between semantic Invocation data and the mechanism represented by the Interface. It MUST NOT:

- rename a semantic Input or Output in the Core model;
- change a Core data type;
- remove a required Contract Input;
- weaken or redefine Contract constraints;
- change the subject of the Capability;
- embed credentials or secrets; or
- create a generic executable workflow.

Core does not define a generic mapping DSL. Mapping semantics are owned by the specific Interface Extension, such as the HTTP Extension in Part IX.

A Mapping is optional. A plain `interface-use` reference is valid when the applicable Interface Extension needs no capability-specific data.

Multiple InterfaceUses MAY reference the same Interface, including multiple InterfaceUses in one Capability. Each InterfaceUse and Mapping remains a separate route description; processors MUST NOT merge them merely because `ref` values or Extension root names match.

# 36. Unknown Extension Processing

## 36.1 Core Validity

An unknown or unsupported foreign namespaced Extension does not invalidate a document at the Core layer when all of the following are true:

1. its semantic root occurs in a permitted Extension Slot;
2. the Core slot envelope and cardinality are valid;
3. the element is in a non-Core namespace; and
4. surrounding Core structure is valid.

Conversely, foreign content outside a permitted Extension Slot is a Core structural error even if a processor recognizes the foreign namespace.

```text
recognized Extension outside its slot
→ Core invalid

unknown Extension inside its slot
→ Core valid
```

## 36.2 Layered Validation

Processors MUST distinguish at least these outcomes:

```text
Core structural validation
Extension recognition and support
Extension-specific validation
Runtime evaluation
```

An Extension-specific validation failure does not retroactively change the result of Core structural validation. It makes the Extension instance invalid for processors claiming that Extension's conformance class.

An unknown Extension has no Extension-specific validity result from that processor. The processor MUST NOT guess its semantics from local names, attribute names, human-readable text, namespace similarity, or AI inference.

For an unknown Requirement body, Core validity remains valid and Requirement evaluation is `UNKNOWN`. Runtime consequences for unknown Realization, Mapping, constraints, and other semantics are defined in Part VIII.

## 36.3 Opaque Preservation

A Core processor that exposes or reserializes Extension content SHOULD preserve an unknown foreign subtree as opaque extension data where practical. Preservation SHOULD retain:

- namespace URI and local name for every element and attribute;
- attribute values;
- character data;
- child element order; and
- namespace bindings required to reserialize the subtree.

The original namespace prefix, attribute order, quote style, entity spelling, comments, processing instructions, and byte-for-byte lexical form are not Core semantic data. Applications that require XML signatures or exact lexical round trips need a separate byte-preservation mechanism.

A processor MUST NOT silently convert an unknown Extension subtree into a known Core item, discard it while claiming lossless round-trip support, or execute it as code.

## 36.4 Resolution and Trust

An Extension namespace URI is an identifier and need not be fetched from the network. Recognizing or resolving an Extension specification does not authenticate the document issuer, establish trust, grant authorization, or prove Runtime support.

```text
Extension identification
≠ Extension support
≠ Extension validity
≠ Trust
≠ Authorization
≠ Execution
```

# Part IV — Capability Contracts

# 37. Capability Contract Model

A Capability Contract is the versioned normative semantic source for one kind of Capability. It defines what the Capability means independently of any Entity, Interface, transport, endpoint, Runtime, or current availability state.

The conceptual model is:

```text
CapabilityContract
├─ identifier                 1
├─ invocation?                0..1
│  ├─ inputs*                 0..*
│  └─ result?                 0..1
│     └─ outputs*             0..*
├─ requirements*              0..*
├─ constraints*               0..*
└─ extension semantics*       0..*
```

The Contract `identifier` is its exact-versioned Semantic Identifier. Contract Invocation, Input, Result, Output, Requirement, and constraint concepts have the same semantic roles as their Entity-side counterparts, but the Contract is normative and the Entity declaration is a projection.

A Contract MAY omit Invocation. If it contains Invocation, that Invocation MAY contain no Inputs and no Result. The absence of Invocation MUST NOT be generalized into event, observation, subscription, or stream semantics.

A Contract Input definition may normatively define:

- name;
- Core data type;
- requiredness;
- format;
- unit;
- constraints; and
- Extension semantics.

A Contract Output definition may normatively define:

- name;
- Core data type;
- format;
- unit;
- constraints; and
- Extension semantics.

Contract Requirements are semantic prerequisites. Contract constraints and Extension semantics MUST define deterministic comparison behavior if they are intended to participate in conformant automated projection validation.

Human-readable explanation MAY accompany a Contract, but prose, labels, examples, or AI interpretation MUST NOT replace machine-readable normative fields required for deterministic interoperability.

## 37.1 Excluded Implementation Information

A Capability Contract MUST NOT contain Entity implementation routing information, including:

- Interface or InterfaceUse;
- Attachment, Realization, or Mapping;
- HTTP methods, paths, endpoints, or headers;
- BLE services or characteristics;
- connector instances;
- Entity-local IDs or Subject references;
- credentials; or
- current Runtime state.

Such information belongs to an Entity-side projection, Interface Extension, Runtime Context, or credential system as applicable.

This specification defines the normative Contract information model and its use in AR-XML processing. A concrete Contract document serialization or registry protocol MAY be defined separately, but MUST preserve these semantics.

# 38. Contract Identity and Resolution

## 38.1 Exact Versioned Identity

Every Capability Contract MUST have an exact-versioned absolute Semantic Identifier. An Entity-side `capability/@type` MUST identify that exact Contract.

```xml
<capability
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  id="temperature-read"
  type="https://example.org/capabilities/temperature/read/1">
  <invocation />
</capability>
```

An identifier such as `https://example.org/capabilities/temperature/read/latest` MUST NOT be used as normative Contract identity. A discovery service MAY offer a latest-version query, but it must return an exact identifier before deterministic resolution or validation.

Two different exact-versioned identifiers denote different Contract identities even when a registry reports compatibility. A processor MUST NOT substitute one version for another without an explicit rule and application policy outside Core validation.

## 38.2 Identity Is Not Location

A Contract identifier identifies semantic content; it is not necessarily a network location. URI syntax does not require HTTP dereferencing.

A Semantic Registry MAY resolve a Contract from built-in definitions, a local registry, cache, application-provided registry, installed Extension or plugin, or network source. Resolution source does not change Contract identity.

```text
Contract identifier
≠ network location
≠ retrieval requirement
≠ trust assertion
```

## 38.3 Resolution Result

Contract resolution has two Core evaluation states:

```text
RESOLVED
UNRESOLVED
```

`RESOLVED` means that exactly one usable semantic definition has been selected for the exact identifier under the active registry policy. `UNRESOLVED` means no usable definition was selected, including when no definition is available or conflicting definitions prevent deterministic selection.

If multiple non-equivalent definitions claim the same exact identifier, a resolver MUST NOT silently select the first result. It MUST report the conflict and produce `UNRESOLVED` unless an external trust policy deterministically rejects all but one candidate before semantic resolution.

An unresolved Contract does not make a structurally valid AR-XML document invalid. The Capability remains exposed as description data, but its projection cannot be fully validated.

Resolution does not authenticate the Contract publisher or Entity issuer, establish trust, grant authorization, or prove Runtime support.

# 39. Entity-side Capability Projection

An Entity-side Capability is an explicit local implementation projection of the Capability Contract identified by `capability/@type`.

```text
Capability Contract
= normative semantic source

Entity-side Capability
= explicit local implementation projection
```

Projection content consists only of information explicitly present in the AR-XML Capability. A processor MUST NOT copy, inject, or structurally merge omitted Contract fields into AR-DOM as though they appeared in the Entity document.

Resolved Contract data MAY be exposed separately and used for validation or caller assistance. The processor MUST preserve the distinction between:

- issuer-authored Entity projection data;
- resolved Contract definition data; and
- derived validation results.

Entity-local `id`, `subject-ref`, InterfaceUses, Mappings, and Interface Requirements are implementation description and are not members of the Capability Contract. They are not compared as Contract fields.

Capability Requirements, Invocation, Inputs, Result, Outputs, Representations where constrained by the Contract, and constraint Extension data are projection material. They MUST NOT redefine or weaken Contract semantics.

A structurally valid Capability may omit Invocation or InterfaceUses. Structural validity is independent of projection compatibility. For example, omitting Invocation is Core-valid but is a projection conflict if the resolved Contract requires an Invocation projection.

There is no implicit fallback from missing Entity projection data to Contract data. If required projection information is absent, validation reports the applicable state; invocation code MUST NOT pretend the missing information was serialized in AR-XML.

# 40. Projection Compatibility

## 40.1 General Rule

Projection validation compares an Entity-side Capability with the exact resolved Contract identified by its `type`.

The Entity projection MUST preserve Contract meaning. It MAY narrow Contract semantics only when the Contract explicitly permits that kind of narrowing and the processor understands the applicable comparison rules.

```text
redefinition
→ CONFLICT

semantic weakening or widening
→ CONFLICT

known Contract-permitted narrowing
→ compatible

unknown comparison semantics
→ UNVALIDATED
```

Similarity of names, natural-language descriptions, common usage, or AI-generated equivalence is not sufficient for compatibility.

## 40.2 Invocation Shape

If a Contract requires Invocation and the Entity projection omits Invocation, the projection is `CONFLICT`. If a Contract has no Invocation, an Entity projection MUST NOT add a request-oriented Invocation unless the Contract explicitly permits it.

An Entity may project an empty Invocation only when that shape is compatible with the Contract. Empty Invocation does not satisfy a Contract that requires named Inputs or Result content.

## 40.3 Inputs

Inputs are matched by exact name. Unless the Contract explicitly declares an extensibility rule:

- a missing required Contract Input is `CONFLICT`;
- an additional Entity Input not defined by the Contract is `CONFLICT`;
- a different Core data type is `CONFLICT`;
- weakening requiredness is `CONFLICT`;
- strengthening requiredness is compatible only when the Contract explicitly permits that narrowing;
- incompatible format or unit is `CONFLICT`; and
- an unknown format, unit, or constraint comparison is `UNVALIDATED` unless another known conflict exists.

Processors MUST NOT apply implicit type coercion during projection validation. In particular:

```text
boolean → string
→ CONFLICT

integer → number
→ not assumed compatible
```

A Contract may explicitly define a permitted subtype or coercion relationship, but a processor may use it only when it implements that deterministic rule.

## 40.4 Result and Outputs

Contract Outputs are matched by exact name. Unless an explicit Contract rule states otherwise:

- a missing Contract Output is `CONFLICT`;
- an additional Entity Output is `CONFLICT`;
- a different Core data type is `CONFLICT`;
- incompatible format or unit is `CONFLICT`; and
- unknown constraint comparison is `UNVALIDATED` unless another known conflict exists.

Result and Representation remain distinct. If a Contract or its Extension semantics constrain permitted Representations, an Entity may select a subset only when that selection is an allowed narrowing. Representation document order is never part of projection compatibility.

## 40.5 Requirements

An Entity projection MUST NOT omit, weaken, or contradict a Contract Requirement. Additional Entity Capability Requirements are compatible only when the Contract permits that form of narrowing and their semantics can be deterministically compared.

Interface Requirements are not Contract projection fields. They may add route-specific prerequisites without changing Capability Contract meaning, and are evaluated separately for each InterfaceUse route.

Authentication and authorization Requirement comparison does not authenticate a caller, grant authorization, or validate credentials.

## 40.6 Constraints

For each understood constraint, the processor MUST use the comparison relation defined by its Contract or Extension specification.

Examples:

```text
Contract range: 0..100
Entity range: 0..80
Contract explicitly permits range narrowing
→ compatible

Contract range: 0..100
Entity range: -10..100
→ CONFLICT

Contract constraint: understood
Entity constraint: comparison semantics unknown
→ UNVALIDATED
```

A processor MUST NOT treat lexical similarity as semantic subset comparison. Unknown constraint semantics are not proof of conflict and are not permission to assume compatibility.

# 41. Projection Validation States

Projection validation produces exactly one state for each Entity-side Capability relative to its identified Contract:

```text
VALIDATED
UNVALIDATED
CONFLICT
```

**VALIDATED** means the exact Contract resolved and every applicable projection comparison was deterministically evaluated as equal or as a Contract-permitted narrowing.

**UNVALIDATED** means compatibility could not be fully determined. Causes include an unresolved Contract, an unsupported constraint evaluator, unknown Extension semantics, or another comparison for which the processor lacks a deterministic rule.

**CONFLICT** means at least one known semantic contradiction, redefinition, weakening, widening, or prohibited projection difference was detected.

State aggregation follows this precedence:

```text
if any known comparison is conflicting
→ CONFLICT

else if Contract is unresolved
     or any required comparison is unknown
→ UNVALIDATED

else
→ VALIDATED
```

A known conflict is not hidden by another unknown comparison. Conversely, lack of an evaluator does not by itself prove conflict.

Examples:

```text
required Input missing
→ CONFLICT

boolean projected as string
→ CONFLICT

known allowed narrowing
→ VALIDATED

unknown constraint comparison semantics
→ UNVALIDATED
```

Projection state is derived Runtime evaluation data, not AR-XML description data. A processor SHOULD expose the state with diagnostics identifying the compared Contract, affected field or constraint, and reason without mutating the Capability declaration.

`VALIDATED` does not imply Profile conformance, Runtime support, availability, authorization, certification, or execution success. `CONFLICT` makes routes for that Capability unavailable under Part VIII. `UNVALIDATED` contributes uncertainty rather than automatic availability or automatic rejection.

# Part V — Profiles

# 42. Profile Model

A Profile is a versioned deterministic interoperability constraint set. It states which semantic contracts and Entity characteristics are required or permitted for a defined interoperability context.

A Profile is not a Capability Contract and MUST NOT define a new meaning for a Capability. It references Capability Contracts by exact-versioned identity and may add only compatible constraints.

The conceptual model is:

```text
ProfileDefinition
├─ identifier                    1
├─ capabilityRequirements*       0..*
├─ propertyRequirements*         0..*
├─ identifierRequirements*       0..*
├─ interfaceRequirements*        0..*
├─ requirementPolicies*          0..*
└─ extensionPolicy?              0..1
```

Profile `identifier` is the Profile's exact-versioned absolute Semantic Identifier.

A Profile definition MAY constrain:

- presence of Capabilities identified by exact Capability Contract identifiers;
- Capability subjects;
- Invocation Inputs and Result Outputs;
- permitted Result Representations;
- Properties and Identifiers;
- Interface, InterfaceUse, Attachment, Realization, and Mapping characteristics;
- Requirement policy; and
- permitted, required, or prohibited Extensions.

Every normative constraint intended for automated conformance evaluation MUST have deterministic machine-readable semantics. Human-readable prose MAY explain a Profile but MUST NOT be the sole source for a required automated comparison.

This specification defines the Profile information model and evaluation semantics. A concrete Profile document serialization or registry protocol MAY be defined separately, but MUST preserve these semantics.

## 42.1 Profile Claim Separation

An AR-XML `conforms-to` item is a Profile Claim made by the document issuer. The Profile definition is an independently resolved semantic object.

```text
Profile Claim
≠ Profile Definition
≠ Profile Resolution
≠ Profile Conformance Result
≠ Certification
```

A processor MAY evaluate an Entity against a Profile even when the Entity does not claim that Profile. Conversely, the existence of a claim MUST NOT change the evaluation algorithm or force a `CONFORMANT` result.

# 43. Profile Identity and Resolution

## 43.1 Exact Versioned Identity

A Profile identifier and every `conforms-to/@href` used as normative identity MUST be an exact-versioned absolute Semantic Identifier.

Moving aliases such as `latest`, an unversioned family identifier, and relative references MUST NOT be treated as normative Profile identity. Discovery may begin with such a query only if it resolves to an exact identifier before conformance evaluation.

Different exact identifiers denote different Profile versions. A processor MUST NOT substitute a newer, older, or allegedly compatible Profile version without an explicit external selection policy.

## 43.2 Resolution

Profile resolution uses the common Semantic Registry model defined in Part VI. A Profile may be obtained from a built-in source, local registry, cache, application-provided registry, installed Extension or plugin, or network source. URI syntax does not require network dereferencing.

Profile resolution has two states:

```text
RESOLVED
UNRESOLVED
```

`RESOLVED` means exactly one usable Profile definition has been selected for the exact identifier. `UNRESOLVED` includes absence of a definition and conflicting non-equivalent definitions that cannot be deterministically disambiguated.

A resolver MUST NOT silently use the first of multiple conflicting definitions. An unresolved Profile Claim remains issuer-declared description data, but verified conformance for that Profile is `UNDETERMINED`.

Resolution does not authenticate the Profile publisher or Entity issuer, establish trust, grant authorization, certify an Entity, or prove Runtime support.

# 44. Capability Requirements

## 44.1 Presence

Each Profile Capability Requirement identifies one exact-versioned Capability Contract and declares one presence value:

```text
required
optional
```

Draft 5 defines no `recommended`, weighted, preferred, prohibited, or conditional presence value.

For `required`, at least one Entity-side Capability matching the exact Contract identifier and applicable subject constraints MUST be present. If none is present, the Entity is `NON_CONFORMANT`.

For `optional`, absence does not affect conformance. If a matching Capability is present and is used to satisfy that Profile item, it MUST satisfy every applicable Profile constraint; `optional` does not mean unconstrained or exempt from validation.

Document order of Entity Capabilities and order of Profile requirements MUST NOT be used to select a preferred match. When more than one Capability is eligible, the Profile definition MUST provide deterministic matching or cardinality rules if one particular match matters.

## 44.2 Capability Contract and Projection

A Capability Requirement references a Capability Contract; it MUST NOT copy and redefine that Contract's semantic meaning.

For a Capability to satisfy a Profile requirement:

1. its `type` MUST equal the required exact Contract identifier;
2. the Contract MUST resolve when Contract-dependent constraints must be evaluated;
3. its Entity-side projection MUST not be `CONFLICT`; and
4. all Profile constraints applicable to that Capability MUST be satisfied or deterministically evaluated according to Section 49.

A Profile MAY require `VALIDATED` projection. If it does not explicitly require that state, an `UNVALIDATED` projection still causes `UNDETERMINED` whenever unresolved or unknown semantics could affect whether the Capability satisfies the Profile.

## 44.3 Subject Constraints

A Profile MAY constrain whether a Capability applies to the described Entity or to a Subject meeting deterministic criteria. It MUST NOT treat Subject as a nested Entity or infer a component hierarchy.

Runtime-selected targets are Invocation Inputs and MUST NOT be matched as static `subjectRef` values.

## 44.4 Invocation, Result, and Representation Constraints

A Profile MAY narrow Contract-permitted Invocation, Input, Result, Output, and Representation choices. It MUST NOT:

- add a semantic Input or Output that changes the Contract;
- remove a required Contract Input or Output;
- change a Core data type, unit, format, or meaning;
- weaken requiredness or constraints;
- convert Result into Representation or transport data; or
- use Representation order as preference.

Any Profile narrowing is valid only under Section 48.

# 45. Property and Identifier Requirements

## 45.1 Property Requirements

A Property Requirement identifies Property semantics by exact `type` and defines deterministic presence, value, unit, cardinality, or constraint rules as needed by the Profile.

Because Core permits multiple Properties with the same `type`, a Profile MUST state deterministic matching and cardinality rules whenever the existence of multiple candidates affects conformance. It MUST NOT assume that the first Property is preferred, newest, authoritative, or unique.

A Profile MAY require a Property to be present or constrain a known vocabulary-defined value. It MUST NOT transform an issuer-declared Property into verified truth or current Runtime state.

Unknown Property vocabulary or unsupported comparison semantics produce `UNDETERMINED` when they are required to decide conformance. A known missing required Property or known violated Property constraint produces `NON_CONFORMANT`.

## 45.2 Identifier Requirements

An Identifier Requirement identifies an identifier scheme by exact `type` and defines deterministic presence, subject, value-shape, or cardinality rules.

Because Core permits multiple Identifiers with the same `type`, a Profile MUST define how candidates are matched when multiplicity matters. Identifier order has no preference semantics.

A Profile MUST NOT infer Canonical Entity Identity, a Locator, a credential, authentication, authorization, ownership, or trust from an Identifier unless a separate applicable specification defines an explicit deterministic rule. Such a rule does not alter the Core meaning of Identifier.

An unknown required identifier scheme or unsupported validator produces `UNDETERMINED`; a known missing required Identifier or known violation produces `NON_CONFORMANT`.

# 46. Interface Requirements

A Profile MAY constrain Entity implementation characteristics needed for interoperability, including:

- presence of an Interface;
- required Attachment or Realization Extension roots;
- Interface Requirements;
- existence of an InterfaceUse from a matching Capability;
- Mapping Extension roots; and
- deterministically defined Extension-specific characteristics.

Interface Requirements constrain the Entity implementation projection. They MUST NOT be inserted into, or treated as part of, the referenced Capability Contract.

A Profile may require that a Capability have one or more InterfaceUse routes satisfying specified characteristics. Matching is based on explicit InterfaceUse references and Extension semantics, never on collection order.

A Profile MUST NOT equate an Interface's presence with Runtime support or availability. A conformant Entity may describe an Interface that a particular Runtime cannot use.

Unknown or unsupported Interface Extension semantics yield `UNDETERMINED` when they are necessary to decide a required Interface constraint. A known absence or known incompatible characteristic yields `NON_CONFORMANT`.

Profiles SHOULD constrain standardized Interface Extensions rather than reproduce transport-specific vocabulary. They MUST NOT create a generic mapping DSL or redefine Attachment, Realization, or Mapping roles.

# 47. Requirement and Extension Policies

## 47.1 Requirement Policy

A Profile MAY require the presence or absence of identified Requirement types, constrain understood Requirement data, or state policy for additional Requirements.

A Profile MUST NOT remove, weaken, or contradict a Requirement imposed by a Capability Contract. It MAY add a stricter prerequisite only when the Contract permits that narrowing and the Requirement semantics are deterministically comparable.

Capability Requirements and Interface Requirements remain scoped by placement. A Profile MUST NOT treat a route-specific Interface Requirement as though it changed the semantic Capability Contract.

Profile evaluation of an authentication or authorization Requirement is a conformance check on declarations. It does not authenticate a caller, validate a live credential, grant authorization, or enforce access.

If a required Requirement type or body is unknown to the evaluator, conformance is `UNDETERMINED` unless a separate known violation already determines `NON_CONFORMANT`.

## 47.2 Extension Policy

A Profile's optional Extension policy MAY identify:

- Extension namespaces or semantic roots that are required;
- Extension namespaces or roots that are permitted;
- Extension namespaces or roots that are prohibited;
- slots in which they may be used; and
- Extension-specific validation or support requirements.

Extension policy MUST NOT permit foreign content outside a Core Extension Slot or make an invalid slot envelope valid.

The policy MUST distinguish document presence, Extension-specific validity, and Runtime support. Requiring an Extension declaration does not prove that a Runtime implements it.

If the Profile requires semantics from an unknown Extension, conformance is `UNDETERMINED`, not guessed `CONFORMANT` or `NON_CONFORMANT`. If the Profile deterministically prohibits the Extension and it is present, the result is `NON_CONFORMANT` even if the evaluator does not understand the Extension's internal semantics.

# 48. Profile Narrowing Rules

A Profile may narrow a Capability Contract or other referenced semantic definition only when all of the following hold:

1. the referenced exact definition is resolved;
2. that definition permits the kind of narrowing;
3. the Profile constraint denotes a semantic subset of the permitted behavior or values;
4. the comparison relation is deterministic and implemented; and
5. the narrowing does not redefine names, types, units, formats, Requirements, or behavioral meaning.

Examples:

```text
Contract range: 0..100
Contract permits range narrowing
Profile range: 0..80
→ permitted narrowing

Contract representations: image/jpeg or image/png
Contract permits representation subset
Profile representation: image/jpeg
→ permitted narrowing

Contract unit: m/s
Profile interprets the same value as km/h
→ redefinition; prohibited

Contract Input type: boolean
Profile Input type: string
→ redefinition; prohibited

Constraint comparison semantics unknown
→ narrowing not established
```

A Profile MUST NOT widen accepted values, weaken required Inputs or Requirements, add contradictory alternatives, or redefine the meaning of a Contract term.

A narrower-looking lexical form is not sufficient. Unit conversion, subtype relationships, range inclusion, format compatibility, and Extension constraints require explicit semantic comparison rules.

When narrowing cannot be established because required semantics or comparison support are unknown, evaluation uses `UNDETERMINED`. It MUST NOT silently accept the constraint as compatible.

# 49. Profile Conformance

Profile conformance has exactly three results:

```text
CONFORMANT
NON_CONFORMANT
UNDETERMINED
```

**CONFORMANT** means the exact Profile resolved and every applicable required comparison was deterministically satisfied.

**NON_CONFORMANT** means at least one known Profile requirement was violated. Examples include a missing required Capability, a known projection conflict, a missing required Property, or a prohibited Extension.

**UNDETERMINED** means no known violation determines non-conformance, but the evaluator lacks information or deterministic support required to establish conformance. Examples include an unresolved Profile or Contract, an unknown required Extension, or unsupported constraint comparison semantics.

Aggregation follows this precedence:

```text
if Profile is unresolved
→ UNDETERMINED

else if any known requirement is violated
→ NON_CONFORMANT

else if any required evaluation is unknown
→ UNDETERMINED

else
→ CONFORMANT
```

Once the Profile is resolved, a known violation takes precedence over unrelated unknown evaluations. A processor SHOULD expose diagnostics for every evaluated requirement rather than only the aggregate result.

Core-invalid AR-XML cannot establish Profile conformance. A conformance processor MUST first report the Core validation failure and MUST NOT return `CONFORMANT` for that document.

## 49.1 Independence from Claim, Certification, and Availability

A conformance result does not modify the issuer's Profile Claim. A missing claim does not prevent evaluation, and a claim does not guarantee its result.

```text
Profile Claim
≠ Verified Profile Conformance
≠ Certification
```

Certification is an external assurance process and is not created by AR-XML or by a local conformance result.

Profile conformance is also independent of current Runtime availability:

```text
CONFORMANT + UNAVAILABLE
→ possible

NON_CONFORMANT + READY route
→ possible under Runtime policy, but not Profile-conformant

UNDETERMINED + UNKNOWN availability
→ possible
```

`CONFORMANT` does not guarantee Runtime support, connectivity, authentication, authorization, safety, remote acceptance, or execution success.

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
