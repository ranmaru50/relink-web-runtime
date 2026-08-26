# AR-XML Core 0.1 Draft Specification — Draft 4

**ステータス:** Draft
**バージョン:** 0.1-draft4
**想定用途:** AR-XML Core 0.1 Web Runtime PoC実装基準

---

# 1. 概要

AR-XMLは、Entity、そのEntityが公開するSemantic Capability、CapabilityのInput Contract、Result Contract、Requirement、およびCapabilityを呼び出すためのInterface Bindingを記述する宣言的フォーマットです。

AR-XMLは主としてRELinkで利用するために設計されています。

RELinkは既存のWeb Infrastructureを利用して、Physical EntityをWeb上からAddressable、Discoverable、Interactable、OperableにするためのArchitectureです。

ただし、AR-XMLのInformation Model自体はPhysical Entityを必須としません。

Digital Service、Network Resource、AI Agent Service等もAR-XML Entityとして記述できます。

AR-XMLはUser Interface Description Languageではありません。

---

# 2. Core Design Principles

AR-XML Core 0.1は以下を基本原則とします。

```text
Web Native
Declarative
Platform Independent
Capability Oriented
Semantic Interoperability
Consumer Independent
Extensible
```

---

## 2.1 Web Native

AR-XMLは可能な限り既存標準を再利用します。

特に、

* HTTP
* HTTPS
* URI / URL
* DNS
* TLS
* IANA Media Types
* HTTP Authentication
* OAuth等の既存Authorization Framework
* Browser / OS Security Model

を利用します。

AR-XML独自Protocolを、不必要に新設すべきではありません。

---

## 2.2 Declarative

AR-XMLはCapabilityのContractおよびAccess Methodを記述します。

CapabilityそのもののImplementationを記述しません。

```text
Capability
= What can be done

Interface
= How it can be invoked
```

---

## 2.3 Platform Independent

AR-XMLは以下へ依存しません。

* Browser DOM
* HTML
* JavaScript
* Android
* iOS
* WebXR
* MCP
* 特定Robot Framework
* 特定AI Runtime

Consumerには、

```text
Web Application
Native Application
AI Agent
Robot
Drone
Headless Runtime
Server
RELink Entity
RELink Service
```

等を含められます。

---

# 3. Core Separation of Concerns

AR-XML Coreでは以下を明確に区別します。

```text
Entity
≠ Capability Contract
≠ Profile
≠ Profile Claim
≠ Entity Capability Implementation
≠ Result
≠ Representation
≠ Interface
≠ Runtime Context
```

---

# 4. Capability Contract

Capability ContractはCapabilityのVersioned Semantic Contractです。

Conceptually:

```text
Capability Contract
├─ Semantic Identifier
├─ Inputs
├─ Result
│  ├─ Outputs
│  ├─ Representations
│  └─ Errors
├─ Requirements
├─ Behavioral Semantics
├─ Error Semantics
└─ Conformance Rules
```

Capability ContractはProfileとは独立したSemantic Objectです。

---

# 5. Semantic Capability Identifier

Entity内のCapabilityは、Local IDとSemantic Capability Identifierを持ちます。

```xml
<capability
  id="speed"
  type="https://example.org/capabilities/vehicle/speed-set/1">
```

ここで、

```text
id
= Document-local identifier

type
= Semantic Capability Identifier
```

です。

Local IDだけではSemantic Interoperabilityは成立しません。

---

## 5.1 IdentifierとResourceの分離

Semantic Capability IdentifierにはURIを使用することを推奨します。

ただし、

```text
URI Identifier
≠
Network resource that MUST be fetched
```

です。

Semantic Capability IdentifierはDereference可能でも構いませんが、Dereference可能であることを必須としません。

RuntimeはCapability Contractを以下から取得できます。

* Built-in Contract Registry
* Local Registry
* Cache
* Profile情報
* Application-provided Registry
* External Resource

したがって、

> **Semantic Capability Identifier identifies a Capability Contract. Network dereferencing is optional.**

とします。

---

# 6. Profile

ProfileはCapability Contract群に対するVersioned Constraint Setです。

```text
Capability Contract A ─┐
Capability Contract B ─┼── Profile
Capability Contract C ─┘
```

ProfileはCapability Contractを定義しません。

ProfileはCapability Contractを、

* Require
* Optionally Require
* Constrain

できます。

---

## 6.1 Profile Constraint

ProfileはCapability Contractの意味を変更してはなりません。

例えばCapability Contractが、

```text
speed
type: number
unit: m/s
range: 0..50
```

を定義するとします。

Profileが、

```text
speed <= 12
```

というConstraintを加えることは可能です。

しかし、

```text
speedはkm/hとして解釈する
```

というSemantic Redefinitionは禁止します。

---

# 7. Profile Claim

EntityはProfileへの準拠を宣言できます。

```xml
<profiles>

  <conforms-to
    href="https://example.org/profiles/tractor/2" />

</profiles>
```

意味は、

> このEntityは参照Profileへの準拠を主張する。

です。

```text
Profile Claim
≠
Verified Conformance
≠
Certification
```

---

# 8. Profile Definition Separation

AR-XML Coreが定義するのはProfile Claimまでです。

```text
AR-XML Core
└─ Profile Claim

Profile Specification
└─ Profile Definition Language

Capability Contract Specification
└─ Capability Contract Definition

Profile Documents
└─ actual Profiles

Capability Contract Documents
└─ actual semantic contracts
```

---

# 9. XML Namespace

Draft 4では暫定的に以下をCore Namespaceとします。

```text
https://relink.dev/ns/arxml/core/0.1
```

例:

```xml
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1">
```

Extensionは別Namespaceを使用しなければなりません。

Namespace URIは0.1 Final前に変更される可能性があります。

---

# 10. Root Element

Root Elementは、

```xml
<ar-entity>
```

です。

例:

```xml
<?xml version="1.0" encoding="UTF-8"?>

<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1">

  ...

</ar-entity>
```

`version`は必須です。

---

# 11. Core Entity Model

```text
AR Entity
├─ Category
├─ Profile Claims
└─ Capabilities
```

---

# 12. Category

EntityはOptionalなCategoryを持てます。

```xml
<category>tourism.place</category>
```

CategoryはDescriptive Metadataです。

CategoryをCapability IdentityまたはProfile Conformanceの代替として使用してはなりません。

---

# 13. Capability Declaration

例:

```xml
<capabilities>

  <capability
    id="temperature"
    type="https://example.org/capabilities/environment/read/1">

    ...

  </capability>

</capabilities>
```

`id`と`type`は必須です。

---

# 14. Entity-side Projection

Entity内のCapability Declarationは、Referenced Capability ContractのImplementation Declarationです。

Capability ContractがNormative Semantic Sourceです。

AR-XML Entityに記述された、

* Inputs
* Result
* Outputs
* Representations
* Requirements

はContractのLocal Projectionとして扱われます。

---

# 15. Local Projection Rules

Projectionについて以下を区別します。

```text
Redefinition
= forbidden

Semantic weakening
= forbidden

Conformant narrowing
= allowed only when permitted by the Capability Contract
```

---

## 15.1 Narrowing

Capability Contractが複数Implementation Variantを許可している場合、EntityはそのSubsetのみを実装できます。

例:

```text
Contract permits:
image/jpeg OR image/png

Entity:
image/jpeg only
```

これはContractが許可しているならConformant Narrowingです。

---

## 15.2 Projection Conflict

Contract:

```text
speed:
  type = number
  unit = m/s
```

Entity:

```xml
<input
  name="speed"
  type="string" />
```

の場合、Overrideではありません。

`CONFLICT`です。

---

# 16. Inputs

InputsはCallerがCapability Invocation時に与えるSemantic Dataを定義します。

```xml
<inputs>

  <input
    name="query"
    type="string"
    required="true" />

</inputs>
```

InputはUI Controlではありません。

---

# 17. Core Data Types

Core 0.1では以下のData Typeを定義します。

```text
string
number
integer
boolean
binary
object
array
```

これらはSemantic Meaningではなく、Core Data Model上のTypeです。

例えば、

```xml
<output
  name="temperature"
  type="number" />
```

の`number`は、

```text
Output Semantic Meaning
= temperature

Core Data Type
= number
```

です。

---

## 17.1 Input Attributes

Inputは以下を持てます。

```text
name
type
required
format
unit
```

`name`は必須です。

`type`は必須です。

`required`はOptionalでDefault `false`です。

Input NameはCapability内で一意でなければなりません。

---

# 18. Result Contract

Capability Invocationの返却値全体を **Result** とします。

Draft 4では、

```text
Output
└─ Representation
```

モデルを廃止し、

```text
Result
├─ Outputs
├─ Representations
└─ Errors
```

とします。

---

# 19. Result

例:

```xml
<result>

  <outputs>

    <output
      name="temperature"
      type="number"
      unit="Cel" />

    <output
      name="humidity"
      type="number" />

  </outputs>

  <representations>

    <representation
      media-type="application/json" />

  </representations>

</result>
```

---

# 20. Outputs

OutputはResultを構成するSemantic Valueです。

```text
Result
├─ temperature
├─ humidity
└─ timestamp
```

OutputはSerialization Formatそのものではありません。

---

## 20.1 Output Attributes

Core 0.1では以下を定義します。

```text
name
type
format
unit
```

`name`と`type`は必須です。

Output NameはResult内で一意でなければなりません。

---

# 21. Representation

RepresentationはResult全体のConcrete Media Representationを定義します。

例えば、

```xml
<result>

  <outputs>
    ...
  </outputs>

  <representations>

    <representation
      media-type="application/json" />

  </representations>

</result>
```

とします。

---

# 22. Representation Media Type

RepresentationはIANA Media Typeを使用します。

例:

```text
text/plain
text/html
text/csv

application/json
application/xml
application/pdf
application/octet-stream

image/jpeg
image/png

audio/mpeg

video/mp4
```

AR-XML独自のMedia Type Vocabularyを新設すべきではありません。

登録状況が不明確なMedia TypeをNormative Exampleへ使用する場合は、Core Finalization前にIANA登録状況を確認する必要があります。

---

# 23. Text Representation

同じTextual Dataであっても形式は明示的に区別します。

```text
text/plain
text/html
application/xml
application/json
```

は異なるRepresentationです。

`type="string"`だからといって、自動的に`text/plain`であると解釈してはなりません。

---

# 24. Materially Equivalent Representation

RepresentationはResultの **materially equivalent content** を異なるMedia Formで表現するものとします。

例えば、

```text
text/plain
text/html
application/pdf
```

が同一Documentの実質的に等価なRepresentationであることは可能です。

一方、

```text
full document
summary
translation
simplified version
```

のように意味的変換を伴うものは、必ずしもCore Representationとはみなしません。

Translation、Summary、Accessible Rendition等は将来のAlternative Representation Extension対象とします。

---

# 25. Example: Multiple Semantic Outputs in One Representation

```xml
<result>

  <outputs>

    <output
      name="temperature"
      type="number" />

    <output
      name="humidity"
      type="number" />

    <output
      name="timestamp"
      type="string"
      format="date-time" />

  </outputs>

  <representations>

    <representation
      media-type="application/json" />

  </representations>

</result>
```

HTTP Representation:

```json
{
  "temperature": 20.1,
  "humidity": 44,
  "timestamp": "2026-08-27T00:00:00Z"
}
```

1つのRepresentationが複数Semantic Outputを保持できます。

---

# 26. Error Contract

ErrorはOutputとは分離します。

```text
Result
├─ Success Outputs
├─ Representations
└─ Errors
```

例:

```xml
<result>

  <outputs>
    ...
  </outputs>

  <errors>

    <error
      type="https://example.org/errors/control-denied/1" />

    <error
      type="https://example.org/errors/emergency-stop-active/1" />

  </errors>

</result>
```

---

# 27. Semantic Capability Error

Capability ErrorはDomainまたはCapability Semanticとして定義されます。

例:

```text
payment.insufficient-funds
machine.emergency-stop-active
door.control-denied
```

Capability ErrorはHTTP Statusそのものではありません。

---

# 28. Interface Error vs Capability Error

以下を区別します。

```text
Transport Error
Interface Error
Representation Error
Capability Error
```

概念:

```text
Invocation
   ↓
Interface
   ├─ Transport Failure
   ├─ Interface Failure
   ├─ Representation Failure
   └─ Semantic Capability Result
        ├─ Success
        └─ Capability Error
```

---

# 29. Runtime Error Categories

Runtimeは最低限、以下を区別することを推奨します。

```text
TransportError
InterfaceError
RepresentationError
ContractError
CapabilityError
```

例:

```text
TransportError
├─ network failure
├─ timeout
├─ CORS failure
└─ TLS failure

InterfaceError
├─ HTTP non-success status
└─ unsupported protocol behavior

RepresentationError
├─ invalid JSON
├─ incompatible media type
├─ output mapping failure
└─ data type mismatch

ContractError
├─ unresolved conflict
└─ invalid local projection

CapabilityError
└─ semantic/domain error
```

---

# 30. Requirements

RequirementはCapabilityを利用するために必要なPropertyまたはConditionです。

例:

```xml
<requirements>

  <require
    type="authentication" />

</requirements>
```

RequirementはCurrent Runtime Stateではありません。

---

# 31. Requirement vs Runtime Context

```text
Requirement
= declaration

Runtime Context
= observed current state
```

例えば、

```xml
<require type="location" />
```

はCurrent Latitude / Longitudeそのものではありません。

---

# 32. Requirement Evaluation Model

RuntimeはRequirementについて少なくとも概念的に以下を区別できます。

```text
Runtime Support
Permission / Credential State
Current Evidence
Requirement Satisfaction
```

例:

```text
location API supported
↓
permission granted
↓
current location available
↓
requirement satisfied
```

これらはAR-XML DocumentのMutable Stateとして保持しません。

---

# 33. Authentication Requirement

```xml
<require type="authentication" />
```

は、

> AuthenticationというSecurity Propertyが必要

という意味です。

---

# 34. Interface Authentication Mechanism

例えば、

```xml
<authentication
  type="oauth2"
  scope="door.unlock" />
```

は、

> このInterfaceではOAuth 2.0を利用する

ことを意味します。

したがって、

```text
Authentication Requirement
≠
Authentication Mechanism
```

です。

---

# 35. Interfaces

Capabilityは複数Interfaceを持てます。

```xml
<interfaces>

  <interface
    type="http"
    method="POST"
    endpoint="/api/action" />

</interfaces>
```

Interface OrderはPreferenceを意味しません。

---

# 36. HTTP Baseline Binding

Core Semantic ModelはTransport Independentです。

しかしAR-XML Core 0.1では、PoCおよびBaseline Interoperabilityを成立させるためHTTP Bindingを含めます。

> **HTTP is included in Core 0.1 as the baseline interoperable invocation binding, not as part of the semantic Capability model.**

将来HTTP Bindingを独立Specificationへ分離する可能性は排除しません。

---

# 37. HTTP Methods

Core 0.1 Baselineでは、

```text
GET
POST
```

を定義します。

Serialization時はUppercaseを推奨します。

---

# 38. HTTP Endpoint Resolution

Relative EndpointはAR-XML Document URLをBase URLとして解決します。

AR-XML:

```text
https://example.org/entities/device/ar.xml
```

Interface:

```xml
<interface
  type="http"
  method="POST"
  endpoint="/api/start" />
```

Resolved URL:

```text
https://example.org/api/start
```

Host ApplicationのDocument URLをBaseにしてはなりません。

---

# 39. GET Input Serialization

Draft 4ではBaseline GET Bindingを定義します。

GET Capability InputはQuery ParameterへMappingします。

Input NameをQuery Parameter Nameとして使用します。

Example Inputs:

```text
q = test
page = 2
```

Result:

```text
?q=test&page=2
```

Web RuntimeではURL / URLSearchParams相当の標準URL Encodingを利用すべきです。

---

## 39.1 GET Baseline Type Restriction

Baseline GET Query Mappingでは、

```text
string
number
integer
boolean
```

を扱います。

`object`、`array`、`binary`のGET MappingはCore 0.1 Baselineでは定義しません。

必要な場合はAdvanced HTTP Bindingを使用します。

---

# 40. POST JSON Input Serialization

```xml
<interface
  type="http"
  method="POST"
  endpoint="/api/contact"
  encoding="json" />
```

の場合、Input NameをJSON Property Nameとして使用します。

Inputs:

```text
name = Alice
message = Hello
```

Request:

```json
{
  "name": "Alice",
  "message": "Hello"
}
```

---

# 41. HTTP Success Status

Core 0.1 Baselineでは、

```text
HTTP 2xx
```

をHTTP Binding成功として扱います。

Non-2xxはHTTP Interface-level non-successとします。

Capability Semantic ErrorへのMappingは別規則です。

---

# 42. HTTP 204

`204 No Content`は正常なHTTP Invocation Successとして扱います。

Capability ResultにRequired Outputが存在するにもかかわらず204が返った場合、RuntimeはRepresentation / Result Mapping Errorとして扱うべきです。

Outputを持たないCapabilityでは204は正常です。

---

# 43. Baseline HTTP Response Mapping

Draft 4ではPoC実装可能性のため、Baseline Mappingを定義します。

---

## 43.1 Single Output + JSON

Result:

```xml
<result>

  <outputs>

    <output
      name="temperature"
      type="number" />

  </outputs>

  <representations>

    <representation
      media-type="application/json" />

  </representations>

</result>
```

Response:

```json
20.1
```

RuntimeはParsed JSON Value全体を`temperature`へMappingします。

---

## 43.2 Multiple Outputs + JSON

Result:

```xml
<outputs>

  <output
    name="temperature"
    type="number" />

  <output
    name="humidity"
    type="number" />

</outputs>
```

Response:

```json
{
  "temperature": 20.1,
  "humidity": 44
}
```

Baseline Mappingでは、

```text
JSON top-level property name
=
Output name
```

とします。

---

## 43.3 Unknown JSON Properties

ResponseにAR-XML Resultで宣言されていないPropertyが存在しても、Core 0.1 Baseline Runtimeはそれだけを理由にResponse全体をRejectする必要はありません。

未知Propertyは無視できます。

ただしCapability Contractがより厳密なValidationを要求する場合は、そのContractに従います。

---

## 43.4 Missing Output Property

Declared Outputに対応するPropertyが存在しない場合、BaselineではResult Mapping Errorとして扱います。

Optional Output ModelはCore 0.1 Finalization前の検討事項です。

---

## 43.5 Single Output + text/*

ResultにSingle Outputがあり、Response Media Typeが`text/*`の場合、Decoded Text Body全体をそのOutputへMappingします。

例:

```xml
<output
  name="message"
  type="string" />
```

Response:

```text
Registered
```

Result:

```text
message = "Registered"
```

---

## 43.6 Single Output + Binary / Media

Single Outputかつ`image/png`、`application/pdf`、`application/octet-stream`等の場合、Response Body全体をそのOutput ValueへMappingします。

Runtime内部表現はPlatform固有で構いません。

Web RuntimeではBlob、ArrayBuffer、Uint8Array等へのMappingが考えられます。

Coreは特定JavaScript Typeを要求しません。

---

## 43.7 Multiple Outputs + Non-JSON

Core 0.1 Baselineでは、Multiple OutputsをNon-JSON RepresentationからMappingする一般規則を定義しません。

必要な場合はAdvanced Bindingが必要です。

---

# 44. HTTP Content-Type

HTTP Responseの`Content-Type`は、Resultで宣言されたRepresentationとCompatibilityがあるべきです。

例:

```xml
<representation
  media-type="application/json" />
```

に対し、

```http
Content-Type: application/json
```

はCompatibleです。

Incompatible Media Typeの場合、RuntimeはRepresentationErrorとして扱うことができます。

---

# 45. Representation Selection

複数Representationが存在する場合、Document OrderをPreferenceとして扱ってはなりません。

Selectionは概念的に、

```text
Caller Preference
∩
Runtime Support
∩
Entity Representation Support
```

から行います。

---

## 45.1 Caller Preference

Runtime APIはCallerが希望Media Typeを指定できることを推奨します。

Conceptual example:

```js
capability.invoke(input, {
  accept: "application/json"
})
```

このJavaScript API自体はCore仕様ではありません。

---

## 45.2 HTTP Negotiation

HTTP Interfaceでは`Accept` / `Content-Type`等のHTTP Standard Mechanismを利用できます。

Capability Result RepresentationはProtocol-independent Declarationです。

HTTP Headerそのものではありません。

---

# 46. Contract Resolution State

Capability Contract ResolutionとDocument Validityは分離します。

Runtimeは概念的に、

```text
RESOLVED
UNRESOLVED
```

を区別できます。

`UNRESOLVED`はDocument Invalidを意味しません。

---

# 47. Projection Validation State

Entity-side ProjectionのConformance Stateとして概念的に、

```text
VALIDATED
UNVALIDATED
CONFLICT
```

を区別できます。

意味:

```text
VALIDATED
= Contractに対して検証済み

UNVALIDATED
= Contract未解決等により検証不能

CONFLICT
= ContractとのSemantic Conflictを検出
```

---

# 48. Contract ResolutionとInvocation

Capability Contractが`UNRESOLVED`であっても、AR-XML Document自体をLoadできます。

RuntimeはCapabilityを保持・公開できます。

ただし、

```text
UNRESOLVED
=
semantic conformance has not been established
```

です。

Invocationを許可するかはRuntime Policyによって決定できます。

Bindingに必要な情報が不足している場合はInvocationしてはなりません。

---

# 49. Capability Availability

Core 0.1では、

```text
READY
UNAVAILABLE
UNKNOWN
```

をPrimary Availability Stateとします。

---

## 49.1 READY

`READY`:

> Runtime has no known local reason preventing an invocation attempt.

簡潔には、

```text
Invocation may be attempted.
```

です。

READYは成功保証ではありません。

---

## 49.2 UNAVAILABLE

`UNAVAILABLE`:

> Runtime currently knows a reason that prevents an invocation attempt.

---

## 49.3 UNKNOWN

`UNKNOWN`:

> Runtime cannot currently determine availability.

---

# 50. READYが保証しないもの

READYは以下を保証しません。

* Backend Authorization
* Remote Device State
* Business Rule Acceptance
* Actual Execution Success
* Remote System Health
* Physical Safety State

したがって、

```text
READY
→ invoke
→ HTTP 403
```

も可能です。

---

# 51. Availability / Authorization / Execution

明確に分離します。

```text
Availability
= attempt可能か

Authorization
= operationが許可されるか

Execution
= operationが実際に成功するか
```

---

# 52. Safe Availability Evaluation

Side Effectを持つCapabilityをAvailability確認だけの目的で実行してはなりません。

例えば、

```text
door.unlock
```

をAvailability TestとしてInvokeすることは禁止します。

---

# 53. Cross-Origin HTTP

HTTP InterfaceはRelativeまたはAbsolute URLを使用できます。

Web Runtimeでは、

```text
Endpoint Resolution
↓
Runtime Security Policy
↓
Browser fetch
↓
Browser CORS / security enforcement
```

という処理になります。

CoreはCross-Origin Request成功を保証しません。

---

## 53.1 Runtime Security Policy

RuntimeはBrowser Policyより厳しいPolicyを持つことができます。

例:

```text
same-origin only
explicit allowlist
trusted-origin only
```

PoC RuntimeがSame-Origin Onlyを採用してもCore Modelと矛盾しません。

---

# 54. Authentication and Credentials

AR-XMLへRaw Secretを格納してはなりません。

例:

* Password
* Session ID
* Bearer Token
* Refresh Token
* Private Key
* API Secret

CredentialはRuntime / Host Environmentが管理します。

---

# 55. Ambient Authentication

Same-Origin Web CapabilityではBrowser Session Cookie等を利用できます。

AR-XMLからCookie Valueへアクセスする必要はありません。

---

# 56. Cross-Origin Credential

CredentialはTarget Serviceに適切にScopeされる必要があります。

RuntimeはCredentialを任意OriginへForwardしてはなりません。

---

# 57. AR-DOM Abstract Model

AR-DOMはAbstract Information Modelです。

特定のIn-memory DOM Implementationを要求しません。

Normativeなのは、

```text
Data Model
Observable Semantics
Reference Resolution Behavior
```

です。

---

# 58. Conceptual AR-DOM Draft 4

```text
ARDocument
├─ Category
├─ ProfileClaims
└─ Capabilities
   └─ Capability
      ├─ localId
      ├─ semanticType
      ├─ Inputs
      ├─ Result
      │  ├─ Outputs
      │  ├─ Representations
      │  └─ Errors
      ├─ Requirements
      └─ Interfaces
```

---

# 59. Processing Model

Runtimeは概念的に以下を実行します。

```text
1. AR-XML resource fetch
2. XML parse
3. Namespace validation
4. Core structure validation
5. Relative URL resolution
6. AR-DOM abstract model construction
7. Profile Claim discovery
8. Semantic Capability Identifier resolution
9. Capability Contract resolution where available
10. Local Projection conformance evaluation
11. Runtime Context construction
12. Requirement evaluation
13. Capability Availability determination
14. Interface selection
15. Representation selection
16. Credential acquisition where required
17. Input validation
18. HTTP request serialization
19. Invocation attempt
20. HTTP result classification
21. Response media type validation
22. Representation decode
23. Result-to-Output mapping
24. Output data validation
25. Result exposure
```

---

# 60. Parsing and Validation

以下を区別します。

```text
Parse Error
Validation Error
Contract Resolution Failure
Conformance Conflict
Runtime Availability State
Invocation Error
```

これらを同一Errorとして扱うべきではありません。

---

# 61. Security Considerations

AR-XMLはPotentially Untrusted Inputです。

Runtimeは最低限以下を守ります。

* AR-XMLを`innerHTML`へ直接挿入しない
* AR-DOMとBrowser DOMを分離する
* Network AccessをRuntimeが仲介する
* Device / Sensor AccessをRuntimeが仲介する
* Raw CredentialsをDocumentへ公開しない
* Credentialsを無関係Originへ送信しない
* HTML Outputを無条件にDOM Injectionしない
* JSONはJSON Parserで処理する
* XMLは安全なXML Parser Policyで処理する
* Media TypeをTrustの証明として扱わない
* Backend Authorizationを必須とする
* Input / OutputをUntrusted DataとしてValidationする
* Side-effecting Capabilityに適切なInitiating Intentを要求する
* Least Privilegeを適用する

---

# 62. Example: Environment Sensor

```xml
<?xml version="1.0" encoding="UTF-8"?>

<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1">

  <category>environment.sensor</category>

  <capabilities>

    <capability
      id="environment"
      type="https://example.org/capabilities/environment/read/1">

      <result>

        <outputs>

          <output
            name="temperature"
            type="number"
            unit="Cel" />

          <output
            name="humidity"
            type="number" />

          <output
            name="timestamp"
            type="string"
            format="date-time" />

        </outputs>

        <representations>

          <representation
            media-type="application/json" />

        </representations>

      </result>

      <interfaces>

        <interface
          type="http"
          method="GET"
          endpoint="/api/environment" />

      </interfaces>

    </capability>

  </capabilities>

</ar-entity>
```

Expected Baseline Response:

```json
{
  "temperature": 20.1,
  "humidity": 44,
  "timestamp": "2026-08-27T00:00:00Z"
}
```

---

# 63. Example: Search Capability

```xml
<capability
  id="search"
  type="https://example.org/capabilities/search/basic/1">

  <inputs>

    <input
      name="q"
      type="string"
      required="true" />

    <input
      name="page"
      type="integer"
      required="false" />

  </inputs>

  <result>

    <outputs>

      <output
        name="result"
        type="object" />

    </outputs>

    <representations>

      <representation
        media-type="application/json" />

    </representations>

  </result>

  <interfaces>

    <interface
      type="http"
      method="GET"
      endpoint="/api/search" />

  </interfaces>

</capability>
```

Invocation:

```text
q = relink
page = 2
```

Request:

```text
GET /api/search?q=relink&page=2
```

---

# 64. Example: Text Result

```xml
<capability
  id="message"
  type="https://example.org/capabilities/message/read/1">

  <result>

    <outputs>

      <output
        name="message"
        type="string" />

    </outputs>

    <representations>

      <representation
        media-type="text/plain" />

    </representations>

  </result>

  <interfaces>

    <interface
      type="http"
      method="GET"
      endpoint="/message" />

  </interfaces>

</capability>
```

HTTP Body全体を`message`へMappingします。

---

# 65. Example: Multi-format Document Result

```xml
<capability
  id="document"
  type="https://example.org/capabilities/document/read/1">

  <result>

    <outputs>

      <output
        name="document"
        type="binary" />

    </outputs>

    <representations>

      <representation
        media-type="text/plain" />

      <representation
        media-type="text/html" />

      <representation
        media-type="application/pdf" />

    </representations>

  </result>

  <interfaces>

    <interface
      type="http"
      method="GET"
      endpoint="/document" />

  </interfaces>

</capability>
```

`binary`はSemantic MeaningではなくCore Data Typeです。

---

# 66. Example: Capability Errors

```xml
<capability
  id="unlock"
  type="https://example.org/capabilities/door/unlock/1">

  <result>

    <errors>

      <error
        type="https://example.org/errors/control-denied/1" />

      <error
        type="https://example.org/errors/device-unavailable/1" />

    </errors>

  </result>

  <interfaces>

    <interface
      type="http"
      method="POST"
      endpoint="/api/unlock" />

  </interfaces>

</capability>
```

HTTP StatusからこれらSemantic ErrorへのMapping方法はCore 0.1 Draft 4ではまだ一般化しません。

PoC RuntimeではNon-2xxをInterfaceErrorとして扱って構いません。

---

# 67. Web Runtime PoC Baseline Behavior

Draft 4を基準にしたBrowser Runtime PoCでは、少なくとも以下を実装できます。

```text
1. GET Inputs
   → URL query parameters

2. POST encoding=json
   → JSON request object

3. HTTP 2xx
   → HTTP success

4. 204
   → success with no body

5. Single Output
   → decoded body mapped to the Output

6. Multiple Outputs + application/json
   → top-level JSON property names map to Output names

7. Semantic Contract unresolved
   → document remains loadable

8. Contract unresolved
   → projection becomes UNVALIDATED

9. Contract conflict
   → CONFLICT

10. Representation Selection
    → Caller Preference ∩ Runtime Support ∩ Entity Support

11. Errors
    → Transport / Interface / Representation / Contract / Capability layers

12. Cross-origin
    → Browser policy + Runtime policy
```

---

# 68. Web Runtime API Considerations

Core 0.1はJavaScript APIをNormativeには定義しません。

ただしPoCではConceptually、

```js
const capability =
  document.getCapability("environment");

const result =
  await capability.invoke({}, {
    accept: "application/json"
  });
```

のようなAPIを実装できます。

---

## 68.1 Cancellation

Web RuntimeではWeb NativeなCancellation Mechanismを利用することを推奨します。

例えば、

```js
const controller = new AbortController();

await capability.invoke(input, {
  signal: controller.signal
});
```

`AbortSignal`はWeb Runtime APIのConcernであり、AR-XML Core Document Modelには含めません。

---

# 69. PoC Runtime Recommended State Model

Implementationでは以下を分離することを推奨します。

```text
Document State

Capability Contract State
  RESOLVED
  UNRESOLVED

Projection State
  VALIDATED
  UNVALIDATED
  CONFLICT

Availability State
  READY
  UNAVAILABLE
  UNKNOWN

Invocation State
  idle
  running
  completed
  failed
```

Invocation StateはCore XML SemanticではなくRuntime Implementation Concernです。

---

# 70. Non-Goals of Draft 4

Draft 4では以下をまだ定義しません。

* Capability Contract Document Format
* Profile Definition Language
* Complex Profile Constraint Language
* General Mapping DSL
* JSONPath Mapping
* XPath Mapping
* Multipart Mapping
* Arbitrary HTTP Header Mapping
* Semantic Error HTTP Mapping
* Realtime Event Streaming
* Presentation
* Script
* Spatial
* Resolver
* Trust Profiles
* Certification

---

# 71. Open Issues Before Core 0.1 Finalization

1. Final Namespace URI
2. Capability Contract Document Format
3. Capability Contract Versioning
4. Profile Definition Format
5. Profile Constraint Rules
6. Optional Output Model
7. `null` handling
8. Structured Schema Model
9. `format` vocabulary
10. Unit vocabulary
11. Charset rules
12. Content language
13. Alternative Representation
14. Semantic Error payload model
15. HTTP Status → Capability Error mapping
16. Advanced Response Mapping
17. POST formats other than JSON
18. GET object / array serialization
19. Requirement Vocabulary
20. Requirement AND / OR composition
21. Authentication vocabulary
22. Interface negotiation metadata
23. Capability Availability query mechanism
24. Capability Composition
25. Extension mandatory/optional mechanism
26. Formal AR-DOM Conformance
27. Profile Conformance Evaluation
28. Contract Registry / Cache semantics
29. Identity / Resolver integration
30. Long-term `AR-XML` naming

---

# 72. Draft 4 Changes

Draft 4ではDraft 3から以下を変更しました。

* `Result Contract`を導入
* RepresentationをOutput配下からResult配下へ移動
* Multiple OutputsをSingle Representationで表現可能に変更
* Output `type`をCore Data Typeとして明確化
* `object` / `array`をCore Data Typeへ追加
* RepresentationのSemantic Equivalenceを`materially equivalent`へ緩和
* Alternative Representationを将来Extensionとして分離
* Projection Redefinition / Weakening / Narrowingを区別
* Permitted Narrowing概念を導入
* ErrorをOutputから分離
* Semantic Capability Errorを導入
* Transport / Interface / Representation / Contract / Capability Errorを分離
* GET Query MappingをBaseline定義
* POST JSON Mappingを維持
* HTTP 2xx Success Ruleを定義
* HTTP 204を定義
* Single Output Response Mappingを定義
* Multiple Outputs + JSON Mappingを定義
* JSON Property NameとOutput NameのMappingを定義
* Unknown JSON Propertyの扱いを定義
* Missing OutputのBaseline Error処理を定義
* Representation Selection Modelを定義
* Contract `RESOLVED / UNRESOLVED`状態を明確化
* Projection `VALIDATED / UNVALIDATED / CONFLICT`状態を明確化
* Cross-OriginとRuntime Policyの関係を明確化
* Web Runtime PoC Baseline Behaviorを追加
* Web Runtime CancellationをCore外Concernとして整理

---

# 73. Draft 4 Core Model

Draft 4時点の中心モデルは次の通りです。

```text
Capability Contract
│
├─ Semantic Identity
├─ Inputs
├─ Result
│  ├─ Outputs
│  ├─ Representations
│  └─ Errors
├─ Requirements
└─ Behavioral Semantics
        ↑
        │ implemented by
        │
AR-XML Entity Capability
│
├─ Local ID
├─ Semantic Capability Identifier
├─ Local Contract Projection
└─ Interfaces
        ↓
        ↓ HTTP Baseline Binding
        ↓
Runtime
│
├─ Contract Resolution
├─ Projection Validation
├─ Runtime Context
├─ Requirement Evaluation
├─ Availability
├─ Representation Selection
└─ Invocation
        ↓
Authorization
        ↓
Execution
        ↓
Semantic Result
```

ProfileはCapability Contractを外側から参照・制約します。

```text
Capability Contract A ─┐
Capability Contract B ─┼─ Profile
Capability Contract C ─┘
                         ↑
                         │ conforms-to
                         │
                     AR Entity
```

---

# 74. Draft 4 Status

Draft 4は、AR-XML Core 0.1を使ったWeb Browser Runtime PoCを実装可能にすることを主要目的の1つとしています。

現段階で、

```text
Parse
→ Validate
→ Resolve
→ Evaluate
→ Invoke
→ Decode
→ Map
→ Expose Result
```

までのBaseline Processingを一通り定義しています。

高度なMapping、Profile Definition、Capability Contract Definition Format、Semantic Error Mapping等は依然として未確定ですが、PoC RuntimeではそれらをOptionalまたは未対応として実装できます。

**Draft 4をWeb Runtime PoCの基準仕様とし、実装で判明した曖昧点をDraft 5候補としてフィードバックすることを推奨します。**
