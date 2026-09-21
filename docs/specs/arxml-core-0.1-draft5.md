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

_To be specified in the next staged update._

# 8. AR Entity

_To be specified in the next staged update._

# 9. Category

_To be specified in the next staged update._

# 10. Identifier

_To be specified in the next staged update._

# 11. Property

_To be specified in the next staged update._

# 12. Subject

_To be specified in the next staged update._

# 13. Profile Claim

_To be specified in the next staged update._

# 14. Capability

_To be specified in the next staged update._

# 15. Invocation

_To be specified in the next staged update._

# 16. Input, Result, Output, and Representation

_To be specified in the next staged update._

# 17. Requirement

_To be specified in the next staged update._

# 18. Interface and InterfaceUse

_To be specified in the next staged update._

---

# Part II — XML Serialization

Sections 19–30 are reserved for the staged XML Serialization draft.

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
