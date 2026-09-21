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
  - [77. AR-XML Producer and Document Conformance](#77-ar-xml-producer-and-document-conformance)
  - [78. AR-XML Consumer Conformance](#78-ar-xml-consumer-conformance)
  - [79. Extension Conformance](#79-extension-conformance)
  - [80. Runtime and Profile Evaluator Conformance](#80-runtime-and-profile-evaluator-conformance)
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
The semantic result contract of an Invocation, containing one or more Outputs and zero or more Representations. Result and Representation are distinct.

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
      │     ├─ Outputs+              1..*
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

`number` denotes a numeric scalar shape and `integer` denotes an integral numeric scalar shape. These primitive names do not prescribe an arbitrary-precision decimal value model, a machine word size, IEEE-754 independence, or a universal range and precision policy. Numeric ranges, precision, exceptional-value handling, and wire representations belong to applicable Capability Contracts, Profiles, datatype Extensions, and transport mappings. Runtime numeric limitations remain implementation support information; this Core vocabulary alone does not require arbitrary-precision arithmetic or exact-decimal storage.

## 16.2 Input

An Input is a semantic value supplied by the caller. Its Core information is:

```text
Input
├─ name        1
├─ type        1
├─ required?   0..1, default true
├─ format?     0..1
├─ unit?       0..1
└─ constraints 0..*
```

`name` is a non-empty semantic field name unique among Inputs in the same Invocation. `type` is one Core data type. `required`, when absent, is `true`. `format`, `unit`, and constraints refine interpretation but MUST NOT contradict the Input semantics defined by the resolved Capability Contract.

Input constraints are expressed only in the explicit constraint area defined by Parts II and III. Unknown constraint semantics affect projection or Runtime evaluation as specified later; they MUST NOT be guessed.

## 16.3 Result

Result is the semantic result contract of an Invocation. It consists of:

```text
Result
├─ Outputs+         1..*
└─ Representations* 0..*
```

If `result` is present, it MUST contain at least one Output. A semantic invocation with no returned value omits Result rather than using an empty Result. Result is distinct from a successful Runtime execution result, HTTP response, decoded payload, or Capability error.

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

A Representation declares a concrete media representation of the Result as a whole. It has a required `mediaType` value containing a non-empty media type conforming to RFC 9110 media-type syntax, as specified in Section 27.3, and MAY contain only the additional Core information explicitly defined by Part II.

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
└─ extension-defined elements 0..*
```

`type` is a non-empty Semantic Identifier identifying the Requirement semantics. The Core does not define a closed `kind` enumeration. The body contains zero or more foreign Extension elements supplying data governed by the Requirement definition and Extension processing rules. Multiple body elements belong to this one Requirement; Core does not collapse them into a single root or treat each as a separate Requirement.

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

An Attachment-only Interface and a Realization-only Interface are both valid. This permits descriptions such as a passive HDMI connector without requiring a Capability, network API, or executable operation. Attachment describes the access boundary only; a concrete Invocation mechanism MUST be expressed through Realization. An InterfaceUse referencing an Attachment-only Interface remains Core-valid, but its request-oriented route is `UNAVAILABLE` under Section 66.

If Attachment or Realization is present, its wrapper contains exactly one foreign namespaced Extension semantic root. Part III defines Extension processing and validation.

Attachment and Realization describe distinct Interface aspects. When a request-oriented route references an Interface with Attachment, the declared Attachment is an applicable access prerequisite and MUST be evaluated under Section 66.5. If both Attachment and Realization are present, Attachment satisfaction and the required interaction mechanism support are cumulative conditions for that route; mere Realization support does not bypass Attachment. The Attachment Extension defines the access condition, and Core defines how its evaluation contributes to Availability. Presence alone does not prove satisfaction, programmatic invocation support, or physical safety.

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
0.1
```

The namespace and root `version="0.1"` identify the Core 0.1 family. They do not distinguish Draft 4 from Draft 5. A consumer MUST select Draft 5 processing through explicit application configuration or an out-of-band specification agreement and validate the complete Draft 5 grammar. It MUST NOT infer the draft solely from this namespace/version pair or silently fall back to another draft on validation failure. An absent version or a value other than `0.1` is invalid under the selected Draft 5 grammar.

Extension elements MUST use a non-Core namespace. Namespace prefix spelling has no semantic significance. A namespace declaration is not an information-model attribute.

Core processors MUST perform namespace-aware XML processing. Matching an element by local name while ignoring its namespace is non-conforming.

# 20. Root Element

The document element MUST be `ar-entity` in the Core namespace. No Core wrapper is permitted around it.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1">
  <!-- Core children, if any -->
</ar-entity>
```

An empty Entity is valid:

```xml
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1" />
```

The root permits only the Core children defined in Section 21 and the required unqualified `version` Core attribute, plus foreign metadata attributes under Section 32.3. Unknown Core-namespace children and unknown unqualified or Core-namespace attributes are invalid.

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

A canonical Draft 5 serializer SHOULD emit root children in this order when present:

```text
category
identifiers
properties
subjects
profiles
interfaces
capabilities
```

Within a Capability it SHOULD emit:

```text
requirements
invocation
interface-uses
```

Within an Interface it SHOULD emit:

```text
attachment
realization
requirements
```

Canonical order provides recommended stable output; it does not change the order-insensitive validation rule and does not assign preference to collection items. A different permitted child order does not invalidate a Producer conformance claim. This recommendation is not an XML byte-canonicalization or signature algorithm.

## 21.4 Closed Core Content

Core elements that contain only attributes MUST NOT contain element children or non-whitespace character data. Core container elements MUST NOT contain non-whitespace character data. The `category` element is the only Core element in this Part whose value is element character data.

Unless explicitly declared by this specification:

- an unknown Core-namespace element is invalid;
- an unknown unqualified attribute on a Core element is invalid;
- an unknown Core-namespace attribute is invalid; and
- a foreign namespaced element is invalid outside an Extension Slot.

Foreign subtree content inside an Extension Slot is governed by Part III rather than by Core child grammar. All Core elements also permit foreign namespaced metadata attributes under Section 32.3; this does not permit foreign child elements outside the defined slots.

# 22. Category Serialization

Category is serialized as the character content of `category`:

```xml
<category>environment.sensor</category>
```

`category` MUST contain a non-empty value after excluding XML markup-only whitespace. It MUST NOT contain child elements or Core/unqualified attributes. Foreign metadata attributes follow Section 32.3.

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

If `required` is absent its value is `true`. An Input is optional only when `required="false"` is explicitly present. If present, its lexical value MUST be exactly `true` or `false`. `format` and `unit`, when present, MUST be non-empty.

An `input` MAY contain one optional `constraints` Extension Slot. The slot contains foreign namespaced constraint elements as defined by Part III. No other children are permitted.

## 27.2 Result and Outputs

Result is serialized as the optional `result` child of `invocation`. If present, Result MUST contain at least one Output. A no-value invocation omits the `result` child.

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

`result` MUST contain exactly one `outputs` container with one or more `output` children and MAY contain one `representations` container. Each `output` MUST have `name` and `type` and MAY have `format` and `unit`. Output `name` values MUST be non-empty and unique within that Result. Output `type`, `format`, and `unit` follow the Input rules above, except Output has no Core `required` attribute.

An `output` MAY contain one optional `constraints` Extension Slot. No other children are permitted.

Draft 5 Core has no `errors` child in `result`. An `errors` element in the Core namespace is invalid.

## 27.3 Representations

Each `representation` MUST have exactly one Core-defined attribute, `media-type`, whose non-empty value conforms to the media-type syntax in [RFC 9110 Section 8.3.1](https://httpwg.org/specs/rfc9110.html#media.type). Core validation checks syntax, not IANA registration. Syntactically valid vendor, personal, and unregistered type/subtype names are not rejected merely because they are unregistered or unknown. Core validation MUST NOT require a registry lookup or depend on a local registration snapshot. Registration status, Runtime support, and availability are separate policy or Extension concerns; HTTP JSON baseline matching remains governed by Section 75.2.

Examples:

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
  <requirement type="https://example.org/requirements/authentication/1">
    <auth:oauth2
      xmlns:auth="https://example.org/ns/auth/1"
      scope="light.write" />
  </requirement>
</requirements>
```

Each `requirement` MUST have the unqualified `type` attribute. `type` MUST be non-empty. No Core `kind` or `scope` attribute is defined.

The `requirement` element is an Extension Slot containing zero or more foreign namespaced Extension elements. It MAY be empty or contain multiple parameter elements, including elements from different foreign namespaces. Each subtree is processed under Part III; the Requirement definition governs their combined meaning. Non-whitespace character data directly inside `requirement` is invalid. The exactly-one-root rule for Attachment, Realization, and Mapping does not apply to Requirement bodies.

For example, the following illustrates a Core-valid body with two Extension parameter elements; their domain meaning requires the identified Requirement and Extension definitions:

```xml
<requirement xmlns="https://relink.dev/ns/arxml/core/0.1"
             xmlns:access="https://example.org/ns/access/1"
             type="https://example.org/requirements/access-zone/1">
  <access:zone value="front" />
  <access:distance maximum="1" unit="m" />
</requirement>
```

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

An Extension MAY add element-based semantics only through a slot that permits its semantic root. Foreign namespaced metadata attributes on Core elements are separately permitted under Section 32.3. The same foreign namespace MAY define roots for more than one slot, but each root's meaning is determined by both its expanded XML name and its slot context.

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
| Requirement body | direct children of `requirement` | 0..* | Parameter elements for the Requirement identified by `requirement/@type` |
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

The Core does not define a generic `extensions` container and does not permit arbitrary foreign child elements at the root or inside other Core elements. Foreign metadata attributes are governed separately by Section 32.3. New Extension Slots require a future Core revision.

## 32.2 Slot Envelope Validation

Core validation checks the envelope of an Extension Slot:

- that the slot occurs in a permitted Core location;
- that wrapper cardinality is satisfied;
- that each semantic root uses a non-Core namespace; and
- that no prohibited direct character data or extra Core content occurs.

Core validation does not validate the internal grammar or domain meaning of a foreign subtree. That is Extension-specific validation.

An Extension root in the Core namespace is never foreign content, even if a processor does not recognize its local name. It is an unknown Core element and is invalid.

## 32.3 Foreign Metadata Attributes

A foreign namespaced attribute on any Core element MAY add metadata. It MUST NOT redefine Core semantics, replace a required Core attribute, change defaults or cardinalities, or override Core reference or HTTP base-resolution rules. For example, `meta:required="false"` cannot make an Input optional; only the Core unqualified `required` attribute controls that field.

Unknown foreign metadata attributes MUST NOT make an otherwise valid Core document invalid. Core validation checks XML namespace correctness and the unchanged Core rules; a recognized metadata Extension is validated separately. A processor SHOULD preserve each foreign attribute by expanded name (namespace URI and local name), its XML-processed string value, and its owning Core element, even when its semantics are unknown. A claimed lossless serializer MUST retain this metadata or disclose its inability to do so.

This permission does not admit unknown Core/unqualified attributes, foreign child elements outside slots, or executable processing instructions. Namespace declarations remain XML syntax rather than metadata attributes. Reading metadata MUST NOT trigger network retrieval or Capability execution.

Example of Core-valid metadata:

```xml
<ar-entity xmlns="https://relink.dev/ns/arxml/core/0.1"
           xmlns:meta="https://example.org/ns/metadata/1"
           version="0.1" meta:source="catalog" />
```

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

An unknown or unsupported foreign namespaced Extension element does not invalidate a document at the Core layer when all of the following are true:

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
│     └─ outputs+             1..*
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

Contract Requirements are universal normative prerequisites for the Capability. Entity Capability Requirements may add Entity-specific prerequisites under Section 40.5. The effective Capability prerequisites are the conjunction of Contract Requirements and Entity Requirements; this semantic evaluation does not structurally merge Contract data into the Entity document. Contract constraints and Extension semantics MUST define deterministic comparison behavior if they are intended to participate in conformant automated projection validation.

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

`RESOLVED` means that exactly one usable semantic definition has been selected for the exact identifier under the active registry policy. `UNRESOLVED` means no usable definition was selected, including when no definition is available, a definition is known invalid, or conflicting definitions prevent deterministic selection.

A usable Contract MUST self-identify with the requested exact-versioned absolute identifier and satisfy its declared definition format and the Contract model in Section 37. Known structural errors, forbidden transport content, missing normative data, or known internally contradictory constraints make it unusable; the resolver MUST report a definition defect rather than an Entity projection conflict. Explicitly identified but unsupported constraint semantics do not alone invalidate a definition. They can leave ContractResolution `RESOLVED` while required projection comparisons remain `UNVALIDATED` under Part IV.

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

The Entity projection MUST preserve Contract meaning. Changes to Contract-defined values or constraints MAY narrow them only when the Contract explicitly permits that kind of narrowing and the processor understands the applicable comparison rules. Entity-specific additional Requirements follow Section 40.5: their addition is compatible by default and does not require an advance Contract permission.

```text
redefinition
→ CONFLICT

semantic weakening or widening
→ CONFLICT

known Contract-permitted narrowing
→ compatible

Entity-specific additional Requirement without removal, weakening, or contradiction
→ compatible by default under Section 40.5

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

An Entity projection MUST NOT omit, weaken, or contradict a Contract Requirement. A known omission, weakening, or contradiction is `CONFLICT`. Entity-specific additional Capability Requirements, including mandatory authentication or authorization prerequisites, are compatible by default; the Contract need not explicitly authorize their addition. Mere presence of an additional prerequisite MUST NOT be classified as a projection conflict or subjected to a Contract opt-in rule.

Effective Capability Requirements are Contract Requirements plus Entity Capability Requirements, applied conjunctively. An Entity Requirement does not replace or cancel a Contract Requirement, and matching `type` identifiers alone do not establish equivalence or permit either declaration to be discarded. Processors MUST preserve each declaration's source and scope. This is semantic composition for evaluation, not structural inheritance: Contract data MUST NOT be inserted into AR-DOM, and the effective set does not repair an omitted Contract Requirement in an explicit projection.

The default compatibility of additions does not override a known contradiction with Contract semantics. If a comparison needed to determine contradiction or weakening cannot be performed, ProjectionValidation is `UNVALIDATED` unless a known conflict takes precedence. Inability to evaluate whether a standalone additional prerequisite is currently satisfied is separately `RequirementEvaluation = UNKNOWN`; it does not itself establish a projection conflict or make every additional Requirement require a Contract comparison.

Interoperability restrictions on additional Entity Requirements are evaluated through the Profile's additional Requirement policy in Section 47.1. A Profile may prohibit an otherwise compatible additional Requirement and produce `NON_CONFORMANT` without changing ProjectionValidation to `CONFLICT`. Profile silence permits additions.

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

**VALIDATED** means the exact Contract resolved and every applicable projection comparison was deterministically compatible: equal, a Contract-permitted narrowing, or an Entity-specific additional Requirement allowed by Section 40.5. Current prerequisite satisfaction and a Profile's additional Requirement policy are separate evaluations.

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

Entity-specific additional authentication Requirement,
no Contract semantics removed, weakened, or contradicted,
all other required comparisons compatible
→ VALIDATED, without Contract opt-in

the same projection under a Profile prohibiting that additional Requirement
→ ProjectionValidation remains VALIDATED;
  ProfileConformance is NON_CONFORMANT for a required policy violation
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

Profile evaluation is open-world by default. An Entity declaration that a Profile does not mention is allowed and does not affect conformance unless the Profile explicitly applies a deterministic restriction to that declaration class or scope. This default applies to additional Capabilities, Properties, Identifiers, Interfaces, Profile Claims, Requirements, and Extension content. A Profile restriction MUST state whether it prohibits presence, requires validation when present, or imposes a cardinality or matching rule.

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

`RESOLVED` means exactly one usable Profile definition has been selected for the exact identifier. `UNRESOLVED` includes absence of a definition, a rejected invalid definition, and conflicting non-equivalent definitions that cannot be deterministically disambiguated.

A usable Profile definition MUST self-identify with the requested exact-versioned absolute identifier, conform to its declared definition format and the model in Section 42, and provide machine-readable normative constraints with unambiguous scope and matching rules (including the defaults in Sections 44–45). A definition with a known structural error, missing required rule for which Core supplies no default, known prohibited redefinition or narrowing, or known mutually inconsistent constraints MUST be rejected as unusable. The resolver MUST report the definition defect separately from any Entity evaluation; an invalid Profile is not evidence of Entity non-conformance.

An unfamiliar but explicitly identified constraint language is different from a missing constraint definition. A structurally usable Profile MAY remain `RESOLVED` when referenced Contracts or constraint semantics are unresolved or unsupported. Any such uncertainty needed to establish legality of a required Profile constraint or satisfaction of the required subset MUST produce `UNDETERMINED`, never assumed compatibility. This includes unresolved narrowing comparisons. If later resolution proves the Profile itself invalid, ProfileResolution becomes `UNRESOLVED` and its conformance result is `UNDETERMINED`, with a definition-invalid diagnostic. No additional Core state domain is introduced.

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

Matching candidates are Entity-side Capabilities whose exact Contract identifier and applicable subject constraints match the Profile item. Unless the Profile explicitly declares another cardinality or matching rule, the default quantifier is existential: one candidate satisfying every applicable Profile constraint is sufficient. Document order MUST NOT select the candidate.

For `required`, the evaluator MUST aggregate candidates existentially: any satisfying candidate satisfies the item; otherwise, any candidate with unknown required matching or comparison semantics makes the item `UNDETERMINED`; otherwise, no candidates or all candidates known to fail makes the item `NON_CONFORMANT`. A failing candidate does not override another satisfying or indeterminate candidate. Candidate membership that cannot be decided MUST remain indeterminate rather than being silently excluded.

For `optional`, both absence and presence are outside the baseline required subset. Projection conflicts, unresolved Contracts, and failed or unknown comparisons for an optional Capability MUST be reported separately when evaluated, but MUST NOT by themselves change baseline Profile conformance. An Entity meeting the required subset can therefore be `CONFORMANT` even when an optional Capability has `ProjectionValidation = CONFLICT`. This does not validate that projection or make its routes available. An independently declared required constraint, including an explicit presence-conditional constraint, still applies to its stated scope; optional presence alone MUST NOT create such a constraint.

A Profile MAY explicitly require all matching candidates, a bounded cardinality, or another deterministic matching rule. If it does so, that rule governs evaluation of the item and MUST be machine-readable; it does not turn an optional item into a baseline required condition. Additional Entity Capabilities that do not match the item remain allowed under the open-world default unless the Profile explicitly restricts additional declarations.

## 44.2 Capability Contract and Projection

A Capability Requirement references a Capability Contract; it MUST NOT copy and redefine that Contract's semantic meaning.

For a Capability to satisfy a required Profile item (or a separately reported optional-item comparison):

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

Properties with the exact required `type` are matching candidates. Unless the Profile explicitly declares another deterministic cardinality or quantifier, a required Property item uses existential aggregation: any candidate satisfying all value, unit, and constraint tests satisfies the item; otherwise any indeterminate candidate makes the item `UNDETERMINED`; otherwise no candidates or all candidates known to fail makes it `NON_CONFORMANT`. The evaluator MUST use this default when a Profile omits a multiplicity rule. It MUST NOT assume that the first Property is preferred, newest, authoritative, or unique. For example, a required rated-voltage value of `5` is satisfied by candidates with values `5` and `9`, unless an explicit rule requires every candidate to equal `5`.

A Profile MAY require a Property to be present or constrain a known vocabulary-defined value. It MUST NOT transform an issuer-declared Property into verified truth or current Runtime state.

Unknown Property vocabulary or unsupported comparison semantics produce `UNDETERMINED` when they are required to decide conformance. A known missing required Property or violation of a required Property item after candidate aggregation produces `NON_CONFORMANT`.

## 45.2 Identifier Requirements

An Identifier Requirement identifies an identifier scheme by exact `type` and defines deterministic presence, subject, value-shape, or cardinality rules.

Identifiers with the exact required `type` and matching subject scope are candidates. Unless a Profile explicitly supplies another deterministic rule, a required Identifier item uses the same existential aggregation as Property items: any satisfying candidate succeeds; otherwise any candidate with unknown required membership or value comparisons yields `UNDETERMINED`; otherwise no candidates or all known failures yields `NON_CONFORMANT`. Unknown subject matching MUST NOT silently exclude a candidate. Identifier order has no preference semantics.

A Profile MUST NOT infer Canonical Entity Identity, a Locator, a credential, authentication, authorization, ownership, or trust from an Identifier unless a separate applicable specification defines an explicit deterministic rule. Such a rule does not alter the Core meaning of Identifier.

An unknown required identifier scheme or unsupported validator produces `UNDETERMINED`; a known missing required Identifier or known violation of the required item after candidate aggregation produces `NON_CONFORMANT`.

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

A Profile MAY require the presence or absence of identified Requirement types, constrain understood Requirement data, or state policy for additional Requirements. Such policies are constraints within the applicable Capability or Interface requirement item; Draft 5 adds no independent top-level Requirement-policy collection. A companion Profile serialization defines their concrete encoding.

Unless a Profile explicitly states otherwise, additional Capability or Interface Requirements are allowed. A Profile that restricts additional Requirements MUST identify the applicable owner scope and deterministic rule, such as `additional Requirements prohibited` or an explicit allowed type set. Silence in the Profile MUST NOT be interpreted as prohibition. Such a policy governs Profile interoperability, not whether the Contract grants permission to declare Entity-specific prerequisites. A known policy violation may yield `NON_CONFORMANT` while the Capability projection remains `VALIDATED`.

A Profile MUST NOT remove, weaken, or contradict a Requirement imposed by a Capability Contract. Tightening the content of an existing Contract Requirement follows the Contract-permitted narrowing rules and requires deterministic comparison. Requiring an Entity-specific additional prerequisite instead follows Section 40.5 and this Profile policy; its addition does not require advance Contract permission.

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

Extension policy MUST NOT permit foreign child elements outside a Core Extension Slot or make an invalid slot envelope valid. Foreign metadata attributes remain subject to Section 32.3.

The policy MUST distinguish document presence, Extension-specific validity, and Runtime support. Requiring an Extension declaration does not prove that a Runtime implements it.

If the Profile requires semantics from an unknown Extension, conformance is `UNDETERMINED`, not guessed `CONFORMANT` or `NON_CONFORMANT`. If the Profile deterministically prohibits the Extension and it is present, the result is `NON_CONFORMANT` even if the evaluator does not understand the Extension's internal semantics.

# 48. Profile Narrowing Rules

A Profile may narrow the content of a Capability Contract or other referenced semantic definition only when all of the following hold. Policies for Entity-specific additional Requirements are governed separately by Sections 40.5 and 47.1; adding such a prerequisite does not redefine an existing Contract Requirement:

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

**NON_CONFORMANT** means at least one known Profile requirement was violated. Examples include a missing required Capability, a projection conflict that leaves a required item with no satisfying or indeterminate candidate, a missing required Property, or a prohibited Extension.

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

Once the Profile is resolved, aggregation uses required item results after candidate aggregation under Sections 44–45, together with independently required Profile constraints. Optional-item diagnostics are excluded. A known violation of one required item takes precedence over unrelated unknown evaluations; failure of one candidate within an existential item does not. A processor SHOULD expose diagnostics for every evaluated requirement rather than only the aggregate result.

The following examples illustrate required-subset aggregation, assuming all other required items are satisfied and the Profile resolves unless the row states otherwise:

| Evaluation case | ProfileConformance |
|---|---|
| Optional Capability present with projection `CONFLICT` | `CONFORMANT`; conflict remains a separate projection diagnostic |
| Required item has one satisfying and one failing candidate | `CONFORMANT` |
| Required item has one failing and one indeterminate candidate | `UNDETERMINED` |
| Required item has candidates, all known to fail | `NON_CONFORMANT` |
| Profile definition itself is known invalid | `UNDETERMINED`, with ProfileResolution `UNRESOLVED` |

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

# 50. Semantic Identifiers

A Semantic Identifier identifies a semantic definition or vocabulary term. It denotes identity; it does not by itself denote a retrieval location, prove ownership, authenticate a publisher, or require network access.

Semantic Identifiers are used for, among other things:

- Capability Contracts;
- Profiles;
- Identifier schemes;
- Property types;
- Subject types;
- Requirement types;
- Extension-defined constraints; and
- other versioned vocabulary terms.

Capability Contract and Profile identifiers MUST be exact-versioned absolute identifiers. Other semantic vocabularies SHOULD use stable absolute identifiers when cross-document interoperability or registry resolution is required.

A processor MUST compare Semantic Identifiers using the equality rules defined by the applicable identifier scheme. In the absence of such rules, it MUST use exact code-point equality after XML attribute-value processing and MUST NOT invent equivalence through case folding, URI rewriting, percent-decoding, path normalization, redirects, labels, natural-language similarity, or AI inference.

For Capability Contract identifiers and Profile identifiers, including `capability/@type` and `conforms-to/@href`, exact code-point equality after XML attribute-value processing is the normative identity rule. URI normalization, percent-decoding, case folding, default-port removal, dot-segment resolution, redirect targets, or dereferenced representations MUST NOT create alternate spellings or change identity. Other Semantic Identifier schemes MAY define explicit comparison rules, but those rules MUST NOT override the exact identity rule for Contract and Profile identifiers.

```text
Semantic Identifier
≠ Locator
≠ Canonical Entity Identity
≠ Credential
```

An identifier using `https` syntax may be dereferenceable, but dereferenceability remains optional. Failure to fetch that URI does not change the identifier's lexical identity.

Semantic identification also does not establish that the identified definition is trusted or supported by the current Runtime.

# 51. Exact Versioned Identity

An exact-versioned identifier denotes one immutable semantic version. The version syntax is defined by the owning specification or registry; Core does not require Semantic Versioning or a particular path layout.

The following properties are REQUIRED for Capability Contract and Profile identities:

- the identifier is absolute;
- it denotes one specific semantic version;
- the identified normative meaning does not change incompatibly while retaining that identifier; and
- a resolved definition self-identifies with the requested exact identifier.

A moving label such as `latest`, `current`, a mutable branch name, or an unversioned family identifier is not exact-versioned normative identity. Such labels MAY be used for discovery, but discovery MUST yield an exact-versioned identifier before deterministic Contract resolution, Profile resolution, projection validation, or Profile conformance.

An exact identifier is not a claim that the definition bytes can never be republished. If two non-equivalent semantic definitions claim the same exact identifier, they are conflicting definitions under Section 54.

Compatibility metadata between versions does not merge their identities. A processor MUST NOT silently replace one exact identifier with another because it believes the versions are compatible.

The requested exact identity is the lexical identifier carried by the document. A redirect, dereferenced resource, registry source, or canonicalized retrieval URI is not an alternate spelling and MUST NOT be substituted during Contract or Profile identity comparison.

The following are distinct operations:

```text
discover a version
select an exact identifier
resolve the exact definition
validate semantic compatibility
```

Applications MAY perform discovery and selection according to policy. Core validation and deterministic conformance operate on the resulting exact identity.

# 52. Semantic Registry

A Semantic Registry maps a Semantic Identifier to a semantic definition. It is a conceptual component; this specification does not require one network service, one storage format, or one global authority.

Conceptually:

```text
resolve(semanticIdentifier, expectedDefinitionKind)
→ RESOLVED(definition, provenance)
  | UNRESOLVED(reason, candidates)
```

`expectedDefinitionKind` distinguishes, for example, a Capability Contract from a Profile or vocabulary definition. A returned definition MUST self-identify with the requested identifier and MUST be of the expected kind.

A registry implementation SHOULD retain provenance sufficient to report:

- which source supplied each candidate;
- whether a cache was used;
- which trust or application policy filtered candidates;
- whether candidates were equivalent or conflicting; and
- why the final result was resolved or unresolved.

The semantic definition is exposed separately from AR-XML Entity description data. Resolving a Capability Contract MUST NOT insert its fields into the Entity's AR-DOM; resolving a Profile MUST NOT convert a Profile Claim into verified conformance.

Registry lookup MAY be eager, lazy, or application-requested. A Core-valid document remains loadable when semantic definitions are unavailable.

The registry MUST NOT execute a Capability, acquire credentials, authenticate an Entity, make an authorization decision, or select a Runtime route as a side effect of semantic resolution.

# 53. Resolution Sources

A Semantic Registry MAY obtain candidates from one or more sources, including:

```text
built-in definitions
local registry
cache
application-provided registry
installed Extension or plugin
network source
```

No source category has universal priority defined by Core. Source order, allowlists, trust anchors, offline behavior, freshness, and network policy are Runtime or Application policy.

A conforming policy MUST be deterministic for the same candidate set and policy inputs. It MUST NOT silently use arrival order or unspecified iteration order as semantic precedence.

## 53.1 Built-in and Installed Sources

Built-in definitions and installed Extensions or plugins MAY provide offline resolution. Installation establishes availability to the Runtime, not automatic trust in every document that references the definition.

## 53.2 Local and Application-provided Registries

Local and application-provided registries MAY supply private, deployment-specific, or test definitions. A definition's source does not alter its declared Semantic Identifier.

An application MAY constrain which registries are consulted. Failure to consult an excluded source is policy behavior, not evidence that the semantic identifier is invalid.

## 53.3 Cache

A cache MAY satisfy resolution for an exact-versioned identifier. Provenance, integrity metadata, expiry, and storage layout are implementation details, not mandatory Core cache fields. Cache freshness policy MUST NOT transform a mutable alias into exact identity.

If a cached candidate conflicts with another acceptable candidate for the same exact identifier, Section 54 applies; cache order does not authorize silent first-wins behavior.

## 53.4 Network

Network resolution is OPTIONAL, including when the Semantic Identifier is an HTTP or HTTPS URI. A Runtime MAY prohibit network resolution, restrict origins, require integrity metadata, or operate completely offline.

Network failure, DNS failure, TLS failure, HTTP failure, CORS policy, or refusal to dereference produces an unavailable candidate source. It does not make the AR-XML document structurally invalid and does not prove that the Semantic Identifier is invalid.

Semantic resolution over a network is a definition-retrieval operation. It is not Capability execution.

# 54. Conflicting Definitions

Multiple sources may return candidates for the same exact Semantic Identifier. A registry MUST determine whether the candidates are semantically equivalent under the definition format's specified equivalence or integrity rules.

Byte-identical or normatively equivalent duplicates MAY be treated as one resolved definition while retaining all provenance. Definitions MUST NOT be treated as equivalent merely because titles, descriptions, version labels, selected fields, or examples look similar.

When two acceptable candidates are non-equivalent and claim the same exact identifier:

```text
silent first-wins
→ prohibited

silent last-wins
→ prohibited

merge candidate fields
→ prohibited

guess intended definition
→ prohibited
```

The registry MUST report a conflict and return `UNRESOLVED` unless an explicit trust or application policy deterministically excludes all but one candidate before semantic selection.

Trust policy may filter candidates using configured source identity, signatures, integrity metadata, allowlists, or equivalent external evidence. Resolution itself does not define or imply that policy.

A conflict diagnostic SHOULD identify the Semantic Identifier, expected definition kind, candidate sources, and available integrity or version metadata without exposing credentials or secrets.

Conflicting Capability Contract definitions cause Contract resolution `UNRESOLVED` and projection `UNVALIDATED` unless an independent known Entity projection contradiction already yields `CONFLICT`. Conflicting Profile definitions cause Profile resolution `UNRESOLVED` and Profile conformance `UNDETERMINED`.

A processor MUST NOT ask an AI or human-language heuristic to choose between conflicting normative definitions as part of conformant deterministic resolution.

# 55. Entity Resolver Separation

Entity resolution and semantic-definition resolution are separate responsibilities:

```text
Entity Resolver
= entity identity or application reference → AR-XML location

Semantic Registry
= Semantic Identifier → semantic definition
```

An Entity Resolver locates an AR-XML representation. It does not:

- resolve Capability Contracts or Profiles;
- decide which semantic definition is authoritative;
- authenticate the Entity or document issuer;
- grant authorization;
- evaluate Capability availability; or
- execute a Capability.

A Semantic Registry resolves semantic definitions. It does not locate an Entity's current AR-XML representation unless an application separately configures the same implementation for both roles. Even when one software component implements both roles, their inputs, outputs, state, diagnostics, and security policy MUST remain distinguishable.

An Entity Identifier is not automatically a Locator or Canonical Entity Identity. An application or identity scheme must explicitly determine which identifier is used as Entity Resolver input.

The AR-XML document retrieval URL is Runtime context. It may serve as the base for explicitly defined relative locator resolution, such as the HTTP Extension rules in Part IX, but it does not become an implicit Entity Identifier, Property, or Canonical Entity Identity.

Conceptually, load remains:

```text
ARRuntime.load()
= Resolve Entity / Fetch / Parse / Validate / Expose
```

Semantic definition resolution MAY occur during load, lazily after exposure, or on explicit application request. Whichever timing is chosen, it MUST NOT automatically invoke a Capability.

The following separations always apply:

```text
Resolution ≠ Trust
Resolution ≠ Authentication
Resolution ≠ Authorization
Resolution ≠ Availability
Resolution ≠ Execution
```

# Part VII — Validation and Processing

# 56. Processing Model

## 56.1 Load Pipeline

An AR-XML Runtime load operation follows this conceptual pipeline:

```text
1. Resolve Entity reference when required
2. Fetch AR-XML resource bytes
3. Parse XML safely and namespace-aware
4. Validate Core namespace and Draft version
5. Validate Core structure and Extension Slot envelopes
6. Validate typed uniqueness and local references
7. Construct AR-DOM and preserve Extension data
8. Expose the description and diagnostics
```

This pipeline refines, but does not change, the fundamental rule:

```text
ARRuntime.load()
= Resolve / Fetch / Parse / Validate / Expose
```

No step in load authorizes or invokes a Capability. Fetching the AR-XML resource is document retrieval, not execution of a described Capability.

Semantic Contract or Profile resolution MAY occur during load, after AR-DOM exposure, or on explicit application request. It is not required for Core structural validity and MUST NOT cause Capability execution.

## 56.2 Distinct Processing Outcomes

A processor MUST keep these outcome categories distinct:

```text
Entity resolution failure
resource fetch failure
XML parse failure
Core validation failure
Extension validation result
semantic resolution result
projection validation result
Profile conformance result
Runtime availability result
invocation result or error
```

One category MUST NOT be silently reported as another. For example, an unresolved Capability Contract is not a Core validation failure, and an HTTP authorization failure is not proof that the AR-XML document is invalid.

## 56.3 Determinism and No Repair

Core parsing and validation MUST be deterministic and MUST NOT require AI, an LLM, network dereferencing of Semantic Identifiers, or human interpretation.

A processor MAY collect multiple diagnostics, but MUST NOT repair an invalid document while claiming it validated the original. Examples of prohibited silent repair include:

- deleting an unknown Core element or attribute;
- choosing one duplicate local ID;
- selecting an arbitrary target for a dangling reference;
- moving foreign content into an Extension Slot;
- filling missing Entity projection fields from a Contract; or
- treating malformed XML as a valid AR-DOM.

An application MAY offer a separate repair workflow, but repaired content is a new document and MUST be revalidated.

## 56.4 Safe XML Parsing

Processors MUST use an XML parser configuration suitable for untrusted input. During Core parsing they MUST NOT fetch external entities or external DTD resources as an implicit side effect. Resource limits SHOULD bound document size, nesting depth, attribute count, and expanded text according to the deployment environment.

Parser security policy is not an Extension mechanism. A document cannot weaken the Runtime's XML security configuration.

# 57. Core Structural Validation

Core structural validation determines whether the parsed document conforms to the Core grammar independently of semantic-definition resolution and Extension-specific meaning.

A Core validator MUST verify at least:

1. the resource is well-formed XML;
2. the document element is Core `ar-entity`;
3. the Core namespace and `version="0.1"` are correct;
4. only defined Core elements and attributes occur;
5. foreign elements occur only in explicit Extension Slots;
6. singleton elements and containers do not repeat;
7. required attributes and non-empty lexical values are present;
8. Core child containment and cardinalities are satisfied;
9. Core data type and boolean lexical values are permitted;
10. Input and Output constraint wrappers satisfy their slot envelope;
11. Attachment, Realization, Mapping, and Requirement body envelopes are valid;
12. Every Interface contains Attachment or Realization; and
13. The uniqueness and reference rules in Section 58 hold.

Core child order MUST NOT affect validity. A document using a non-canonical but otherwise permitted child order is valid.

## 57.1 Unknown Content

Validation applies the following matrix:

| Content | Location | Core result |
|---|---|---|
| known Core element or attribute | permitted Core location | continue validation |
| unknown Core-namespace element | anywhere | invalid |
| unknown unqualified or Core attribute on Core element | anywhere | invalid |
| foreign element | permitted Extension Slot | Core-valid if slot envelope is valid |
| foreign element | outside an Extension Slot | invalid |
| foreign namespaced attribute on a Core element | metadata under Section 32.3 | Core-valid; metadata semantics validated separately |

Recognizing a foreign Extension element does not permit it outside its Core-defined slot. Failing to recognize a foreign Extension element inside a valid slot does not make the document Core-invalid. Foreign metadata attributes on Core elements use Section 32.3 rather than the element-slot envelope rules.

## 57.2 Structural Validity and Semantic Evaluation

Core validity does not require:

- an Entity Identifier, Interface, or Capability;
- a CPU, network connection, API, or Runtime implementation;
- resolution of Capability Contracts, Profiles, or vocabulary terms;
- Extension processor support;
- Profile conformance;
- Runtime availability; or
- successful authentication, authorization, or execution.

An empty passive Entity is Core-valid. Conversely, a semantically familiar or executable document is Core-invalid if it violates the Core grammar.

# 58. Reference and Uniqueness Validation

## 58.1 Typed Local ID Collections

Local IDs MUST be unique within each typed collection:

```text
Subject.id
Interface.id
Capability.id
```

The collections are separate. The same lexical ID MAY occur once in each different typed collection without collision.

ID comparison uses exact code-point equality after XML attribute-value processing. A validator MUST NOT case-fold, trim, URI-normalize, Unicode-normalize, or otherwise guess equivalence unless a future Core revision explicitly defines such normalization.

## 58.2 Scoped Names

Input names MUST be unique within their containing Invocation. Output names MUST be unique within their containing Result.

Input and Output name collections are separate. The same name MAY be used once as an Input and once as an Output. Names in different Capabilities do not collide.

## 58.3 Local References

The following references MUST resolve within the same AR-XML document:

```text
Capability.subject-ref → Subject.id
Identifier.subject-ref → Subject.id
InterfaceUse.ref       → Interface.id
```

Reference matching uses the same exact equality rule as IDs. References MUST NOT resolve through network access, a Semantic Registry, Entity Resolver, label matching, or cross-document inference.

Forward references are valid. A processor MUST therefore complete collection construction before reporting a reference as dangling.

A dangling local reference is a Core structural validation error. A processor MUST NOT create a placeholder target or silently drop the referencing item.

## 58.4 Permitted Repetition

The following repetition is explicitly permitted:

- multiple Identifiers with the same `type`;
- multiple Properties with the same `type`;
- multiple InterfaceUses in one Capability with the same `ref`;
- different Capabilities referencing the same Interface; and
- different Identifiers or Capabilities referencing the same Subject.

Permitted repetition does not imply order, preference, aliasing, aggregation, equivalence, or conflict resolution.

# 59. Extension Validation

## 59.1 Separate Validation Layer

Extension-specific validation occurs after or alongside Core slot-envelope validation but produces a separate result.

For each foreign semantic root, a processor conceptually determines:

```text
Extension recognized?
Extension processor supported?
Extension subtree valid under that Extension?
```

An Extension processor MUST NOT alter the Core validation result, relax Core cardinality, or reinterpret Core attributes. It validates only the foreign semantics assigned to its slot or metadata-attribute definition.

## 59.2 Recognized Extensions

For a recognized and supported Extension, the processor MUST apply the Extension specification associated with the root's namespace URI, local name, and slot context.

An Extension validation failure SHOULD identify the foreign root, slot, Extension specification or version, and violated rule. It does not retroactively make Core structure invalid; it makes the Extension instance invalid for the applicable Extension conformance class.

A processor MUST NOT claim conformance to an Extension merely because it can preserve or display its XML.

## 59.3 Unknown or Unsupported Extensions

For an unknown or unsupported foreign root in a valid Extension Slot:

- Core validation remains valid;
- Extension-specific validity is not established;
- the subtree SHOULD be preserved as opaque data;
- no semantic meaning may be guessed; and
- applicable Runtime or conformance evaluation uses the specified unknown state.

In particular, an unknown Requirement body produces `RequirementEvaluation = UNKNOWN` when evaluation is required. Unknown Attachment semantics produce `AttachmentEvaluation = UNKNOWN` when a route requires evaluation. Realization, Mapping, and constraint semantics are handled separately by Part VIII.

## 59.4 Extension Processor Isolation

Extension processors MUST treat foreign subtree content as untrusted input. They MUST NOT execute scripts, fetch arbitrary resources, access credentials, or invoke Capabilities merely to validate Extension syntax.

An Extension may define explicit resolution behavior, but resolution remains subject to Runtime policy and MUST remain distinguishable from validation and execution.

# 60. Preservation and Exposure

## 60.1 AR-DOM Construction

After successful Core validation, a processor constructs or exposes an implementation-independent AR-DOM representing the Core Information Model.

AR-DOM MUST preserve:

- all Core information items and their lexical values required by the model;
- collection membership;
- document order where needed for faithful reserialization, without assigning preference;
- local IDs and references;
- the AR-XML retrieval location or document base as separate Runtime context when available; and
- foreign Extension subtrees according to the preservation rules in Section 36.

AR-DOM is not the browser DOM and MUST NOT expose untrusted XML by inserting it into HTML.

## 60.2 Description and Derived State

The exposed Entity description MUST remain separate from derived data, including:

- resolved Contract and Profile definitions;
- resolution provenance;
- projection validation states;
- Profile conformance states;
- Requirement evaluations;
- Runtime support and availability;
- selected routes;
- credentials and authorization state; and
- invocation or execution results.

A processor MAY expose these through associated evaluation objects or APIs, but MUST NOT mutate the issuer-authored AR-DOM to make derived state appear declared.

Resolved Contract fields MUST NOT be injected into missing Capability fields. Profile constraints MUST NOT be serialized back as Entity declarations unless an application explicitly creates and revalidates a new document.

## 60.3 Invalid Documents

A processor MUST NOT expose an invalid document as a conforming AR-DOM. It MAY expose parse or validation diagnostics and a non-conforming inspection representation, provided that representation is clearly distinguished from valid AR-DOM.

Partial parsing, editor recovery, or best-effort inspection MUST NOT be used for conformance, projection validation, Profile conformance, availability, or invocation.

## 60.4 Reserialization

A serializer SHOULD emit canonical Core child order from Section 21 while preserving collection membership and Extension semantics. Reordering collection items MUST NOT be used to communicate preference.

If a processor cannot preserve an unknown Extension subtree sufficiently for its claimed serialization mode, it MUST disclose the loss and MUST NOT claim lossless round-trip behavior.

## 60.5 Exposure Is Not Execution

Exposing an AR-DOM, Capability, Interface, InterfaceUse, resolved definition, or availability state is observational. It MUST NOT initiate Capability execution.

Side-effecting execution begins only after an explicit Application or Human request through a Runtime invocation operation.

# Part VIII — Runtime Evaluation

# 61. Description and Runtime State

AR-XML contains description data. Runtime evaluation produces derived state from that description, resolved semantic definitions, Runtime implementation support, policy, and current context.

The following state domains are distinct:

```text
ContractResolution:
  RESOLVED | UNRESOLVED

ProjectionValidation:
  VALIDATED | UNVALIDATED | CONFLICT

RequirementEvaluation:
  SATISFIED | UNSATISFIED | UNKNOWN

AttachmentEvaluation:
  SATISFIED | UNSATISFIED | UNKNOWN

Support:
  SUPPORTED | UNSUPPORTED | UNKNOWN

ProfileResolution:
  RESOLVED | UNRESOLVED

ProfileConformance:
  CONFORMANT | NON_CONFORMANT | UNDETERMINED

Availability:
  READY | UNAVAILABLE | UNKNOWN
```

A processor MUST NOT collapse these domains into one boolean such as `valid`, `supported`, or `available`.

Evaluation state is not serialized into the issuer-authored AR-XML document. It MAY be exposed through an associated Runtime API together with diagnostics, provenance, policy context, and evaluation time.

Evaluation results are snapshots. They may change when registries, installed Extensions, permissions, credentials, connectivity, device state, Runtime policy, or other context changes. A changed evaluation result does not mutate the description.

Core structural validity is a prerequisite to conforming Runtime evaluation. A Runtime MUST NOT invoke through a partial or invalid AR-DOM.

Deterministic evaluation MUST NOT require AI or an LLM. An application MAY present assisted recommendations separately, but they are not Core evaluation states.

# 62. Contract Resolution

For each Capability, the Runtime evaluates the exact Capability Contract identifier in `capability/@type`:

```text
RESOLVED
= exactly one usable Contract definition selected

UNRESOLVED
= no usable definition selected
```

`UNRESOLVED` includes unavailable definitions and unresolved conflicts between non-equivalent definitions claiming the same identifier.

Contract resolution is independent of Core document validity. A Core-valid Capability remains exposed when its Contract is unresolved.

The Runtime SHOULD expose resolution provenance and diagnostics, including the requested identifier and reason for failure. It MUST NOT silently substitute a different Contract version, dereference the identifier against policy, or use first-wins conflict handling.

Contract resolution does not prove trust, Runtime support, authorization, availability, or execution success.

An unresolved Contract normally causes ProjectionValidation `UNVALIDATED` and prevents a route from becoming `READY` when Contract-dependent semantic validation is required.

# 63. Projection Validation

ProjectionValidation is evaluated according to Part IV:

```text
VALIDATED
= all applicable comparisons are deterministically compatible

UNVALIDATED
= compatibility cannot be fully determined

CONFLICT
= a known semantic contradiction exists
```

The Runtime MUST preserve known conflicts even if other comparisons are unknown. A missing evaluator does not erase a detected type mismatch, missing required Input, prohibited widening, or other known conflict.

`CONFLICT` is a known semantic blocker and makes every invocation route for that Capability `UNAVAILABLE`.

`UNVALIDATED` represents uncertainty. It does not authorize invocation and does not prove incompatibility. Under the baseline route algorithm it contributes `UNKNOWN` unless another known blocker makes the route `UNAVAILABLE`.

`VALIDATED` establishes Contract projection compatibility only. It does not establish Interface support, satisfied Requirements, Profile conformance, authorization, availability, or execution success.

# 64. Requirement Evaluation

## 64.1 States

Each applicable Requirement is evaluated in current Runtime context as:

```text
SATISFIED
= available evidence deterministically satisfies the Requirement

UNSATISFIED
= available evidence deterministically violates or lacks a mandatory prerequisite

UNKNOWN
= the Runtime cannot determine satisfaction
```

Unknown Requirement type, unknown Requirement Extension data, unavailable evidence, unsupported evaluator, or ambiguous policy produces `UNKNOWN`, not an assumed `SATISFIED` or `UNSATISFIED`.

## 64.2 Scope

The effective Capability prerequisite set is the conjunction of resolved Contract Requirements and Entity Capability Requirements under Section 40.5. Both apply to every InterfaceUse route for that Capability. Interface Requirements add prerequisites only to routes using that Interface. Keep Contract, Entity Capability, and Interface declaration provenance separate; evaluation MUST NOT inject resolved Contract Requirements into AR-DOM.

If the Contract is unresolved, known Entity and Interface Requirements may still be evaluated, but their results do not establish that all universal prerequisites are known or satisfied. ContractResolution remains an independent route-evaluation input under Section 66.

For a route, applicable Requirement results aggregate as follows:

```text
if any applicable Requirement is UNSATISFIED
→ aggregate UNSATISFIED

else if any applicable Requirement is UNKNOWN
→ aggregate UNKNOWN

else
→ aggregate SATISFIED
```

An empty applicable Requirement set aggregates to `SATISFIED` for this calculation; it does not assert authorization or safety beyond the absence of declared Requirements.

## 64.3 Authentication and Authorization

An authentication Requirement may evaluate whether required authentication context or credential capability is available locally. This evaluation does not authenticate a remote response or guarantee that credentials are accepted.

An authorization Requirement declaration does not grant authorization. A local Runtime may know that authorization is absent, but remote authorization can still fail after a route was `READY`.

Requirement evaluation MUST NOT disclose secrets or serialize credentials into AR-DOM. It MUST NOT send credentials, prompt for permission, or perform a side-effecting Capability merely because a document was loaded. An explicit application operation or Runtime policy is required for active acquisition steps.

# 65. Runtime Support

Support expresses whether the current Runtime implementation can process an applicable semantic or mechanism:

```text
SUPPORTED
= the Runtime implements the required behavior

UNSUPPORTED
= the Runtime knows it does not implement the required behavior

UNKNOWN
= support cannot be determined
```

Support is evaluated for the concrete interaction features needed by a route, including Realization roots, Mapping roots, constraint evaluators, media representations, and Interface Extension behavior. Attachment access-condition satisfaction is evaluated separately as `AttachmentEvaluation` under Section 66.5. Missing knowledge or an unavailable Attachment condition evaluator yields `UNKNOWN` in that domain, not evidence that the physical access condition is unsatisfied. An Attachment Extension defines access-boundary semantics and their condition evaluation; it MUST NOT supply an Invocation execution mechanism through the Attachment slot. A concrete interaction mechanism MUST be declared as a Realization. Attachment satisfaction and Realization support remain separate checks.

An Extension specification existing does not make it supported by a Runtime. Conversely, preserving an unknown subtree does not constitute semantic support.

Support may be feature-specific. A Runtime that supports HTTP `GET` but not a required request encoding or result mapping MUST NOT report the entire route as supported merely because it recognizes the HTTP namespace.

Support aggregation for a route follows:

```text
if any required feature is UNSUPPORTED
→ aggregate UNSUPPORTED

else if any required feature is UNKNOWN
→ aggregate UNKNOWN

else
→ aggregate SUPPORTED
```

An absent optional Mapping requires no Mapping support. A plain InterfaceUse is evaluated using the referenced Interface Extension's rules.

# 66. InterfaceUse Route Evaluation

## 66.1 Route Inputs

Each InterfaceUse is evaluated as a distinct route. Evaluation considers:

- presence of request-oriented Invocation when invocation availability is requested;
- ContractResolution;
- ProjectionValidation;
- applicable Capability Requirements;
- applicable referenced Interface Requirements;
- AttachmentEvaluation for the referenced Interface, when Attachment is present;
- presence of a Realization and support for its required interaction mechanism;
- Mapping support when Mapping is present;
- applicable constraint and Representation support; and
- Runtime and Application policy.

Multiple InterfaceUses with the same `ref` remain distinct routes. InterfaceUse and Interface document order MUST NOT be used as preference or fallback priority.

## 66.2 Baseline Decision Algorithm

For a Core-valid document and a request-oriented Capability, route Availability is determined in this precedence order:

```text
1. ProjectionValidation = CONFLICT
   → UNAVAILABLE

2. Any known mandatory Requirement = UNSATISFIED
   or applicable AttachmentEvaluation = UNSATISFIED
   → UNAVAILABLE

3. Referenced Interface has no Realization
   or any required interaction mechanism, Realization, Mapping,
   constraint, or Representation feature = UNSUPPORTED
   → UNAVAILABLE

4. Runtime or Application policy deterministically blocks the route
   → UNAVAILABLE

5. ContractResolution = UNRESOLVED
   or ProjectionValidation = UNVALIDATED
   → UNKNOWN

6. Any applicable RequirementEvaluation = UNKNOWN
   or applicable AttachmentEvaluation = UNKNOWN
   → UNKNOWN

7. Any required Support = UNKNOWN
   → UNKNOWN

8. Otherwise
   → READY
```

Known blockers take precedence over unrelated uncertainty. For example, a known unsupported Mapping makes a route `UNAVAILABLE` even when a separate Requirement evaluator is unknown.

The Core three-state invocation Availability evaluation applies only to a Capability with Invocation. For a Capability without Invocation, a Runtime MUST NOT generate a Core Availability value; it MAY report that this interaction model is not applicable as a diagnostic, not a fourth Availability state. If Invocation is present but no InterfaceUse exists, Section 67 defines the empty route-set result.

An Interface with both Attachment and Realization requires the Attachment condition to be satisfied as well as the other route prerequisites. A known unsatisfied Attachment blocks that InterfaceUse; an unknown Attachment condition prevents `READY` unless a separate known blocker already yields `UNAVAILABLE`. Attachment-only Interfaces remain structurally valid descriptions of access boundaries. For request-oriented Invocation, a route to an Interface without Realization is `UNAVAILABLE` because it declares no interaction mechanism, even if Attachment evaluation is `SATISFIED` or another evaluation is unknown. A Mapping MUST NOT supply a substitute Realization. This known absence does not invalidate the passive Interface or imply an unsatisfied Attachment.

## 66.3 READY Meaning

`READY` means:

> The Runtime has no known local reason, under the evaluated description, definitions, support, Requirements, context, and policy, that prevents an explicit invocation attempt on this route.

`READY` does not mean the Runtime has already contacted the target. A Runtime MUST NOT invoke a Capability merely to determine whether the route is `READY`.

## 66.4 Diagnostics

A Runtime SHOULD expose route diagnostics containing the InterfaceUse identity within its Capability, referenced Interface ID, relevant Extension roots, contributing state values, evaluated policy context, and reason for the aggregate result.

Diagnostics MUST distinguish known blockers from unknown information and MUST NOT expose credentials or secrets. A known unsatisfied Attachment MUST be identified by the reason `ATTACHMENT_UNSATISFIED`; unknown Attachment evaluation SHOULD be distinguishable by `ATTACHMENT_UNKNOWN`.

## 66.5 Attachment Evaluation

For each evaluated request-oriented InterfaceUse route, a Runtime MUST evaluate a present Attachment against current evidence using that Attachment Extension's deterministic semantics:

- `SATISFIED`: available evidence establishes the declared access condition.
- `UNSATISFIED`: available evidence establishes that the declared access condition is not met.
- `UNKNOWN`: the Extension, evaluator, required evidence, or comparison semantics are unavailable or insufficient to decide.

A missing Attachment contributes no access condition; it MAY be treated as the neutral `SATISFIED` input for aggregation, with diagnostics recording that no Attachment was declared. Unknown metadata or missing evidence MUST NOT be guessed into satisfaction or failure. A known descriptive Attachment whose Extension explicitly defines no access condition can evaluate as `SATISFIED` under those semantics; a Runtime MUST NOT assume that interpretation for an unknown Extension.

AttachmentEvaluation is derived Runtime context, separate from RequirementEvaluation, Support, and the issuer-authored Attachment. It MUST NOT be serialized into the description. It MUST NOT initiate contact, pairing, connection, movement, authentication, or Capability execution merely to obtain evidence. An explicit Application or Human action may separately establish new context for reevaluation.

For otherwise ready routes, `SATISFIED` permits `READY`, `UNSATISFIED` yields `UNAVAILABLE`, and `UNKNOWN` yields `UNKNOWN`. With multiple InterfaceUses, these results are aggregated under Section 67: an unsatisfied Attachment on one Interface does not block another independently ready route. No Core Availability is generated for a Capability without Invocation, and an unreferenced passive Interface need not be route-evaluated.

# 67. Capability Availability Aggregation

For a Capability with Invocation, Capability Availability aggregates all applicable InterfaceUse route results without assigning order-based preference:

```text
if any route is READY
→ Capability READY

else if any route is UNKNOWN
→ Capability UNKNOWN

else
→ Capability UNAVAILABLE
```

Thus, one ready route is sufficient for Capability `READY` even when another route is unavailable or unknown. If no route is ready but at least one might become usable after unknown information is resolved, the result is `UNKNOWN`.

A Capability with Invocation and zero InterfaceUses aggregates to `UNAVAILABLE` only for an explicit evaluation of invocation routes in this document: no route for that request is described. This is not a statement that the semantic function is impossible or that the description is invalid. A semantic-only Capability without Invocation has no Core Availability value, regardless of its InterfaceUse count.

A Capability without Invocation is outside Core request-oriented Availability evaluation, even if it has InterfaceUses. Its Core Availability value is absent. A future Extension defining another interaction pattern may expose a separate availability model.

Capability Availability is Runtime-specific and context-specific. Different conforming Runtimes may report different states because their installed support or policy differs, while using the same deterministic rules on their respective inputs.

Route selection for an actual invocation is a separate Runtime operation. `READY` routes form an eligible set; document order MUST NOT select among them. Applications or Interface Extensions MAY apply explicit deterministic selection policy.

# 68. Profile Resolution and Conformance

Profile resolution and Profile conformance use the states defined in Part V:

```text
ProfileResolution:
  RESOLVED | UNRESOLVED

ProfileConformance:
  CONFORMANT | NON_CONFORMANT | UNDETERMINED
```

An unresolved claimed Profile produces conformance `UNDETERMINED`. A known Profile violation produces `NON_CONFORMANT`; unknown required semantics produce `UNDETERMINED` when no known violation already determines the result.

Profile evaluation does not mutate a Profile Claim. A claim remains issuer data regardless of the evaluated result.

Profile conformance and Availability are independent dimensions. A Runtime MUST NOT derive one from the other.

```text
CONFORMANT does not imply READY
NON_CONFORMANT does not imply UNAVAILABLE
READY does not imply CONFORMANT
```

A passive Entity may be Profile-conformant to a descriptive Profile without having an invocable Capability. An available route may exist on an Entity that does not conform to a selected interoperability Profile.

# 69. Availability, Authorization, and Execution

Availability, authorization, and execution answer different questions:

```text
Availability
= may this Runtime attempt the described interaction route?

Authorization
= will the controlling authority permit this operation?

Execution
= did the requested operation actually occur and produce a result?
```

`READY` does not guarantee:

- successful authentication;
- authorization by a remote service or physical controller;
- network reachability or target presence;
- current remote device state;
- business-rule acceptance;
- physical safety;
- semantic success; or
- any particular Result.

The following sequence is valid:

```text
Capability READY
→ explicit invocation attempt
→ remote authorization denial
```

`UNAVAILABLE` means a known local blocker prevents an attempt under current policy. It is not a permanent statement about the Entity or Contract.

`UNKNOWN` means the Runtime cannot determine local attempt readiness. It MUST NOT be presented as `READY`, but an application MAY apply an explicit policy deciding whether and how a user may attempt invocation under uncertainty.

Availability evaluation MUST NOT execute a side-effecting Capability as a probe. In particular, an operation such as `door.unlock`, `light.setState`, payment, or actuator movement MUST NOT be invoked merely to test availability.

# 70. Load and Explicit Invocation

## 70.1 Non-executing Load

`ARRuntime.load()` and equivalent parse, validation, resolution, inspection, Profile evaluation, or Availability APIs MUST NOT automatically invoke a described Capability.

Load-time Entity retrieval and policy-permitted semantic-definition retrieval are not Capability execution. They MUST remain distinguishable in diagnostics and security policy.

## 70.2 Initiating Intent

A side-effecting Capability execution MUST begin only from an explicit request attributable to an Application or Human. Merely viewing an Entity, enumerating Capabilities, resolving a Contract, evaluating a Requirement, or observing `READY` is not an invocation request.

The Runtime API SHOULD preserve initiating intent across asynchronous processing so that retries, redirects, credential acquisition, and route selection cannot turn a passive load into execution.

## 70.3 Conceptual Invocation Pipeline

After an explicit request, a Runtime may conceptually:

```text
1. identify the requested Capability
2. validate invocation Inputs against resolved semantics
3. evaluate current routes and policy
4. select an eligible route without document-order preference
5. acquire permitted credentials or consent through Runtime policy
6. serialize the request through the selected Interface Extension
7. perform the interaction
8. classify transport and Interface outcomes
9. decode and validate the Result Representation
10. Expose semantic Outputs or errors
```

Each step may fail independently and MUST preserve the error-layer distinctions defined by this specification.

Credential acquisition, authorization prompts, device access, network requests, and physical actions remain under Runtime and host-environment policy. AR-XML does not bypass browser, operating-system, network, or device security controls.

An invocation result does not rewrite the description. Applications MAY maintain Runtime Context or observations separately.

# Part IX — Standard Extensions / HTTP

# 71. HTTP Extension Scope

HTTP is the first Standard Interface Extension for AR-XML Draft 5. It is not part of the Core Capability semantic model.

The HTTP Extension namespace is:

```text
https://relink.dev/ns/arxml/http/0.1
```

This Part defines two foreign semantic roots:

```text
http:api
→ Interface Realization

http:operation
→ InterfaceUse Mapping
```

`http:api` describes HTTP configuration shared by an Interface. `http:operation` describes how one Capability uses that Interface.

HTTP elements MUST NOT appear directly in a Capability Contract. An HTTP method, path, URL, header, status code, or JSON mapping is implementation routing information, not normative Capability meaning.

The HTTP Extension does not redefine Capability Inputs, Outputs, Requirements, or constraints. It maps an already-defined semantic Invocation to HTTP.

This baseline defines common semantic request and JSON Result mappings. GET permits wire-equivalent serializations under Section 74.2, but does not cover receiver-specific lexical conventions or query-name collisions. Such cases MUST NOT be claimed as supported by the baseline merely through an implicit deployment agreement. It does not define:

- an arbitrary header mapping DSL;
- cookies or credential storage;
- OAuth token acquisition;
- HTTP status-to-semantic-error mapping;
- multipart bodies;
- streaming, subscription, or event semantics;
- arbitrary object, array, or binary GET query serialization; or
- every possible HTTP content negotiation strategy.

An HTTP method permitted by this Extension is not necessarily implemented by a Runtime. Method and feature support are evaluated through the Part VIII `Support` state.

# 72. HTTP Interface Realization

An HTTP Interface uses `http:api` as the single semantic root of `realization`:

```xml
<interface
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  xmlns:http="https://relink.dev/ns/arxml/http/0.1"
  id="web-api">

  <realization>
    <http:api base="./api/" />
  </realization>
</interface>
```

`http:api` MAY have the unqualified `base` attribute. When present, `base` is an absolute or relative URI reference identifying the shared HTTP base context; an empty reference is permitted. When omitted, the base context is the final AR-XML document retrieval URI. If an explicit `base` is absolute, its scheme MUST be `http` or `https` (scheme comparison is case-insensitive); resolving a relative or empty `base` MUST likewise produce an `http` or `https` URI with a non-empty host.

For the baseline `base + path` model, URI syntax and reference resolution MUST follow [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986.html), using the strict reference-resolution algorithm in Section 5.2. A present relative or empty `base` is resolved against the final AR-XML document retrieval URI; an omitted `base` uses that final URI directly. This retrieval URI MUST be absolute, and the resulting base context MUST use `http` or `https` with a non-empty host. For a redirected document retrieval, use the final retrieval URI, not the original request URI. The Host Application document URL MUST NOT be substituted for it.

A trailing `/` is not required. It has the ordinary RFC 3986 path-merging effect: a directory-style base ends in `/`, whereas the last segment of a file-style base is replaced when resolving a relative operation path. Both `base` and operation `path` may contain a query or fragment; operation `path` MUST have neither a scheme nor an authority, as specified in Section 73. RFC 3986 determines query inheritance or replacement for each reference, including empty and query-only references. HTTP request-target construction excludes the resolved fragment; a fragment is not an Invocation Input.

Validate URI syntax before resolution. Raw backslashes, raw non-ASCII characters, spaces, controls, and malformed percent escapes are invalid in these URI inputs; browser error recovery MUST NOT repair them into accepted baseline references. An internationalized name or non-ASCII path must be provided in an appropriate ASCII URI form before baseline processing. Apply RFC 3986 dot-segment removal to literal `.` and `..` segments without percent-decoding beforehand; `%2e` and `%2E` are not literal dot segments in this algorithm. These rules govern locators only and MUST NOT normalize Contract or Profile identity.

An HTTP implementation MUST preserve the resolved authority and path semantics when issuing the request. If its underlying URL API would change them (for example, by interpreting encoded dot segments as path traversal), it MUST report unsupported target handling and prevent that invocation rather than silently access a different target. Support limitations remain separate from HTTP Extension syntax validity.

Example:

```text
AR-XML retrieval URL:
https://example.org/entities/lab/ar.xml

http:api base:
./api/

resolved HTTP base:
https://example.org/entities/lab/api/
```

If the final AR-XML retrieval URI is unavailable while `base` is omitted, empty, or relative, the Runtime cannot construct its target URL. The document may remain structurally valid, but that HTTP route is `UNAVAILABLE` for the evaluation because required resolution context is absent. An absolute `http:api@base` can supply the shared context without a retrieval URI; `http:operation@path` cannot supply its own scheme or authority. The HTTP baseline does not define an application-supplied replacement base or a precedence rule for one; an Application may reload or re-evaluate the resource with a known retrieval URL under its own policy. A non-`http`/`https` resolved scheme is an HTTP Extension validation failure and cannot produce a `READY` route.

A realization with no explicit base is valid:

```xml
<realization xmlns="https://relink.dev/ns/arxml/core/0.1"
             xmlns:http="https://relink.dev/ns/arxml/http/0.1">
  <http:api />
</realization>
```

For final retrieval URI `https://example.org/entities/lab/ar.xml?rev=5` and operation path `light/state`, the following target URLs are deterministic:

| `base` declaration | Operation target before Input query mapping |
|---|---|
| Omitted | `https://example.org/entities/lab/light/state` |
| Empty string | `https://example.org/entities/lab/light/state` |
| `./api/` | `https://example.org/entities/lab/api/light/state` |
| `https://example.org/api` | `https://example.org/light/state` |
| `https://example.org/api/?v=1#anchor` | `https://example.org/api/light/state` |

The baseline defines no other `http:api` attributes or child elements. An HTTP Extension processor MUST reject unknown unqualified attributes or HTTP-namespace children under `http:api` unless a later compatible Extension revision defines them.

Authentication is not encoded as an `http:api` secret or credential attribute. Shared authentication prerequisites belong in Interface Requirements; credentials remain under Runtime control.

Cross-origin permission, DNS, TLS, CORS, proxy behavior, origin allowlists, and network access are Runtime or host-environment policy. An absolute or resolved URL does not guarantee that a request is allowed.

# 73. HTTP Operation Mapping

An HTTP Capability route uses `http:operation` as the single semantic root of `mapping`:

```xml
<interface-use
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  xmlns:http="https://relink.dev/ns/arxml/http/0.1"
  ref="web-api">

  <mapping>
    <http:operation
      method="POST"
      path="light/state" />
  </mapping>
</interface-use>
```

`http:operation` MUST have the unqualified attributes `method` and `path`.

`method` MUST be a non-empty valid HTTP method token. The Extension does not limit methods to `GET` and `POST`. Standard methods SHOULD use their registered uppercase spelling. Method tokens are case-sensitive; a processor MUST NOT uppercase an unknown method and assume equivalence.

`path` MUST be present and be an RFC 3986 URI-reference with neither a scheme nor an authority component. This is the subset of `relative-ref` that excludes its network-path alternative; `relative-ref` alone would still permit an authority. Empty, relative-path, absolute-path (a single leading `/`), query-bearing, and fragment-bearing references are permitted. Absolute URI references and network-path references beginning with `//` MUST be rejected by HTTP Extension validation, including when they name the same authority as the base.

Construct the target by resolving this reference against the shared Interface base context using the RFC 3986 Section 5.2 algorithm specified in Section 72. The resolved HTTP target MUST inherit the base context's scheme and authority, use `http` or `https`, and have a non-empty host. A different scheme or authority requires a separate Interface with its own `http:api` Realization. Its fragment is excluded from the HTTP request target. The notation `base + path` denotes URI-reference resolution, not raw string concatenation or browser URL repair.

Example:

```text
resolved base:
https://example.org/entities/lab/api/

operation path:
light/state

request URL before Input query mapping:
https://example.org/entities/lab/api/light/state
```

For base context `https://example.org/api/?mode=read`, these additional reference forms are valid:

| Operation `path` | Resolved URI before Input mapping | HTTP target before Input mapping |
|---|---|---|
| `/api/x` | `https://example.org/api/x` | `https://example.org/api/x` |
| `x?mode=write` | `https://example.org/api/x?mode=write` | `https://example.org/api/x?mode=write` |
| `?mode=write` | `https://example.org/api/?mode=write` | `https://example.org/api/?mode=write` |
| Empty string | `https://example.org/api/?mode=read` | `https://example.org/api/?mode=read` |
| `#result` | `https://example.org/api/?mode=read#result` | `https://example.org/api/?mode=read` |

In contrast, `https://other.example/action` and `//other.example/action` are invalid operation `path` values because they supply a scheme or authority. An operation on that server requires a separate Interface; its `http:api@base` may be `https://other.example/` and its operation `path` may be `action`. These are HTTP Extension validation outcomes, not Core envelope errors.

The referenced Interface MUST have an `http:api` Realization. An `http:operation` Mapping applied to an Interface with a different or absent Realization is invalid under this HTTP Extension.

The baseline defines no other `http:operation` attributes or child elements. Authentication and authorization are Requirements, not Mapping attributes. Static or dynamic generic header mappings are outside this baseline.

The same Capability MAY contain multiple InterfaceUses with HTTP operations, including multiple operations on the same HTTP Interface. Each is evaluated as a separate route; document order does not express preference.

# 74. HTTP Request Mapping

## 74.1 Common Rules

Before serialization, the Runtime MUST validate supplied values against the Capability's effective Input semantics. A missing required Input or a value that fails known type or constraint validation MUST prevent the request.

Input names are semantic keys. The baseline uses them directly as JSON object member names or GET query parameter names. It defines no renaming rule.

An absent optional Input is omitted. Core defines no `null` shortcut; a JSON `null` value is not accepted for a Core Input unless an applicable semantic definition explicitly permits and maps it.

Credentials, authorization headers, cookies, and ambient authentication are supplied by the Runtime or host environment according to policy. They MUST NOT be read from secrets embedded in AR-XML.

## 74.2 GET Query Mapping

For `method="GET"`, the baseline sends no request body. Present scalar Inputs map to query parameters:

```text
query parameter name  = Input name
query parameter value = scalar lexical form
```

Supported GET baseline Input types are:

```text
string
number
integer
boolean
```

Lexical forms are:

- `string`: the string value;
- `number`: a numeric lexical form preserving the supplied numeric value and applicable numeric constraints, subject to the wire-equivalence boundary below;
- `integer`: an integral numeric lexical form preserving the supplied integer value under the same boundary; and
- `boolean`: exactly `true` or `false`.

The Core primitive vocabulary does not choose a canonical numeric spelling, precision, or exponent policy for query values. The GET baseline permits different numeric spellings only when they preserve the same typed Input value at the receiver. If an API requires a particular spelling, treats numerically equal spellings differently, or applies a receiver-specific numeric convention, that requirement is outside this baseline. For example, `1` and `1.0` are interchangeable only where both decode to the same permitted numeric Input value with the same operation meaning; this is not a universal equivalence assertion for arbitrary APIs.

The baseline permits multiple wire-equivalent query serializations. Here, wire equivalence means that parameter decoding and typed Input interpretation produce the same Input names and values, preserve existing locator parameters, and do not change the operation meaning. It does not require byte-identical requests, parameter sorting, a single space encoding, a fixed percent-escape set, or hexadecimal letter case. Parameter order expresses no preference.

Use of an HTTP stack's query encoder alone does not establish wire equivalence. In particular, `+` and `%20` are not universally interchangeable: a receiver may interpret `+` literally. Likewise, a lexical distinction significant to the receiver, including a byte-level signature requirement, is outside the baseline even if another API would ignore it. A Runtime MUST NOT silently choose a receiver-specific convention or treat an undocumented deployment agreement as baseline semantics.

An existing query in the resolved operation URI remains locator data. Present Inputs add parameters without changing the meaning of existing parameters; no Inputs means no Input parameters are added. A name collision between an existing decoded query parameter and a present Input is outside the baseline. A baseline-only Runtime MUST report the required collision-handling feature as `Support = UNSUPPORTED`; it MUST NOT choose replacement, repetition, or silent omission. Query mapping operates on the query component, never on the fragment.

The same support boundary applies when receiver-sensitive numeric spelling or other receiver-specific encoding is required: a baseline-only Runtime MUST report that required mapping feature as `UNSUPPORTED`, making the affected route `UNAVAILABLE` under Section 66. Unknown compatibility or unknown query-decoding semantics produces `Support = UNKNOWN`, not an assumed equivalence or `READY`. These are mapping-support outcomes, not Core validity failures. Evaluation MUST NOT probe the Capability by executing it to establish equivalence.

Additional conventions require separately specified, versioned Mapping Extension semantics explicitly identifiable from the Mapping subtree, using the Extension model in Part III. This baseline introduces no convention selector on `http:operation` and no generic mapping DSL. A conforming baseline-only implementation does not claim support for those additional features. A processor implementing an identified Extension evaluates that Extension's support separately; a document-external agreement alone MUST NOT be promoted to baseline conformance.

Example values:

```text
q = relink
page = 2
active = true
```

produce a query equivalent to:

```text
?active=true&page=2&q=relink
```

GET serialization for `object`, `array`, or `binary` is outside the baseline. If such an Input is present or required for a GET operation, a baseline-only Runtime reports the necessary mapping feature as `UNSUPPORTED`; it MUST NOT invent JSON-in-query, repeated-key, base64, or other serialization.

## 74.3 JSON Object Request Mapping

For `POST`, `PUT`, and `PATCH`, the baseline maps present Inputs to one JSON object:

```text
JSON member name  = Input name
JSON member value = Input value represented by its Core data type
```

Example Inputs:

```text
on = true
level = 0.75
```

produce:

```json
{
  "on": true,
  "level": 0.75
}
```

The request `Content-Type` is `application/json`. JSON member order has no semantic significance. An Invocation with no present Inputs maps to `{}`.

Core `string`, `number`, `integer`, `boolean`, `object`, and `array` values map to their corresponding JSON value kinds; an `integer` is represented by a JSON number with integral meaning. JSON serialization obeys JSON syntax, which does not provide `NaN` or infinity tokens. The baseline does not add an arbitrary-precision requirement or universal numeric range, exact-decimal, or rounding policy. Applicable numeric constraints and the Runtime's declared support determine whether a value is usable. Core `binary` has no baseline JSON request mapping and requires an additional mapping specification.

Methods other than `GET`, `POST`, `PUT`, and `PATCH` are permitted in `http:operation`, but their request Input mapping is not defined by this baseline. A Runtime may support such a method through an additional versioned HTTP mapping specification; otherwise the route is `UNSUPPORTED` when Input serialization is required.

## 74.4 No Generic Header DSL

The baseline MUST NOT interpret Input names as HTTP header names and provides no arbitrary header-expression language. Standard protocol headers generated by the Runtime, including `Content-Type` and representation negotiation headers, are not semantic Input remapping.

# 75. HTTP Response and Result Mapping

## 75.1 HTTP-level Outcome

Any HTTP status in the `2xx` class is an HTTP-level success. A non-`2xx` status is an HTTP Interface-level non-success in the baseline.

HTTP status is not a Capability semantic error identifier:

```text
HTTP status
≠ Capability semantic result
≠ Capability semantic error
```

The baseline MUST NOT infer a domain error such as `control-denied`, `insufficient-funds`, or `emergency-stop-active` solely from an HTTP status. A separate versioned semantic error mapping specification is required.

Network failure, timeout, TLS failure, CORS rejection, and malformed HTTP are transport or Interface failures, not Core validation failures.

## 75.2 Representation Selection

Representation selection is conceptually based on:

```text
caller preference
∩ Runtime support
∩ declared Entity Representations
∩ applicable HTTP support
```

Representation document order MUST NOT express preference. A Runtime MAY generate standard HTTP `Accept` negotiation from an explicit selection policy; this is not a generic header mapping DSL.

The baseline JSON Result mapping requires a declared `application/json` Representation when Result is present. When Result is absent, Section 75.4 applies instead; there is no Result Representation to select or validate.

For this JSON baseline, compatibility is determined by the following rules, not by Application sniffing or recovery policy:

1. Parse the declared media type and response `Content-Type` using the media-type syntax of [RFC 9110 Section 8.3.1](https://httpwg.org/specs/rfc9110.html#media.type). The response MUST contain exactly one syntactically valid `Content-Type` field value. Missing, malformed, repeated fields, a list of media types, or duplicate parameter names (compared ASCII case-insensitively) are Representation failures.
2. Compare type and subtype ASCII case-insensitively. Both the selected declaration and the response MUST be `application/json`. A structured suffix such as `application/problem+json` does not match merely because it ends in `+json`.
3. Parameter order has no significance. For this baseline, all syntactically valid, non-duplicate media-type parameters, including `charset` and unknown extra parameters, are ignored on both sides and MUST NOT affect compatibility or decoding. They supply no baseline semantic constraints. JSON is decoded as UTF-8 in accordance with [RFC 8259 Sections 8.1 and 11](https://www.rfc-editor.org/rfc/rfc8259.html#section-8.1); a parameter cannot select a different character encoding. Content that is not valid UTF-8 JSON is a Representation failure.
4. Matching the media type does not validate the body. Section 75.3 still requires the JSON object and semantic Output checks. Other media types and parameter-dependent mappings require a separately identified mapping specification and are outside this baseline claim.

For a declared `application/json`, these compatibility results are fixed (assuming a valid UTF-8 JSON body where applicable):

| Received Content-Type | Baseline media-type result |
|---|---|
| `application/json` | Compatible |
| `Application/JSON; Charset="utf-8"` | Compatible; parameter ignored |
| `application/json; vendor=example` | Compatible; extra parameter ignored |
| `application/problem+json` | Representation failure |
| No Content-Type field | Representation failure when Result is present |

Application policy may separately block or abort processing, but MUST NOT relabel a baseline mismatch as compatible or make a policy-specific recovery a baseline conformance result.

## 75.3 Baseline JSON Result

A JSON Result body MUST be a top-level JSON object. Each declared Output maps by exact name to one object member:

```text
JSON member name  = Output name
JSON member value = Output value
```

For a single Output named `temperature`, the baseline response is still an object:

```json
{
  "temperature": 21.4
}
```

The scalar shortcut below is not a valid baseline JSON Result for that declaration:

```json
21.4
```

Every declared Output MUST have a corresponding object member. Each member value MUST satisfy the Output's Core structural data type and all understood semantic constraints. Numeric decoding follows the selected JSON implementation and applicable numeric constraints; the baseline adds no arbitrary-precision or exact-decimal preservation requirement. A Runtime reports numeric support limitations separately from Core document validity.

Unknown JSON object members MAY be ignored unless the Capability Contract, Profile, or applicable Extension deterministically prohibits them. Ignoring an unknown member does not add it to AR-DOM or the semantic Result.

JSON member order has no semantic significance. Multiple Outputs use the same name-to-member rule.

## 75.4 No Result and HTTP 204

`204 No Content` is an HTTP-level success. It is compatible with an absent Result, which represents a semantic invocation with no returned value. An empty Result and a Result declaring no Outputs are invalid Draft 5 Core structures.

If one or more Outputs are declared, a `204` response or an otherwise absent body is a Result or Representation mapping failure, not successful semantic Output production.

When Result is absent, a Runtime MUST NOT invent an Output from a response body. For a valid `2xx` HTTP response, the baseline completes the invocation mapping without semantic Outputs whether the body is absent or present. The body MUST be ignored for Capability Result interpretation and MAY be discarded without parsing; its presence, contents, and Content-Type MUST NOT cause a baseline Result or Representation failure. This rule does not infer a remote business outcome or override transport failures, invalid HTTP framing, or an independently reported policy abort. A non-`2xx` response remains an HTTP Interface-level non-success. Any mapping that interprets an otherwise undeclared body requires a separate versioned mapping specification; Application policy MUST NOT silently redefine the baseline outcome.

## 75.5 Authentication and Authorization

Shared HTTP authentication prerequisites SHOULD be declared as Interface Requirements. Capability-specific authorization prerequisites MAY be declared as Capability Requirements.

The HTTP Extension does not issue, store, refresh, or forward credentials outside Runtime policy. `READY` does not guarantee that a server will authenticate or authorize the request.

# Part X — Conformance Classes

# 76. Conformance Overview

Conformance is claimed against a named class and specification version. A statement that a product or document is simply “AR-XML compliant” is incomplete unless its applicable class or classes are clear from context.

Draft 5 defines these principal classes:

| Conformance class | Conforming subject | Primary responsibility |
|---|---|---|
| AR-XML Producer | authoring tool or serializer | produce structurally valid AR-XML and preserve declared semantics |
| AR-XML Consumer | parser, validator, or AR-DOM consumer | process Core deterministically and preserve model boundaries |
| Runtime | evaluation and interaction implementation | expose separated states and execute only by explicit request |
| Extension | specification and implementation of an identified Extension | define and process named semantics within Core slots |
| Profile Evaluator | Profile conformance implementation | evaluate the required subset deterministically and report uncertainty |

A conforming implementation MAY claim more than one class. Conformance to one class does not imply conformance to another. These are the five baseline classes. Core Document validity is a document property, not a sixth implementation class. The terms Core Processor, Extension Processor, Runtime Evaluator, HTTP Extension Processor, and Invoking Runtime below describe operations or feature subsets within these classes; they do not replace or add baseline classes.

Examples:

```text
Core-valid Document
≠ document whose Extensions are all supported

Core Processor
≠ HTTP Extension Processor

HTTP Extension Processor
≠ support for every HTTP method

Runtime Evaluator
≠ Invoking Runtime
```

Conformance claims MUST identify Draft 5 or the exact specification version and MUST NOT imply support beyond the claimed class and features.

Test results, verified conformance, and certification are distinct from a self-declared conformance claim. This specification does not create a certification authority.

# 77. AR-XML Producer and Document Conformance

A conforming **AR-XML Producer** MUST emit documents satisfying every applicable Core structural requirement and MUST preserve declared semantics when serializing AR-DOM. Its output is a Core-valid document when it satisfies the following requirements:

- well-formed XML;
- Core `ar-entity` as the document element;
- the Core 0.1 namespace and `version="0.1"`;
- permitted Core elements, attributes, containment, and cardinalities;
- singleton container rules;
- required lexical values and Core data types;
- explicit Extension Slot envelope rules;
- Interface Attachment-or-Realization requirement;
- typed local ID uniqueness;
- Input and Output scoped-name uniqueness; and
- all local-reference integrity rules.

A Core Document MAY contain unknown foreign Extension roots in valid Extension Slots. It remains Core-conforming even when the current processor cannot validate or execute those Extensions.

A Core Document need not contain a Category, Identifier, Property, Subject, Profile Claim, Interface, or Capability. An empty passive Entity can conform.

Core Document conformance does not require:

- Capability Contract or Profile resolution;
- a `VALIDATED` projection;
- Profile conformance;
- Runtime or Extension support;
- network accessibility;
- authentication or authorization; or
- an executable Capability.

An unknown Core element, unknown Core or unqualified attribute, foreign element outside a slot, duplicate typed ID, dangling local reference, duplicate scoped Input or Output name, or empty Interface makes the document non-conforming.

Non-canonical Core child order does not make an otherwise valid document non-conforming.

# 78. AR-XML Consumer Conformance

A conforming **AR-XML Consumer** MUST implement the Core parsing and validation requirements below and preserve the information model for its advertised exposure operations. “Core Processor” is a descriptive role for these operations. Serializer requirements in Section 78.3 apply to the AR-XML Producer class.

## 78.1 Parser and Validator

A conforming Core parser and validator MUST:

- parse XML namespace-aware using a configuration suitable for untrusted input;
- recognize the Core namespace and `version="0.1"` under an explicitly selected Draft 5 processing context;
- reject unknown Core content rather than silently discard it;
- validate order-insensitively while enforcing cardinality and containment;
- enforce typed uniqueness, scoped-name uniqueness, and local references;
- validate Extension Slot envelopes without requiring Extension knowledge;
- distinguish XML parse errors from Core validation errors;
- accept unknown foreign roots in valid slots;
- avoid Semantic Identifier network dereferencing as a prerequisite for Core validity;
- construct or expose AR-DOM only for Core-valid documents; and
- avoid Capability execution during parsing, validation, or exposure.

Core parsing and validation MUST be deterministic and MUST NOT depend on AI or human interpretation.

## 78.2 AR-DOM Exposure

A Core Processor exposing AR-DOM MUST preserve the Core information model and keep issuer-authored description separate from resolved definitions and derived Runtime state.

It SHOULD preserve unknown foreign subtrees as opaque data. If it advertises round-trip preservation, it MUST disclose any lexical information it cannot retain and MUST NOT silently drop Extension content.

## 78.3 Serializer

A conforming Draft 5 serializer MUST emit well-formed XML using the Core namespace and `version="0.1"`. It MUST emit only structures valid for the Core model and SHOULD use the recommended canonical Core child order defined in Section 21.

Canonical child order does not authorize reordering collection members to imply preference. A serializer MUST preserve semantic collection membership, local references, and Extension subtree meaning.

An implementation may claim parser, validator, AR-DOM, or serializer functionality separately, but MUST state the supported operation when a general Core Processor claim would be ambiguous.

# 79. Extension Conformance

An **Extension** conformance claim MUST identify the Extension specification, namespace version, semantic roots, and supported slot contexts. An Extension specification MUST satisfy Part III, including explicit slot grammar, deterministic semantics, and preservation of Core meaning. An implementation claiming the Extension class performs the Extension Processor operations below; the claim MUST state whether it concerns a specification, its implementation, or both.

A conforming Extension Processor MUST:

- identify Extension elements by namespace URI and local name rather than prefix;
- validate the Extension root only in permitted Core slots;
- apply the Extension's declared grammar and semantics;
- reject invalid known Extension content for that Extension conformance class;
- preserve Core validation as a separate result;
- avoid changing Core cardinality, reference, or semantic rules;
- report unsupported Extension features through `Support` rather than invent behavior;
- treat Extension content as untrusted input; and
- avoid execution, credential access, or unrequested network activity during validation.

An implementation that only stores, displays, or reserializes an unknown subtree MUST NOT claim semantic conformance to that Extension.

An Extension Processor MUST identify feature limitations relevant to interoperability. For example, recognizing an Extension namespace while omitting a required constraint evaluator is not full support for that constraint.

Extension validity is not Core validity. A foreign subtree can be inside a Core-valid slot yet fail its recognized Extension grammar. Conversely, an unknown Extension can remain Core-valid without an Extension-specific conformance result.

Extension specifications MAY define additional named processor classes, but MUST NOT weaken these Core separation requirements.

# 80. Runtime and Profile Evaluator Conformance

## 80.1 Runtime Evaluator

A conforming **Runtime** implementing evaluation (the Runtime Evaluator role) MUST:

- keep description data separate from evaluation state;
- expose the state domains and values defined in Part VIII without collapsing them into a boolean;
- distinguish unresolved, unknown, unsupported, unsatisfied, and conflicting conditions;
- evaluate Attachment satisfaction separately and apply known-blocker precedence for InterfaceUse route evaluation, including `ATTACHMENT_UNSATISFIED`;
- generate Core Availability only for Capabilities with Invocation, and aggregate their routes as `any READY`, otherwise `any UNKNOWN`, otherwise `UNAVAILABLE`;
- keep Profile conformance independent of Availability;
- avoid using document order as implicit route preference;
- provide sufficient diagnostics to distinguish known blockers from uncertainty; and
- never execute a Capability to test availability.

A Runtime Evaluator MAY implement only a subset of Interface Extensions. Unsupported implementation capability is represented through `Support`; it is not a change to the specification's capability.

## 80.2 Invoking Runtime

A conforming **Runtime** implementing execution (the Invoking Runtime role) MUST also:

- require an explicit Application or Human request before Capability execution;
- preserve initiating intent through route selection and asynchronous work;
- validate Inputs under all implemented semantic rules before serialization;
- apply Runtime and host security policy;
- keep credential handling outside AR-DOM;
- distinguish transport, Interface, Representation, Contract, and semantic outcomes; and
- avoid rewriting the description with execution state or results.

An Invoking Runtime need not support every described Interface or Capability. It MUST report support and availability accurately for the features it claims.

## 80.3 HTTP Extension Processor

A conforming **HTTP Extension Processor** MUST:

- recognize the HTTP Extension namespace in Part IX;
- validate `http:api` only in Realization and `http:operation` only in Mapping;
- validate required `method` and `path` and the optional `base` attribute when present;
- use the final AR-XML retrieval URI when `base` is omitted, and resolve a relative or empty `base` against that URI rather than the Host Application URL;
- reject operation `path` values containing a scheme or authority, and construct the operation URL using strict RFC 3986 reference resolution with the shared Interface's scheme and authority;
- treat method support separately from method syntax validity;
- keep HTTP authentication and authorization in Requirement and Runtime policy; and
- distinguish HTTP-level outcomes from semantic Capability outcomes.

## 80.4 HTTP Baseline Mapping Features

An HTTP Runtime claiming the corresponding baseline mapping feature MUST implement it exactly:

| Feature claim | Required behavior |
|---|---|
| HTTP GET scalar request mapping | `string`, `number`, `integer`, and `boolean` Inputs mapped to query parameters within Section 74.2's wire-equivalence and no-collision boundary |
| HTTP JSON object request mapping | `POST`, `PUT`, and `PATCH` Inputs mapped to one JSON object |
| HTTP JSON Result mapping | top-level JSON object keyed by Output name, including for one Output |
| HTTP status classification | every `2xx` is HTTP-level success; non-`2xx` is Interface-level non-success |
| HTTP 204 handling | HTTP-level success; Result mapping succeeds only when Result is absent |
| HTTP response media-type matching | exact baseline type/subtype comparison and parameter handling under Section 75.2; no sniffing fallback |
| HTTP no-Result response | ignore body for semantic interpretation on valid `2xx`; no invented Outputs |

An implementation MUST NOT claim a mapping feature when it uses an incompatible scalar shortcut, changes the semantic Input names or types during query mapping, uses a generic header DSL as though it were the baseline, or infers semantic errors from HTTP status. HTTP baseline conformance permits wire-equivalent query serialization under Section 74.2, not arbitrary receiver-dependent encodings. A baseline-only Runtime MUST report required receiver-specific lexical conventions or query-name collision handling as `UNSUPPORTED`, and unknown compatibility as `UNKNOWN`. Additional versioned Mapping Extension semantics must be explicitly identifiable from the Mapping subtree; an implicit deployment agreement does not establish baseline conformance.

An HTTP Extension Processor is not required to implement every valid HTTP method. For a syntactically valid but unimplemented method or mapping feature it MUST report `UNSUPPORTED`, not declare the AR-XML Core document invalid.

## 80.5 Conformance Reporting

An implementation conformance statement SHOULD identify:

- specification version;
- claimed classes;
- supported Extension namespaces and versions;
- supported HTTP methods and mapping features;
- implemented semantic resolvers and constraint evaluators;
- relevant Runtime policy limitations; and
- test-suite version, when a conformance test suite is used.

A Profile Claim in an Entity document is not an implementation conformance statement for the Runtime.

## 80.6 Profile Evaluator

A conforming **Profile Evaluator** MUST:

- establish Core document validity separately from semantic conformance;
- use exact Contract/Profile identity and the usable-definition rules in Sections 38 and 43;
- expose ProfileResolution separately from ProfileConformance;
- evaluate required items with the default matching and candidate aggregation rules in Sections 44–45 unless the Profile explicitly defines another deterministic rule;
- exclude optional-item diagnostics from baseline required-subset aggregation, while evaluating independently required constraints in their declared scope;
- apply the open-world default and placement-scoped Requirement policies;
- reject known invalid Profile definitions as `UNRESOLVED` with conformance `UNDETERMINED`, rather than blaming the Entity;
- preserve unknown required semantics as `UNDETERMINED` and avoid assuming compatible narrowing;
- keep Profile Claim, verified evaluation, certification, Runtime Support, and Availability separate; and
- evaluate without required AI inference or automatic Capability execution.

Profile Evaluator conformance does not require invocation support or network resolution. Unsupported semantic features MUST be disclosed and handled through the defined uncertainty states.

# Part XI — Examples

# 81. Empty Passive Entity

The smallest Draft 5 document describes a valid passive Entity with no other declarations:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1" />
```

This document is Core-valid. It does not imply a CPU, network connection, API, Interface, Capability, Canonical Entity Identity, or current availability.

# 82. Properties-only Entity

An Entity may contain declared characteristics without being invocable:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1">

  <category>laboratory.instrument</category>

  <properties>
    <property
      type="https://example.org/properties/manufacturer/1"
      value="Example Instruments" />

    <property
      type="https://example.org/properties/rated-voltage/1"
      value="5"
      unit="V" />

    <property
      type="https://example.org/properties/rated-voltage/1"
      value="9"
      unit="V" />
  </properties>
</ar-entity>
```

The repeated Property `type` is valid. Core does not infer which voltage is preferred, current, or applicable under a particular configuration.

# 83. Identifier and Subject

Identifiers may apply either to the described Entity or to a lightweight Subject:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1">

  <identifiers>
    <identifier
      type="https://example.org/identifier-schemes/asset-id/1"
      value="LAB-DEVICE-0042" />

    <identifier
      type="https://example.org/identifier-schemes/serial/1"
      value="TEMP-8831"
      subject-ref="temperature-module" />
  </identifiers>

  <subjects>
    <subject
      id="temperature-module"
      type="https://example.org/subject-types/sensor-module/1" />
  </subjects>
</ar-entity>
```

`temperature-module` is not a nested Entity. Neither Identifier is automatically a Locator, credential, or Canonical Entity Identity.

# 84. Attachment-only Interface

A passive physical connector can be described without a Capability or network Realization:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  xmlns:phys="https://example.org/ns/arxml/physical/1"
  version="0.1">

  <interfaces>
    <interface id="display-connector">
      <attachment>
        <phys:connector
          family="hdmi"
          form="type-a" />
      </attachment>
    </interface>
  </interfaces>
</ar-entity>
```

The Interface is valid because Attachment is present. Core validation does not need to understand the `phys:connector` semantics.

# 85. Capability without Invocation

A Capability may describe a semantic affordance without defining a request-oriented Invocation:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1">

  <capabilities>
    <capability
      id="status-observable"
      type="https://example.org/capabilities/status/observable/1" />
  </capabilities>
</ar-entity>
```

The document is valid. Core request-oriented Availability for this Capability is `UNAVAILABLE`; the declaration may still be useful as semantic description or to a future observation Extension.

# 86. Capability without InterfaceUse

A Capability may define its request and Result contract projection without declaring a route:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1">

  <capabilities>
    <capability
      id="label-read"
      type="https://example.org/capabilities/label/read/1">

      <invocation>
        <result>
          <outputs>
            <output
              name="label"
              type="string" />
          </outputs>

          <representations>
            <representation media-type="application/json" />
          </representations>
        </result>
      </invocation>
    </capability>
  </capabilities>
</ar-entity>
```

The Capability is Core-valid but has zero InterfaceUse routes. A Runtime does not invent an endpoint from the Contract identifier.

# 87. Shared HTTP Interface

One Entity-level HTTP Interface can be shared by multiple Capabilities:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  xmlns:http="https://relink.dev/ns/arxml/http/0.1"
  version="0.1">

  <interfaces>
    <interface id="web-api">
      <realization>
        <http:api base="./api/" />
      </realization>
    </interface>
  </interfaces>

  <capabilities>
    <capability
      id="status-read"
      type="https://example.org/capabilities/status/read/1">

      <invocation>
        <result>
          <outputs>
            <output name="status" type="string" />
          </outputs>
          <representations>
            <representation media-type="application/json" />
          </representations>
        </result>
      </invocation>

      <interface-uses>
        <interface-use ref="web-api">
          <mapping>
            <http:operation method="GET" path="status" />
          </mapping>
        </interface-use>
      </interface-uses>
    </capability>

    <capability
      id="reset"
      type="https://example.org/capabilities/device/reset/1">

      <invocation />

      <interface-uses>
        <interface-use ref="web-api">
          <mapping>
            <http:operation method="POST" path="reset" />
          </mapping>
        </interface-use>
      </interface-uses>
    </capability>
  </capabilities>
</ar-entity>
```

`http:api` holds shared HTTP configuration. Each `http:operation` holds only the Capability-specific method and path.

# 88. Multiple InterfaceUses

One semantic Capability can have routes over different Interface Extensions without duplicating the Capability:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  xmlns:http="https://relink.dev/ns/arxml/http/0.1"
  xmlns:ble="https://example.org/ns/arxml/ble/1"
  version="0.1">

  <interfaces>
    <interface id="web-api">
      <realization>
        <http:api base="./api/" />
      </realization>
    </interface>

    <interface id="ble-service">
      <realization>
        <ble:service uuid="12345678-1234-1234-1234-123456789000" />
      </realization>
    </interface>
  </interfaces>

  <capabilities>
    <capability
      id="power-set"
      type="https://example.org/capabilities/power/set/1">

      <invocation>
        <inputs>
          <input
            name="on"
            type="boolean"
            required="true" />
        </inputs>
      </invocation>

      <interface-uses>
        <interface-use ref="web-api">
          <mapping>
            <http:operation method="POST" path="power/state" />
          </mapping>
        </interface-use>

        <interface-use ref="ble-service">
          <mapping>
            <ble:write characteristic="12345678-1234-1234-1234-123456789001" />
          </mapping>
        </interface-use>
      </interface-uses>
    </capability>
  </capabilities>
</ar-entity>
```

This is one Capability with two independently evaluated routes. Their order is not preference. A Runtime may support HTTP, BLE, both, or neither.

# 89. Unknown Foreign Extension

Unknown foreign content remains Core-valid when it occurs in a permitted Extension Slot:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  xmlns:vendor="https://vendor.example/ns/arxml/device/7"
  version="0.1">

  <properties>
    <property
      type="https://example.org/properties/model/1"
      value="X100" />

    <vendor:declared-characteristic
      name="service-class"
      value="precision" />
  </properties>

  <interfaces>
    <interface id="vendor-link">
      <realization>
        <vendor:link mode="local" />
      </realization>
    </interface>
  </interfaces>
</ar-entity>
```

A Core processor that does not recognize the vendor namespace still accepts the Core structure and should preserve both foreign subtrees. It does not claim that the vendor Extension is valid or supported.

# 90. Reference Lab Light Control

The Reference Lab light control semantic intent is:

```text
light.setState(on:boolean)
```

It is represented by one semantic Capability, one Entity-level shared HTTP Interface, and one HTTP InterfaceUse Mapping:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  xmlns:http="https://relink.dev/ns/arxml/http/0.1"
  version="0.1">

  <category>reference-lab.device</category>

  <interfaces>
    <interface id="web-api">
      <realization>
        <http:api base="./api/" />
      </realization>
    </interface>
  </interfaces>

  <capabilities>
    <capability
      id="light-set-state"
      type="https://relink.dev/capabilities/light/set-state/1">

      <invocation>
        <inputs>
          <input
            name="on"
            type="boolean"
            required="true" />
        </inputs>
      </invocation>

      <interface-uses>
        <interface-use ref="web-api">
          <mapping>
            <http:operation
              method="POST"
              path="light/state" />
          </mapping>
        </interface-use>
      </interface-uses>
    </capability>
  </capabilities>
</ar-entity>
```

Baseline request body:

```json
{
  "on": true
}
```

An HTTP `204 No Content` response is compatible because this Invocation declares no Outputs. Loading this document MUST NOT send the request.

# 91. Reference Lab Temperature Reading

The Reference Lab temperature semantic intent is:

```text
temperature.read()
→ temperature:number
```

The following complete document combines it with the light control Capability while sharing the same Entity-level HTTP Interface:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  xmlns:http="https://relink.dev/ns/arxml/http/0.1"
  version="0.1">

  <category>reference-lab.device</category>

  <interfaces>
    <interface id="web-api">
      <realization>
        <http:api base="./api/" />
      </realization>
    </interface>
  </interfaces>

  <capabilities>
    <capability
      id="light-set-state"
      type="https://relink.dev/capabilities/light/set-state/1">

      <invocation>
        <inputs>
          <input
            name="on"
            type="boolean"
            required="true" />
        </inputs>
      </invocation>

      <interface-uses>
        <interface-use ref="web-api">
          <mapping>
            <http:operation
              method="POST"
              path="light/state" />
          </mapping>
        </interface-use>
      </interface-uses>
    </capability>

    <capability
      id="temperature-read"
      type="https://relink.dev/capabilities/temperature/read/1">

      <invocation>
        <result>
          <outputs>
            <output
              name="temperature"
              type="number" />
          </outputs>

          <representations>
            <representation media-type="application/json" />
          </representations>
        </result>
      </invocation>

      <interface-uses>
        <interface-use ref="web-api">
          <mapping>
            <http:operation
              method="GET"
              path="temperature" />
          </mapping>
        </interface-use>
      </interface-uses>
    </capability>
  </capabilities>
</ar-entity>
```

Baseline temperature response:

```json
{
  "temperature": 21.4
}
```

The single Output still uses a JSON object. A scalar `21.4` response is not the baseline mapping.

An Entity Resolver may map a Reference Lab Entity identity or application reference to this AR-XML resource location. It does not resolve the two Capability Contracts, choose the HTTP route, or execute either Capability. Those responsibilities remain with the Semantic Registry and explicit Runtime operations.

# Part XII — Security and Privacy Considerations

# 92. Security Considerations

**Normative Core boundary.** The applicable Producer, Consumer, Runtime, Extension, and Profile Evaluator requirements are limited here to the following:

- Consumers MUST perform secure namespace-aware XML processing as specified in Section 92.1.
- Producers MUST NOT embed Credentials or reusable secrets in AR-XML; consumers MUST NOT treat Requirement data as Credentials.
- Loading, resolution, validation, exposure, and evaluation MUST NOT invoke a described Capability. Execution MUST originate from an explicit Application or Human request.
- Claims, resolution, availability, authentication, authorization, and execution MUST remain distinct; issuer data MUST NOT become verified truth merely through parsing.
- Deterministic interoperability and conformance MUST NOT require AI or LLM inference.

The following introductory discussion and Sections 92.2–92.8 are **informative implementation guidance**. They preserve deployment advice on network targets, cache protection, redirects, retries, replay, isolation, and physical safety without adding Core conformance gates. Where they restate another section, that section remains the normative source; deployment policy and its enforcement remain outside Core.

AR-XML describes Entities, semantic contracts, interaction surfaces, and possible invocation mappings. A description may influence network access or physical behavior when an Application explicitly invokes a Capability. Implementations must therefore treat every AR-XML document, resolved semantic definition, Extension subtree, Runtime response, and registry result as untrusted input unless an independent trust policy establishes otherwise.

Core validity is not a security decision. A document can be structurally valid while containing deceptive issuer claims, dangerous operation mappings, hostile endpoint locations, privacy-sensitive data, or semantics that the consumer should not trust. Similarly, a resolved Capability Contract or Profile is not trusted merely because its identifier is syntactically valid or its definition is available.

## 92.1 Secure XML Processing

An AR-XML processor MUST use a namespace-aware XML parser and MUST NOT fetch external entities, external DTD subsets, schemas, stylesheets, or other external resources as a side effect of parsing. A processor SHOULD reject or disable constructs that can cause entity expansion, recursive inclusion, or implementation-dependent network access.

Implementations MUST apply resource limits appropriate to their environment, including limits on document size, element depth, attribute count and size, text length, collection length, and diagnostic accumulation. Extension subtrees are subject to the same resource controls even when they are preserved as opaque data.

Core processors MUST enforce the closed Core vocabulary defined by this specification. They MUST NOT repair an unknown Core element or Core/unqualified attribute by silently dropping it, treating it as an Extension, or guessing a replacement. Foreign child elements are accepted only in an Extension Slot; foreign metadata attributes follow Section 32.3. Acceptance of an unknown foreign subtree does not authorize parsing it with an unsafe format-specific processor or executing content found within it.

## 92.2 Claims, Trust, and Semantic Definitions

Identifiers, Properties, Profile Claims, Interface declarations, and Capability projections are issuer-declared data. They must not be treated as verified identity, ownership, authority, certification, current state, or permission without evidence evaluated outside AR-XML.

In particular:

- an Identifier is not automatically a Canonical Entity Identity, locator, Credential, or proof of possession;
- a Profile Claim is not Verified Conformance or Certification;
- a declared Requirement does not prove that the Requirement is satisfied or enforced;
- a `READY` Availability result does not prove authorization, remote acceptance, safe execution, or successful outcome; and
- support for an Extension does not establish trust in documents that use that Extension.

Semantic Registry implementations must guard against definition substitution, cache poisoning, downgrade, and conflicting definitions. They must preserve exact versioned identity and must not apply silent first-wins behavior when different definitions claim the same identifier. Registry and cache entries should retain source, retrieval time, integrity information when available, and the trust decision that admitted the definition. Applications may require signatures, digests, authenticated delivery, local approval, or another provenance policy; such mechanisms are outside Core.

Network retrieval of semantic definitions is optional. A Runtime must not weaken its trust policy merely because a definition cannot be obtained from a preferred source. Failure to resolve or trust a definition produces an unresolved or policy-specific failure state; it does not justify guessing its semantics.

## 92.3 Resolution and Network Target Security

Entity resolution, semantic resolution, and Capability execution are separate activities and should use separate policy boundaries. An Entity Resolver maps Entity identity to an AR-XML location. A Semantic Registry maps a semantic identifier to a semantic definition. Neither operation authorizes later execution.

Any network location obtained from an Entity Resolver, semantic definition, Interface Realization, Mapping, redirect, or Extension must be validated against Application and deployment policy before access. Implementations should defend against server-side request forgery and related target-confusion attacks, including:

- disallowed URI schemes or ports;
- loopback, link-local, private, multicast, metadata-service, and otherwise protected address ranges;
- DNS rebinding and changes between validation and connection;
- redirects to a less trusted origin or scheme;
- authority confusion caused by user information, Unicode, percent encoding, or normalization differences; and
- relative URL resolution against an attacker-controlled or incorrect base.

The HTTP baseline resolves a relative `http:api` `base` against the AR-XML retrieval URL. This deterministic rule does not make the resulting origin trusted. A Runtime must apply its target policy after URL resolution and again after every redirect. Applications should use origin allowlists, transport requirements, redirect limits, and network isolation appropriate to the deployment.

Document retrieval, semantic resolution, Availability evaluation, and `ARRuntime.load()` must not invoke a described Capability or send mapped Capability Inputs as a probe. A Runtime may perform explicitly configured retrieval needed to resolve or fetch descriptions, but it must keep that traffic distinguishable from Capability execution.

## 92.4 Credentials, Authentication, and Authorization

An AR-XML document must not contain passwords, private keys, bearer tokens, API secrets, refresh tokens, session cookies, or other reusable secrets. Requirement data may identify an authentication or authorization mechanism, credential class, audience, or policy, but it must not embed the Credential itself.

Credentials are supplied and managed by the Runtime, Host Application, operating environment, or user agent under an independent policy. A Runtime should apply least privilege, scope Credentials to the intended origin and operation, prevent forwarding across unapproved redirects, and avoid exposing them to Extension processors or diagnostic output. Ambient browser credentials and cookies require explicit cross-origin and request-forgery protections; their presence must not be inferred solely from an Interface declaration.

Successful authentication does not imply authorization. Requirement evaluation does not replace enforcement by the target system. An Application must expect the remote system or physical controller to make its own authorization decision at execution time.

## 92.5 Explicit Execution and Side Effects

`ARRuntime.load()` consists of Resolve, Fetch, Parse, Validate, and Expose. It must not automatically execute a Capability. Availability evaluation, Profile validation, preview generation, route discovery, and UI enumeration likewise must not cause a side-effecting invocation.

Execution begins only from an explicit request by an Application or Human. An Invoking Runtime must preserve that initiating intent through route selection, asynchronous processing, redirects, authentication challenges, and retries. It must not convert background discovery, prefetch, or validation into an execution request.

Applications should require additional confirmation, policy approval, rate limits, or safety interlocks for operations that can affect people, property, money, access control, or the physical environment. AR-XML does not establish that an operation is safe merely because it is described by a Capability Contract or evaluates as `READY`.

Retries can duplicate side effects. A Runtime must not assume idempotency from an HTTP method, Capability name, or semantic similarity alone. Automatic retry is permitted only when the applicable contract, Extension semantics, or Application policy establishes safe retry behavior. Implementations should protect against replay where freshness or one-time authorization matters.

## 92.6 Invocation and Result Handling

Before serialization, an Invoking Runtime must validate supplied Inputs under all Core, resolved Contract, Profile, Extension, and Application rules it implements. Unknown or unvalidated constraints must remain visible to the caller and must not be treated as satisfied. A Runtime should enforce size limits, timeouts, cancellation, response limits, and bounded concurrency for invocation processing.

Transport success is not semantic success. HTTP `2xx` indicates HTTP-level success only. Conversely, a non-`2xx` response must not be reclassified as a successful Capability outcome merely because a response body can be parsed.

All response representations are untrusted. Implementations must validate media type, representation size, syntax, and semantic shape before exposing typed Outputs. JSON objects, XML content, binary data, text, URLs, and error messages must be handled using format-appropriate safe parsers and output encoding. A Runtime must not inject returned text or markup into an executable HTML, script, command, template, or query context without the protections required by that context.

Representation order is not a trust ranking. Content-Type alone is not proof that content is safe or authentic. If a returned representation does not match the selected or negotiated Representation, the Runtime must report the mismatch rather than coercing it through heuristic interpretation.

## 92.7 Extension Processor and Plugin Isolation

An Extension processor may interpret Attachment, Realization, Mapping, Requirement, Property, Constraint, or other extension-defined data. Supporting an Extension can therefore expand the Runtime's attack surface.

Extension processors should run with the least privileges needed for their declared function. Merely validating or preserving an Extension must not grant it unrestricted file, network, process, device, UI, or Credential access. Extension validation should be deterministic and free of externally visible side effects. Executable scripts or code embedded in an Extension subtree are not executed by Core processing.

A Runtime must distinguish:

- recognizing an Extension namespace;
- validating its syntax;
- evaluating its semantics;
- determining Runtime support; and
- authorizing and executing an operation that uses it.

Success at one stage does not imply success or permission at a later stage.

## 92.8 Physical and Operational Safety

Capabilities may control devices or processes that can cause physical harm even when the described Entity has no CPU or network interface of its own. An Interface may lead through a gateway, adapter, Human procedure, or other external realization. The absence of an obvious network endpoint is therefore not evidence that execution is harmless.

This specification does not define hazard analysis, emergency-stop behavior, interlocks, operator qualification, safe motion, medical safety, industrial control safety, or functional-safety certification. Applications operating in such domains must apply the relevant independent safety rules before invocation. Runtime Availability states are informational inputs to that decision, not safety approvals.

AI or LLM processing may assist user interfaces, authoring, or diagnostics, but deterministic validation, security policy enforcement, conformance classification, and authorization must not depend on probabilistic AI interpretation. An AI-generated mapping, target, Input, or explanation must be treated as untrusted until accepted through the same explicit and deterministic controls as any other input.

# 93. Privacy Considerations

**Informative implementation guidance.** This section adds no Core conformance requirements for legal basis, consent mechanisms, retention, disclosure policy, telemetry, or deployment controls. Core requirements concerning secrets, issuer claims, explicit invocation, and separation of description from Runtime state remain normative in their defining sections.

An AR-XML document can reveal substantially more than a transport endpoint. Identifiers, Properties, Subjects, Profile Claims, Capability names, Interface details, Requirements, semantic identifiers, and extension data may identify a person or organization, expose device characteristics, describe accessibility or health-related functions, reveal operational state, or advertise an attack surface. A document remains privacy-sensitive even when it describes a passive or offline Entity.

Publishers and processors should apply data minimization, purpose limitation, access control, retention limits, and deletion policies appropriate to the deployment. They should avoid publishing data merely because the Core model permits it. Distribution of a document should be no broader than necessary for its intended use.

## 93.1 Identifiers, Subjects, Properties, and Claims

Core does not automatically interpret an Identifier as a person's identity, but stable Identifier values can still enable correlation across documents, registries, locations, and time. Combining several non-unique Identifiers or Properties can produce a unique fingerprint. Implementations should avoid exposing full stable identifiers when a scoped, rotated, pseudonymous, or user-mediated reference would meet the same purpose.

`subjectRef` is a semantic reference, not a privacy boundary. A lightweight Subject may still represent a person, body part, room, asset, or component whose association with the described Entity is sensitive. Processors must apply access and disclosure policy to the referenced data rather than assuming that Subject data is harmless because it is not a nested Entity.

Properties are issuer-declared characteristics or state, not absolute truth. Nevertheless, collecting, indexing, or redistributing them may have privacy consequences. Profile Claims can expose memberships, roles, product classes, accessibility features, or claimed certifications. Consumers must not present such claims as verified facts, and publishers should consider whether the claim itself should be disclosed.

## 93.2 Location and Runtime Context

Core intentionally does not define direct latitude or longitude fields. Stable declared location may be represented by a Geo Extension or another typed Property, while a moving Entity's current position is generally Runtime Context or the result of a Capability such as `position.read`. This separation does not make location data non-sensitive.

Precise, repeated, historical, inferred, or real-time location can reveal habits, occupancy, identity, and safety-relevant information. Location producers and consumers should minimize precision, frequency, retention, and audience; establish a purpose and legal basis where applicable; and obtain user control or consent when required. Cached location must retain appropriate freshness metadata so that a stale value is not silently presented as current.

An Application must not infer consent to retrieve current location from the presence of a location-related Property, Capability, Contract, or Profile Claim. Reading a current position is an invocation and requires the same explicit request, Requirement evaluation, and authorization handling as other Capabilities.

## 93.3 Invocation Data and Telemetry

Capability Inputs and Outputs can contain personal data even when the Capability type appears routine. Query parameters may be recorded in browser history, intermediary logs, server logs, analytics systems, and referrer data. HTTP mappings should avoid placing sensitive values in a URL unless the Contract and deployment explicitly require it and appropriate controls exist. Transport confidentiality and integrity should be used whenever invocation data, Credentials, identifiers, or operational details require protection.

Applications and Runtimes should collect and retain only the Inputs, Outputs, errors, timing data, and network metadata needed for the stated purpose. Diagnostic records should prefer structural information such as semantic identifier, state, validation category, and AR-DOM path. They should redact or omit Credential material, Identifier values, Property values, Input and Output values, response bodies, URLs containing sensitive queries, and opaque Extension payloads unless those values are necessary and protected.

Semantic Results belong to an invocation outcome, not to the Entity description. A Runtime must not silently persist a Result as a Property or republish it in AR-XML. Any such transformation is a separate Application action subject to provenance, freshness, consent, and retention policy.

## 93.4 Resolution and Registry Privacy

Resolution requests can disclose what Entity, Capability Contract, Profile, or Extension a user or Application is interested in. Repeated requests can reveal inventory, behavior, location, or organizational relationships even when the retrieved definition is public.

Resolvers and Semantic Registries should support privacy-preserving deployment choices such as built-in definitions, local registries, caches, Application-provided registries, and installed plugins. Network resolution is not mandatory. When network resolution is used, implementations should minimize transmitted context, avoid sending the full Entity document unless explicitly required, partition caches where cross-user correlation is a concern, and apply retention and logging controls to requested identifiers.

An exact versioned absolute identifier is semantic identity, not consent to contact every network location suggested by its URI form. Dereferencing policy must remain separate from identifier comparison and validation.

## 93.5 Unknown Extensions and Derived Information

An unknown Extension subtree can contain personal or confidential data even when Core preserves it opaquely. Opaque preservation, copying, canonical serialization, logging, signing, or forwarding are all data processing actions. Implementations should treat unknown Extension content as potentially sensitive and should avoid unnecessary inspection or propagation.

Deterministic interoperability does not require behavioral or personal inference beyond declared semantics. Implementations must not require AI or LLM inference to decide privacy-sensitive meaning, conformance, or disclosure policy. Applications using AI to summarize or enrich AR-XML should disclose that processing where appropriate, minimize submitted data, and avoid deriving sensitive attributes without a separate lawful and user-visible basis.

AR-XML conformance does not establish compliance with any privacy, data-protection, communications, sector-specific, or records-retention law. Publishers, registry operators, Runtime providers, and Applications remain responsible for the obligations that apply to their processing and deployment.

# Part XIII — Namespace, Registry, and Evolution Considerations

# 94. Namespace Considerations

XML namespaces distinguish the closed AR-XML Core vocabulary from independently defined Extension vocabularies. They identify vocabularies; they do not establish trust, ownership, availability, authorization, or a network retrieval requirement.

## 94.1 Core Namespace and Document Version

The Core 0.1 namespace name is:

```text
https://relink.dev/ns/arxml/core/0.1
```

The Draft 5 root version is:

```text
0.1
```

The namespace and root `version` value identify the Core 0.1 family; selecting the Draft 5 grammar additionally requires the explicit processing context defined in Section 19. A processor MUST compare the namespace name and version value exactly. It MUST NOT use URI normalization, redirects, fetched content, prefix spelling, or local-name-only comparison to decide that another name is equivalent.

The namespace name is an identifier, not an instruction to retrieve a schema or other resource. A processor MAY use a built-in or locally installed schema, but parsing and Core validation MUST NOT depend on dereferencing the namespace URI.

The unqualified root `version` attribute is part of the Core serialization. Default XML namespaces do not apply to attributes. Producers MUST therefore emit Core attributes unqualified unless this specification explicitly states otherwise. A namespace declaration is XML syntax and is not an AR-DOM Property or attribute.

The `https://relink.dev/ns/arxml/core/0.1` namespace is reserved for elements and attributes defined by the AR-XML Core 0.1 specification family. Applications and Extensions MUST NOT mint private elements or attributes in that namespace.

## 94.2 Core Vocabulary Closure

Draft 5 is a closed Core vocabulary. The following are invalid:

- an unknown Core-namespace element;
- an unknown Core-namespace attribute;
- an unknown unqualified attribute on a Core element; and
- a foreign element outside an explicit Extension Slot.

An implementation MUST NOT reinterpret invalid Core content as an Extension merely to obtain forward compatibility. It also MUST NOT accept a future Core element by ignoring it. A future Core grammar is processed under its own explicitly recognized version rules.

XML namespace aliases have no semantic significance. The following declarations may denote the same Core namespace:

```xml
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1" />
```

```xml
<ar:ar-entity
  xmlns:ar="https://relink.dev/ns/arxml/core/0.1"
  version="0.1" />
```

A processor MUST preserve namespace identity rather than prefix spelling. A canonical serializer MAY choose stable prefixes, but changing a prefix alone does not change AR-DOM semantics.

## 94.3 Extension Namespace Ownership

Every Extension semantic element MUST use a non-Core namespace and occur in an Extension Slot permitted by Part III. An Extension specification SHOULD publish:

- a stable namespace name under authority controlled by its maintainer;
- the Extension versioning policy;
- the elements and attributes permitted at each applicable slot;
- deterministic validation and processing rules;
- the semantic identifiers it defines or uses;
- compatibility and deprecation policy; and
- security and privacy considerations.

Use of an Extension namespace does not imply endorsement by the Core specification. Namespace control does not prove that a particular document, definition, processor, or publisher is trusted.

An Extension MUST NOT assign a new meaning to Core elements, Core attributes, Core cardinalities, local reference rules, or Runtime evaluation states. It MAY add element-based semantics through its declared Extension elements in the applicable slots and metadata through foreign attributes as defined in Section 32.3. An Extension that needs incompatible Core structure requires a future Core version rather than namespace tricks or out-of-slot content.

## 94.4 Namespace and Semantic Identifier Separation

An XML namespace identifies a vocabulary. A Semantic Identifier identifies a semantic definition such as a Capability Contract, Profile, Property type, Identifier scheme, Requirement type, Subject type, or other registered concept. These roles are distinct:

```text
XML namespace
= vocabulary identity

Semantic Identifier
= semantic definition identity
```

An Extension namespace MAY also be an absolute URI, but it MUST NOT be used as an implicit substitute for the exact identifiers of every semantic definition in that vocabulary. Conversely, sharing a URI authority or string prefix does not establish semantic equivalence, compatibility, trust, or common governance.

Core does not reserve short prefixes such as `http`, `phys`, `auth`, or `geo`. Examples use readable prefixes only for presentation. Producers and consumers MUST compare namespace names, not those example prefixes.

# 95. Registry Considerations

AR-XML does not require a mandatory centralized registry. Deterministic resolution may use built-in definitions, a local registry, a cache, an Application-provided registry, an installed Extension or plugin, a network service, or a policy-controlled combination of these sources.

The normative Core registry boundary is the resolution model in Part VI: built-in, local, cache, Application, plugin, and network sources are permitted; source priority is Runtime policy; exact identities MUST be preserved; conflicting acceptable definitions MUST NOT use silent first-wins; and resolution MUST remain separate from trust, authentication, authorization, and execution. Cache design is an implementation detail. Registry protocol, discovery, registration records, lifecycle, governance, federation, and trust mechanisms are outside Core.

Sections 95.1–95.5 below are **informative implementation guidance**, retaining the rationale and operational options without defining mandatory registry fields or new Core conformance gates. Statements summarizing resolution rules refer back to Part VI.

## 95.1 Registry Roles

A Semantic Registry maps an exact Semantic Identifier to a semantic definition. It may contain or resolve:

- Capability Contracts;
- Profiles;
- Property and Identifier type definitions;
- Requirement semantics;
- Subject or Category vocabularies;
- Extension definitions and constraint semantics; and
- other versioned semantic resources used by an AR-XML processor.

A Semantic Registry is separate from an Entity Resolver:

```text
Entity Resolver
= Entity identity → AR-XML location

Semantic Registry
= Semantic Identifier → semantic definition
```

A registry must not treat an Entity Identifier as a document locator unless a separately configured Entity Resolver rule defines that mapping. A registry also must not execute a Capability, supply Credentials, authenticate a publisher, authorize a caller, or certify conformance merely because it returned a definition.

## 95.2 Registration Records and Exact Identity

A registry record should preserve at least:

- the exact Semantic Identifier;
- the semantic resource kind;
- the versioned definition or a stable reference to it;
- source and provenance information;
- integrity information when available;
- publication, retrieval, or cache time when relevant;
- lifecycle status such as active, deprecated, or withdrawn; and
- the trust or admission policy under which the definition is usable.

Registry metadata is not part of the semantic definition unless the applicable specification explicitly says so. Retrieval time, popularity, source priority, or lifecycle status must not silently change Contract or Profile meaning.

Normative Capability Contract and Profile identities must be exact-versioned absolute identifiers. A moving alias such as `latest` may be offered for discovery, but the registry must return or select an exact identifier before deterministic validation. The alias itself must not be stored in AR-XML as normative Contract or Profile identity.

Once published, a definition associated with an exact identifier should be immutable. Any normative semantic change requires a new exact identifier. Correcting transport metadata, registry indexing, or an editorial description may retain the identifier only when it cannot change deterministic interpretation or conformance results.

## 95.3 Conflicts and Multiple Sources

Multiple registry sources may return candidates for the same exact identifier. If the candidates are semantically or bytewise equivalent under a defined comparison rule, a registry may coalesce them while preserving provenance. If they conflict, the registry must not use silent first-wins, source order, document order, cache timing, or lexical preference as an implicit decision rule.

A policy may deterministically reject untrusted candidates before semantic resolution. After that policy is applied, resolution is `RESOLVED` only when exactly one usable definition remains. Otherwise it is `UNRESOLVED`, and the processor should report the conflicting sources without exposing sensitive registry or credential data.

Implementations should defend against namespace or identifier squatting, malicious re-registration, cache poisoning, rollback, downgrade, stale entries, and substitution. Appropriate controls may include authenticated publication, signatures, content digests, append-only logs, administrator approval, pinned definitions, or trusted local packages. Core does not mandate one trust mechanism.

## 95.4 Caching and Offline Operation

Caching is permitted but must preserve exact identity, source, and applicable trust policy. A cache must not answer an exact identifier with a newer, older, or allegedly compatible definition. Cache invalidation and retention policy are deployment concerns, but stale or withdrawn status should be observable to the Application when it can affect policy.

Negative caching may reduce repeated failed lookups, provided it is bounded and does not turn a temporary failure into a permanent `UNRESOLVED` result. A cached definition must not become trusted solely because it was cached successfully in the past.

Offline operation is a first-class deployment mode. A conforming processor may resolve all supported semantics from built-in, local, cached, or Application-provided sources. Network access is never required solely because a Semantic Identifier uses an HTTP or HTTPS URI form.

## 95.5 Registry Extensibility and Governance

A registry may support resource kinds beyond those defined by Draft 5, but unknown kinds must not be coerced into a known kind. Resource-kind dispatch, definition validation, and processor support should be explicit and versioned.

Registry governance should define identifier allocation, maintainer authority, review policy, immutability, deprecation, dispute handling, archival availability, and security response. Federated registries should make authority and precedence rules visible rather than presenting federation order as semantic truth.

Core does not recreate external identifier systems or standards. GTIN, VIN, MAC, IPv6, IMEI, OPC UA, AAS, WoT, and other domain identifiers remain governed by their respective specifications. A registry definition may reference such a scheme, but must not silently redefine it under an AR-XML-specific enum.

# 96. Evolution and Compatibility

Evolution must preserve machine readability and semantic certainty. Compatibility claims MUST be explicit and versioned; they MUST NOT be inferred from similar names, shared URI prefixes, document order, a successful parse, or AI-generated comparison.

## 96.1 Draft 5 and Earlier Drafts

Draft 5 does not guarantee syntax compatibility with earlier AR-XML drafts. The wire token remains `version="0.1"`; it is not a draft discriminator. A consumer configured for Draft 5 MUST validate against Draft 5 and MUST NOT silently accept an earlier grammar. An absent or unsupported root version is invalid under that processing context.

Migration from an earlier draft is an explicit transformation. A migration tool SHOULD:

- validate the source document under the source grammar when possible;
- preserve source data and provenance;
- report every dropped, synthesized, split, merged, or semantically uncertain item;
- require policy or user input where no deterministic mapping exists; and
- validate the result independently as Draft 5.

A migration MUST NOT infer Capability Contracts, Profile conformance, authorization, Interface mappings, Canonical Entity Identity, or current Runtime state from ambiguous legacy content. Successfully producing well-formed Draft 5 XML does not prove semantic equivalence to the source.

## 96.2 Core Grammar Evolution

Within the exact Draft 5 version, the Core grammar is closed. A processor MUST NOT assume that an unknown Core element or attribute is a compatible additive feature. Adding a Core element, Core attribute, cardinality, default, reference rule, validation rule, or processing behavior requires an explicitly distinguishable future specification version.

Editorial corrections that do not alter deterministic parsing, validation, AR-DOM, semantic comparison, Runtime states, or conformance requirements may be published without changing document identity. Any normative change that can alter one of those results requires a new version designation and a documented compatibility and migration policy.

A future specification decides its own namespace and version pairing. Draft 5 processors MUST use the exact pairing and explicit draft-selection context defined in Section 19 and MUST fail closed for an unsupported Core version. They MAY expose the unsupported document as raw data or hand it to another processor, but MUST NOT claim Draft 5 validation or conformance for it.

Canonical serialization order may remain stable across revisions, but order stability alone is not compatibility. Consumers MUST validate version and vocabulary before applying a serializer or parser profile.

## 96.3 Extension Evolution

Each Extension specification MUST define how its versions are identified. It may use versioned namespace names, exact versioned semantic roots, or another deterministic mechanism appropriate to the Extension. An Extension change that alters syntax, semantic interpretation, validation, mapping, constraint comparison, security behavior, or Runtime support expectations MUST be distinguishable from the prior version.

Unknown foreign semantic roots remain Core-valid when placed in a correct Extension Slot. This provides Core-level forward carriage, not Extension-level compatibility. A processor that does not implement the Extension reports unknown validation, evaluation, or support states as defined elsewhere in this specification; it MUST NOT guess the new semantics.

Opaque preservation SHOULD retain the complete foreign subtree and namespace identity. It does not require preservation of original prefix spelling, attribute order, quote style, or insignificant XML formatting unless an external signature or byte-preservation mechanism requires it. A processor MUST NOT claim lossless round-tripping when its XML processing model cannot preserve the properties required by that claim.

An evolved Extension MUST NOT use new content to weaken Core requirements or reinterpret old Core data. If its new behavior requires a Core location that is not an Extension Slot, it must wait for or target an appropriate future Core version.

## 96.4 Contract and Profile Evolution

Every normative revision of a Capability Contract or Profile uses a new exact-versioned Semantic Identifier. This rule applies to both compatible and incompatible normative revisions. Compatibility metadata MAY relate two exact versions, but does not make their identifiers interchangeable.

An Application MAY select a different Contract or Profile version through explicit policy before validation. The selected exact identifier and definition must then be used consistently. A Semantic Registry or Runtime MUST NOT upgrade, downgrade, or substitute versions silently.

A revised Capability Contract MUST NOT retroactively change the meaning of existing Entity projections that reference an earlier identifier. A revised Profile MUST NOT retroactively change the result of conformance evaluation for an earlier Profile identifier. Deprecation may warn against new use, but it does not rewrite historical semantics.

Contract compatibility does not imply Interface compatibility. Profile compatibility does not imply Runtime Availability. Neither implies trust, authorization, Certification, or successful execution.

## 96.5 Runtime and Implementation Evolution

Runtime implementations may gain or lose support for Extensions, transports, methods, representations, constraint evaluators, or registry sources. Such changes affect `Support`, evaluation certainty, and Availability; they do not alter the specification capability described by the document.

```text
Spec Capability
≠ Runtime Implementation Capability
```

An implementation SHOULD version and disclose its claimed conformance classes and supported Extension features. A newer implementation MUST NOT rewrite a valid description merely to match its own feature set. An older implementation MUST represent unsupported or unknown semantics through the defined states rather than declaring known support or inventing results.

No evolution mechanism defined here authorizes automatic execution. Loading, migrating, resolving, validating, upgrading a registry cache, or installing Extension support MUST NOT invoke a Capability. Side-effecting execution continues to require an explicit Application or Human request.

## 96.6 Deferred Features

Draft 5 deliberately leaves Relations, Observation, Subscription, Event, Stream, workflow, generic mapping DSLs, JSON serialization of AR-XML, credential management, authorization enforcement, and centralized registry requirements outside Core. Their absence is not an invitation to encode them as unknown Core content or to overload Invocation with contradictory semantics.

Future specifications MAY define such features through an appropriate Extension, companion specification, or new Core version. They MUST preserve the separations on which Draft 5 relies, including Entity versus Location, Capability versus Interface and Invocation, Description versus Execution, Resolution versus Authentication, Authentication versus Authorization, Result versus Representation, and Profile Claim versus Verified Conformance and Certification.

# Appendix A. AR-DOM Summary

This appendix is an informative implementation summary of the AR-DOM defined by the normative body. It does not define a programming-language API, object layout, storage format, or additional conformance requirement. If this summary conflicts with Sections 7–36 or 56–60, the normative sections take precedence.

AR-DOM is the implementation-independent representation exposed after successful Core parsing and validation. It represents issuer-authored description data. It is not the browser DOM, a mutable execution record, or a merged view of registry definitions.

## A.1 Document Root

One Draft 5 document produces one AR Entity root:

```text
ARDocumentView
├─ coreNamespace = https://relink.dev/ns/arxml/core/0.1
├─ version       = 0.1
└─ entity        = AREntity
```

`ARDocumentView` is descriptive notation only; Draft 5 does not serialize an `ar-document` wrapper. The XML document element is `ar-entity`, and `AREntity` is the sole top-level information-model object.

The retrieval URL or document base, when known, is Runtime context associated with the loaded document. It is not an Entity Identifier, Property, Canonical Entity Identity, Interface, or child of `AREntity`.

## A.2 Entity Containment

The complete Core containment shape is:

```text
AREntity
├─ category?                         0..1
├─ identifiers                      0..*
│  └─ Identifier
├─ properties                       0..*
│  ├─ Property
│  └─ PropertyExtension
├─ subjects                         0..*
│  └─ Subject
├─ profileClaims                    0..*
│  └─ ProfileClaim
├─ interfaces                       0..*
│  └─ Interface
└─ capabilities                     0..*
   └─ Capability
```

Every collection may be empty. `PropertyExtension` denotes a preserved foreign semantic root occurring directly in the XML `properties` Extension Slot; it is not converted into a Core `Property`.

The XML collection wrappers `identifiers`, `properties`, `subjects`, `profiles`, `interfaces`, and `capabilities` do not create additional domain objects with independent identity. An implementation MAY preserve wrapper-presence information for exact or loss-aware reserialization, but an absent empty wrapper and a present empty wrapper have the same Core collection membership.

## A.3 Core Node Summary

| AR-DOM item | Core information | Important invariant |
|---|---|---|
| `AREntity` | optional Category; Identifier, Property, Subject, ProfileClaim, Interface, and Capability collections | May be otherwise empty; does not imply computation or connectivity |
| `Identifier` | `type`, `value`, optional `subjectRef` | `subjectRef`, when present, resolves to a local Subject |
| `Property` | `type`, `value`, optional `unit` | Repeated `type` values are allowed; value remains issuer-declared |
| `Subject` | `id`, optional `type` | `id` is unique within Subjects; Subject is not a nested Entity |
| `ProfileClaim` | `href` | Exact-versioned absolute Profile identifier; claim is not verified conformance |
| `Interface` | `id`, optional Attachment, optional Realization, Requirements | `id` is unique within Interfaces; Attachment or Realization is required |
| `Capability` | `id`, `type`, optional `subjectRef`, Requirements, optional Invocation, InterfaceUses | `id` is unique within Capabilities; `type` identifies an exact Capability Contract |
| `Requirement` | `type`, zero or more foreign body elements | Placement determines Capability or Interface scope |
| `Invocation` | Inputs, optional Result | May be empty; presence never causes execution |
| `Input` | `name`, `type`, `required`, optional `format`, optional `unit`, Constraints | `name` is unique within its Invocation; absent `required` means `true` |
| `Result` | one or more Outputs, Representations | Present Result is non-empty; it is not a Runtime result value |
| `Output` | `name`, `type`, optional `format`, optional `unit`, Constraints | `name` is unique within its Result |
| `Representation` | `mediaType` | Describes the Result as a whole; order is not preference |
| `InterfaceUse` | `ref`, optional Mapping | `ref` resolves to a local Interface; repeated references are allowed |

Core attributes retain their XML lexical values except where the normative processing rules define a typed value or default. In particular, `required` is exposed semantically as a boolean with default `true`, while identifiers, Property values, units, formats, paths, and semantic identifiers are not heuristically coerced.

Input and Output `type` is one of:

```text
string | number | integer | boolean | binary | object | array
```

These values describe structural data shape. Domain meaning comes from the resolved Capability Contract and applicable semantic definitions.

## A.4 Capability Subtree

The request-oriented Capability subtree is summarized below:

```text
Capability
├─ id                             1
├─ type                           1
├─ subjectRef?                    0..1
├─ requirements                   0..*
│  └─ Requirement
│     ├─ type                     1
│     └─ extensionBodyElements    0..*
├─ invocation?                    0..1
│  ├─ inputs                      0..*
│  │  └─ Input
│  │     ├─ name                  1
│  │     ├─ type                  1
│  │     ├─ required              1, default true
│  │     ├─ format?               0..1
│  │     ├─ unit?                 0..1
│  │     └─ constraints           0..*
│  └─ result?                     0..1
│     ├─ outputs                  1..*
│     │  └─ Output
│     │     ├─ name               1
│     │     ├─ type               1
│     │     ├─ format?            0..1
│     │     ├─ unit?              0..1
│     │     └─ constraints        0..*
│     └─ representations          0..*
│        └─ Representation
│           └─ mediaType          1
└─ interfaceUses                 0..*
   └─ InterfaceUse
      ├─ ref                      1
      └─ mapping?                 0..1
```

An omitted Invocation is distinct from a present empty Invocation. An omitted Result denotes no semantic return value; a present Result declares one or more Outputs. Implementations must preserve these distinctions because they are explicit issuer-authored projection data.

The Capability subtree is an Entity-side projection. Resolved Contract Inputs, Outputs, Requirements, or constraints are not inserted into it. Contract comparison uses a separate resolved definition and produces a separate ProjectionValidation result.

## A.5 Interface Subtree

The Entity-shared Interface subtree is:

```text
Interface
├─ id                             1
├─ attachment?                    0..1
│  └─ extensionRoot               exactly 1 when present
├─ realization?                   0..1
│  └─ extensionRoot               exactly 1 when present
└─ requirements                   0..*
   └─ Requirement
      ├─ type                     1
      └─ extensionBodyElements    0..*
```

At least one of Attachment or Realization is present. An Attachment-only or Realization-only Interface is valid. Requirements alone do not make an Interface valid.

InterfaceUse does not contain a copy of the referenced Interface. Implementations SHOULD retain the lexical `ref` and MAY maintain a derived reference index for efficient navigation. Such an index is not serialized description data.

One Capability may have multiple InterfaceUses with the same `ref`. AR-DOM preserves them as distinct collection members, including distinct Mappings. It does not collapse or rank them.

## A.6 Extension Content

AR-DOM preserves foreign Extension subtrees at the Core-defined slots:

| Slot | AR-DOM owner | Preserved foreign roots |
|---|---|---:|
| Property slot | `AREntity.properties` | zero or more |
| Requirement body | `Requirement` | zero or more |
| Attachment | `Interface` | exactly one when wrapper is present |
| Realization | `Interface` | exactly one when wrapper is present |
| Mapping | `InterfaceUse` | exactly one when wrapper is present |
| Constraint area | `Input` or `Output` | one or more when wrapper is present |

A preserved foreign root includes its expanded name and sufficient subtree information for the processor's claimed inspection or serialization mode. Namespace prefix spelling is not semantic identity. Attributes and descendants of the foreign root remain Extension-owned data. Foreign metadata attributes attached to Core elements are preserved separately with their owning element and expanded name under Section 32.3; they are not Core model fields.

Unknown Extension content is not converted into invented Core fields. Core validation records that the slot envelope is valid; Extension-specific validation and Runtime support remain separate. If the implementation cannot preserve an unknown subtree sufficiently for a requested serialization mode, it reports that limitation rather than claiming lossless round-tripping.

## A.7 Local IDs and References

AR-DOM has three independent typed local-ID spaces:

```text
Subject.id
Interface.id
Capability.id
```

The same lexical value may occur once in each different typed collection. Within one typed collection, values are unique.

References are resolved only within the same document:

| Reference | Target |
|---|---|
| `Identifier.subjectRef` | `Subject.id` |
| `Capability.subjectRef` | `Subject.id` |
| `InterfaceUse.ref` | `Interface.id` |

A missing `Capability.subjectRef` means the described Entity itself is the Capability subject. A missing `Identifier.subjectRef` similarly scopes the Identifier to the described Entity. Neither omission creates an implicit Subject node.

A Runtime-selected per-request target is an Invocation Input, not a mutation of `subjectRef`. AR-DOM does not infer relations, ownership, containment, or component hierarchy from local references.

## A.8 Order and Reserialization

AR-DOM preserves collection membership and document order sufficiently for the processor's serialization claim. Preserved order does not acquire Core preference, priority, recency, fallback, or execution semantics.

A canonical serializer should emit Core children in the recommended orders defined by Section 21; another permitted order does not invalidate Producer conformance. Canonical reordering changes presentation, not information-model meaning. Extension subtree ordering remains governed by the applicable Extension.

All significant lexical values, local IDs, references, wrapper-presence distinctions required by the model, and foreign content required by the preservation mode must remain available for reserialization. Reserialization does not authorize semantic repair, implicit Contract expansion, Profile application, or Runtime-state insertion.

## A.9 Data Kept Outside AR-DOM

The following are not issuer-authored children of `AREntity`:

- the AR-XML retrieval URL or document base;
- Entity Resolver records;
- resolved Capability Contract or Profile definitions;
- registry source, provenance, trust, and cache metadata;
- ContractResolution and ProfileResolution states;
- ProjectionValidation and ProfileConformance states;
- RequirementEvaluation, AttachmentEvaluation, Support, and Availability states;
- selected InterfaceUse routes;
- Credentials, authentication state, and authorization decisions;
- Runtime Context, including current moving position;
- invocation requests, serialized requests, responses, and execution results; and
- Certification or third-party verification records.

An implementation may expose these through associated context, resolution, evaluation, or execution objects. It must keep them distinguishable from the AR-DOM description and must not serialize them into the Entity document unless an Application explicitly constructs new valid description data in a slot that permits it.

The principal separation is:

```text
AR-DOM
= issuer-authored validated description

Resolved Definitions
= independently obtained semantic sources

Evaluation State
= derived results under current definitions, support, policy, and context

Execution State
= explicit request and its Runtime outcome
```

Exposing or traversing any of these views is observational. It does not invoke a Capability.

# Appendix B. Cardinality Table

This appendix is an informative consolidated index of cardinalities defined by the normative body. It introduces no new elements, attributes, or occurrence rules. If a row conflicts with the applicable normative section, the normative section takes precedence. Core attribute lists below do not prohibit additional foreign namespaced metadata attributes allowed by Section 32.3.

## B.1 Notation

| Notation | Meaning |
|---|---|
| `1` | Exactly one; required |
| `0..1` | Zero or one; optional singleton |
| `0..*` | Zero or more |
| `1..*` | One or more |
| `exactly 1 when present` | The owner or wrapper is optional, but its required content count is one when the owner exists |

The **XML occurrence** columns count direct XML children or attributes in the stated parent. The **AR-DOM cardinality** columns count information-model items after successful Core parsing and validation.

Collection wrappers are optional singletons even when their item collections have cardinality `0..*`. An absent wrapper and a present empty wrapper therefore expose the same empty Core collection, subject to any preservation requirements for the serializer's claimed mode.

## B.2 Document Root and Entity Children

| Parent | XML name | Kind | XML occurrence | AR-DOM item | AR-DOM cardinality | Normative note |
|---|---|---|---:|---|---:|---|
| XML document | `ar-entity` | Core element | `1` | `AREntity` | `1` | Sole document element; no Core wrapper is permitted |
| `ar-entity` | `version` | unqualified attribute | `1` | document version | `1` | Exactly `0.1` |
| `ar-entity` | `category` | Core element | `0..1` | Category | `0..1` | Non-empty character value |
| `ar-entity` | `identifiers` | Core container | `0..1` | Identifiers collection | `0..*` | Container may be empty |
| `ar-entity` | `properties` | Core container and Extension Slot | `0..1` | Properties and Property Extensions | `0..*` | Core and foreign items may be interleaved |
| `ar-entity` | `subjects` | Core container | `0..1` | Subjects collection | `0..*` | Container may be empty |
| `ar-entity` | `profiles` | Core container | `0..1` | ProfileClaims collection | `0..*` | Container may be empty |
| `ar-entity` | `interfaces` | Core container | `0..1` | Interfaces collection | `0..*` | Container may be empty |
| `ar-entity` | `capabilities` | Core container | `0..1` | Capabilities collection | `0..*` | Container may be empty |

No foreign element is permitted directly under `ar-entity`. No Entity child listed above is required, so the empty `ar-entity` form is valid.

## B.3 Entity Collection Items

| XML parent | XML item | XML occurrence | Required Core information | Optional Core information | Item constraints |
|---|---|---:|---|---|---|
| `identifiers` | `identifier` | `0..*` | `type`, `value` | `subject-ref` | Repeated `type` allowed; `subject-ref` targets a Subject |
| `properties` | `property` | `0..*` | `type`, `value` | `unit` | Repeated `type` allowed |
| `properties` | foreign Property root | `0..*` | foreign expanded name and subtree | Extension-defined | Each direct foreign child is one Property Extension item |
| `subjects` | `subject` | `0..*` | `id` | `type` | `id` unique within Subjects |
| `profiles` | `conforms-to` | `0..*` | `href` | none | `href` is an exact-versioned absolute Profile identifier |
| `interfaces` | `interface` | `0..*` | `id`; Attachment or Realization | Attachment, Realization, Requirements | `id` unique within Interfaces |
| `capabilities` | `capability` | `0..*` | `id`, `type` | `subject-ref`, Requirements, Invocation, InterfaceUses | `id` unique within Capabilities |

`Identifier.subjectRef` and `Capability.subjectRef` each have AR-DOM cardinality `0..1`. When absent, the described Entity itself is the subject; no implicit Subject item is created.

## B.4 Capability, Invocation, and Result

| XML parent | XML child or attribute | Kind | XML occurrence | AR-DOM cardinality | Notes |
|---|---|---|---:|---:|---|
| `capability` | `id` | attribute | `1` | `1` | Non-empty local ID |
| `capability` | `type` | attribute | `1` | `1` | Exact-versioned absolute Capability Contract identifier |
| `capability` | `subject-ref` | attribute | `0..1` | `0..1` | Targets a local Subject |
| `capability` | `requirements` | container | `0..1` | Requirements `0..*` | May be empty |
| `capability` | `invocation` | element | `0..1` | `0..1` | May be empty |
| `capability` | `interface-uses` | container | `0..1` | InterfaceUses `0..*` | May be empty |
| `invocation` | `inputs` | container | `0..1` | Inputs `0..*` | May be empty |
| `invocation` | `result` | element | `0..1` | `0..1` | If present, contains a non-empty Outputs collection |
| `inputs` | `input` | item | `0..*` | `0..*` | `name` unique within this Invocation |
| `result` | `outputs` | container | `1` when Result is present | Outputs `1..*` | Required when Result is present |
| `result` | `representations` | container | `0..1` | Representations `0..*` | May be empty |
| `outputs` | `output` | item | `1..*` | `1..*` | At least one Output when Result is present; `name` unique within this Result |
| `representations` | `representation` | item | `0..*` | `0..*` | Order does not express preference |
| `interface-uses` | `interface-use` | item | `0..*` | `0..*` | Duplicate `ref` values are allowed |

The following states are all structurally distinguishable and valid unless a resolved Contract produces a projection conflict:

```text
Capability without Invocation
Capability with empty Invocation
Invocation without Result
Invocation with Result containing one or more Outputs
Capability without InterfaceUse
Capability with an empty interface-uses container
```

Draft 5 defines no Core `errors` child under Result.

## B.5 Input, Output, and Representation Fields

| Owner | Core field | XML form | Cardinality | Default or constraint |
|---|---|---|---:|---|
| Input | `name` | attribute | `1` | Non-empty; unique among sibling Inputs |
| Input | `type` | attribute | `1` | One Core structural data type |
| Input | `required` | attribute | `0..1` | Defaults to `true`; lexical value `true` or `false` |
| Input | `format` | attribute | `0..1` | Non-empty when present |
| Input | `unit` | attribute | `0..1` | Non-empty when present |
| Input | Constraints | `constraints` wrapper | `0..1` | Wrapper contains `1..*` foreign constraint roots |
| Output | `name` | attribute | `1` | Non-empty; unique among sibling Outputs |
| Output | `type` | attribute | `1` | One Core structural data type |
| Output | `format` | attribute | `0..1` | Non-empty when present |
| Output | `unit` | attribute | `0..1` | Non-empty when present |
| Output | Constraints | `constraints` wrapper | `0..1` | Wrapper contains `1..*` foreign constraint roots |
| Representation | `mediaType` | `media-type` attribute | `1` | Non-empty RFC 9110 media-type syntax; no registry lookup |

Input and Output have no Core value child. Runtime Input values and returned Output values belong to invocation state, not AR-DOM description cardinality.

## B.6 Interface and InterfaceUse

| XML parent | XML child or attribute | Kind | XML occurrence | Content cardinality | Notes |
|---|---|---|---:|---:|---|
| `interface` | `id` | attribute | `1` | `1` | Non-empty and unique within Interfaces |
| `interface` | `attachment` | wrapper | `0..1` | exactly `1` foreign root when present | Attachment Extension Slot |
| `interface` | `realization` | wrapper | `0..1` | exactly `1` foreign root when present | Realization Extension Slot |
| `interface` | `requirements` | container | `0..1` | `requirement` `0..*` | May be empty |
| `interface-use` | `ref` | attribute | `1` | `1` | Targets a local Interface |
| `interface-use` | `mapping` | wrapper | `0..1` | exactly `1` foreign root when present | Mapping Extension Slot |

The Interface conditional cardinality is:

```text
count(attachment) + count(realization) >= 1
```

Because each is individually `0..1`, an Interface has Attachment only, Realization only, or both. An Interface with neither is invalid even when it contains Requirements.

An Interface may be unreferenced by every Capability. Conversely, an InterfaceUse is always owned by one Capability and references one Interface in the same document.

## B.7 Requirements and Extension Slots

| Slot or owner | Core envelope occurrence | Foreign semantic-root count | Direct character data | Core note |
|---|---:|---:|---|---|
| Property slot in `properties` | container `0..1` | `0..*` | whitespace only outside Core Property values | Foreign roots coexist with Core `property` items |
| `requirement` | item `0..*` in its Requirements container | `0..*` | whitespace only | `type` attribute required; multiple foreign parameter elements allowed |
| `attachment` | wrapper `0..1` per Interface | exactly `1` | whitespace only | Wrapper invalid when empty |
| `realization` | wrapper `0..1` per Interface | exactly `1` | whitespace only | Wrapper invalid when empty |
| `mapping` | wrapper `0..1` per InterfaceUse | exactly `1` | whitespace only | Wrapper invalid when empty |
| `constraints` | wrapper `0..1` per Input or Output | `1..*` | whitespace only | Multiple independent constraint roots allowed |

The grammar inside each foreign semantic root is not cardinality-constrained by Core. It is validated by the applicable Extension specification. Foreign child elements outside these slots are invalid. Foreign namespaced metadata attributes on Core elements are permitted under Section 32.3 and do not count toward child cardinalities.

Each `requirement` has exactly one non-empty `type` attribute and no Core `kind` or `scope` attribute. Requirement scope comes from its owner:

| Owner | Requirement scope |
|---|---|
| Capability `requirements` | Capability prerequisite |
| Interface `requirements` | Interface prerequisite |

## B.8 Local Uniqueness and Reference Constraints

| Scope | Unique value | Cardinality consequence |
|---|---|---|
| Subjects collection | `subject/@id` | At most one Subject target for a given Subject ID |
| Interfaces collection | `interface/@id` | At most one Interface target for a given Interface ID |
| Capabilities collection | `capability/@id` | At most one Capability for a given Capability ID |
| One Invocation | `input/@name` | At most one Input with a given name |
| One Result | `output/@name` | At most one Output with a given name |

Typed local-ID spaces are independent. The same lexical value may occur once as a Subject ID, once as an Interface ID, and once as a Capability ID.

| Reference field | Cardinality | Required target | Dangling result |
|---|---:|---|---|
| `Identifier.subjectRef` | `0..1` | one Subject in the same document | Core-invalid |
| `Capability.subjectRef` | `0..1` | one Subject in the same document | Core-invalid |
| `InterfaceUse.ref` | `1` | one Interface in the same document | Core-invalid |

Forward references are permitted. Reference integrity is checked after the complete document is available.

## B.9 Standard HTTP Extension Cardinalities

| Extension root | Permitted Core slot | Root occurrence in slot | Required attributes | Optional Core-baseline attributes or children |
|---|---|---:|---|---|
| `http:api` | Realization | exactly `1` semantic root | none | `base` (`0..1`; omission uses final retrieval URI) |
| `http:operation` | Mapping | exactly `1` semantic root | `method`, `path` | none |

An Interface may have only one Core Realization wrapper, and that wrapper has one semantic root. An Entity needing distinct HTTP realization contexts declares distinct Interfaces. Multiple Capability InterfaceUses may reference the same HTTP Interface, and one Capability may repeat the same Interface `ref` in distinct InterfaceUses.

The HTTP Extension cardinalities do not restrict HTTP method syntax to `GET` and `POST`. Method implementation support is a Runtime property, not a document occurrence constraint.

## B.10 Cardinality Is Not Preference or Availability

Cardinality describes presence and multiplicity only. It does not assign priority, preference, fallback, recency, truth, Runtime support, or Availability. In particular:

- multiple Identifiers or Properties of the same `type` are not ordered alternatives;
- multiple Representations are not ranked by document order;
- multiple Interfaces and InterfaceUses are not implicit fallback order;
- a present Requirement is not necessarily satisfied;
- a present Realization or Mapping is not necessarily supported; and
- a present Capability is not necessarily invocable or available.

These questions are resolved through the semantic, validation, and Runtime evaluation rules in the normative body, not by changing the cardinalities summarized here.

# Appendix C. Validation Error Categories

This appendix is an informative diagnostic taxonomy for implementations, test suites, authoring tools, and conformance reports. It does not replace the normative outcome states or require a particular error-code spelling, exception hierarchy, API, or message format.

The central rule is that failure domains remain distinct. A processor must not report every unsuccessful operation as “invalid AR-XML.”

```text
Entity resolution failure
≠ resource fetch failure
≠ XML parse failure
≠ Core validation failure
≠ Extension validation result
≠ semantic resolution result
≠ projection validation result
≠ Profile conformance result
≠ Runtime availability result
≠ invocation result or error
```

## C.1 Diagnostic Record

A machine-readable diagnostic SHOULD contain enough information to identify both the failure domain and the affected data without requiring natural-language interpretation. A useful record includes:

| Field | Purpose |
|---|---|
| `category` | Stable failure or outcome family |
| `code` | Specific implementation or specification-defined condition |
| `severity` | Error, warning, or informational presentation level |
| `phase` | Resolve, fetch, parse, Core validate, Extension validate, semantic resolve, evaluate, serialize, or invoke |
| `location` | Source line/column, XML expanded name, AR-DOM path, semantic field, or route identity |
| `specRef` | Relevant specification section or Extension rule |
| `message` | Human-readable explanation |
| `state` | Applicable normative state such as `UNRESOLVED`, `CONFLICT`, or `UNAVAILABLE` |
| `cause` | Optional underlying diagnostic or platform failure |
| `provenance` | Registry source, Extension version, policy context, or evaluation time when relevant |

The exact record shape is implementation-defined. Category and state should be separately represented: for example, `SEMANTIC.CONTRACT_NOT_FOUND` may explain why `ContractResolution = UNRESOLVED`.

Diagnostics MUST NOT disclose passwords, bearer tokens, private keys, API secrets, session cookies, or equivalent Credentials. Implementations SHOULD redact sensitive Identifier, Property, Input, Output, query, response, location, and opaque Extension values while retaining a structural path and useful reason.

## C.2 Recommended Category Families

The following symbolic families are recommended for interoperable reporting. Implementations MAY use different exact codes if they preserve the same distinctions.

| Family | Domain | Does it make the AR-XML document Core-invalid? |
|---|---|---|
| `ENTITY_RESOLUTION.*` | Mapping an Entity reference to an AR-XML location | No document may have been obtained |
| `FETCH.*` | Retrieving AR-XML resource bytes | No document may have been obtained |
| `XML.*` | XML byte decoding and well-formed parsing | Yes; no conforming AR-DOM is produced |
| `CORE.*` | Draft 5 namespace, grammar, values, IDs, and references | Yes |
| `EXTENSION.*` | Extension recognition, support, or Extension-specific validation | Not by itself when the Core slot envelope is valid |
| `SEMANTIC.*` | Capability Contract, Profile, or vocabulary resolution | No |
| `PROJECTION.*` | Entity Capability versus resolved Contract | No; affects projection state and routes |
| `PROFILE.*` | Profile resolution and conformance | No |
| `REQUIREMENT.*` | Runtime prerequisite evaluation | No |
| `SUPPORT.*` | Runtime implementation support | No |
| `AVAILABILITY.*` | Route or Capability aggregation | No |
| `SERIALIZATION.*` | AR-DOM output and preservation | Does not retroactively change input validity |
| `INVOCATION.*` | Explicit execution attempt and its outcome | No |

The severity chosen for UI presentation does not redefine the normative result. For example, an unresolved optional Profile may be displayed as a warning, but its ProfileResolution state remains `UNRESOLVED`.

## C.3 Entity Resolution, Fetch, and XML Parsing

| Recommended code | Condition | Processing consequence |
|---|---|---|
| `ENTITY_RESOLUTION.NOT_FOUND` | Entity Resolver selected no AR-XML location | Load cannot fetch a document |
| `ENTITY_RESOLUTION.AMBIGUOUS` | Resolver cannot deterministically select one location | Load stops or requests explicit Application policy |
| `ENTITY_RESOLUTION.POLICY_BLOCKED` | Location is prohibited by resolver or security policy | Load does not fetch that target |
| `FETCH.NETWORK_FAILURE` | Connection, DNS, TLS, or equivalent retrieval failure | No XML parse result |
| `FETCH.HTTP_FAILURE` | Document retrieval returned an unacceptable HTTP outcome | No conforming loaded document from that response |
| `FETCH.SIZE_LIMIT` | Resource exceeds configured safe-processing limit | Parsing is refused |
| `XML.DECODING` | Bytes cannot be decoded under the applicable XML rules | No conforming AR-DOM |
| `XML.NOT_WELL_FORMED` | XML syntax is malformed | No conforming AR-DOM |
| `XML.SECURITY_POLICY` | DTD, external entity, expansion, depth, or another parser-security limit is violated | Parsing is refused |

Entity resolution and Fetch diagnostics occur before Core document validity can be established. They must not be reclassified as `CORE.*` solely because loading failed.

Fetching an AR-XML resource is description retrieval. It is not Capability execution and must not produce an `INVOCATION.*` result.

## C.4 Core Structural Validation

`CORE.*` diagnostics indicate that parsed XML does not conform to the Draft 5 Core grammar. Any such error prevents exposure of the document as a conforming AR-DOM.

| Recommended code | Example condition |
|---|---|
| `CORE.ROOT` | Document element is not Core `ar-entity` or a prohibited wrapper is present |
| `CORE.NAMESPACE` | A Core element uses the wrong namespace or is matched only by local name |
| `CORE.VERSION` | Root `version` is absent or not exactly `0.1` |
| `CORE.UNKNOWN_ELEMENT` | Unknown element occurs in the Core namespace |
| `CORE.UNKNOWN_ATTRIBUTE` | Unknown unqualified or Core-namespace attribute occurs on a Core element; foreign metadata attributes are permitted |
| `CORE.FOREIGN_CONTENT_LOCATION` | Foreign element occurs outside an Extension Slot |
| `CORE.CONTAINMENT` | Known Core child occurs under a prohibited parent |
| `CORE.CARDINALITY` | Singleton repeats, required item is missing, or collection envelope is malformed |
| `CORE.CHARACTER_CONTENT` | Non-whitespace text occurs where Core permits none |
| `CORE.REQUIRED_VALUE` | Required attribute or non-empty lexical value is absent or empty |
| `CORE.DATA_TYPE` | Input or Output uses an unknown Core structural type |
| `CORE.BOOLEAN_LEXICAL` | `required` is not exactly `true` or `false` |
| `CORE.MEDIA_TYPE` | Representation `media-type` is absent or invalid under the Core rule |
| `CORE.SEMANTIC_IDENTIFIER_SHAPE` | A field required to be an exact-versioned absolute identifier is not one |
| `CORE.INTERFACE_EMPTY` | Interface has neither Attachment nor Realization |
| `CORE.EXTENSION_ENVELOPE` | Attachment, Realization, Mapping, Requirement body, or Constraints violates its Core slot envelope |

Core child order is not semantically significant. A validator MUST NOT emit `CORE.CONTAINMENT` or `CORE.CARDINALITY` solely because otherwise permitted children appear in non-canonical order.

Unknown foreign content in a valid Extension Slot is not `CORE.UNKNOWN_ELEMENT`. The Core validator records a valid envelope and leaves Extension recognition and validation to the separate `EXTENSION.*` domain.

## C.5 Uniqueness and Reference Diagnostics

Uniqueness and local-reference failures are Core structural errors, but they benefit from more specific codes:

| Recommended code | Condition |
|---|---|
| `CORE.DUPLICATE_SUBJECT_ID` | Two Subjects have the same exact `id` |
| `CORE.DUPLICATE_INTERFACE_ID` | Two Interfaces have the same exact `id` |
| `CORE.DUPLICATE_CAPABILITY_ID` | Two Capabilities have the same exact `id` |
| `CORE.DUPLICATE_INPUT_NAME` | Two Inputs in one Invocation have the same exact `name` |
| `CORE.DUPLICATE_OUTPUT_NAME` | Two Outputs in one Result have the same exact `name` |
| `CORE.DANGLING_SUBJECT_REF` | Identifier or Capability `subject-ref` matches no Subject |
| `CORE.DANGLING_INTERFACE_REF` | InterfaceUse `ref` matches no Interface |

Exact equality after XML attribute-value processing is used. Diagnostics should include the typed collection or scope because the same lexical ID in different typed collections is valid.

Forward references are valid. A validator must finish collecting the applicable targets before reporting a dangling reference. It must not create a placeholder, choose a similar spelling, search another document, or resolve through a network service.

Repeated Property or Identifier `type` values and repeated InterfaceUse `ref` values are permitted and must not be reported as duplicate-ID errors.

## C.6 Extension Diagnostics

Extension processing separates Core slot validity, Extension recognition, implementation support, and Extension-specific validity:

| Recommended code | Meaning | Core validity | Typical derived effect |
|---|---|---|---|
| `EXTENSION.UNKNOWN` | Namespace/root/slot semantics are not recognized | Remains valid | Applicable evaluation becomes unknown |
| `EXTENSION.UNSUPPORTED` | Extension is recognized but required processing is not implemented | Remains valid | `Support = UNSUPPORTED` for affected feature |
| `EXTENSION.INVALID` | Recognized supported Extension violates its own grammar or semantics | Core envelope remains valid | Extension conformance fails; affected route is not usable |
| `EXTENSION.PROCESSOR_FAILURE` | Extension processor fails to complete safely | Core result unchanged | Support or evaluation is unknown unless a known blocker exists |
| `EXTENSION.PRESERVATION_LOSS` | Processor cannot preserve the foreign subtree for a claimed output mode | Core input result unchanged | Lossless round-trip claim is unavailable |

An invalid Core slot envelope uses `CORE.EXTENSION_ENVELOPE`, not `EXTENSION.INVALID`. For example, an empty `mapping` wrapper is Core-invalid; a syntactically invalid known `http:operation` inside a correctly formed Mapping envelope is an HTTP Extension validation failure.

Preserving or displaying a foreign subtree does not establish Extension support. An Extension processor must not alter the Core result, repair the Core envelope, access Credentials, or execute a Capability during validation.

## C.7 Semantic Resolution and Projection Diagnostics

Semantic-definition resolution does not determine Core document validity.

| Recommended code | Normative state | Meaning |
|---|---|---|
| `SEMANTIC.CONTRACT_NOT_FOUND` | `ContractResolution = UNRESOLVED` | No usable exact Contract definition is available |
| `SEMANTIC.CONTRACT_CONFLICT` | `ContractResolution = UNRESOLVED` | Non-equivalent definitions claim the same exact Contract identifier |
| `SEMANTIC.PROFILE_NOT_FOUND` | `ProfileResolution = UNRESOLVED` | No usable exact Profile definition is available |
| `SEMANTIC.PROFILE_CONFLICT` | `ProfileResolution = UNRESOLVED` | Non-equivalent definitions claim the same exact Profile identifier |
| `SEMANTIC.POLICY_BLOCKED` | applicable resolution state is `UNRESOLVED` | Registry or trust policy rejects every candidate |
| `SEMANTIC.DEFINITION_INVALID` | applicable resolution state is `UNRESOLVED` | Candidate definition cannot be used under its defining specification |

A resolver should report requested exact identity, candidate source, and conflict or policy reason without silently substituting versions or using first-wins behavior.

Projection diagnostics explain `ProjectionValidation`:

| Recommended code | State | Example |
|---|---|---|
| `PROJECTION.UNRESOLVED_CONTRACT` | `UNVALIDATED` | Exact Contract did not resolve |
| `PROJECTION.UNKNOWN_COMPARISON` | `UNVALIDATED` | Constraint or Extension comparison semantics are unsupported |
| `PROJECTION.MISSING_REQUIRED_INPUT` | `CONFLICT` | Required Contract Input is absent |
| `PROJECTION.TYPE_CONFLICT` | `CONFLICT` | Entity projects `boolean` as `string` |
| `PROJECTION.REQUIREMENT_WEAKENED` | `CONFLICT` | Projection omits or weakens a Contract Requirement |
| `PROJECTION.PROHIBITED_WIDENING` | `CONFLICT` | Entity constraints permit values forbidden by the Contract |

A known `CONFLICT` is not hidden by another unknown comparison. A diagnostic for `UNVALIDATED` must not be worded as verified compatibility or incompatibility.

## C.8 Profile Diagnostics

Profile resolution and Profile conformance are separate:

| Recommended code | State | Meaning |
|---|---|---|
| `PROFILE.UNRESOLVED` | `ProfileResolution = UNRESOLVED` | Exact Profile definition is unavailable, conflicting, invalid, or rejected |
| `PROFILE.MISSING_REQUIRED_CAPABILITY` | `ProfileConformance = NON_CONFORMANT` | Deterministically required Capability is absent |
| `PROFILE.PROHIBITED_OR_INCOMPATIBLE_FEATURE` | `NON_CONFORMANT` | A required Profile item or independently required constraint is known to fail after candidate aggregation |
| `PROFILE.UNKNOWN_REQUIRED_SEMANTICS` | `UNDETERMINED` | Required Extension or comparison cannot be evaluated |
| `PROFILE.UNVALIDATED_PROJECTION` | `UNDETERMINED` | Required item has no satisfying candidate and a candidate projection remains indeterminate |

`NON_CONFORMANT` requires a known violation. Unresolved definitions and unknown required semantics produce `UNDETERMINED`, not a guessed failure. A Profile Claim does not suppress diagnostics and does not force `CONFORMANT`.

## C.9 Runtime Evaluation Diagnostics

Requirement, Attachment, Support, and Availability evaluations produce Runtime states rather than Core validation errors:

| Family | State values | Diagnostic purpose |
|---|---|---|
| `REQUIREMENT.*` | `SATISFIED`, `UNSATISFIED`, `UNKNOWN` | Explain evidence and prerequisite evaluation |
| `ATTACHMENT_*` | `SATISFIED`, `UNSATISFIED`, `UNKNOWN` | Explain declared access-condition satisfaction separately from mechanism support |
| `SUPPORT.*` | `SUPPORTED`, `UNSUPPORTED`, `UNKNOWN` | Identify implemented or missing route features |
| `AVAILABILITY.*` | `READY`, `UNAVAILABLE`, `UNKNOWN` | Explain route and Capability aggregation |

Recommended examples include:

| Code | Result |
|---|---|
| `REQUIREMENT.UNSATISFIED` | Known mandatory prerequisite makes the route `UNAVAILABLE` |
| `REQUIREMENT.UNKNOWN` | Unknown evaluator contributes `UNKNOWN` absent a known blocker |
| `ATTACHMENT_UNSATISFIED` | Known unmet Attachment access condition makes this route `UNAVAILABLE` |
| `ATTACHMENT_UNKNOWN` | Unknown Attachment semantics or evidence contributes `UNKNOWN` absent a known blocker |
| `AVAILABILITY.NO_REALIZATION` | Referenced Interface has no Realization; the request-oriented route is `UNAVAILABLE`, while the Interface remains Core-valid |
| `SUPPORT.REALIZATION_UNSUPPORTED` | Required Realization makes the route `UNAVAILABLE` |
| `SUPPORT.MAPPING_UNKNOWN` | Unknown Mapping support contributes `UNKNOWN` |
| `AVAILABILITY.NO_INVOCATION` | Evaluation is outside Core Invocation scope; no Availability value is generated |
| `AVAILABILITY.NO_ROUTE` | Capability with Invocation has no described InterfaceUse route; invocation-route aggregation is `UNAVAILABLE` |
| `AVAILABILITY.POLICY_BLOCKED` | Runtime or Application policy deterministically makes the route `UNAVAILABLE` |

Diagnostics should identify contributing states and preserve precedence: known conflicts, unsatisfied mandatory Requirements, unsupported required features, and deterministic policy blocks produce `UNAVAILABLE` even if an unrelated evaluation is unknown.

`READY` is not a success diagnostic. It does not establish authorization, target reachability, remote acceptance, safety, or execution outcome.

## C.10 Serialization and Invocation Diagnostics

Serialization diagnostics occur when emitting XML from AR-DOM:

| Recommended code | Condition |
|---|---|
| `SERIALIZATION.INVALID_MODEL` | Requested model cannot be emitted as valid Draft 5 Core |
| `SERIALIZATION.EXTENSION_LOSS` | Required foreign subtree information cannot be preserved |
| `SERIALIZATION.ENCODING` | Output cannot be encoded as requested |
| `SERIALIZATION.NON_CANONICAL_REQUEST` | Requested mode intentionally differs from canonical Core order |

A serialization failure does not retroactively make the successfully parsed source document Core-invalid. A processor must not claim canonical or lossless output when it cannot meet that claim.

Invocation diagnostics occur only after an explicit Application or Human request. Useful subcategories include:

| Recommended code | Failure domain |
|---|---|
| `INVOCATION.INPUT_VALIDATION` | Caller Inputs violate known semantic rules |
| `INVOCATION.ROUTE_NOT_READY` | Selected route is not `READY` under current evaluation |
| `INVOCATION.POLICY_BLOCKED` | Execution policy refuses the request |
| `INVOCATION.TRANSPORT` | Network, TLS, timeout, CORS, or protocol failure |
| `INVOCATION.AUTHENTICATION` | Target rejects or cannot establish authentication |
| `INVOCATION.AUTHORIZATION` | Target denies the requested operation |
| `INVOCATION.HTTP_STATUS` | HTTP Interface returns non-`2xx` baseline outcome |
| `INVOCATION.REPRESENTATION` | Content type, body shape, or decoding is incompatible |
| `INVOCATION.RESULT_VALIDATION` | Decoded Output violates declared type or understood constraint |
| `INVOCATION.SEMANTIC_ERROR` | Versioned Capability semantics identify a domain error |

Transport and HTTP failures are not Core validation failures. HTTP status alone must not be relabeled as a Capability semantic error without an applicable versioned semantic mapping.

## C.11 Aggregation, Repair, and Reporting

A processor MAY return multiple diagnostics. It SHOULD preserve causal structure instead of duplicating one cause as unrelated errors. For example, one unresolved Contract can cause `ProjectionValidation = UNVALIDATED` and contribute to route `Availability = UNKNOWN`; the report should retain the resolution diagnostic as the underlying cause.

Diagnostic aggregation must not erase known information:

```text
known conflict + unknown comparison
→ report both
→ ProjectionValidation remains CONFLICT

known route blocker + unrelated uncertainty
→ report both
→ Availability remains UNAVAILABLE
```

A processor MUST NOT silently repair an invalid document while claiming that the original validated. Suggested edits, migration, or editor recovery are separate workflows. Repaired content is a new document and must pass the entire applicable validation pipeline.

Conformance reports SHOULD state the specification version, claimed conformance class, Extension versions, policy context, and whether diagnostics are parse-time, Core, Extension, semantic, evaluation, serialization, or invocation results. Natural-language messages may be localized; machine category and state identity should remain stable.

AI or LLM assistance MAY explain diagnostics or propose repairs, but deterministic classification, normative state selection, and conformance decisions MUST NOT depend on probabilistic interpretation.

# Appendix D. Draft 4 → Draft 5 Changes

This appendix summarizes changes from `docs/specs/arxml-core-0.1-draft4.md` on the repository's `main` branch to Draft 5. It is informative and intended for reviewers, implementers, and migration-tool authors.

Draft 5 is not syntax-compatible with Draft 4. The root token remains `version="0.1"`; a Draft 4 document must not be accepted as Draft 5 solely because that token matches. Migration is an explicit transformation followed by complete Draft 5 validation and, where applicable, Contract projection and Profile conformance evaluation.

## D.1 Change Classification

| Classification | Meaning |
|---|---|
| Retained | The central concept remains, although wording or validation may be more precise |
| Clarified | Draft 5 makes an existing separation or behavior normative and machine-testable |
| Restructured | The concept remains but its Core information model or XML location changes |
| Added | Draft 5 introduces a new Core concept or processing rule |
| Removed | Draft 4 Core content is not present in Draft 5 Core |
| Deferred | The topic remains valid for future work but is intentionally outside Draft 5 Core |

These classifications do not assert that two serializations are automatically interchangeable.

## D.2 High-level Summary

| Area | Draft 4 | Draft 5 | Classification |
|---|---|---|---|
| Root | `ar-entity` | `ar-entity` | Retained |
| Root version | `version="0.1"` | `version="0.1"` with explicit Draft 5 processing context | Retained |
| Core namespace | `https://relink.dev/ns/arxml/core/0.1` | Same provisional Core 0.1 namespace | Retained; draft context is separate |
| Entity model | Category, Profile Claims, Capabilities | Adds Identifiers, Properties, Subjects, Entity-level Interfaces | Added and restructured |
| Capability interaction shape | Inputs and Result directly under Capability | Optional request-oriented Invocation contains Inputs and Result | Restructured |
| Interfaces | Inline per Capability with HTTP attributes | Shared Entity Interfaces plus Capability InterfaceUses | Restructured |
| HTTP | Baseline binding described in Core | Standard Interface Extension in a foreign namespace | Restructured |
| HTTP address | One `endpoint` | Interface `base` plus operation `path` | Restructured |
| Result | Outputs, Representations, Errors | Outputs and Representations; no Core Errors collection | Removed/deferred |
| Extensions | Separate namespaces required, limited slot detail | Closed Core plus explicit Extension Slots and opaque preservation | Added and clarified |
| Contracts | Versioned semantic source and projection concepts | Exact-versioned identity, explicit projection, deterministic comparison states | Clarified and expanded |
| Profiles | Versioned constraint set and issuer claim | Resolution, requirements, Extension policy, and three-state conformance | Expanded |
| Resolution | Contract lookup sources described | Entity Resolver separated from Semantic Registry; conflicts defined | Added and clarified |
| Runtime states | Contract, projection, availability emphasized | Adds Requirement, Attachment, Support, Profile resolution and conformance domains | Expanded |
| Validation | General parse/validation distinction | Closed structural grammar, cardinality, uniqueness, references, Extension layers | Expanded |
| Conformance | Informal PoC baseline | Named conformance classes | Added |
| Privacy | Primarily security-oriented guidance | Separate comprehensive security and privacy sections | Expanded |

## D.3 Root, Entity, and Identity Model

The root remains `ar-entity`; Draft 5 does not add an `ar-document` or multi-Entity wrapper. Draft 4's conceptual `ARDocument` label therefore must not be migrated into a serialized wrapper.

The Draft 4 root example used:

```xml
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1" />
```

Draft 5 requires:

```xml
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1" />
```

The namespace and root version are unchanged. Migration changes the document structure under an explicitly selected Draft 5 processing context; changing a version token is neither required nor sufficient.

Draft 5 adds three Entity description areas that Draft 4 did not model:

- typed Identifiers with optional Subject scope;
- typed Properties with optional units; and
- lightweight Subjects referenced by Identifier or Capability declarations.

Migration must not synthesize these items from a Draft 4 Category, Capability ID, document URL, HTTP endpoint, or retrieval location. In particular, Draft 5 makes the following separation explicit:

```text
Identifier
≠ Locator
≠ Canonical Entity Identity
≠ Credential
```

Draft 5 also makes passive and physical Entities explicitly valid without CPU, network, API, Interface, or Capability. Draft 4 allowed the information model to describe non-physical and physical Entities, but did not define the empty passive Entity and connector-only cases with Draft 5's structural precision.

Relations and component hierarchy remain outside Core. New Subjects are not a replacement relation graph and must not be populated by inferring containment from Draft 4 structure.

## D.4 Capability, Invocation, and Subject Scoping

Draft 4 placed `inputs` and `result` directly under `capability`. Draft 5 introduces an optional `invocation` wrapper:

```text
Draft 4
Capability
├─ Inputs
└─ Result

Draft 5
Capability
└─ Invocation?
   ├─ Inputs
   └─ Result?
```

For a Draft 4 Capability that clearly describes request-oriented interaction, a migration may wrap its Inputs and Result in `invocation`. The tool must still validate the projection against the exact Capability Contract. It must not add Invocation solely because an inline Interface existed when the semantic interaction pattern is ambiguous.

Draft 5 explicitly permits:

- a Capability without Invocation;
- an empty Invocation;
- an Invocation without Result;
- a Result containing one or more Outputs; and
- a Capability without InterfaceUse.

These states are not automatically equivalent. A migration must preserve whether Draft 4 declared Inputs or Result and must report any meaning it cannot preserve.

Draft 5 adds optional `Capability.subjectRef`. When absent, the described Entity itself is the subject. A Runtime-selected target remains invocation Input data and must not be migrated into a Subject or `subjectRef` without explicit source semantics.

The Core structural data types remain:

```text
string | number | integer | boolean | binary | object | array
```

Draft 5 Input `required` defaults to `true`; migration must preserve source requiredness explicitly when it differs from this default; Input names remain scoped to an Invocation, and Output names remain scoped to a Result. Draft 5 makes the scoped uniqueness checks normative and deterministic.

## D.5 Result, Representation, and Errors

The Draft 4 separation of semantic Output from wire Representation is retained and strengthened:

```text
Result ≠ Representation
```

Representations still describe the Result as a whole, may carry multiple Outputs, use syntactically valid media types without requiring registration lookup, and are not ordered by preference. Draft 5 retains the principle that materially different summary, translation, or simplified content is not automatically an alternative Representation of the same Result.

Draft 4 included a Core `errors` collection below Result. Draft 5 removes that collection from the Entity-side Core grammar. A Draft 4 `errors` element is an unknown Core element and is invalid in Draft 5.

There is no deterministic mechanical migration for Draft 4 Core errors. Semantic error definitions and transport-to-semantic-error mappings require an applicable versioned Capability Contract or Extension. A migration tool must preserve the source information externally or report it as unmapped; it must not silently drop the errors or convert HTTP statuses into semantic errors.

Draft 5 continues to distinguish transport, Interface, Representation, Contract, and semantic outcomes, but expresses this through processing and diagnostics rather than a Core Result `errors` collection.

## D.6 Interface Model Restructuring

Draft 4 attached inline Interfaces to each Capability:

```xml
<capability
  id="action"
  type="https://example.org/capabilities/action/1">
  <interfaces>
    <interface
      type="http"
      method="POST"
      endpoint="/api/action" />
  </interfaces>
</capability>
```

Draft 5 places shared Interfaces at Entity level and references them from Capabilities:

```xml
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  xmlns:http="https://relink.dev/ns/arxml/http/0.1"
  version="0.1">

  <interfaces>
    <interface id="web-api">
      <realization>
        <http:api base="./api/" />
      </realization>
    </interface>
  </interfaces>

  <capabilities>
    <capability
      id="action"
      type="https://example.org/capabilities/action/1">
      <interface-uses>
        <interface-use ref="web-api">
          <mapping>
            <http:operation
              method="POST"
              path="action" />
          </mapping>
        </interface-use>
      </interface-uses>
    </capability>
  </capabilities>
</ar-entity>
```

The restructuring establishes:

```text
Interface
= shared attachment / realization context

InterfaceUse
= Capability-specific reference and optional mapping
```

A migration may coalesce Draft 4 inline Interfaces only when it can prove that their shared Realization data is semantically identical. Similar endpoints or string prefixes are insufficient proof. Otherwise it should create distinct Entity Interfaces.

Draft 5 adds Attachment for physical, spatial, or contact-oriented access boundaries. An Interface may contain Attachment, Realization, or both, but not neither. An Attachment-only connector Interface is valid and need not have a Capability.

Interface and InterfaceUse order still does not express preference. Draft 5 additionally permits one Capability to contain multiple InterfaceUses with the same `ref`; they remain distinct routes.

## D.7 HTTP Baseline Changes

HTTP is no longer expressed using Core Interface attributes. It is a Standard Interface Extension using:

- `http:api` in an Interface Realization; and
- `http:operation` in an InterfaceUse Mapping.

The Draft 4 fields map conceptually as follows, but require URL and sharing analysis:

| Draft 4 field | Draft 5 location | Migration note |
|---|---|---|
| `interface/@type="http"` | HTTP Extension semantic roots | Do not preserve as a Core enum |
| `interface/@endpoint` | `http:api/@base` plus `http:operation/@path` | Split deterministically under URL resolution rules |
| `interface/@method` | `http:operation/@method` | Method syntax and Runtime support are separate |
| `interface/@encoding="json"` | Baseline method/request mapping plus Contract/Representation declarations | No generic Core encoding attribute |

Draft 4 described `GET` and `POST` as the Core 0.1 baseline methods. Draft 5 does not restrict valid HTTP method syntax to those two. A Runtime may support only a subset and reports unsupported behavior through `Support` rather than declaring an otherwise valid document Core-invalid.

Draft 5 uses `base + path` as the canonical HTTP model. `base` is optional: omission uses the final AR-XML retrieval URI, and a present relative or empty value resolves against that URI. A trailing slash is not mandatory; RFC 3986 path merging determines the result. The Host Application URL is not substituted. Deployment security policy is applied independently of these resolution rules.

The GET scalar baseline remains limited to `string`, `number`, `integer`, and `boolean`; generic query serialization for `object`, `array`, and `binary` remains outside the baseline.

Draft 5 defines JSON-object request mapping for applicable `POST`, `PUT`, and `PATCH` operations. It does not introduce an arbitrary header or general mapping DSL.

The most visible response-mapping incompatibility is single-output JSON:

```text
Draft 4 single JSON Output
→ top-level scalar permitted

Draft 5 baseline JSON Result
→ top-level object keyed by Output name
```

For an Output named `temperature`, Draft 5 requires:

```json
{
  "temperature": 21.4
}
```

The Draft 4 scalar `21.4` shortcut is not a Draft 5 baseline JSON Result. Draft 4's generic single-output `text/*` and binary/media whole-body shortcuts are also not generalized as Draft 5 Core HTTP baseline rules; an applicable versioned Extension or mapping specification is required where such behavior is needed.

HTTP `2xx`, `204`, Content-Type validation, unknown JSON member handling, and missing declared Output handling remain conceptually aligned, with Draft 5 more explicitly separating HTTP-level, Representation-level, and semantic outcomes.

## D.8 Requirements and Extension Model

Draft 4 introduced Requirements as declarations separate from Runtime Context, and distinguished an authentication Requirement from an authentication mechanism. Draft 5 retains and formalizes those principles.

Draft 5 Requirement changes include:

- `type` is a Semantic Identifier rather than a closed Core `kind` enum;
- placement determines Capability or Interface scope;
- `requirements` contains `requirement` items whose bodies carry zero or more foreign Extension parameter elements;
- unknown Requirement semantics produce `RequirementEvaluation = UNKNOWN`; and
- authentication and authorization remain distinct prerequisites and enforcement concerns.

A Draft 4 value such as `type="authentication"` must not be assumed to be an exact globally governed semantic identifier. Migration requires a selected Requirement vocabulary and must report the mapping source.

Draft 5 defines explicit Extension Slots:

| Slot | Draft 5 purpose |
|---|---|
| Property slot | Extension-defined Entity characteristics or state |
| Requirement body | Data for the typed Requirement |
| Attachment | Physical, spatial, or contact-oriented boundary |
| Realization | Concrete shared interaction mechanism |
| Mapping | Capability-specific use of an Interface |
| Constraint area | Extension-defined Input or Output constraints |

Unknown foreign roots are Core-valid only in the correct slot. Unknown Core elements, unknown Core/unqualified attributes, and foreign child elements outside a slot are invalid. Foreign namespaced metadata attributes on Core elements are permitted and cannot redefine Core semantics. Draft 5 specifies a closed, machine-validatable child-placement model with a separate metadata-attribute rule.

## D.9 Contracts, Profiles, and Semantic Resolution

Draft 4 already established Capability Contract as the normative semantic source, prohibited redefinition and weakening, permitted Contract-defined narrowing, and introduced `RESOLVED`, `UNRESOLVED`, `VALIDATED`, `UNVALIDATED`, and `CONFLICT` concepts. Draft 5 retains these foundations and makes their algorithms normative.

Draft 5 requires exact-versioned absolute identifiers for Capability Contracts and Profiles. Moving aliases such as `latest` are not normative identity. Definitions are not structurally merged into AR-DOM; omitted Entity projection fields remain omitted.

Projection comparison now explicitly covers Invocation shape, named Inputs and Outputs, Core types, requiredness, formats, units, Requirements, Representations, and Extension constraints. Known contradiction produces `CONFLICT`; unknown comparison semantics produce `UNVALIDATED`; known allowed narrowing produces `VALIDATED` only when every applicable comparison succeeds.

Profile is expanded from the Draft 4 conceptual versioned constraint set into a defined information model covering Capability, Property, Identifier, Interface, Requirement, and Extension policy constraints. Initial Capability presence is limited to `required` and `optional`.

Profile evaluation now uses:

```text
ProfileResolution:
  RESOLVED | UNRESOLVED

ProfileConformance:
  CONFORMANT | NON_CONFORMANT | UNDETERMINED
```

Unknown required semantics or unresolved definitions produce `UNDETERMINED`, not a guessed `NON_CONFORMANT`. Profile Claim remains distinct from Verified Conformance and Certification.

Draft 5 introduces the explicit resolver separation:

```text
Entity Resolver
= Entity identity → AR-XML location

Semantic Registry
= Semantic Identifier → semantic definition
```

Conflicting definitions for the same exact identifier must not use silent first-wins behavior. Network dereferencing remains optional, and Draft 5 does not mandate a centralized registry.

## D.10 Validation, AR-DOM, and Runtime Evaluation

Draft 4 distinguished parse errors, validation errors, Contract resolution failures, conformance conflicts, availability, and invocation errors. Draft 5 turns that guidance into a staged load model:

```text
Resolve / Fetch / Parse / Validate / Expose
```

Loading never invokes a Capability. Contract or Profile resolution may occur during or after load, but is separate from Core structural validity and from execution.

Draft 5 adds deterministic Core rules for:

- Core namespace, `version="0.1"`, and explicitly selected Draft 5 grammar;
- closed Core content;
- order-insensitive child validation and canonical serialization order;
- singleton containers and wrapper cardinality;
- required lexical values and Core data types;
- Extension Slot envelopes;
- typed local-ID uniqueness;
- scoped Input and Output name uniqueness;
- local reference integrity; and
- the Interface Attachment-or-Realization invariant.

AR-DOM now explicitly preserves Core information, collection membership, local IDs and references, and foreign Extension subtrees. It excludes resolved definitions, evaluation states, Credentials, route selection, invocation state, and execution results.

Runtime evaluation expands the Draft 4 state model to seven independent domains:

```text
ContractResolution
ProjectionValidation
RequirementEvaluation
AttachmentEvaluation
Support
ProfileResolution
ProfileConformance
Availability
```

Each InterfaceUse is evaluated as a route. Known conflict, unsatisfied mandatory Requirement, unsupported required feature, or deterministic policy block yields `UNAVAILABLE`. Required uncertainty yields `UNKNOWN`; otherwise the route is `READY`. Capability aggregation is `any READY`, otherwise `any UNKNOWN`, otherwise `UNAVAILABLE`.

Draft 4 allowed invocation policy discretion for unresolved Contracts. Draft 5 baseline evaluation is stricter: unresolved or unvalidated required semantics prevent a route from becoming `READY` and yield uncertainty unless a known blocker already yields `UNAVAILABLE`.

## D.11 Security, Privacy, and Conformance

Draft 5 retains Draft 4's treatment of AR-XML and Runtime data as untrusted, its credential-origin separation, browser and Runtime policy layering, and the requirement for explicit initiating intent.

It expands those rules to cover:

- XML external entity and resource-exhaustion defenses;
- SSRF, redirect, DNS rebinding, scheme, origin, and protected-network policy;
- semantic-definition substitution, downgrade, conflicts, and cache poisoning;
- Extension processor isolation;
- retry, replay, idempotency, and physical safety;
- Identifier correlation, Subject association, location, telemetry, and registry-query privacy;
- opaque Extension privacy; and
- deterministic security and conformance without mandatory AI or LLM processing.

Draft 5 defines five baseline conformance classes: AR-XML Producer, AR-XML Consumer, Runtime, Extension, and Profile Evaluator. Core Document validity is evaluated separately; HTTP mapping and invocation are explicit feature claims within the applicable classes. A claim against one class does not imply the others.

## D.12 Migration Checklist

A Draft 4 to Draft 5 migration tool or review should perform at least these steps:

1. Parse and preserve the original Draft 4 resource without modifying it.
2. Record provenance and every transformation decision.
3. Keep `ar-entity`, the Core 0.1 namespace, and `version="0.1"`; record the Draft 5 processing context separately.
4. Move request-oriented Inputs and Result under an explicit Invocation.
5. Remove no Draft 4 Result error declaration silently; report it for Contract or Extension mapping.
6. Lift inline Interfaces to the Entity-level Interfaces collection.
7. Assign unique Interface IDs and create Capability InterfaceUses with valid local references.
8. Convert HTTP binding information into HTTP Realization and Mapping data.
9. Split each legacy endpoint into `base` and `path` without changing URL resolution semantics.
10. Replace the single-output JSON scalar shortcut with the Draft 5 object mapping where the baseline applies.
11. Map Requirement types only through an explicit semantic vocabulary decision.
12. Avoid inventing Identifiers, Subjects, Properties, Canonical Entity Identity, trust, or Profile conformance.
13. Preserve all uncertain or unmapped source information in a migration report.
14. Validate the new XML under the complete Draft 5 Core grammar and applicable Extensions.
15. Resolve exact Contracts and Profiles independently where available.
16. Report ProjectionValidation and ProfileConformance separately from Core validity.

A migration that cannot make a deterministic choice must stop, request policy or user input, or emit an explicit unresolved migration diagnostic. It must not guess by natural-language similarity, endpoint shape, common convention, or AI output while claiming deterministic conformance.

## D.13 Concepts Retained from Draft 4

Despite the syntax changes, Draft 5 preserves several central Draft 4 decisions:

- Capability Contract is the normative semantic source;
- Entity Capability is a local projection, not the Contract itself;
- semantic weakening and redefinition are forbidden;
- known permitted narrowing may be compatible;
- Semantic Identifier identity does not require network dereferencing;
- Profile constrains Contracts without redefining them;
- Profile Claim is not Verified Conformance or Certification;
- Core data types describe shape rather than domain meaning;
- Result and Representation are distinct;
- Representation order is not preference;
- Requirement declaration is not current Runtime state;
- HTTP status is not a semantic Capability error;
- HTTP `2xx` is HTTP-level success and `204` is conditional on Result shape;
- Cross-Origin success remains subject to browser and Runtime policy;
- Credentials are managed outside AR-XML;
- Availability, authorization, and execution are distinct;
- `READY` does not guarantee success or safety; and
- side-effecting Capabilities must not be invoked merely to test availability.

Draft 5 therefore rebuilds the syntax and processing model without discarding the semantic separations that were already sound in Draft 4.

# Appendix E. Non-goals

This appendix identifies concerns that Draft 5 intentionally does not standardize in Core. A non-goal is not necessarily unimportant or permanently prohibited. It means that Core does not define the concern's domain model, execution semantics, protocol, policy engine, or conformance rules.

An external standard, Capability Contract, Profile, Extension, Runtime, or Application may address a non-goal when it does so without weakening or contradicting Core. Such integration does not make the external semantics part of AR-XML Core.

## E.1 Summary

Draft 5 Core is not:

- a robot manipulation standard;
- a general connector ontology;
- a relation or hierarchy inference system;
- an AI planner;
- a skill, workflow, choreography, or orchestration language;
- a Credential manager;
- an authorization enforcement system;
- a new transport protocol;
- a reimplementation of W3C WoT;
- a reimplementation of GS1 identifier standards;
- a reimplementation of OPC UA or Asset Administration Shell;
- a generic mapping DSL;
- a JSON serialization of AR-XML;
- an automatic execution mechanism during loading; or
- a mandatory centralized registry system.

The following sections define the boundaries behind this list.

## E.2 Robot Manipulation and Physical Control

Core can declare a Capability whose Contract describes a function related to a robot, vehicle, actuator, tool, or physical process. It can also describe an Attachment or Realization through an Extension. It does not define:

- coordinate frames, kinematics, dynamics, trajectories, grasping, or path planning;
- robot descriptions, joint models, end effectors, or collision geometry;
- motion safety, emergency stops, force limits, or functional-safety assurance;
- task allocation, fleet control, or autonomous control loops; or
- domain-specific command semantics for industrial, medical, automotive, aviation, or other safety-critical systems.

A robotics specification may define versioned Capability Contracts and Extensions that use AR-XML. Those specifications remain responsible for physical semantics, deterministic constraints, safety analysis, authorization, and conformance.

`READY` is not a physical-safety approval. A Runtime must not infer that a physical action is safe merely because its route has no known local interoperability blocker.

## E.3 Connector, Spatial, and Attachment Ontologies

Attachment is an Extension Slot for a physical, spatial, contact-oriented, or otherwise direct access boundary. Core does not define a universal ontology for:

- connector families, shapes, pinouts, gender, orientation, mating, or electrical limits;
- spatial anchors, coordinate systems, pose, tolerances, reachability, or occlusion;
- mechanical, optical, acoustic, wireless, or material compatibility; or
- installation, assembly, maintenance, or handling instructions.

An Attachment Extension may define any of these under its own namespace and version. It must not imply a Capability, Invocation, compatibility decision, or safe connection unless its own deterministic semantics explicitly establish that result.

Core's lack of a general connector ontology is what permits a simple HDMI connector description, passive tag, printed marker, or future domain-specific Attachment to coexist without forcing all physical objects into one taxonomy.

## E.4 Relations, Hierarchy, and Inference

Draft 5 has no Core Relations collection. It does not define ownership, containment, composition, adjacency, equivalence, dependency, membership, provenance graphs, digital-twin graphs, or arbitrary Entity-to-Entity links.

A Subject is a lightweight document-local target descriptor. It is not:

- a nested Entity;
- a component tree;
- a relation node;
- an ownership assertion; or
- evidence that two identifiers denote the same real-world thing.

`subjectRef` provides only the explicit scoping defined for Identifier and Capability. A processor must not infer unstated relations from shared values, document position, URL paths, interface reuse, similar names, physical proximity, or AI interpretation.

A future Relations specification may use a companion model or an appropriate future Extension/Core version. It must keep asserted relations separate from inferred relations and must define identity, provenance, trust, and conflict behavior explicitly.

## E.5 AI Planning and Autonomous Behavior

Core is not an AI planner and does not define goals, rewards, policies, tool-selection strategies, prompt formats, memory, reasoning traces, autonomy levels, or multi-agent coordination.

Capability descriptions may be exposed to an AI-assisted Application, but AR-XML does not authorize that Application to invoke them. The Application remains responsible for explicit initiating intent, Input validation, Requirement evaluation, route selection, authorization, safety policy, and execution control.

Natural-language similarity and probabilistic model output are not deterministic semantic resolution. AI or LLM processing may assist authoring, discovery, explanation, or user interaction, but it is not required for:

- Core parsing or validation;
- Contract or Profile identity comparison;
- projection compatibility;
- Profile conformance;
- security or authorization decisions; or
- specification conformance testing.

AI-generated Inputs, mappings, migration decisions, or inferred targets are untrusted until accepted through explicit deterministic policy.

## E.6 Skill, Workflow, and Orchestration Languages

A Capability describes one semantic function or functional affordance. It is not a workflow step definition, executable skill package, script, behavior tree, state machine, transaction, saga, choreography, or composition graph.

Core does not define:

- sequencing, branching, loops, parallelism, compensation, or rollback;
- dependency graphs or data flow between Capability invocations;
- trigger, timer, event, or subscription orchestration;
- distributed transaction semantics;
- workflow persistence, scheduling, ownership, or recovery; or
- automatic selection and execution of a Capability chain.

An Application or separate workflow specification may orchestrate explicitly requested Capability invocations. It must not encode workflow semantics by treating InterfaceUse document order as sequence, repeated Capabilities as steps, Requirements as triggers, or Profile constraints as an execution plan.

Observation, Subscription, Event, Notification, and Stream patterns are also not generalized into request-oriented Invocation in Draft 5. They require separate semantics rather than overloading an empty or long-running Invocation.

## E.7 Credential Management and Authorization Enforcement

AR-XML may declare authentication or authorization prerequisites as typed Requirements. It does not:

- issue, store, discover, refresh, rotate, revoke, or exchange Credentials;
- embed passwords, tokens, private keys, session cookies, API secrets, or equivalent secrets;
- define login, consent, delegation, token exchange, or account recovery flows;
- decide that a principal is authorized;
- enforce remote resource policy; or
- replace the target system's authorization checks.

Credential handling belongs to the Runtime, Host Application, operating environment, user agent, identity provider, and target service under their own security policies.

```text
Requirement declaration
≠ Credential
≠ Authentication result
≠ Authorization grant
≠ Enforcement
```

`RequirementEvaluation = SATISFIED` does not guarantee remote authorization. `READY` does not guarantee that supplied Credentials will be accepted. Authentication and authorization failures remain possible after an explicit invocation attempt.

## E.8 Transport and Protocol Standardization

Core does not define a new network, transport, discovery, messaging, or session protocol. Semantic identity does not mandate HTTP dereferencing, and Entity resolution does not mandate a particular discovery transport.

The Standard HTTP Extension reuses HTTP. It defines a limited AR-XML realization and mapping baseline; it does not redefine HTTP methods, status codes, URI processing, TLS, authentication schemes, caching, redirects, Content-Type, CORS, or browser security.

Other transports or mechanisms may be defined by Extensions. Such an Extension is responsible for its namespace, versioning, syntax, mapping, security, support detection, and Runtime behavior. Merely placing a protocol name in a document does not create a conforming binding.

Core does not require network access at all. Passive, attachment-only, offline, Human-mediated, locally resolved, and gateway-mediated Entities remain valid.

## E.9 Reimplementation of External Domain Standards

Draft 5 deliberately avoids copying or redefining established external standards.

| External area | Core boundary |
|---|---|
| W3C Web of Things | Core does not recreate Thing Description, affordance, security-scheme, form, or protocol-binding models |
| GS1 and product identifiers | Core does not define GTIN or related allocation, check-digit, packaging, or identification semantics |
| Vehicle and device identifiers | Core does not redefine VIN, MAC, IPv6, IMEI, serial-number, or other scheme semantics |
| OPC UA | Core does not recreate its information model, services, nodes, references, security, or transport profiles |
| Asset Administration Shell | Core does not recreate AAS submodels, semantic IDs, packages, shells, or registries |

An Identifier `type`, Property `type`, Capability Contract, Profile, Requirement, or Extension may reference an external standard under that standard's authority. A bridge may map between AR-XML and an external model when it defines provenance, loss, versioning, and conflict behavior.

Such a reference or bridge does not make the two models identical. A processor must not infer equivalence from matching labels, shared URI authorities, or common industry usage.

## E.10 Generic Mapping DSL

Draft 5 does not define a general transformation language for arbitrary protocols or payloads. It does not standardize:

- JSONPath, XPath, CSS selectors, templates, scripts, or expressions;
- arbitrary header, cookie, body, multipart, binary, or form mapping;
- schema-to-schema transformation;
- conditional mapping, computed fields, or data joins;
- semantic-error extraction from arbitrary responses; or
- protocol-independent request and response programs.

Mapping is an explicit InterfaceUse Extension Slot. A specific Interface Extension may define a bounded deterministic mapping such as the HTTP baseline `method` and `path` rules. That does not create a generic DSL and must not be extrapolated beyond the Extension's declared semantics.

When a use case requires a richer mapping, it should use a separately versioned Extension or external adapter with explicit security, determinism, and conformance rules. Executable code embedded as mapping data is not executed by Core loading or validation.

## E.11 JSON Serialization of AR-XML

Draft 5 defines an XML serialization only. It does not define a JSON, YAML, CBOR, RDF, binary, or JavaScript-object serialization of the AR Entity model.

JSON used as an HTTP request or Result Representation is payload data for an invocation. It is not a JSON serialization of AR-XML itself.

Implementations may expose language-native AR-DOM objects or private storage forms. Those forms are implementation details and must not be exchanged as “AR-XML JSON” or used for Core conformance claims without a separately versioned serialization specification.

A future serialization must define namespace identity, Extension carriage, lexical preservation, local references, ordering, canonicalization, unknown content, signatures, media type, and round-trip behavior. Simple key renaming from XML is not sufficient.

## E.12 Automatic Execution During Loading

Loading is observational:

```text
ARRuntime.load()
= Resolve / Fetch / Parse / Validate / Expose
```

Load does not include Capability invocation. The following activities also must not automatically execute a Capability:

- AR-DOM construction or traversal;
- Profile Claim discovery;
- Contract or Profile resolution;
- Extension recognition or validation;
- projection or Profile conformance evaluation;
- Support or Availability evaluation;
- route enumeration or representation selection;
- document preview, indexing, caching, or migration; or
- installation of a registry or Extension processor.

Side-effecting execution begins only after an explicit request by an Application or Human. A Runtime must not invoke a Capability as a health check or Availability probe. Fetching an AR-XML document or a semantic definition remains retrieval of description data, not execution of the described function.

## E.13 Mandatory Centralized Registry

Draft 5 defines Semantic Registry behavior but does not require one global service, one authority, one network endpoint, or one governance organization.

Definitions may be resolved from:

- built-in resources;
- local registries;
- caches;
- Application-provided registries;
- installed Extensions or plugins;
- network services; or
- policy-controlled combinations of these sources.

Offline operation is valid. URI-shaped identity does not require network dereferencing. Federation order, source popularity, cache timing, or first response must not become an implicit semantic decision rule.

Registry operation also does not establish publisher trust, Entity authentication, authorization, verified conformance, or Certification. Those concerns require separate evidence and policy.

## E.14 Certification, Truth, and Freshness

Core validates structure and supports deterministic semantic evaluation where definitions are available. It is not a certification authority, product approval system, source-of-truth service, or freshness protocol.

Issuer-declared Identifiers, Properties, Profile Claims, Capabilities, Interfaces, and Requirements may be inaccurate, stale, unauthorized, or deceptive. Core validity does not prove them true. Profile conformance does not prove certification. A resolved definition does not prove the publisher or document trustworthy.

Applications needing signatures, attestations, audit trails, observation timestamps, confidence, revocation, certification marks, or regulated approval must use an appropriate external mechanism or versioned Extension and must preserve the distinction from Core validity.

## E.15 Future Work Boundary

A non-goal may become the subject of a future Extension, companion specification, or Core revision. Future work must not retroactively change Draft 5 semantics or encode new Core content under the Draft 5 version.

Any future feature should preserve at least these boundaries:

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
```

It should also remain deterministic without requiring AI for interoperability or conformance, keep physical and passive Entities valid, preserve explicit initiating intent for side effects, and define unknown or unsupported semantics without guessing.

The purpose of these non-goals is scope discipline. Draft 5 provides a small semantic Core, explicit extension boundaries, and separated Runtime states so that specialized standards can integrate without being partially and inconsistently reimplemented inside AR-XML Core.
