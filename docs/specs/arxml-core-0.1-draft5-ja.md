# AR-XML Core 0.1 ドラフト仕様 — Draft 5 日本語参考訳

**状態:** Working Draft  
**バージョン:** 0.1-draft5  
**対象:** AR-XML Core 0.1  
**原文:** [`arxml-core-0.1-draft5.md`](./arxml-core-0.1-draft5.md)  
**Issue:** [#10 — AR-XML Core 0.1 Draft 5: specification and runtime migration](https://github.com/ranmaru50/relink-web-runtime/issues/10)

> **翻訳上の注意:** この文書は英語版仕様の日本語参考訳である。英語版と日本語版に相違がある場合は英語版を優先する。XML名、属性名、識別子、状態値、コード例、およびBCP 14の規範キーワード（`MUST`、`SHOULD`、`MAY`など）は原則として原文の表記を維持する。

---


# 目次

- [1. この文書の位置づけ](#1-status-of-this-document)
- [2. 概要](#2-abstract)
- [3. 適合性と規範言語](#3-conformance-and-normative-language)
- [4. 適用範囲](#4-scope)
- [5. 設計原則](#5-design-principles)
- [6. 用語](#6-terminology)
- [Part I — Core情報モデル](#part-i--core-information-model)
  - [7. Coreモデル概要](#7-core-model-overview)
  - [8. AR Entity](#8-ar-entity)
  - [9. Category](#9-category)
  - [10. Identifier](#10-identifier)
  - [11. Property](#11-property)
  - [12. Subject](#12-subject)
  - [13. Profile Claim](#13-profile-claim)
  - [14. Capability](#14-capability)
  - [15. Invocation](#15-invocation)
  - [16. Input、Result、Output、およびRepresentation](#16-input-result-output-and-representation)
  - [17. Requirement](#17-requirement)
  - [18. InterfaceとInterfaceUse](#18-interface-and-interfaceuse)
- [Part II — XMLシリアライゼーション](#part-ii--xml-serialization)
  - [19. XML名前空間とバージョン](#19-xml-namespace-and-version)
  - [20. ルート要素](#20-root-element)
  - [21. Coreコンテナと子要素順序](#21-core-containers-and-child-order)
  - [22. Categoryのシリアライゼーション](#22-category-serialization)
  - [23. Identifierのシリアライゼーション](#23-identifier-serialization)
  - [24. Propertyのシリアライゼーション](#24-property-serialization)
  - [25. Subjectのシリアライゼーション](#25-subject-serialization)
  - [26. Capabilityのシリアライゼーション](#26-capability-serialization)
  - [27. InvocationとResultのシリアライゼーション](#27-invocation-and-result-serialization)
  - [28. Requirementのシリアライゼーション](#28-requirement-serialization)
  - [29. InterfaceとInterfaceUseのシリアライゼーション](#29-interface-and-interfaceuse-serialization)
  - [30. Profile Claimのシリアライゼーション](#30-profile-claim-serialization)
- [Part III — Extensionモデル](#part-iii--extension-model)
  - [31. Extensionアーキテクチャ](#31-extension-architecture)
  - [32. Extension Slot](#32-extension-slots)
  - [33. Attachment](#33-attachment)
  - [34. Realization](#34-realization)
  - [35. Mapping](#35-mapping)
  - [36. 未知Extensionの処理](#36-unknown-extension-processing)
- [Part IV — Capability Contract](#part-iv--capability-contracts)
  - [37. Capability Contractモデル](#37-capability-contract-model)
  - [38. ContractのIdentityとResolution](#38-contract-identity-and-resolution)
  - [39. Entity側Capability Projection](#39-entity-side-capability-projection)
  - [40. Projection互換性](#40-projection-compatibility)
  - [41. Projection Validation状態](#41-projection-validation-states)
- [Part V — Profile](#part-v--profiles)
  - [42. Profileモデル](#42-profile-model)
  - [43. ProfileのIdentityとResolution](#43-profile-identity-and-resolution)
  - [44. Capability Requirement](#44-capability-requirements)
  - [45. PropertyおよびIdentifier Requirement](#45-property-and-identifier-requirements)
  - [46. Interface Requirement](#46-interface-requirements)
  - [47. RequirementおよびExtension Policy](#47-requirement-and-extension-policies)
  - [48. Profileのnarrowing規則](#48-profile-narrowing-rules)
  - [49. Profile適合性](#49-profile-conformance)
- [Part VI — Semantic IdentificationとResolution](#part-vi--semantic-identification-and-resolution)
  - [50. Semantic Identifier](#50-semantic-identifiers)
  - [51. Exact Versioned Identity](#51-exact-versioned-identity)
  - [52. Semantic Registry](#52-semantic-registry)
  - [53. Resolution Source](#53-resolution-sources)
  - [54. 競合するDefinition](#54-conflicting-definitions)
  - [55. Entity Resolverの分離](#55-entity-resolver-separation)
- [Part VII — ValidationとProcessing](#part-vii--validation-and-processing)
  - [56. Processingモデル](#56-processing-model)
  - [57. Core構造Validation](#57-core-structural-validation)
  - [58. Referenceおよび一意性Validation](#58-reference-and-uniqueness-validation)
  - [59. Extension Validation](#59-extension-validation)
  - [60. PreservationとExposure](#60-preservation-and-exposure)
- [Part VIII — Runtime Evaluation](#part-viii--runtime-evaluation)
  - [61. DescriptionとRuntime State](#61-description-and-runtime-state)
  - [62. Contract Resolution](#62-contract-resolution)
  - [63. Projection Validation](#63-projection-validation)
  - [64. Requirement Evaluation](#64-requirement-evaluation)
  - [65. Runtime Support](#65-runtime-support)
  - [66. InterfaceUse Route Evaluation](#66-interfaceuse-route-evaluation)
  - [67. Capability Availabilityの集約](#67-capability-availability-aggregation)
  - [68. Profile ResolutionとConformance](#68-profile-resolution-and-conformance)
  - [69. Availability、Authorization、およびExecution](#69-availability-authorization-and-execution)
  - [70. Loadと明示的Invocation](#70-load-and-explicit-invocation)
- [Part IX — Standard Extension / HTTP](#part-ix--standard-extensions--http)
  - [71. HTTP Extensionの適用範囲](#71-http-extension-scope)
  - [72. HTTP Interface Realization](#72-http-interface-realization)
  - [73. HTTP Operation Mapping](#73-http-operation-mapping)
  - [74. HTTP Request Mapping](#74-http-request-mapping)
  - [75. HTTP ResponseとResult Mapping](#75-http-response-and-result-mapping)
- [Part X — 適合クラス](#part-x--conformance-classes)
  - [76. 適合性の概要](#76-conformance-overview)
  - [77. AR-XML ProducerおよびDocument適合性](#77-ar-xml-producer-and-document-conformance)
  - [78. AR-XML Consumer適合性](#78-ar-xml-consumer-conformance)
  - [79. Extension適合性](#79-extension-conformance)
  - [80. RuntimeおよびProfile Evaluator適合性](#80-runtime-and-profile-evaluator-conformance)
- [Part XI — 例](#part-xi--examples)
  - [81. 空のPassive Entity](#81-empty-passive-entity)
  - [82. Propertyのみを持つEntity](#82-properties-only-entity)
  - [83. IdentifierとSubject](#83-identifier-and-subject)
  - [84. Attachmentのみを持つInterface](#84-attachment-only-interface)
  - [85. Invocationを持たないCapability](#85-capability-without-invocation)
  - [86. InterfaceUseを持たないCapability](#86-capability-without-interfaceuse)
  - [87. 共有HTTP Interface](#87-shared-http-interface)
  - [88. 複数のInterfaceUse](#88-multiple-interfaceuses)
  - [89. 未知のforeign Extension](#89-unknown-foreign-extension)
  - [90. Reference Lab Light Control](#90-reference-lab-light-control)
  - [91. Reference Lab Temperature Reading](#91-reference-lab-temperature-reading)
- [Part XII — SecurityおよびPrivacyに関する考慮事項](#part-xii--security-and-privacy-considerations)
  - [92. Securityに関する考慮事項](#92-security-considerations)
  - [93. Privacyに関する考慮事項](#93-privacy-considerations)
- [Part XIII — Namespace、Registry、およびEvolutionに関する考慮事項](#part-xiii--namespace-registry-and-evolution-considerations)
  - [94. Namespaceに関する考慮事項](#94-namespace-considerations)
  - [95. Registryに関する考慮事項](#95-registry-considerations)
  - [96. EvolutionとCompatibility](#96-evolution-and-compatibility)
- [Appendix A. AR-DOM要約](#appendix-a-ar-dom-summary)
- [Appendix B. Cardinality表](#appendix-b-cardinality-table)
- [Appendix C. Validation Error分類](#appendix-c-validation-error-categories)
- [Appendix D. Draft 4 → Draft 5の変更点](#appendix-d-draft-4--draft-5-changes)
- [Appendix E. Non-goal](#appendix-e-non-goals)

---

<a id="1-status-of-this-document"></a>
# 1. この文書の位置づけ

この文書はAR-XML Core 0.1 Draft 5のWorking Draftである。最終標準ではない。実装はレビューおよび実験のために使用してもよい（MAY）が、Draft 5の動作を最終版AR-XML Core 0.1への適合として表明してはならない（MUST NOT）。

Draft 5は、現在の`main`ブランチにあるDraft 4仕様とIssue #10に記録された決定事項から再構築されている。以前のDraft 5作業ブランチは、過去のレビュー資料にすぎず、この文書の規範的情報源ではない。

仕様本文はRuntime実装の変更より先に策定される。ここに規定された規則は、現在のRuntimeがその規則を実装していることを意味しない。仕様上のCapabilityとRuntime実装上のCapabilityは別である。

Draft 5は、以前のドラフトと互換性のないsyntaxを導入する場合がある。以前のドラフトとの互換性は、machine readability、semantic certainty、または矛盾のないextensibilityを損なわない場合に限って維持される。

<a id="2-abstract"></a>
# 2. 概要

AR-XMLは、AR Entityについて、その宣言されたCategory、Identifier、Property、軽量なSubject、Profile Claim、共有interaction Interface、およびsemantic Capabilityを記述するためのdeclarativeなXML形式である。

AR-XMLは、Entityが何を宣言し、明示的requestをどのようにrouteできるかを記述する。Capabilityの実行、Credentialの発行、Authorizationの決定、Profile Claimの認証、またはissuerが宣言したデータの絶対的truth化は行わない。

Draft 5は、次の概念を分離する。

- EntityとそのLocation
- semantic Capabilityと、InterfaceおよびInvocation
- semantic Resultとwire Representation
- 共有InterfaceとCapability固有のInterfaceUse
- 規範的Capability ContractとEntity側projection
- Entity resolutionとsemantic-definition resolution
- description dataとRuntime evaluation state

Coreは、安定したsemantic slotと決定的な構造規則を定義する。domain固有およびtransport固有のsemanticsは、namespaceを持つExtensionによって提供される。HTTPはCore Capability semanticsではなく、Standard Interface Extensionとして規定される。

AR Entityは、physical、digital、active、passive、networked、disconnected、または計算能力を持たないものでもよい。CapabilityもInterfaceも持たないEntityを記述する文書もvalidである。ApplicationはAIまたはLLMの支援を利用してもよい（MAY）が、決定的なparse、validation、resolution-state reporting、およびconformance evaluationはAIを必須としてはならない（MUST NOT）。

<a id="3-conformance-and-normative-language"></a>
# 3. 適合性と規範言語

この文書におけるキーワード **MUST**、**MUST NOT**、**REQUIRED**、**SHALL**、**SHALL NOT**、**SHOULD**、**SHOULD NOT**、**RECOMMENDED**、**NOT RECOMMENDED**、**MAY**、および**OPTIONAL**は、すべて大文字で表記された場合に限り、BCP 14（RFC 2119およびRFC 8174）の記述に従って解釈される。

規範的要件は、その文脈で名前が示されている、または明確に示唆されるconformance classにのみ適用される。Part Xは、この仕様で使用するconformance classを定義する。

XML fragment、data-model diagram、algorithm、およびexampleは、周囲の本文が要件であることを明示する場合に限り規範的である。それ以外は参考例である。exampleによって規範的規則が弱められることはない。

Conformanceは、次の独立したlayerで評価される。

1. **Core structural validity**は、AR-XML文書がCore grammarおよびCore reference規則に従うかを判定する。
2. **Extension validity**は、理解される各Extensionについて個別に判定される。
3. **Capability projection validation**は、Entity側Capability projectionを、resolveされたCapability Contractと比較する。
4. **Profile conformance**は、EntityをresolveされたProfileに対して評価する。
5. **Runtime availability**は、明示的なinvocation attemptがlocalでready、unavailable、またはindeterminateであるかを評価する。

あるlayerでの成功または失敗を、別のlayerの結果として暗黙に置き換えてはならない（MUST NOT）。特に、次の概念は同一ではない。

```text
Core validity ≠ Extension support
Profile Claim ≠ Verified Conformance ≠ Certification
Profile Conformance ≠ Runtime Availability
Availability ≠ Authorization ≠ Execution
```

Coreがforeign Extension elementを許可しているがprocessorがそれを理解しない場合でも、そのelementが許可されたExtension Slotにあるなら、文書はCore-validのままである。unsupportedまたはunknownなsemanticsは、該当するextension、validation、またはevaluation stateを通じて報告しなければならず（MUST）、推測してはならない（MUST NOT）。

<a id="4-scope"></a>
# 4. 適用範囲

AR-XML Core 0.1 Draft 5は、次を定義する。

- AR Entityの抽象Core Information Model
- AR-XML Core namespaceにおけるそのmodelのXML serialization
- 明示的なExtension Slotとforeign namespaced contentの規則
- Capability Contract identityとEntity側projection semantics
- Profile Claimと概念的Profile conformance model
- semantic identifierおよびregistry resolutionの原則
- Core structural validationとlayered processing
- mutableなRuntime stateをdescriptionへ埋め込まないRuntime evaluation state
- conformance class
- baseline HTTP Standard Interface Extension

AR-XMLはdeclarativeである。可能なinteractionを記述できるが、文書のparseまたはloadによってそのinteractionを開始してはならない（MUST NOT）。

概念的には、次のとおりである。

```text
ARRuntime.load()
= Resolve Entity / Fetch / Parse / Validate / Expose
```

ここで`Resolve Entity`とは、Entity Resolverを介して要求されたAR-XML resourceを特定することを意味する。すべてのSemantic Identifierをresolveすること、当事者をauthenticateすること、authorizationを決定すること、またはCapabilityをinvokeすることを意味しない。

side effectを伴うoperationは、ApplicationまたはHumanからの明示的requestへの応答としてのみ開始しなければならない（MUST）。AR-XML文書のfetchはload-time network operationであり、記述されたCapability invocationではない。

CoreはphysicalかつpassiveなEntityをサポートする。CPU、network connection、API、Interface、Capability、または現在のRuntime presenceを持たないEntityもvalidである。

次はDraft 5 Coreの適用範囲外である。

- robot manipulation semantics
- general connector ontology
- relation inferenceまたはcomponent hierarchy
- AI plannerまたはskill/workflow language
- Credentialの発行、保存、refresh、またはauthorization enforcement
- 新しいtransport protocol
- W3C WoT、GS1、OPC UA、またはAsset Administration Shellの再実装
- generic mapping DSL
- AR-XMLのJSON serialization
- load中の自動execution
- 必須のcentralized registry

Extensionおよび別仕様は適用範囲外のdomainを扱ってもよい（MAY）が、Core semanticsを再定義してはならない（MUST NOT）。

<a id="5-design-principles"></a>
# 5. 設計原則

## 5.1 優先順位

要件が競合する場合、Draft 5は次の優先順位を使用する。

1. Machine readability
2. Semantic certainty
3. Future extensibility without contradiction
4. Convenience
5. Compatibility with the current specification

以前のドラフトとのsyntax後方互換性は保証されない。ただし、不要な変更は避けることが望ましい（SHOULD）。

## 5.2 関心事の分離

次の分離は基本原則である。

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

別の適用可能な仕様が明示的かつ決定的な規則を提供しない限り、processorは上記で分離された概念間の同一性を推論してはならない（MUST NOT）。

## 5.3 Declarativeかつ非実行

AR-XML文書は、issuerによる宣言と可能なinteractionを記述する。実行可能codeではない。load、parse、validate、inspect、semantic definitionのresolve、またはavailabilityのevaluateによって、記述されたCapabilityを自動的にinvokeしてはならない（MUST NOT）。

## 5.4 Capability指向でTransport非依存のCore

Capabilityはsemantic functionまたはfunctional affordanceを表す。API endpoint、HTTP method、BLE characteristic、WoT affordance、またはinvocation attemptではない。transport固有のRealizationとMappingはExtensionに属する。

1つのsemantic Capability Contractが複数transport経由で利用可能な場合、通常のmodelは複数のInterfaceUseを持つ1つのCapabilityである。producerは、各transportを表すことだけを目的としてCapabilityを複製すべきではない（SHOULD NOT）。

## 5.5 共有Interfaceと明示的Use

InterfaceはEntityで共有されるinteraction surfaceまたはrealization contextである。InterfaceUseは、特定のCapabilityが参照先Interfaceを使用することを表し、任意でExtension定義のMappingを持つ。

InterfaceはCapabilityなしで存在してもよい（MAY）。CapabilityはInvocationまたはInterfaceUseなしで存在してもよい（MAY）。InterfaceおよびInterfaceUseのdocument orderはpreferenceを意味してはならない（MUST NOT）。

## 5.6 ExtensibleだがClosedなCore

Core vocabularyはclosedである。未知のCore namespace element、および未知のCore属性またはunqualified属性はinvalidである。Extensibilityは明示的であり、foreign namespaced elementは定義済みExtension Slot内でのみ受け入れられる。

Core validationとExtension固有validationは分離される。実用上可能な場合、processorは未知のExtension subtreeをopaque dataとして保持することが望ましい（SHOULD）。

## 5.7 決定的Interoperability

決定的なinteroperabilityおよびconformance evaluationは、processing時のAI、LLM、heuristic semantic matching、またはhuman interpretationに依存してはならない（MUST NOT）。Applicationは規範的processingの外部でそのような支援を利用してもよい（MAY）が、支援された結論と適合する決定的な結果を区別しなければならない（MUST）。

## 5.8 安全な不確実性

知識がないことは、非互換またはreadyであることの証拠ではない。unknown semantics、unresolved definition、またはunsupported evaluatorは、`UNVALIDATED`、`UNKNOWN`、`UNDETERMINED`など、規定されたindeterminate stateを生成する。これらを推測によってdefinitiveな結果へ変換してはならない（MUST NOT）。

<a id="6-terminology"></a>
# 6. 用語

**AR Entity**  
ルート`ar-entity`要素が記述する単一のEntity。physicalまたはdigital、activeまたはpassiveであってよい。

**AR-DOM**  
Coreのparseとvalidationが成功した後に公開される、抽象的で実装非依存のdata model。browser DOMではない。

**Application**  
Runtimeを介してAR EntityのCapabilityをload、inspect、evaluate、または明示的に利用要求するconsumer。

**Attachment**  
physical、spatial、またはcontact-orientedなaccess boundaryのための明示的なInterface Extension Slot。存在する場合、foreign Extension semantic rootを正確に1つ含む。

**Availability**  
invocation attemptがlocalで`READY`、`UNAVAILABLE`、または`UNKNOWN`のいずれであるかを示すRuntime evaluation。Availabilityはauthorizationを付与せず、execution successも予測しない。

**Capability**  
semantic functionまたはfunctional affordanceについてのEntity側宣言。localには`id`、semanticには`type`で識別される。Capability Contractがresolveされた場合、その明示的なlocal projectionである。

**Capability Contract**  
Capabilityについてのexact-versionedで規範的なsemantic definition。InvocationのInput、ResultのOutput、Requirement、constraint、およびExtension semanticsを含み得る。Interfaceまたはtransport bindingは含まない。

**Canonical Entity Identity**  
明示的なidentity policyに基づいて選択されたidentity。CoreはIdentifierまたはLocatorから自動的に導出しない。

**Category**  
記述対象Entityについてissuerが宣言する任意のclassification。descriptive metadataであり、Capability、Profile、identity、またはconformanceの証明ではない。

**Core**  
AR-XML Core namespaceの下でこの仕様が定義するvocabulary、information model、XML grammar、およびprocessing requirement。

**Entity Resolver**  
Entity identityまたはApplicationが提供した別のEntity referenceをAR-XML locationへ対応付けるcomponent。Capability ContractまたはProfileをresolveせず、Capabilityをexecuteしない。

**Execution**  
明示的なinvocation request後にoperationを実行すること。Executionはdocument loadingの外部であり、side effectを伴い得る。

**Extension**  
non-Core XML namespaceを使用し、Extension Slot内のsemanticsを定義する仕様。

**Extension Slot**  
foreign namespaced Extension contentが許可されるCore定義のlocation。主要slotには、Property関連extension area、Requirement body、Attachment、Realization、Mapping、および後のsectionで定義するconstraint areaが含まれる。

**Identifier**  
issuerが宣言するtyped identifier value。任意でSubjectにscopeされる。Locator、credential、またはCanonical Entity Identityとして自動的に扱われない。

**Interface**  
document-localな`id`、任意のAttachment、任意のRealization、および0個以上のRequirementを持つ、Entityで共有されるinteraction surfaceまたはrealization context。InterfaceはAttachmentまたはRealizationを含まなければならない。

**InterfaceUse**  
Capabilityから共有Interfaceへのreference。任意でExtension定義のMappingを含む。複数のInterfaceUseが同じInterfaceを参照してもよい。

**Invocation**  
0個以上のInputと任意のResultを含む、request-orientedな任意のinteraction contract。空のInvocationもvalidである。CoreはObservation、Subscription、Event、およびStream semanticsをInvocationへ一般化しない。

**Locator**  
resourceまたはinteraction targetの位置を特定するために使用される情報。URI形式のIdentifierが必ずLocatorであるとは限らない。

**Mapping**  
Capabilityが参照先Interfaceをどのように使用するかを記述する明示的なInterfaceUse Extension Slot。存在する場合、foreign Extension semantic rootを正確に1つ含む。

**Profile**  
Capability Contractおよびその他のEntity characteristicに対するexact-versionedなinteroperability constraint set。Profileは適用されるsemanticsをnarrowできるが、widen、weaken、またはredefineしてはならない。

**Profile Claim**  
Entityが`conforms-to/@href`で識別されるProfileに適合するとするissuer declaration。verified conformanceまたはcertificationではない。

**Projection**  
resolveされたCapability Contractと比較されるEntity側Capability declaration。明示的なdocument contentであり、Contract contentがAR-XMLへstructural mergeされることはない。

**Property**  
任意のunitを持つ、issuerが宣言したtyped characteristicまたはstate value。絶対的truthまたは現在のRuntime stateであることは保証されない。

**Realization**  
具体的なinteraction mechanismのための明示的なInterface Extension Slot。存在する場合、foreign Extension semantic rootを正確に1つ含む。

**Representation**  
Resultについて宣言されたwireまたはmedia representation。順序はpreferenceを意味しない。

**Requirement**  
Extension定義dataを持つtyped prerequisite declaration。配置によってscopeが決まる。Capability RequirementはCapability prerequisite、Interface RequirementはInterface prerequisiteである。

**Result**  
Invocationのsemantic return description。Entity側Resultは1個以上のOutputと0個以上のRepresentationを含む。別のCapability Contract definition modelでは、列挙されるOutputを0個以上とすることができる（Section 37）。ResultとRepresentationは別である。

**Runtime**  
AR-XMLをloadし、AR-DOMをexposeし、definitionをresolveし、routeをevaluateし、実装済みCapabilityおよびpolicyに従って明示的に要求されたinvocationを実行できるprocessor。

**Semantic Identifier**  
semantic definitionを表すidentifier。identityであり、必ずしもnetwork locationではない。Capability ContractおよびProfileのidentifierはexact-versioned absolute identifierである。

**Semantic Registry**  
1つ以上のsourceを使ってSemantic Identifierをsemantic definitionへ対応付け、競合するdefinitionを検出するcomponent。Entity Resolverとは別である。

**Subject**  
必須の`id`と任意の`type`を持つ、軽量でdocument-localなtarget descriptor。nested Entityでもcomponent hierarchyでもない。`Capability.subjectRef`がない場合、記述対象Entity自体がsubjectである。

---


<a id="part-i--core-information-model"></a>
# Part I — Core情報モデル

<a id="7-core-model-overview"></a>
# 7. Coreモデル概要

Core Information Modelは、1つのAR Entityを記述する。次のtreeはcontainmentおよびcardinalityについて規範的である。

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

`?`は0回または1回の出現、`*`は0回以上の出現を表す。この概念treeの複数形labelはcollectionを表す。Part IIで対応するXML containerを定義する。

model内のすべてのitemはdescription dataである。Runtime observation、resolveされたdefinition、validation result、support information、credential、authorization decision、selected route、invocation state、およびexecution resultは、AR Entity modelのmutableな子要素ではない。

すべてのcollectionは空でもよい（MAY）。したがって、空またはpassiveなAR Entityもvalidである。Core validityは、記述対象Entityがprocessor、power source、network connection、API、または実行可能Capabilityを持つことに依存してはならない（MUST NOT）。

Draft 5 CoreはRelation collectionを持たない。Subject referenceは、Sections 10、12、14で定義する明示的scopeだけを表す。general relation、ownership graph、component hierarchy、またはcontainment inferenceとして解釈してはならない（MUST NOT）。

<a id="8-ar-entity"></a>
# 8. AR Entity

AR Entityは、AR-XML文書が記述する唯一のtop-level objectである。document rootは引き続き`ar-entity`であり、Coreは`ar-document`、`entities`、または同等のwrapperを導入しない。

AR Entityは、任意のCategoryと、このPartで定義する任意個数のIdentifier、Property、Subject、Profile Claim、Interface、およびCapabilityを含んでもよい（MAY）。任意contentの一部または全部が存在しなくても、Entityが不完全またはinvalidになることはない。

AR Entityはnetwork locationではない。そのAR-XML representationを取得したlocationはdocument retrieval contextであり、暗黙のIdentifier、Property、Interface、またはCanonical Entity Identityではない。

processorは、AR-XML文書に記述されているという理由だけで、Entityがdigital、active、online、controllable、またはcodeを実行可能であると推論してはならない（MUST NOT）。physical object、printed object、passive tag、connector-only object、および計算能力のないobjectもvalidなAR Entityである。

文書のissuerは、その宣言に責任を負う。Core parsingが確立するのは構造であり、その宣言のtruth、provenance、authority、freshness、safety、またはcertificationではない。

<a id="9-category"></a>
# 9. Category

Categoryは、記述対象Entityについてissuerが宣言する任意のclassificationである。1つの空でないstring valueを持つ。

Categoryはdescriptive metadataである。consumerはCategoryを次の代替として使用してはならない（MUST NOT）。

- IdentifierまたはCanonical Entity Identity
- Capability typeまたはCapability Contract
- Profile Claimまたはverified Profile conformance
- InterfaceまたはRuntime availability
- authorization decision

CoreはclosedなCategory vocabularyを定義せず、Category value間のhierarchy、equivalence、またはcompatibilityを推論しない。別のvocabularyまたはProfileは、CategoryのCore上の意味を変更することなくCategory valueを制約してもよい（MAY）。

EntityはCore Categoryを最大1つ持つ。追加classificationを必要とするApplicationは、適切なExtensionまたは宣言済みPropertyを使用してもよい（MAY）。

<a id="10-identifier"></a>
# 10. Identifier

Identifierは、issuerが宣言するtyped identifier valueである。次から構成される。

```text
Identifier
├─ type        1
├─ value       1
└─ subjectRef? 0..1
```

`type`は、identifier schemeまたはidentifier semanticsを示す空でないSemantic Identifierである。`value`は、そのschemeにおける空でないlexical identifier valueである。CoreはGTIN、VIN、MAC、IPv6、IMEIなどのschemeを列挙または再定義しない。

`subjectRef`がない場合、Identifierは記述対象Entityに適用される。存在する場合、同じ文書内にあるSubjectの`id`を参照しなければならず（MUST）、IdentifierはそのSubjectに適用される。

同じ`type`が複数のIdentifierに現れてもよい（MAY）。識別対象schemeまたは適用可能Profileが明示的にその意味を定義しない限り、複数の出現は、valueがequivalent、alias、preference順、または組み合わせてcomposite identifierを形成することを意味しない。

Core processorは、Identifierから次のいずれも自動推論してはならない（MUST NOT）。

- Canonical Entity Identity
- AR-XMLまたはnetwork Locator
- dereference可能resource
- authentication credential
- authorization
- ownership
- trust

Semantic Identifier自体がURI syntaxを使用する場合がある。URI syntaxだけでは、Identifierの`value`または`type`はfetch必須のnetwork locationにならない。

<a id="11-property"></a>
# 11. Property

Propertyは、記述対象EntityまたはEntity descriptionについてissuerが宣言するcharacteristicまたはstateである。次から構成される。

```text
Property
├─ type  1
├─ value 1
└─ unit? 0..1
```

`type`は、Propertyの意味とvalue interpretationを定義する空でないSemantic Identifierである。`value`は宣言されたlexical valueである。`unit`が存在する場合、空でないidentifierまたはtermであり、そのinterpretationはProperty vocabulary、適用可能Profile、またはExtensionによって定義される。

Property declarationは絶対的truthのassertionではない。Core validityは、Propertyがaccurate、current、observed、verified、またはauthoritativeであることを確立しない。provenance、timestamp、confidence、signature、またはobservation semanticsを必要とするApplicationは、適用可能Extensionまたは外部mechanismからそれを取得しなければならない（MUST）。

複数のPropertyが同じ`type`を使用してもよい（MAY）。document orderおよびrepetitionは、priority、recency、aggregation、またはconflict resolutionを意味しない。Property definitionまたは適用可能Profileは、追加の決定的constraintを課してもよい（MAY）。

Coreはlatitudeまたはlongitudeの直接fieldを追加しない。安定して宣言されたlocationは、Geo Extensionまたは別の適切なsemantic Property definitionで表現してもよい（MAY）。移動Entityの現在位置はRuntime Contextに属するか、`position.read`などのCapabilityを介して取得できる。Entity resolutionまたはdocument retrieval locationから推論してはならない（MUST NOT）。

<a id="12-subject"></a>
# 12. Subject

Subjectは、軽量でdocument-localなtarget descriptorである。次から構成される。

```text
Subject
├─ id    1
└─ type? 0..1
```

`id`は、文書のSubject collection内で一意な、空でないlocal identifierである。`type`が存在する場合、Subjectのkindを記述するSemantic Identifierである。

Subjectは、nested AR Entity、埋め込みAR-XML文書、component description、relation node、ownership assertion、またはhierarchyではない。Category、Identifier、Property、Profile Claim、Interface、またはCapabilityを継承も包含もしない。

Subjectは、`subjectRef`を持つCore declarationが、軽量な記述対象targetへ明示的にscopeできるようにするためだけに存在する。Subject collectionが存在しないこともvalidである。

Runtimeが選択するtargetはinvocation dataであり、requestごとに選択する場合はInvocation Inputとしてmodel化しなければならない（MUST）。`Capability.subjectRef`を変更したり、`subjectRef`をRuntime variableとして扱ったりして表現してはならない（MUST NOT）。

<a id="13-profile-claim"></a>
# 13. Profile Claim

Profile Claimは、記述対象Entityが識別されたProfileに適合するというissuer declarationである。情報itemは次のとおりである。

```text
ConformsTo
└─ href 1
```

`href`は、Profileのexact-versioned absolute Semantic Identifierでなければならない（MUST）。`latest`のようなmoving aliasを規範的Profile identityとして使用してはならない（MUST NOT）。

同じProfileは、結果となるdeclarationがsemantically identicalな場合に限り複数回claimしてもよい（MAY）。producerは冗長なclaimを避けることが望ましい（SHOULD）。document orderはpriorityを意味してはならない（MUST NOT）。

Profile Claimはissuerが提供するdataである。Profileがresolveされたこと、conformanceがevaluateされたこと、Entityがconformantであること、またはthird partyがcertifyしたことの証明ではない。

```text
Profile Claim
≠ Profile Resolution
≠ Verified Conformance
≠ Certification
```

Profile resolutionおよびconformance stateは、Parts VおよびVIIIで別に定義する。

<a id="14-capability"></a>
# 14. Capability

Capabilityは、semantic functionまたはfunctional affordanceについてのEntity側declarationである。次から構成される。

```text
Capability
├─ id             1
├─ type           1
├─ subjectRef?    0..1
├─ Requirements*  0..*
├─ Invocation?    0..1
└─ InterfaceUses* 0..*
```

`id`は、文書のCapability collection内で一意な、空でないlocal identifierである。`type`は、そのEntity側projectionが実装するCapability Contractのexact-versioned absolute Semantic Identifierでなければならない（MUST）。

`subjectRef`がない場合、Capabilityのsubjectは記述対象Entity自体である。存在する場合、同じ文書内にあるSubjectの`id`を参照しなければならない（MUST）。

Capabilityは、どのfunctionまたはaffordanceが宣言されているかを表す。次のいずれでもない。

- Interfaceまたはtransport binding
- endpoint、HTTP method、BLE characteristic、またはWoT affordance
- invocation requestまたはexecution record
- Runtime support、availability、authorization、またはexecution成功の証明
- 規範的Capability Contract自体

CapabilityはInvocationを省略してもよい（MAY）。すべてのInterfaceUseを省略してもよい（MAY）。どちらの省略もvalidであり、descriptive、non-request-oriented、現在route不能、または外部でrealizeされるsemantic capabilityを表し得る。

複数のInterfaceUseが同じCapability Contractを実装する場合、それらは1つのCapabilityに対する代替routeまたは追加routeである。producerは、HTTP、BLE、physical connector、または別のrealizationも利用可能であることだけを理由にCapabilityを複製すべきではない（SHOULD NOT）。

Entity側Capabilityは、そのCapability Contractの明示的なlocal projectionである。Contract contentがAR-XML文書へ暗黙にcopyまたはstructural mergeされることはない。Projection規則はPart IVで定義する。

<a id="15-invocation"></a>
# 15. Invocation

Invocationは、Capabilityの任意のrequest-oriented interaction contractである。次から構成される。

```text
Invocation
├─ Inputs* 0..*
└─ Result? 0..1
```

空のInvocationもvalidである。これは、Core InputまたはCore Resultを宣言せずに、Capabilityがrequest-oriented interaction shapeを持つことを表す。文書をloadしたときにrequestを実行すべきことは意味しない。

Inputは、特定invocationのためにcallerが提供するsemantic valueを記述する。Resultは、そのinvocationから期待されるsemantic resultを記述する。どちらもtransport serializationを定義せず、その役割はInterface ExtensionおよびInterfaceUse Mappingが担う。

Invocationは、意図的にgeneral interaction-pattern abstractionではない。Observation、Subscription、Event、Notification、およびStream semanticsをInvocationへ押し込まない。将来のCore revisionまたはExtensionは、ここで定義したrequest-orientedな意味を変更することなく、それらのpatternを定義してもよい（MAY）。

Invocationが存在しても、InterfaceUse、Runtime implementation support、authorization、route availability、またはexecution成功は保証されない。

<a id="16-input-result-output-and-representation"></a>
# 16. Input、Result、Output、およびRepresentation

## 16.1 Core Data Type

InputおよびOutputは、次のCore structural data typeのいずれかを使用する。

```text
string
number
integer
boolean
binary
object
array
```

これらのtypeが記述するのはdata shapeであり、domain meaningではない。semantic name、Capability Contract、unit、format、またはExtensionがdomain semanticsを提供する。processorは、たとえば`number`がtemperatureであることや、`string`が`text/plain` representationを使用することを推論してはならない（MUST NOT）。

`number`はnumeric scalar shape、`integer`はintegral numeric scalar shapeを表す。これらのprimitive nameは、arbitrary-precision decimal value model、machine word size、IEEE-754非依存性、または普遍的なrange/precision policyを規定しない。numeric range、precision、exceptional-value handling、およびwire representationは、適用可能なCapability Contract、Profile、datatype Extension、およびtransport mappingに属する。Runtimeのnumeric limitationはimplementation support informationであり、このCore vocabularyだけではarbitrary-precision arithmeticまたはexact-decimal storageを要求しない。

## 16.2 Input

Inputはcallerが提供するsemantic valueである。Core情報は次のとおりである。

```text
Input
├─ name        1
├─ type        1
├─ required?   0..1, default true
├─ format?     0..1
├─ unit?       0..1
└─ constraints 0..*
```

`name`は、同じInvocation内のInput間で一意な、空でないsemantic field nameである。`type`は1つのCore data typeである。`required`がない場合は`true`である。`format`、`unit`、およびconstraintはinterpretationをrefineするが、resolveされたCapability Contractが定義するInput semanticsと矛盾してはならない（MUST NOT）。

Input constraintは、Parts IIおよびIIIで定義する明示的なconstraint areaでのみ表現される。unknown constraint semanticsは、後で規定するとおりprojectionまたはRuntime evaluationに影響する。推測してはならない（MUST NOT）。

## 16.3 Result

Entity側Resultは、Invocationのsemantic return valueを記述する。Core information modelは次のとおりである。

```text
Result
├─ Outputs+         1..*
└─ Representations* 0..*
```

Entity側`result`が存在する場合、少なくとも1つのOutputを含まなければならない（MUST）。return valueを持たないEntity側Invocationは、空のResultを使用せずResultを省略する。このEntity serialization規則は、Section 37の別個のCapability Contract definition modelに同じcardinalityを課さない。Resultは、成功したRuntime execution result、HTTP response、decoded payload、またはCapability errorとは別である。

Draft 5 Coreは、Draft 4の`errors` collectionをEntity側Result modelに含めない。semantic error definitionおよびmappingには、適用可能なCapability ContractまたはExtensionが必要であり、transport statusだけから推論してはならない（MUST NOT）。

## 16.4 Output

OutputはResult内のsemantic valueである。Core情報は次のとおりである。

```text
Output
├─ name        1
├─ type        1
├─ format?     0..1
├─ unit?       0..1
└─ constraints 0..*
```

`name`は、同じResult内のOutput間で一意な、空でないsemantic field nameである。`type`は1つのCore data typeである。`format`、`unit`、およびconstraintはinterpretationをrefineするが、resolveされたCapability Contractが定義するOutput semanticsと矛盾してはならない（MUST NOT）。

適用可能なMappingまたは関連Interface Extensionが対応関係を定義するまで、Outputはwire fieldではない。

## 16.5 Representation

Representationは、Result全体の具体的なmedia representationを宣言する。RFC 9110のmedia-type syntaxに適合する空でない必須`mediaType` valueを持ち、Section 27.3に従う。また、Part IIが明示的に定義する追加Core情報だけを含んでもよい（MAY）。

```text
Result ≠ Representation
```

1つのRepresentationが複数のOutputを伝達してもよい（MAY）。逆に、Outputが1つだけ宣言されていても、processorはscalar wire representationを仮定できない。

Representationのdocument orderはpreferenceを意味してはならない（MUST NOT）。selectionをサポートする場合、明示的なcaller preference、Runtime support、適用可能なInterface Extension規則、およびEntity declarationに基づく。

複数のRepresentationは、実質的にequivalentなResult contentを記述することが望ましい（SHOULD）。summary、translation、simplified version、または別のsemantic transformationは、同じResultの代替Core Representationには自動的にならない。

<a id="17-requirement"></a>
# 17. Requirement

Requirementはtyped prerequisite declarationである。次から構成される。

```text
Requirement
├─ type                   1
└─ extension-defined elements 0..*
```

`type`は、Requirement semanticsを識別する空でないSemantic Identifierである。Coreはclosedな`kind` enumerationを定義しない。bodyは、Requirement definitionおよびExtension processing規則に従うdataを提供する0個以上のforeign Extension elementを含む。複数のbody elementは、この1つのRequirementに属する。Coreはそれらを単一rootへcollapseせず、それぞれを別Requirementとしても扱わない。

Requirementのscopeは配置によって決まる。

```text
Capability.Requirements
→ prerequisites for the Capability

Interface.Requirements
→ prerequisites for use of the Interface
```

producerはCoreの`scope` valueを使用して配置をoverrideしてはならない（MUST NOT）。

AuthenticationおよびauthorizationのprerequisiteをRequirementとして宣言してもよい（MAY）。AR-XMLはcredentialまたはauthorizationを発行、保存、refresh、開示、またはenforceしない。文書は、password、session identifier、bearer token、refresh token、private key、API secret、または同等のsecretをRequirement dataまたはAR-XML内の他の場所へ埋め込んではならない（MUST NOT）。

Requirementはdescription dataであり、現在のRuntime stateではない。prerequisiteが現在満たされているとはassertしない。Runtime evaluationはPart VIIIで定義する`SATISFIED`、`UNSATISFIED`、または`UNKNOWN`を使用する。

unknown Requirement typeまたはunknown Requirement Extensionだけで、Core-validな文書がinvalidになることはない。

```text
Core validity = valid
RequirementEvaluation = UNKNOWN
```

この不確実性をauthorizationへ変換したり、satisfiedとして扱ったりしてはならない（MUST NOT）。

<a id="18-interface-and-interfaceuse"></a>
# 18. InterfaceとInterfaceUse

## 18.1 Interface

Interfaceは、Entityで共有されるinteraction surfaceまたはrealization contextである。次から構成される。

```text
Interface
├─ id            1
├─ Attachment?   0..1
├─ Realization?  0..1
└─ Requirements* 0..*
```

`id`は、文書のInterface collection内で一意な、空でないlocal identifierである。

Attachmentはphysical、spatial、またはcontact-orientedなaccess boundaryを記述する。Realizationは具体的なinteraction mechanismを記述する。具体的semanticsはCoreではなくforeign namespaced Extensionが定義する。connector description、BLE realization、HTTP API、WoT-based realizationなどが例である。

InterfaceはAttachmentまたはRealizationの少なくとも一方を含まなければならない（MUST）。

```text
Attachment absent
AND Realization absent
→ invalid Interface
```

Attachmentのみを持つInterfaceとRealizationのみを持つInterfaceは、どちらもvalidである。これにより、Capability、network API、または実行可能operationを要求せずにpassive HDMI connectorなどを記述できる。Attachmentはaccess boundaryだけを記述し、具体的なInvocation mechanismはRealizationで表現しなければならない（MUST）。AttachmentのみのInterfaceを参照するInterfaceUseはCore-validのままだが、そのrequest-oriented routeはSection 66に従って`UNAVAILABLE`となる。

AttachmentまたはRealizationが存在する場合、そのwrapperはforeign namespaced Extension semantic rootを正確に1つ含む。Part IIIはExtension processingおよびvalidationを定義する。

AttachmentとRealizationはInterfaceの別々のaspectを記述する。request-oriented routeがAttachmentを持つInterfaceを参照する場合、宣言されたAttachmentは適用可能なaccess prerequisiteであり、Section 66.5に従ってevaluateしなければならない（MUST）。AttachmentとRealizationの両方が存在する場合、Attachment satisfactionと必要なinteraction mechanism supportは、そのrouteに対する累積条件である。Realization supportだけではAttachmentをbypassしない。Attachment Extensionはaccess conditionを定義し、CoreはそのevaluationがAvailabilityへどう寄与するかを定義する。存在だけでは、satisfaction、programmatic invocation support、またはphysical safetyを証明しない。

どのCapabilityからも参照されないInterfaceが存在してもよい（MAY）。Interface orderはpreferenceを意味してはならない（MUST NOT）。

## 18.2 InterfaceUse

InterfaceUseは、特定Capabilityが共有Interfaceをどう使用するかを宣言する。次から構成される。

```text
InterfaceUse
├─ ref      1
└─ Mapping? 0..1
```

`ref`は、同じ文書内のInterfaceの`id`を参照しなければならない（MUST）。dangling referenceはCore structural errorである。

Mappingが存在する場合、Capability固有の参照先Interface利用方法を記述するforeign namespaced Extension semantic rootを正確に1つ含む。Interface realizationまたは適用可能Extension semanticsがCapability固有mappingを必要としない場合、Mappingを持たないplain InterfaceUseもvalidである。

1つのCapabilityが、同じ`ref`を持つ複数のInterfaceUseを含んでもよい（MAY）。これにより、同じ共有Interfaceに対する複数のmappingまたはuseを表現できる。processorは、`ref` valueが一致するという理由だけで、そのようなInterfaceUseをcollapseしてはならない（MUST NOT）。

InterfaceUse orderはroute preferenceを意味してはならない（MUST NOT）。route supportおよびavailabilityは、適用可能な各InterfaceUseについて個別にevaluateされ、Part VIIIの定義どおりaggregateされる。

## 18.3 分離規則

InterfaceとInterfaceUseは別の概念として維持しなければならない（MUST）。

```text
Interface
= shared attachment / realization context

InterfaceUse
= capability-specific reference and optional mapping
```

Capability Contractは、Interface、InterfaceUse、Attachment、Realization、Mapping、endpoint、またはtransport informationを含んではならない（MUST NOT）。これらはEntity implementation projectionと利用可能interaction routeを記述するものであり、規範的semantic functionではない。

---
