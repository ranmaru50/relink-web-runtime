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

<a id="part-ii--xml-serialization"></a>
# Part II — XMLシリアライゼーション

<a id="19-xml-namespace-and-version"></a>
# 19. XML名前空間とバージョン

AR-XML Core 0.1のnamespaceは次のとおりである。

```text
https://relink.dev/ns/arxml/core/0.1
```

Draft 5文書は、すべてのCore elementのnamespace nameとしてこのnamespaceを使用しなければならない（MUST）。exampleではdefault namespaceとして使用する。

rootの`version`属性は必須（REQUIRED）であり、このdraftにおけるvalueは正確に次のとおりである。

```text
0.1
```

namespaceとrootの`version="0.1"`はCore 0.1 familyを識別する。Draft 4とDraft 5は区別しない。consumerは明示的なApplication configurationまたはout-of-bandな仕様上の合意によってDraft 5 processingを選択し、Draft 5 grammar全体をvalidateしなければならない（MUST）。このnamespace/version pairだけからdraftを推論してはならず、validation failure時に別draftへ暗黙にfallbackしてもならない（MUST NOT）。versionがない場合、または`0.1`以外の場合、選択されたDraft 5 grammarではinvalidである。

Extension elementはnon-Core namespaceを使用しなければならない（MUST）。namespace prefixの表記はsemantic significanceを持たない。namespace declarationはinformation-model attributeではない。

Core processorはnamespace-awareなXML processingを行わなければならない（MUST）。namespaceを無視してlocal nameだけでelementをmatchする実装はnon-conformingである。

<a id="20-root-element"></a>
# 20. ルート要素

document elementはCore namespaceの`ar-entity`でなければならない（MUST）。その外側にCore wrapperを置くことは許可されない。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1">
  <!-- Core children, if any -->
</ar-entity>
```

空のEntityもvalidである。

```xml
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1" />
```

rootに許可されるのは、Section 21で定義するCore child、必須のunqualified `version` Core attribute、およびSection 32.3に従うforeign metadata attributeだけである。未知のCore-namespace child、および未知のunqualifiedまたはCore-namespace attributeはinvalidである。

foreign namespaced childを`ar-entity`直下に置くことはできない。Part IIIで定義する明示的なExtension Slot内でのみ許可される。

<a id="21-core-containers-and-child-order"></a>
# 21. Coreコンテナと子要素順序

## 21.1 Singleton Container

次の任意collection containerは、それぞれ最大1回、`ar-entity`直下に出現できる。

```text
identifiers
properties
subjects
profiles
interfaces
capabilities
```

`category`は任意のsingleton value elementであり、collection containerではない。最大1回出現できる。

singleton containerの反復は、そのうち1つが空であってもinvalidである。空のcollection containerはvalidであり、containerがない場合と同じcollection cardinalityを持つ。canonical serializerは空のcollection containerを省略することが望ましい（SHOULD）。

このPartで定義するnested singleton container（`requirements`、`invocation`、`inputs`、`result`、`outputs`、`representations`、`interface-uses`、`attachment`、`realization`、`mapping`、`constraints`を含む）は、後のsectionが明示的に別の規則を定めない限り、そのowner element内でそれぞれ最大1回出現できる。

## 21.2 順序に依存しないValidation

許可されたCore child elementの順序は、Core validationにおいてsemantic significanceを持たない。validatorは、cardinalityおよびcontainment規則を満たす限り、許可されたchildをどの順序でも受け入れなければならない（MUST）。

collection itemの順序はdocument dataとして保持されるが、適用可能なnon-Core仕様がそのsemanticsを明示的に定義しない限り、preference、priority、recency、fallback、またはexecution orderを意味してはならない（MUST NOT）。

## 21.3 Canonical Serializerの順序

canonical Draft 5 serializerは、root childが存在する場合、次の順序で出力することが望ましい（SHOULD）。

```text
category
identifiers
properties
subjects
profiles
interfaces
capabilities
```

Capability内では、次の順序で出力することが望ましい（SHOULD）。

```text
requirements
invocation
interface-uses
```

Interface内では、次の順序で出力することが望ましい（SHOULD）。

```text
attachment
realization
requirements
```

canonical orderは安定した出力の推奨を提供するが、順序に依存しないvalidation規則を変更せず、collection itemへpreferenceを付与しない。許可された別のchild orderを使用しても、Producer conformance claimはinvalidにならない。この推奨はXML byte canonicalizationまたはsignature algorithmではない。

## 21.4 ClosedなCore Content

attributeだけを含むCore elementは、element childまたはnon-whitespace character dataを含んではならない（MUST NOT）。Core container elementはnon-whitespace character dataを含んではならない（MUST NOT）。このPartでelement character dataをvalueとするCore elementは`category`だけである。

この仕様が明示的に宣言しない限り、次の規則を適用する。

- 未知のCore-namespace elementはinvalidである。
- Core element上の未知のunqualified attributeはinvalidである。
- 未知のCore-namespace attributeはinvalidである。
- Extension Slot外のforeign namespaced elementはinvalidである。

Extension Slot内のforeign subtree contentは、Core child grammarではなくPart IIIに従う。すべてのCore elementはSection 32.3に従うforeign namespaced metadata attributeも許可するが、これは定義済みslot外のforeign child elementを許可するものではない。

<a id="22-category-serialization"></a>
# 22. Categoryのシリアライゼーション

Categoryは`category`のcharacter contentとしてserializeされる。

```xml
<category>environment.sensor</category>
```

`category`は、XML markup-only whitespaceを除外した後に空でないvalueを含まなければならない（MUST）。child elementまたはCore/unqualified attributeを含んではならない（MUST NOT）。foreign metadata attributeはSection 32.3に従う。

Coreは、それ以外のCategory content normalizationを行わない。producerはleadingまたはtrailing whitespaceを避けることが望ましい（SHOULD）。vocabulary固有のcomparisonおよびnormalizationは、適用可能Profileが定義しない限りCoreの範囲外である。

<a id="23-identifier-serialization"></a>
# 23. Identifierのシリアライゼーション

Identifierは、任意の`identifiers` container内にserializeされる。

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

各`identifier`はunqualified attributeの`type`および`value`を持たなければならない（MUST）。`subject-ref`を持ってもよい（MAY）。他のCoreまたはunqualified attribute、およびCore childは許可されない。

`type`および`value`は空であってはならない（MUST）。`subject-ref`が存在する場合、空であってはならず、同じ文書内の`subject`の`id`と一致しなければならない（MUST）。forward referenceはvalidである。whole-document validation後にdangling referenceが残る場合はinvalidである。

複数の`identifier`が同じ`type`を使用してもよい（MAY）。Identifier orderはCore上のpreference semanticsを持たない。

<a id="24-property-serialization"></a>
# 24. Propertyのシリアライゼーション

Propertyは、任意の`properties` container内にserializeされる。

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

各`property`はunqualified attributeの`type`および`value`を持たなければならない（MUST）。`unit`を持ってもよい（MAY）。このPartでは、他のCoreまたはunqualified attribute、およびCore childは許可されない。

`type`および`value`は空であってはならない（MUST）。`unit`が存在する場合、空であってはならない（MUST）。Coreはlexical valueを保持し、適用可能なsemantic definitionなしにnumeric、boolean、date、location、または別のRuntime typeへcoerceしない。

複数の`property`が同じ`type`を使用してもよい（MAY）。Property orderはCore上のpreferenceまたはrecency semanticsを持たない。

<a id="25-subject-serialization"></a>
# 25. Subjectのシリアライゼーション

Subjectは、任意の`subjects` container内にserializeされる。

```xml
<subjects>
  <subject
    id="sensor-module"
    type="https://example.org/subject-types/sensor/1" />
</subjects>
```

各`subject`はunqualified `id` attributeを持たなければならず（MUST）、`type`を持ってもよい（MAY）。child elementまたはnon-whitespace character dataを含んではならない（MUST NOT）。

`id`は空であってはならず（MUST）、文書のSubject collection内で一意でなければならない（MUST）。`type`が存在する場合、空であってはならない（MUST）。Subject IDとInterface IDまたはCapability IDは別々のtyped collectionに属するため、異なるtyped collectionで同じlexical valueを使用してもよい（MAY）。

Subject serializationは、nested `ar-entity`、`subjects`、relationship、component、またはhierarchy contentを許可しない。

<a id="26-capability-serialization"></a>
# 26. Capabilityのシリアライゼーション

Capabilityは、任意の`capabilities` container内にserializeされる。

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

各`capability`はunqualified attributeの`id`および`type`を持たなければならない（MUST）。`subject-ref`を持ってもよい（MAY）。`id`は空であってはならず（MUST）、文書のCapability collection内で一意でなければならない（MUST）。`type`は空でないexact-versioned absolute Capability Contract identifierでなければならない（MUST）。

`subject-ref`が存在する場合、同じ文書内のSubject IDと一致しなければならない（MUST）。存在しない場合、記述対象Entityがsubjectである。

`capability`に許可されるCore childは、任意のsingleton `requirements`、`invocation`、および`interface-uses`だけである。3つすべてを省略してもよい（MAY）。Invocationを持たないCapability、およびInterfaceUseを持たないCapabilityはvalidである。

<a id="27-invocation-and-result-serialization"></a>
# 27. InvocationとResultのシリアライゼーション

## 27.1 InvocationとInput

InvocationはCapabilityの任意の`invocation` childとしてserializeされる。空elementもvalidである。

```xml
<invocation />
```

Inputが存在する場合、1つの`inputs` container内にserializeされる。

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

各`input`は`name`および`type`を持たなければならない（MUST）。`required`、`format`、および`unit`を持ってもよい（MAY）。Inputの`name` valueは空であってはならず（MUST）、同じInvocation内で一意でなければならない（MUST）。`type`は`string`、`number`、`integer`、`boolean`、`binary`、`object`、`array`のいずれかでなければならない（MUST）。

`required`がない場合、そのvalueは`true`である。Inputがoptionalになるのは、`required="false"`が明示的に存在する場合だけである。`required`が存在する場合、そのlexical valueは正確に`true`または`false`でなければならない（MUST）。`format`および`unit`が存在する場合、空であってはならない（MUST）。

`input`は任意の`constraints` Extension Slotを1つ含んでもよい（MAY）。slotはPart IIIで定義するforeign namespaced constraint elementを含む。他のchildは許可されない。

## 27.2 ResultとOutput

Resultは`invocation`の任意の`result` childとしてserializeされる。存在する場合、Resultは少なくとも1つのOutputを含まなければならない（MUST）。valueを返さないinvocationでは`result` childを省略する。

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

`result`は、1つ以上の`output` childを持つ`outputs` containerを正確に1つ含まなければならず（MUST）、`representations` containerを1つ含んでもよい（MAY）。各`output`は`name`および`type`を持たなければならず（MUST）、`format`および`unit`を持ってもよい（MAY）。Outputの`name` valueは空であってはならず（MUST）、そのResult内で一意でなければならない（MUST）。Outputの`type`、`format`、および`unit`は、OutputにCore `required` attributeがない点を除き、上記Input規則に従う。

`output`は任意の`constraints` Extension Slotを1つ含んでもよい（MAY）。他のchildは許可されない。

Draft 5 Coreには`result`配下の`errors` childはない。Core namespaceの`errors` elementはinvalidである。

## 27.3 Representation

各`representation`は、Core定義attributeの`media-type`を正確に1つ持たなければならない（MUST）。その空でないvalueは[RFC 9110 Section 8.3.1](https://httpwg.org/specs/rfc9110.html#media.type)のmedia-type syntaxに適合しなければならない。Core validationはsyntaxを検査し、IANA registrationは検査しない。syntax上validなvendor、personal、およびunregistered type/subtype nameは、未登録またはunknownであるという理由だけではrejectされない。Core validationはregistry lookupを要求したり、local registration snapshotに依存したりしてはならない（MUST NOT）。registration status、Runtime support、およびavailabilityは別のpolicyまたはExtension concernである。HTTP JSON baseline matchingは引き続きSection 75.2に従う。

例:

```xml
<representations>
  <representation media-type="application/json" />
  <representation media-type="text/plain" />
</representations>
```

`representation`はCoreまたはforeign child elementを含んではならない（MUST NOT）。Representation orderはpreferenceを表さない。

<a id="28-requirement-serialization"></a>
# 28. Requirementのシリアライゼーション

Requirementは、CapabilityまたはInterfaceが所有する任意の`requirements` container内にserializeされる。

```xml
<requirements>
  <requirement type="https://example.org/requirements/authentication/1">
    <auth:oauth2
      xmlns:auth="https://example.org/ns/auth/1"
      scope="light.write" />
  </requirement>
</requirements>
```

各`requirement`はunqualified `type` attributeを持たなければならない（MUST）。`type`は空であってはならない（MUST）。Coreの`kind`または`scope` attributeは定義されない。

`requirement` elementは、0個以上のforeign namespaced Extension elementを含むExtension Slotである。空でもよく（MAY）、異なるforeign namespaceのelementを含む複数のparameter elementを持ってもよい（MAY）。各subtreeはPart IIIに従って処理され、Requirement definitionがそれらを組み合わせた意味を規定する。`requirement`直下のnon-whitespace character dataはinvalidである。Attachment、Realization、およびMappingのexactly-one-root規則はRequirement bodyには適用されない。

次の例は、2つのExtension parameter elementを持つCore-validなbodyを示す。domain meaningには、識別されたRequirementおよびExtension definitionが必要である。

```xml
<requirement xmlns="https://relink.dev/ns/arxml/core/0.1"
             xmlns:access="https://example.org/ns/access/1"
             type="https://example.org/requirements/access-zone/1">
  <access:zone value="front" />
  <access:distance maximum="1" unit="m" />
</requirement>
```

配置によってscopeが決まる。Capability配下の同じXML shapeはCapability prerequisiteを、Interface配下ではInterface prerequisiteを宣言する。

<a id="29-interface-and-interfaceuse-serialization"></a>
# 29. InterfaceとInterfaceUseのシリアライゼーション

## 29.1 Interface

Interfaceは、任意のroot-level `interfaces` container内にserializeされる。

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

各`interface`はunqualified `id` attributeを持たなければならない（MUST）。空であってはならず（MUST）、Interface collection内で一意でなければならない（MUST）。許可されるCore childは、任意のsingleton `attachment`、任意のsingleton `realization`、および任意のsingleton `requirements`だけである。

`attachment`または`realization`の少なくとも一方が存在しなければならない（MUST）。したがって、`<interface id="x"/>`および`requirements`だけを含むInterfaceはinvalidである。

`attachment`および`realization`は明示的なExtension wrapperである。各wrapperが存在する場合、foreign namespaced semantic rootを正確に1つ含み、direct non-whitespace character dataを含んではならない（MUST）。

Attachmentのみを持つInterfaceはvalidである。

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

InterfaceUseは、Capabilityの任意の`interface-uses` container内にserializeされる。

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

各`interface-use`はunqualified `ref` attributeを持たなければならない（MUST）。`ref`は空であってはならず（MUST）、同じ文書内のInterface IDと一致しなければならない（MUST）。forward referenceは許可される。whole-document validation後にdangling referenceが残る場合はinvalidである。

`interface-use`は`mapping` wrapperを1つ含んでもよい（MAY）。`mapping`が存在する場合、foreign namespaced semantic rootを正確に1つ含み、direct non-whitespace character dataを含んではならない（MUST）。

plain referenceはvalidである。

```xml
<interface-use ref="display-port" />
```

同じCapability内の複数のInterfaceUseが同じ`ref`を持ってもよい（MAY）。InterfaceUse orderはpreferenceを表さない。

<a id="30-profile-claim-serialization"></a>
# 30. Profile Claimのシリアライゼーション

Profile Claimは、任意の`profiles` container内にserializeされる。

```xml
<profiles>
  <conforms-to href="https://example.org/profiles/reference-lab/1" />
</profiles>
```

各`conforms-to`はunqualified `href` attributeを持ち（MUST）、child elementまたはnon-whitespace character dataを含んではならない（MUST NOT）。`href`は空でないexact-versioned absolute Profile identifierでなければならない（MUST）。relative referenceおよび`latest`のようなmoving version aliasは、規範的Profile identityとしてinvalidである。

Profile Claim orderはpreference、verification status、またはcertification levelを表さない。

---

<a id="part-iii--extension-model"></a>
# Part III — Extensionモデル

<a id="31-extension-architecture"></a>
# 31. Extensionアーキテクチャ

AR-XML Coreはclosed vocabularyと有限個の明示的なExtension Slotを定義する。Extensionは、foreign XML namespace内でdomain、device、attachment、constraint、security、またはtransport固有のsemanticsを提供する。

ExtensionはCore semanticsをredefine、weaken、またはcontradictしてはならない（MUST NOT）。特に、Extensionは次を行ってはならない（MUST NOT）。

- Core information itemの意味またはcardinalityを変更する
- invalidなCore structureをvalidにする
- Coreの`id`、reference、data type、またはSemantic Identifierをreinterpretする
- Coreが順序をinsignificantと定める箇所でdocument orderをpreferenceとして扱う
- descriptionをexecutionとして扱う
- availabilityをauthorizationまたはexecution successと同一視する
- document loadingによってCapabilityをinvokeする

Extensionがelement-based semanticsを追加できるのは、そのsemantic rootを許可するslotを介する場合だけである（MAY）。Core element上のforeign namespaced metadata attributeは、Section 32.3に従って別途許可される。同じforeign namespaceが複数slotのrootを定義してもよい（MAY）が、各rootの意味はexpanded XML nameとslot contextの両方によって決まる。

Extension仕様は、次を定義することが望ましい（SHOULD）。

- 安定したversioned namespace URI
- 各slotで許可されるExtension root
- childおよびattribute grammar
- semantic meaningおよびconstraint
- Extension固有validation error
- processor support criteria
- Capability ContractおよびProfileとのinteraction
- 適用可能な場合のRuntime evaluation behavior

namespace prefix textはsemantic identityではない。processorはprefixではなくnamespace URIとlocal nameによってExtension elementを識別しなければならない（MUST）。

Extension contentの存在は、Runtimeがそれを実装していることを確立しない。仕様で定義されたExtension capabilityとRuntime implementation capabilityは別のままである。

<a id="32-extension-slots"></a>
# 32. Extension Slot

## 32.1 定義済みSlot

Draft 5 Coreは次のExtension Slotを定義する。

| Slot | XML location | Foreign semantic root | 目的 |
|---|---|---:|---|
| Property slot | `properties`のdirect child | 0..* | Extension定義のEntity characteristicまたはdeclared state |
| Requirement body | `requirement`のdirect child | 0..* | `requirement/@type`で識別されるRequirementのparameter element |
| Attachment | `attachment`のdirect child | 正確に1 | physical、spatial、またはcontact-orientedなaccess boundary |
| Realization | `realization`のdirect child | 正確に1 | 具体的なinteraction mechanism |
| Mapping | `mapping`のdirect child | 正確に1 | Capability固有のInterface利用方法 |
| Constraint area | `constraints`のdirect child | 0..* | InputまたはOutputに対するExtension定義constraint |

`attachment`、`realization`、および`mapping`は明示的なCore wrapperである。wrapperが存在するのにforeign semantic rootを含まない場合はinvalidである。複数のforeign semantic rootを含む場合もinvalidである。

`constraints`も明示的な任意のCore wrapperである。存在する場合、0個以上のforeign namespaced constraint elementを含んでもよい（MAY）。したがって、空の`<constraints/>` wrapperはCore-validであり、AR-DOMではwrapperがない場合と同じ空のconstraint collectionを表す。serializerはround-tripのためにwrapperの存在を保持してもよい（MAY）が、canonical serializerは空wrapperを省略することが望ましい（SHOULD）。複数のconstraint rootが許可されるのは、各rootが独立してevaluate可能なconstraintを記述し得るためである。この`0..*` content規則はConstraint area固有であり、Attachment、Realization、またはMappingのexactly-one規則を緩和しない。

`properties` containerは、Core `property` elementのcollection containerであると同時にProperty Extension Slotでもある。Core `property` childとforeign namespaced property rootを任意の順序で含んでもよい（MAY）。各foreign childは1つのExtension定義property itemであり、Core `Property`にはならず、暗黙のCore `type`、`value`、または`unit` fieldも付与されない。

例:

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

Coreはgenericな`extensions` containerを定義せず、rootまたは他のCore element内の任意のforeign child elementを許可しない。foreign metadata attributeはSection 32.3に従う。新しいExtension Slotには将来のCore revisionが必要である。

## 32.2 Slot Envelope Validation

Core validationはExtension Slotのenvelopeについて次を検査する。

- slotが許可されたCore locationに出現すること
- wrapper cardinalityが満たされること
- 各semantic rootがnon-Core namespaceを使用すること
- 禁止されたdirect character dataまたは余分なCore contentがないこと

Core validationはforeign subtreeの内部grammarまたはdomain meaningをvalidateしない。それはExtension固有validationの役割である。

Core namespace内のExtension rootは、processorがそのlocal nameを認識しない場合でもforeign contentにはならない。未知のCore elementであり、invalidである。

## 32.3 Foreign Metadata Attribute

任意のCore element上のforeign namespaced attributeはmetadataを追加してもよい（MAY）。Core semanticsをredefineしたり、必須Core attributeを置き換えたり、defaultまたはcardinalityを変更したり、Core referenceまたはHTTP base-resolution規則をoverrideしたりしてはならない（MUST NOT）。たとえば、`meta:required="false"`によってInputをoptionalにはできない。そのfieldを制御するのはCoreのunqualified `required` attributeだけである。

未知のforeign metadata attributeによって、本来validなCore documentをinvalidにしてはならない（MUST NOT）。Core validationはXML namespace correctnessと変更されていないCore規則を検査し、認識されたmetadata Extensionは別にvalidateされる。semanticsがunknownな場合でも、processorは各foreign attributeについて、expanded name（namespace URIとlocal name）、XML処理後のstring value、およびowner Core elementを保持することが望ましい（SHOULD）。lossless serializerをclaimする実装は、このmetadataを保持するか、それができないことを開示しなければならない（MUST）。

この許可は、未知のCore/unqualified attribute、slot外のforeign child element、または実行可能processing instructionを認めない。namespace declarationはmetadata attributeではなくXML syntaxのままである。metadataの読み取りによってnetwork retrievalまたはCapability executionを開始してはならない（MUST NOT）。

Core-validなmetadataの例:

```xml
<ar-entity xmlns="https://relink.dev/ns/arxml/core/0.1"
           xmlns:meta="https://example.org/ns/metadata/1"
           version="0.1" meta:source="catalog" />
```

foreign Extension element上のattributeはforeign subtreeの一部であり、そのExtensionに従う。

<a id="33-attachment"></a>
# 33. Attachment

Attachmentは、Interfaceに関連付けられたphysical、spatial、contact-oriented、またはその他のdirect access boundaryを記述する。`attachment` wrapperはforeign namespaced semantic rootを正確に1つ含まなければならない（MUST）。

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

Coreはconnector family、pinout、orientation、mating rule、spatial tolerance、safety limit、またはcompatibilityを定義しない。これらのsemanticsはAttachment Extensionに属する。

Attachmentは、Interfaceがprogrammatic Invocationをsupportすることを意味しない。Attachmentのみを持つInterfaceもvalidであり、passive connector、contact point、marker、access region、またはその他のnon-network boundaryを記述できる。

Attachment Extensionは、Capability、Capability Contract、Invocation、またはInterfaceUseを暗黙に作成してはならない（MUST NOT）。適用されるCore declarationは明示されたままでなければならない。

Extension自体がforeign subtree内のorderingを定義しない限り、InterfaceまたはAttachment contentのdocument orderをpreferenceとして扱ってはならない（MUST NOT）。

<a id="34-realization"></a>
# 34. Realization

Realizationは、Interfaceによって共有される具体的なinteraction mechanismを記述する。`realization` wrapperはforeign namespaced semantic rootを正確に1つ含まなければならない（MUST）。

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

Realization Extensionは、適用可能なすべてのInterfaceUseが共有するtransport、protocol、またはmechanism levelのconfigurationを定義してよい。Capability固有operation informationはRealizationではなくMappingに属する。

Realizationは、Capability Contractのsemantic function、Input、Result、Output、Requirement、またはconstraintをredefineしてはならない（MUST NOT）。Entityがinteraction surfaceをどのようにexposeするかを記述するものであり、Capabilityが何を意味するかを記述するものではない。

Realizationの存在は、Runtimeがそれをsupportすること、targetがreachableであること、authenticationが成功すること、またはいずれかのCapabilityがauthorizedまたはexecutableであることを証明しない。

InterfaceはRealization wrapperを最大1つ持つ。Entityが異なるrealization contextをexposeする場合、別々のInterfaceを宣言し、適用可能なInterfaceUseから参照することが望ましい（SHOULD）。

<a id="35-mapping"></a>
# 35. Mapping

Mappingは、1つのCapabilityが参照先Interfaceをどのように使用するかを記述する。`mapping` wrapperは`interface-use`内だけに出現し、foreign namespaced semantic rootを正確に1つ含まなければならない（MUST）。

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

MappingはCapability固有である。共有connectionまたはmechanism configurationは参照先InterfaceのRealizationに属する。

Mapping Extensionは、semantic Invocation dataとInterfaceが表すmechanismとの間に決定的なcorrespondenceを定義してもよい（MAY）。次を行ってはならない（MUST NOT）。

- Core model内のsemantic InputまたはOutputをrenameする
- Core data typeを変更する
- 必須Contract Inputを削除する
- Contract constraintをweakenまたはredefineする
- Capabilityのsubjectを変更する
- credentialまたはsecretを埋め込む
- generic executable workflowを作成する

Coreはgeneric mapping DSLを定義しない。Mapping semanticsは、Part IXのHTTP Extensionなど、特定のInterface Extensionが所有する。

Mappingはoptionalである。適用可能なInterface ExtensionがCapability固有dataを必要としない場合、plain `interface-use` referenceもvalidである。

1つのCapability内の複数InterfaceUseを含め、複数のInterfaceUseが同じInterfaceを参照してもよい（MAY）。各InterfaceUseおよびMappingは別々のroute descriptionのままである。processorは、`ref` valueまたはExtension root nameが一致するという理由だけでそれらをmergeしてはならない（MUST NOT）。

<a id="36-unknown-extension-processing"></a>
# 36. 未知Extensionの処理

## 36.1 Core Validity

unknownまたはunsupportedなforeign namespaced Extension elementは、次のすべてを満たす場合、Core layerで文書をinvalidにしない。

1. semantic rootが許可されたExtension Slotに出現する。
2. Core slot envelopeおよびcardinalityがvalidである。
3. elementがnon-Core namespaceにある。
4. 周囲のCore structureがvalidである。

逆に、許可されたExtension Slot外のforeign contentは、processorがforeign namespaceを認識していてもCore structural errorである。

```text
recognized Extension outside its slot
→ Core invalid

unknown Extension inside its slot
→ Core valid
```

## 36.2 Layered Validation

processorは、少なくとも次のoutcomeを区別しなければならない（MUST）。

```text
Core structural validation
Extension recognition and support
Extension-specific validation
Runtime evaluation
```

Extension固有validation failureは、Core structural validationの結果を遡及的に変更しない。そのExtensionのconformance classをclaimするprocessorにとって、そのExtension instanceをinvalidにする。

unknown Extensionについて、そのprocessorからExtension固有validity resultは得られない。processorは、local name、attribute name、human-readable text、namespace similarity、またはAI inferenceからそのsemanticsを推測してはならない（MUST NOT）。

unknown Requirement bodyの場合、Core validityはvalidのままで、Requirement evaluationは`UNKNOWN`となる。unknown Realization、Mapping、constraint、およびその他のsemanticsがRuntimeへ与える影響はPart VIIIで定義する。

## 36.3 Opaque Preservation

Extension contentをexposeまたはreserializeするCore processorは、実用上可能な場合、unknown foreign subtreeをopaque extension dataとして保持することが望ましい（SHOULD）。preservationでは次を保持することが望ましい（SHOULD）。

- すべてのelementおよびattributeのnamespace URIとlocal name
- attribute value
- character data
- child element order
- subtreeのreserializeに必要なnamespace binding

元のnamespace prefix、attribute order、quote style、entity spelling、comment、processing instruction、およびbyte-for-byte lexical formはCore semantic dataではない。XML signatureまたは正確なlexical round tripを必要とするApplicationには、別のbyte-preservation mechanismが必要である。

processorは、unknown Extension subtreeを既知のCore itemへ暗黙に変換したり、lossless round-trip supportをclaimしながら破棄したり、codeとしてexecuteしたりしてはならない（MUST NOT）。

## 36.4 ResolutionとTrust

Extension namespace URIはidentifierであり、networkからfetchする必要はない。Extension仕様のrecognizeまたはresolveは、document issuerのauthenticate、trustの確立、authorizationの付与、またはRuntime supportの証明を行わない。

```text
Extension identification
≠ Extension support
≠ Extension validity
≠ Trust
≠ Authorization
≠ Execution
```

---

<a id="part-iv--capability-contracts"></a>
# Part IV — Capability Contract

<a id="37-capability-contract-model"></a>
# 37. Capability Contractモデル

Capability Contractは、1種類のCapabilityに対するversionedで規範的なsemantic sourceである。Entity、Interface、transport、endpoint、Runtime、または現在のavailability stateから独立して、そのCapabilityが何を意味するかを定義する。

概念modelは次のとおりである。

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

Contractの`identifier`は、そのexact-versioned Semantic Identifierである。ContractのInvocation、Input、Result、Output、Requirement、およびconstraint conceptはEntity側の対応概念と対応するsemantic roleを持つが、Contract definition modelとEntity serialization modelは異なるcardinalityを持つ。Contractは規範的であり、Entity declarationはprojectionである。

存在するContract Resultが列挙するOutputは0個でもよい（MAY）。そのようなresult shapeに追加の意味を与える場合、Contractの`extension semantics*` information item内で明示的に識別されたExtension semanticsを通じて提供しなければならない（MUST）。Draft 5は、Resultに対する別のexternal-definition reference fieldまたは暗黙のresolution channelを定義しない。prose citationだけで規範的resolutionを指示したり、不足しているmachine-readable result definitionを提供したりしてはならない（MUST NOT）。列挙Outputが0個であるという理由だけでContractをunusableにしてはならない（MUST NOT）。これは、存在する`result`が少なくとも1つの`output`を含まなければならないEntity側XMLとは異なる。

Outputを列挙しないContract Resultは、Result不在、no-value Invocation、または任意のEntity Outputに対するpermissionと自動的にequivalentにはならない。その規範的result meaningおよびprojection ruleは、Contractと明示的に識別されたExtension semanticsに従う。processorはOutput declarationを捏造したり、空のEntity Resultを挿入したり、proseまたはAIからshapeを推測したりしてはならない（MUST NOT）。そのresult semanticsが必要な場合のcomparisonはSection 40.4に従う。

ContractはInvocationを省略してもよい（MAY）。Invocationを含む場合、そのInvocationがInputもResultも含まなくてもよい（MAY）。Invocation不在をEvent、Observation、Subscription、またはStream semanticsへ一般化してはならない（MUST NOT）。

Contract Input definitionは、次を規範的に定義できる。

- name
- Core data type
- requiredness
- format
- unit
- constraint
- Extension semantics

Contract Output definitionは、次を規範的に定義できる。

- name
- Core data type
- format
- unit
- constraint
- Extension semantics

Contract Requirementは、Capabilityに対する普遍的で規範的なprerequisiteである。Entity Capability RequirementはSection 40.5に従ってEntity固有prerequisiteを追加できる。effective Capability prerequisiteはContract RequirementとEntity Requirementの論理積である。このsemantic evaluationはContract dataをEntity documentへstructural mergeしない。Contract constraintおよびExtension semanticsを適合するautomated projection validationへ参加させる場合、それらは決定的なcomparison behaviorを定義しなければならない（MUST）。

human-readable explanationをContractに添えてもよい（MAY）が、prose、label、example、またはAI interpretationを、決定的interoperabilityに必要なmachine-readable normative fieldの代わりにしてはならない（MUST NOT）。

## 37.1 除外されるImplementation Information

Capability Contractは、次を含むEntity implementation routing informationを含んではならない（MUST NOT）。

- InterfaceまたはInterfaceUse
- Attachment、Realization、またはMapping
- HTTP method、path、endpoint、またはheader
- BLE serviceまたはcharacteristic
- connector instance
- Entity-local IDまたはSubject reference
- credential
- 現在のRuntime state

これらの情報は、適用可能なEntity側projection、Interface Extension、Runtime Context、またはcredential systemに属する。

この仕様は、規範的Contract information modelとAR-XML processingにおけるその使用方法を定義する。具体的なContract document serializationまたはregistry protocolは別に定義してもよい（MAY）が、これらのsemanticsを保持しなければならない（MUST）。

<a id="38-contract-identity-and-resolution"></a>
# 38. ContractのIdentityとResolution

## 38.1 Exact Versioned Identity

すべてのCapability Contractは、exact-versioned absolute Semantic Identifierを持たなければならない（MUST）。Entity側の`capability/@type`は、そのexact Contractを識別しなければならない（MUST）。

```xml
<capability
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  id="temperature-read"
  type="https://example.org/capabilities/temperature/read/1">
  <invocation />
</capability>
```

`https://example.org/capabilities/temperature/read/latest`のようなidentifierを規範的Contract identityとして使用してはならない（MUST NOT）。discovery serviceはlatest-version queryを提供してもよい（MAY）が、決定的なresolutionまたはvalidationの前にexact identifierを返さなければならない。

registryがcompatibilityを報告する場合でも、異なるexact-versioned identifierは別のContract identityを表す。Core validation外の明示的なruleとApplication policyがない限り、processorはあるversionを別versionに置き換えてはならない（MUST NOT）。

## 38.2 IdentityはLocationではない

Contract identifierはsemantic contentを識別し、必ずしもnetwork locationではない。URI syntaxはHTTP dereferenceを要求しない。

Semantic Registryは、built-in definition、local registry、cache、Application提供registry、installed Extensionまたはplugin、network sourceからContractをresolveしてもよい（MAY）。resolution sourceはContract identityを変更しない。

```text
Contract identifier
≠ network location
≠ retrieval requirement
≠ trust assertion
```

## 38.3 Resolution Result

Contract resolutionは2つのCore evaluation stateを持つ。

```text
RESOLVED
UNRESOLVED
```

`RESOLVED`は、active registry policyの下で、exact identifierに対してusableなsemantic definitionが正確に1つ選択されたことを意味する。`UNRESOLVED`は、usable definitionが選択されなかったことを意味する。definitionがない場合、definitionが既知のinvalidである場合、または競合するdefinitionによって決定的selectionができない場合を含む。

usableなContractは、要求されたexact-versioned absolute identifierで自己識別し、宣言されたdefinition formatとSection 37のContract modelを満たさなければならない（MUST）。既知のstructural error、禁止されたtransport content、不足しているnormative data、または既知の内部矛盾constraintがある場合はunusableである。resolverはEntity projection conflictではなくdefinition defectを報告しなければならない（MUST）。明示的に識別されているがunsupportedなconstraint semanticsだけではdefinitionをinvalidにしない。ContractResolutionは`RESOLVED`のまま、必要なprojection comparisonがPart IVに従って`UNVALIDATED`となり得る。

同じexact identifierをclaimするnon-equivalent definitionが複数ある場合、resolverは最初のresultを暗黙に選択してはならない（MUST NOT）。external trust policyがsemantic resolutionの前に1つ以外のすべてのcandidateを決定的にrejectしない限り、conflictを報告して`UNRESOLVED`を生成しなければならない（MUST）。

Contractがunresolvedでも、structurally validなAR-XML文書はinvalidにならない。Capabilityはdescription dataとしてexposeされたままだが、そのprojectionを完全にはvalidateできない。

Resolutionは、Contract publisherまたはEntity issuerのauthenticate、trustの確立、authorizationの付与、またはRuntime supportの証明を行わない。

<a id="39-entity-side-capability-projection"></a>
# 39. Entity側Capability Projection

Entity側Capabilityは、`capability/@type`で識別されるCapability Contractの明示的なlocal implementation projectionである。

```text
Capability Contract
= normative semantic source

Entity-side Capability
= explicit local implementation projection
```

Projection contentは、AR-XML Capabilityに明示的に存在する情報だけで構成される。processorは、省略されたContract fieldをEntity documentに現れたかのようにAR-DOMへcopy、inject、またはstructural mergeしてはならない（MUST NOT）。

resolveされたContract dataは別にexposeし、validationまたはcaller assistanceに使用してもよい（MAY）。processorは次の区別を保持しなければならない（MUST）。

- issuerがauthorしたEntity projection data
- resolveされたContract definition data
- derived validation result

Entity-localな`id`、`subject-ref`、InterfaceUse、Mapping、およびInterface Requirementはimplementation descriptionであり、Capability Contractのmemberではない。Contract fieldとしてcompareされない。

Capability Requirement、Invocation、Input、Result、Output、Contractが制約するRepresentation、およびconstraint Extension dataはprojection materialである。Contract semanticsをredefineまたはweakenしてはならない（MUST NOT）。

structurally validなCapabilityはInvocationまたはInterfaceUseを省略できる。structural validityはprojection compatibilityから独立している。たとえば、Invocationの省略はCore-validだが、resolveされたContractがInvocation projectionを要求する場合はprojection conflictになる。

不足しているEntity projection dataからContract dataへの暗黙fallbackはない。必須projection informationがない場合、validationは該当stateを報告する。invocation codeは、不足情報がAR-XMLにserializeされていたかのように扱ってはならない（MUST NOT）。

<a id="40-projection-compatibility"></a>
# 40. Projection互換性

## 40.1 一般規則

Projection validationはEntity側Capabilityを、その`type`が識別するexact resolved Contractと比較する。

Entity projectionはContract meaningを保持しなければならない（MUST）。Contract定義valueまたはconstraintの変更によるnarrowingは、Contractがその種類のnarrowingを明示的に許可し、processorが適用可能なcomparison ruleを理解する場合だけ行ってもよい（MAY）。Entity固有の追加RequirementはSection 40.5に従う。その追加はdefaultでcompatibleであり、Contractによる事前permissionを必要としない。

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

nameのsimilarity、natural-language description、common usage、またはAI生成equivalenceだけではcompatibilityの根拠にならない。

## 40.2 Invocation Shape

ContractがInvocationを要求し、Entity projectionがInvocationを省略する場合、projectionは`CONFLICT`である。ContractにInvocationがない場合、Contractが明示的に許可しない限り、Entity projectionはrequest-oriented Invocationを追加してはならない（MUST NOT）。

Entityが空のInvocationをprojectできるのは、そのshapeがContractとcompatibleな場合だけである。空のInvocationは、named InputまたはResult contentを要求するContractを満たさない。

## 40.3 Input

Inputはexact nameでmatchする。Contractがextensibility ruleを明示的に宣言しない限り、次を適用する。

- 必須Contract Inputの欠落は`CONFLICT`である。
- Contractに定義されていない追加Entity Inputは`CONFLICT`である。
- 異なるCore data typeは`CONFLICT`である。
- requirednessのweakeningは`CONFLICT`である。
- requirednessのstrengtheningは、Contractがそのnarrowingを明示的に許可する場合だけcompatibleである。
- incompatibleなformatまたはunitは`CONFLICT`である。
- unknownなformat、unit、またはconstraint comparisonは、別の既知conflictがない限り`UNVALIDATED`である。

processorはprojection validation時に暗黙のtype coercionを適用してはならない（MUST NOT）。特に、次を適用する。

```text
boolean → string
→ CONFLICT

integer → number
→ not assumed compatible
```

Contractは許可されるsubtypeまたはcoercion relationshipを明示的に定義できるが、processorがそれを使用できるのは、その決定的ruleを実装する場合だけである。

## 40.4 ResultとOutput

列挙されたContract Outputはexact nameでmatchする。Contract modelはOutputを列挙しないResultを許可するが、これは存在するResultに少なくとも1つのOutputを要求するEntity XML規則を緩和しない。明示的Contract ruleが別に定めない限り、次を適用する。

- Contract Outputの欠落は`CONFLICT`である。
- 追加Entity Outputは`CONFLICT`である。
- 異なるCore data typeは`CONFLICT`である。
- incompatibleなformatまたはunitは`CONFLICT`である。
- unknown constraint comparisonは、別の既知conflictがない限り`UNVALIDATED`である。

Outputを列挙しないContract Resultについて、processorはContractの規範的result/projection rule、およびEntity projectionの判定に必要なContract model内の明示的に識別されたExtension semanticsを使用しなければならない（MUST）。model化されていないexternal referenceまたはprose citationから追加normative definitionをdiscoverまたはresolveしてはならない（MUST NOT）。zero enumerationだけではopen-output wildcardにも、EntityがResultを省略すべき証拠にもならない。必要なcomparison semanticsがunresolvedまたはunsupportedの場合、別の既知conflictが優先しない限りProjectionValidationは`UNVALIDATED`である。processorはzero countだけから`VALIDATED`または`CONFLICT`を推論してはならない（MUST NOT）。semanticsが既知の場合、その決定的ruleと上記の適用可能なnamed-Output comparisonを適用する。空のEntity側XML `result`は、Contract cardinalityにかかわらずCore-invalidのままである。

ResultとRepresentationは別である。ContractまたはそのExtension semanticsが許可Representationを制約する場合、Entityがsubsetを選択できるのは、そのselectionが許可されたnarrowingである場合だけである。Representation document orderはprojection compatibilityの一部にはならない。

## 40.5 Requirement

Entity projectionはContract Requirementを省略、weaken、またはcontradictしてはならない（MUST NOT）。既知の省略、weakening、またはcontradictionは`CONFLICT`である。必須のauthenticationまたはauthorization prerequisiteを含むEntity固有の追加Capability Requirementはdefaultでcompatibleである。Contractがその追加を明示的に許可する必要はない。追加prerequisiteが存在するだけでprojection conflictと分類したり、Contract opt-in ruleの対象にしたりしてはならない（MUST NOT）。

effective Capability RequirementはContract RequirementとEntity Capability Requirementを加えたものであり、論理積として適用される。Entity RequirementはContract Requirementを置換または取消さず、`type` identifierが一致するだけではequivalenceを確立せず、どちらのdeclarationも破棄できない。processorは各declarationのsourceとscopeを保持しなければならない（MUST）。これはevaluationのためのsemantic compositionであり、structural inheritanceではない。Contract dataをAR-DOMへ挿入してはならず（MUST NOT）、effective setによって明示的projectionで省略されたContract Requirementを修復することもない。

追加がdefaultでcompatibleであっても、Contract semanticsとの既知contradictionは許可されない。contradictionまたはweakeningの判定に必要なcomparisonを実行できない場合、既知conflictが優先しない限りProjectionValidationは`UNVALIDATED`である。standaloneな追加prerequisiteが現在satisfiedか評価できない場合は、別に`RequirementEvaluation = UNKNOWN`となる。それ自体はprojection conflictを確立せず、すべての追加RequirementにContract comparisonを要求するものでもない。

追加Entity Requirementに対するinteroperability restrictionは、Section 47.1のProfile additional Requirement policyで評価される。Profileは本来compatibleな追加Requirementを禁止して`NON_CONFORMANT`を生成してもよいが（MAY）、ProjectionValidationを`CONFLICT`へ変更しない。Profileが何も指定しなければ追加を許可する。

Interface RequirementはContract projection fieldではない。Capability Contract meaningを変更せずにroute固有prerequisiteを追加でき、各InterfaceUse routeについて別々にevaluateされる。

authenticationおよびauthorization Requirementのcomparisonは、callerをauthenticateせず、authorizationを付与せず、credentialをvalidateしない。

## 40.6 Constraint

理解される各constraintについて、processorはContractまたはExtension仕様が定義するcomparison relationを使用しなければならない（MUST）。

例:

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

processorはlexical similarityをsemantic subset comparisonとして扱ってはならない（MUST NOT）。unknown constraint semanticsはconflictの証拠ではなく、compatibilityを仮定するpermissionでもない。

<a id="41-projection-validation-states"></a>
# 41. Projection Validation状態

Projection validationは、各Entity側Capabilityとその識別先Contractとの関係について、正確に1つのstateを生成する。

```text
VALIDATED
UNVALIDATED
CONFLICT
```

**VALIDATED**は、exact Contractがresolveされ、適用可能なすべてのprojection comparisonが決定的にcompatible、すなわちequal、Contractが許可するnarrowing、またはSection 40.5が許可するEntity固有の追加Requirementであったことを意味する。現在のprerequisite satisfactionおよびProfileのadditional Requirement policyは別のevaluationである。

**UNVALIDATED**は、compatibilityを完全に判定できなかったことを意味する。unresolved Contract、unsupported constraint evaluator、unknown Extension semantics、またはprocessorが決定的ruleを持たない別のcomparisonが原因に含まれる。

**CONFLICT**は、少なくとも1つの既知semantic contradiction、redefinition、weakening、widening、または禁止されたprojection differenceが検出されたことを意味する。

state aggregationは次のprecedenceに従う。

```text
if any known comparison is conflicting
→ CONFLICT

else if Contract is unresolved
     or any required comparison is unknown
→ UNVALIDATED

else
→ VALIDATED
```

既知conflictは別のunknown comparisonによって隠されない。逆に、evaluatorがないことだけではconflictを証明しない。

例:

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

Projection stateはderived Runtime evaluation dataであり、AR-XML description dataではない。processorはCapability declarationを変更せず、比較したContract、影響を受けるfieldまたはconstraint、およびreasonを識別するdiagnosticとともにstateをexposeすることが望ましい（SHOULD）。

`VALIDATED`はProfile conformance、Runtime support、availability、authorization、certification、またはexecution successを意味しない。`CONFLICT`はPart VIIIに従ってそのCapabilityのrouteをunavailableにする。`UNVALIDATED`は自動availabilityまたは自動rejectionではなくuncertaintyへ寄与する。

---

<a id="part-v--profiles"></a>
# Part V — Profile

<a id="42-profile-model"></a>
# 42. Profileモデル

Profileは、versionedで決定的なinteroperability constraint setである。定義されたinteroperability contextに対して、どのsemantic contractおよびEntity characteristicがrequiredまたはpermittedであるかを表す。

ProfileはCapability Contractではなく、Capabilityに新しい意味を定義してはならない（MUST NOT）。Capability Contractをexact-versioned identityで参照し、compatibleなconstraintだけを追加できる。

概念modelは次のとおりである。

```text
ProfileDefinition
├─ identifier                    1
├─ capabilityRequirements*       0..*
├─ propertyRequirements*         0..*
├─ identifierRequirements*       0..*
├─ interfaceRequirements*        0..*
└─ extensionPolicy?              0..1
```

Profileの`identifier`は、そのexact-versioned absolute Semantic Identifierである。

Profile definitionは次を制約してもよい（MAY）。

- exact Capability Contract identifierで識別されるCapabilityの存在
- Capability subject
- Invocation InputおよびResult Output
- 許可されるResult Representation
- PropertyおよびIdentifier
- Interface、InterfaceUse、Attachment、Realization、およびMapping characteristic
- Requirement policy
- requiredまたは明示的にprohibitedなExtension。指定されないExtensionは引き続き許可される

automated conformance evaluationを目的とするすべてのnormative constraintは、決定的でmachine-readableなsemanticsを持たなければならない（MUST）。human-readable proseはProfileを説明してもよい（MAY）が、必須automated comparisonの唯一のsourceになってはならない（MUST NOT）。

Profile evaluationはdefaultでopen-worldである。Profileが言及しないEntity declarationは、このmodelが定義する決定的restrictionをProfileがそのdeclaration classまたはscopeへ明示的に適用しない限り許可され、conformanceへ影響しない。このdefaultは追加Capability、Property、Identifier、Interface、Profile Claim、Requirement、およびExtension contentに適用される。Profile restrictionは、このmodelが定義するpolicyの範囲で、presenceをprohibitするのか、存在時にvalidationをrequireするのかを示さなければならない（MUST）。Extension contentにはSection 47.2の明示されたrequiredまたはprohibited ruleだけが適用され、declaration class全体を閉じるpolicyは存在しない。Capability、Property、およびIdentifier itemのcandidate aggregationはSections 44–45で固定され、baselineはcustom cardinalityまたはmatching-rule fieldを定義しない。

この仕様はProfile information modelとevaluation semanticsを定義する。具体的なProfile document serializationまたはregistry protocolは別に定義してもよい（MAY）が、これらのsemanticsを保持しなければならない（MUST）。

## 42.1 Profile Claimの分離

AR-XMLの`conforms-to` itemは、document issuerによるProfile Claimである。Profile definitionは独立してresolveされるsemantic objectである。

```text
Profile Claim
≠ Profile Definition
≠ Profile Resolution
≠ Profile Conformance Result
≠ Certification
```

EntityがそのProfileをclaimしていない場合でも、processorはEntityをProfileに対してevaluateしてもよい（MAY）。逆に、claimが存在してもevaluation algorithmを変更したり、`CONFORMANT` resultを強制したりしてはならない（MUST NOT）。

<a id="43-profile-identity-and-resolution"></a>
# 43. ProfileのIdentityとResolution

## 43.1 Exact Versioned Identity

Profile identifierおよび規範的identityとして使用するすべての`conforms-to/@href`は、exact-versioned absolute Semantic Identifierでなければならない（MUST）。

`latest`のようなmoving alias、unversioned family identifier、およびrelative referenceを規範的Profile identityとして扱ってはならない（MUST NOT）。discoveryをそのようなqueryから開始できるのは、conformance evaluationの前にexact identifierへresolveする場合だけである。

異なるexact identifierは異なるProfile versionを表す。明示的なexternal selection policyがない限り、processorはnewer、older、またはcompatibleとされるProfile versionへ置き換えてはならない（MUST NOT）。

## 43.2 Resolution

Profile resolutionはPart VIで定義する共通Semantic Registry modelを使用する。Profileはbuilt-in source、local registry、cache、Application提供registry、installed Extensionまたはplugin、network sourceから取得してもよい。URI syntaxはnetwork dereferenceを要求しない。

Profile resolutionは2つのstateを持つ。

```text
RESOLVED
UNRESOLVED
```

`RESOLVED`は、exact identifierに対してusableなProfile definitionが正確に1つ選択されたことを意味する。`UNRESOLVED`には、definition不在、invalid definitionのreject、および決定的にdisambiguateできない競合non-equivalent definitionが含まれる。

usableなProfile definitionは、要求されたexact-versioned absolute identifierで自己識別し、宣言されたdefinition formatとSection 42のmodelに適合し、Sections 44–45のbaseline matching ruleとunambiguous scopeを持つmachine-readable normative constraintを提供しなければならない（MUST）。既知のstructural error、Coreがdefaultを提供しない必須ruleの欠落、既知の禁止redefinitionまたはnarrowing、または既知の相互矛盾constraintを持つdefinitionはunusableとしてrejectしなければならない（MUST）。resolverはdefinition defectをEntity evaluationと別に報告しなければならない（MUST）。invalid ProfileはEntity non-conformanceの証拠ではない。

未知だが明示的に識別されたconstraint languageは、constraint definitionの欠落とは異なる。参照Contractまたはconstraint semanticsがunresolvedまたはunsupportedでも、structurally usableなProfileは`RESOLVED`のままであってよい（MAY）。必須Profile constraintのlegalityまたはrequired subsetのsatisfaction確立に必要なそのようなuncertaintyは、assumed compatibilityではなく`UNDETERMINED`を生成しなければならない（MUST）。これにはunresolved narrowing comparisonも含まれる。後のresolutionでProfile自体がinvalidと判明した場合、ProfileResolutionは`UNRESOLVED`となり、そのconformance resultはdefinition-invalid diagnostic付きの`UNDETERMINED`となる。追加のCore state domainは導入しない。

resolverは複数の競合definitionの最初を暗黙に使用してはならない（MUST NOT）。unresolved Profile Claimはissuer-declared description dataのままだが、そのProfileに対するverified conformanceは`UNDETERMINED`である。

ResolutionはProfile publisherまたはEntity issuerをauthenticateせず、trustを確立せず、authorizationを付与せず、Entityをcertifyせず、Runtime supportを証明しない。

<a id="44-capability-requirements"></a>
# 44. Capability Requirement

## 44.1 Presence

各Profile Capability Requirementは1つのexact-versioned Capability Contractを識別し、1つのpresence valueを宣言する。

```text
required
optional
```

Draft 5は`recommended`、weighted、preferred、prohibited、またはconditional presence valueを定義しない。

matching candidateは、exact Contract identifierと適用可能subject constraintがProfile itemにmatchするEntity側Capabilityである。Draft 5 baselineのquantifierはexistentialであり、適用可能なすべてのProfile constraintを満たすcandidateが1つあれば十分である。Profileはbaseline内でこのcandidate aggregation ruleをoverrideしてはならない（MUST NOT）。document orderでcandidateを選択してはならない（MUST NOT）。

`required`について、evaluatorはcandidateをexistentialにaggregateしなければならない（MUST）。いずれかのcandidateがsatisfyingならitemを満たす。それ以外で、必須matchingまたはcomparison semanticsがunknownのcandidateがあればitemは`UNDETERMINED`となる。それ以外で、candidateがないか、すべてのcandidateが既知のfailureならitemは`NON_CONFORMANT`となる。failing candidateは、別のsatisfyingまたはindeterminate candidateをoverrideしない。membershipを判定できないcandidateは、暗黙に除外せずindeterminateのままにしなければならない（MUST）。

`optional`について、absenceとpresenceの両方がbaseline required subsetの範囲外である。optional Capabilityのprojection conflict、unresolved Contract、failedまたはunknown comparisonは、evaluateした場合に別途報告しなければならない（MUST）が、それ自体でbaseline Profile conformanceを変更してはならない（MUST NOT）。したがってrequired subsetを満たすEntityは、optional Capabilityが`ProjectionValidation = CONFLICT`であっても`CONFORMANT`となり得る。これはそのprojectionをvalidateせず、routeをavailableにもしない。Draft 5はoptional Capabilityのpresence-conditional constraintを定義せず、Profile evaluatorはprose、presence、または別itemからそれを推論してはならない（MUST NOT）。

custom candidate cardinality、matching candidate全体へのuniversal quantification、および別のmatching algorithmは、明示的information modelを持つ将来のProfile Extensionへ延期する。Draft 5はoverride用fieldまたはExtension slotを定義しない。proseまたはcompanion serializationによってbaseline behaviorとして導入してはならない（MUST NOT）。これはCapability、Property、およびIdentifier candidate aggregationに適用される。required/optionalの区別は変更しない。presence-conditional constraintおよびその他のcondition modelも、明示的なmachine-readable Profile information modelが定義するまで延期される。itemにmatchしない追加Entity Capabilityは、Profileが追加declarationを明示的に制約しない限りopen-world defaultによって許可されたままである。

## 44.2 Capability ContractとProjection

Capability RequirementはCapability Contractを参照し、そのContractのsemantic meaningをcopyしてredefineしてはならない（MUST NOT）。

Capabilityがrequired Profile itemを満たすため、または別に報告されるoptional-item comparisonを満たすためには、次の条件が必要である。

1. `type`がrequired exact Contract identifierと等しくなければならない（MUST）。
2. Contract依存constraintをevaluateする必要がある場合、Contractがresolveされなければならない（MUST）。
3. Entity側projectionが`CONFLICT`であってはならない（MUST）。
4. そのCapabilityに適用可能なすべてのProfile constraintがsatisfied、またはSection 49に従って決定的にevaluateされなければならない（MUST）。

Profileは`VALIDATED` projectionを要求してもよい（MAY）。そのstateを明示的に要求しない場合でも、CapabilityがProfileを満たすかにunresolvedまたはunknown semanticsが影響し得るとき、`UNVALIDATED` projectionは`UNDETERMINED`を生成する。

## 44.3 Subject Constraint

Profileは、Capabilityが記述対象Entityに適用されるか、決定的criteriaを満たすSubjectに適用されるかを制約してもよい（MAY）。Subjectをnested Entityとして扱ったり、component hierarchyを推論したりしてはならない（MUST NOT）。

Runtimeが選択するtargetはInvocation Inputであり、static `subjectRef` valueとしてmatchしてはならない（MUST NOT）。

## 44.4 Invocation、Result、およびRepresentation Constraint

Profileは、Contractが許可するInvocation、Input、Result、Output、およびRepresentationのchoiceをnarrowしてもよい（MAY）。次を行ってはならない（MUST NOT）。

- Contractを変更するsemantic InputまたはOutputを追加する
- 必須Contract InputまたはOutputを削除する
- Core data type、unit、format、またはmeaningを変更する
- requirednessまたはconstraintをweakenする
- ResultをRepresentationまたはtransport dataへ変換する
- Representation orderをpreferenceとして使用する

Profile narrowingがvalidになるのは、Section 48に従う場合だけである。

<a id="45-property-and-identifier-requirements"></a>
# 45. PropertyおよびIdentifier Requirement

## 45.1 Property Requirement

Property Requirementはexact `type`によってProperty semanticsを識別し、Profileが必要とする決定的なpresence、value、unit、またはconstraint ruleを定義する。これらのcandidate testはcustom cardinalityまたはaggregation ruleを提供しない。

exact required `type`を持つPropertyがmatching candidateである。required Property itemはexistential aggregationを使用しなければならない（MUST）。value、unit、およびconstraint testをすべて満たすcandidateがあればitemを満たす。それ以外でindeterminate candidateがあればitemは`UNDETERMINED`となる。それ以外でcandidateがないか、すべてが既知のfailureなら`NON_CONFORMANT`となる。evaluatorはこのruleをcustom multiplicityまたはquantifierで置き換えてはならない（MUST NOT）。最初のPropertyがpreferred、newest、authoritative、またはuniqueであると仮定してはならない（MUST NOT）。たとえばrequired rated-voltage valueが`5`の場合、valueが`5`と`9`のcandidateがあれば満たされる。failing candidateはsatisfying candidateを無効にしない。

ProfileはPropertyの存在を要求し、または既知vocabulary定義valueを制約してもよい（MAY）。issuer-declared Propertyをverified truthまたは現在のRuntime stateへ変換してはならない（MUST NOT）。

conformance判定に必要なunknown Property vocabularyまたはunsupported comparison semanticsは`UNDETERMINED`を生成する。既知のrequired Property欠落、またはcandidate aggregation後のrequired Property itemへの既知violationは`NON_CONFORMANT`を生成する。

## 45.2 Identifier Requirement

Identifier Requirementはexact `type`によってidentifier schemeを識別し、決定的なpresence、subject、またはvalue-shape ruleを定義する。これらのcandidate testはcustom cardinalityまたはaggregation ruleを提供しない。

exact required `type`とmatching subject scopeを持つIdentifierがcandidateである。required Identifier itemはProperty itemと同じ固定existential aggregationを使用しなければならない（MUST）。satisfying candidateがあれば成功する。それ以外で、必須membershipまたはvalue comparisonがunknownのcandidateがあれば`UNDETERMINED`となる。それ以外でcandidateがないか、すべてが既知のfailureなら`NON_CONFORMANT`となる。unknown subject matchingによってcandidateを暗黙に除外してはならない（MUST NOT）。Identifier orderにpreference semanticsはない。

別の適用可能な仕様が明示的かつ決定的なruleを定義しない限り、ProfileはIdentifierからCanonical Entity Identity、Locator、credential、authentication、authorization、ownership、またはtrustを推論してはならない（MUST NOT）。そのようなruleもIdentifierのCore meaningを変更しない。

unknown required identifier schemeまたはunsupported validatorは`UNDETERMINED`を生成する。既知のrequired Identifier欠落、またはcandidate aggregation後のrequired itemへの既知violationは`NON_CONFORMANT`を生成する。

<a id="46-interface-requirements"></a>
# 46. Interface Requirement

Profileはinteroperabilityに必要なEntity implementation characteristicを制約してもよい（MAY）。次を含む。

- Interfaceの存在
- required AttachmentまたはRealization Extension root
- Interface Requirement
- matching CapabilityからのInterfaceUseの存在
- Mapping Extension root
- 決定的に定義されたExtension固有characteristic

Interface RequirementはEntity implementation projectionを制約する。参照先Capability Contractへ挿入したり、その一部として扱ったりしてはならない（MUST NOT）。

ProfileはCapabilityが、指定characteristicを満たす1つ以上のInterfaceUse routeを持つことを要求してもよい。matchingは明示的なInterfaceUse referenceとExtension semanticsに基づき、collection orderには決して基づかない。

ProfileはInterfaceの存在をRuntime supportまたはavailabilityと同一視してはならない（MUST NOT）。conformant Entityが、特定Runtimeでは使用できないInterfaceを記述する場合がある。

required Interface constraintの判定に必要なunknownまたはunsupported Interface Extension semanticsは`UNDETERMINED`を生成する。既知のabsenceまたは既知のincompatible characteristicは`NON_CONFORMANT`を生成する。

Profileはtransport固有vocabularyを再現せず、標準化されたInterface Extensionを制約することが望ましい（SHOULD）。generic mapping DSLを作成したり、Attachment、Realization、またはMappingのroleをredefineしたりしてはならない（MUST NOT）。

<a id="47-requirement-and-extension-policies"></a>
# 47. RequirementおよびExtension Policy

## 47.1 Requirement Policy

Profileは、識別されたRequirement typeのpresenceまたはabsenceを要求し、理解されるRequirement dataを制約し、または追加Requirementのpolicyを定めてもよい（MAY）。そのようなpolicyは、適用可能なCapabilityまたはInterface requirement item内のconstraintである。Draft 5は独立したtop-level Requirement-policy collectionを追加しない。companion Profile serializationが具体的encodingを定義する。

Profileが明示的に別の規則を定めない限り、追加CapabilityまたはInterface Requirementは許可される。追加Requirementを制約するProfileは、`additional Requirements prohibited`または明示的なallowed type setなど、適用可能owner scopeと決定的ruleを識別しなければならない（MUST）。Profileの沈黙をprohibitionとして解釈してはならない（MUST NOT）。このpolicyが規定するのはProfile interoperabilityであり、Entity固有prerequisiteを宣言するpermissionをContractが与えるかではない。既知policy violationは、Capability projectionを`VALIDATED`のままにして`NON_CONFORMANT`を生成し得る。

ProfileはCapability Contractが課すRequirementをremove、weaken、またはcontradictしてはならない（MUST NOT）。既存Contract Requirement contentのtighteningは、Contractが許可するnarrowing ruleに従い、決定的comparisonを必要とする。Entity固有の追加prerequisiteを要求する場合はSection 40.5とこのProfile policyに従い、追加にContractの事前permissionは必要ない。

Capability RequirementとInterface Requirementは配置によるscopeを維持する。Profileはroute固有Interface Requirementをsemantic Capability Contractの変更として扱ってはならない（MUST NOT）。

authenticationまたはauthorization RequirementのProfile evaluationはdeclarationに対するconformance checkである。callerをauthenticateせず、live credentialをvalidateせず、authorizationを付与せず、accessをenforceしない。

required Requirement typeまたはbodyがevaluatorにとってunknownの場合、別の既知violationによって`NON_CONFORMANT`が既に確定しない限り、conformanceは`UNDETERMINED`である。

## 47.2 Extension Policy

Profileの任意Extension policyは、次を識別してもよい（MAY）。

- requiredなExtension namespaceまたはsemantic root
- 明示的にprohibitedなExtension namespaceまたはroot
- 識別されたrequiredまたはprohibited ruleを適用するCore Extension Slot
- 識別されたrequired Extensionに対するExtension固有validationまたはsupport requirement

Draft 5のExtension policyはopen-worldである。Profileが言及しないExtensionは許可され、列挙されていないという理由だけでconformanceへ影響してはならない（MUST NOT）。required/prohibited ruleのabsenceは暗黙prohibitionではない。Draft 5は、unlisted Extensionを除外するclosed policy、exhaustive allowlist、または`permitted` whitelistを定義しない。そのようなpolicyは明示的machine-readable information modelを持つ将来のProfile Extensionへ延期され、proseまたはcompanion serializationによってbaseline behaviorとして導入してはならない（MUST NOT）。

Extension policyはCore Extension Slot外のforeign child elementを許可したり、invalid slot envelopeをvalidにしたりしてはならない（MUST NOT）。foreign metadata attributeはSection 32.3に従う。識別ruleのslot restrictionは、そのslotを他のExtensionに対して閉じない。

policyはdocument presence、Extension-specific validity、およびRuntime supportを区別しなければならない（MUST）。Extension declarationを要求しても、Runtimeが実装することは証明されない。

Profileがunknown Extensionのsemanticsを要求する場合、conformanceは推測された`CONFORMANT`または`NON_CONFORMANT`ではなく`UNDETERMINED`である。Profileが識別済みExtensionを決定的にprohibitし、そのExtensionがruleの適用slotに存在する場合、evaluatorが内部semanticsを理解しなくてもresultは`NON_CONFORMANT`である。言及されないその他すべてのExtensionはopen-world defaultによって許可される。

<a id="48-profile-narrowing-rules"></a>
# 48. ProfileのNarrowing規則

ProfileがCapability Contractまたはその他の参照semantic definitionのcontentをnarrowできるのは、次のすべてを満たす場合だけである。Entity固有の追加Requirementに対するpolicyはSections 40.5および47.1に従い、そのようなprerequisiteの追加は既存Contract Requirementをredefineしない。

1. 参照先exact definitionがresolveされている。
2. そのdefinitionが該当種類のnarrowingを許可する。
3. Profile constraintが許可behaviorまたはvalueのsemantic subsetを表す。
4. comparison relationが決定的で実装されている。
5. narrowingがname、type、unit、format、Requirement、またはbehavioral meaningをredefineしない。

例:

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

Profileはaccepted valueをwidenし、required InputまたはRequirementをweakenし、contradictory alternativeを追加し、またはContract termのmeaningをredefineしてはならない（MUST NOT）。

narrowerに見えるlexical formだけでは不十分である。unit conversion、subtype relationship、range inclusion、format compatibility、およびExtension constraintには明示的なsemantic comparison ruleが必要である。

required semanticsまたはcomparison supportがunknownでnarrowingを確立できない場合、evaluationは`UNDETERMINED`を使用する。constraintをcompatibleとして暗黙にacceptしてはならない（MUST NOT）。

<a id="49-profile-conformance"></a>
# 49. Profile適合性

Profile conformanceは正確に3つのresultを持つ。

```text
CONFORMANT
NON_CONFORMANT
UNDETERMINED
```

**CONFORMANT**は、exact Profileがresolveされ、適用可能なすべてのrequired comparisonが決定的にsatisfiedであったことを意味する。

**NON_CONFORMANT**は、少なくとも1つの既知Profile requirementがviolatedであったことを意味する。required Capabilityの欠落、required itemにsatisfyingまたはindeterminate candidateを残さないprojection conflict、required Propertyの欠落、prohibited Extensionなどが含まれる。

**UNDETERMINED**は、既知violationによってnon-conformanceは確定しないが、conformance確立に必要な情報または決定的supportがevaluatorに不足することを意味する。unresolved ProfileまたはContract、unknown required Extension、unsupported constraint comparison semanticsなどが含まれる。

aggregationは次のprecedenceに従う。

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

Profileがresolveされた後、aggregationはSections 44–45のcandidate aggregation後のrequired item resultと、Sections 46–47で定義するrequired Interface、Requirement、およびExtension policyを使用する。optional-item diagnosticは除外され、optional itemにpresence-conditional constraintを合成しない。1つのrequired itemに対する既知violationは、無関係なunknown evaluationより優先する。existential item内の1つのcandidate failureは優先しない。processorはaggregate resultだけでなく、evaluateしたすべてのrequirementに対するdiagnosticをexposeすることが望ましい（SHOULD）。

次の例はrequired-subset aggregationを示す。rowが別に示さない限り、他のすべてのrequired itemがsatisfiedで、Profileがresolveされるものとする。

| Evaluation case | ProfileConformance |
|---|---|
| `CONFLICT` projectionを持つoptional Capabilityが存在 | `CONFORMANT`。conflictは別のprojection diagnosticとして残る |
| required itemにsatisfying candidateとfailing candidateが1つずつ存在 | `CONFORMANT` |
| required itemにfailing candidateとindeterminate candidateが1つずつ存在 | `UNDETERMINED` |
| required itemのcandidateがすべて既知のfailure | `NON_CONFORMANT` |
| Profile definition自体が既知のinvalid | ProfileResolutionが`UNRESOLVED`で、`UNDETERMINED` |

Core-invalidなAR-XMLはProfile conformanceを確立できない。conformance processorは最初にCore validation failureを報告しなければならず（MUST）、その文書に`CONFORMANT`を返してはならない（MUST NOT）。

## 49.1 Claim、Certification、およびAvailabilityからの独立

conformance resultはissuerのProfile Claimを変更しない。claimの欠落はevaluationを妨げず、claimはそのresultを保証しない。

```text
Profile Claim
≠ Verified Profile Conformance
≠ Certification
```

Certificationは外部assurance processであり、AR-XMLまたはlocal conformance resultによって作成されない。

Profile conformanceは現在のRuntime availabilityからも独立している。

```text
CONFORMANT + UNAVAILABLE
→ possible

NON_CONFORMANT + READY route
→ possible under Runtime policy, but not Profile-conformant

UNDETERMINED + UNKNOWN availability
→ possible
```

`CONFORMANT`はRuntime support、connectivity、authentication、authorization、safety、remote acceptance、またはexecution successを保証しない。

---

<a id="part-vi--semantic-identification-and-resolution"></a>
# Part VI — Semantic Identification and Resolution

<a id="50-semantic-identifiers"></a>
# 50. Semantic Identifier

Semantic Identifierはsemantic definitionまたはvocabulary termを識別する。これはidentityを示すものであり、それ自体でretrieval locationを示したり、ownershipを証明したり、publisherをauthenticateしたり、network accessを要求したりしない。

Semantic Identifierは、とりわけ次のものに使用される。

- Capability Contract
- Profile
- Identifier scheme
- Property type
- Subject type
- Requirement type
- Extension定義constraint
- その他のversioned vocabulary term

Capability ContractおよびProfileのidentifierは、exact-versioned absolute identifierでなければならない（MUST）。その他のsemantic vocabularyは、cross-document interoperabilityまたはregistry resolutionが必要な場合、stable absolute identifierを使用することが望ましい（SHOULD）。

processorは、適用可能なidentifier schemeが定義するequality ruleを用いてSemantic Identifierを比較しなければならない（MUST）。そのようなruleがない場合、XML attribute-value processing後のexact code-point equalityを使用しなければならず（MUST）、case folding、URI rewriting、percent-decoding、path normalization、redirect、label、natural-language similarity、またはAI inferenceによってequivalenceを作り出してはならない（MUST NOT）。

Capability Contract identifierおよびProfile identifier（`capability/@type`と`conforms-to/@href`を含む）については、XML attribute-value processing後のexact code-point equalityがnormative identity ruleである。URI normalization、percent-decoding、case folding、default-port removal、dot-segment resolution、redirect target、またはdereferenced representationによってalternate spellingを作成したりidentityを変更したりしてはならない（MUST NOT）。その他のSemantic Identifier schemeは明示的なcomparison ruleを定義してもよいが（MAY）、そのruleはContractおよびProfile identifierに対するexact identity ruleをoverrideしてはならない（MUST NOT）。

```text
Semantic Identifier
≠ Locator
≠ Canonical Entity Identity
≠ Credential
```

`https` syntaxを使用するidentifierはdereference可能な場合があるが、dereferenceabilityはoptionalのままである。そのURIのfetch failureはidentifierのlexical identityを変更しない。

semantic identificationは、識別されたdefinitionが現在のRuntimeによってtrustedまたはsupportedであることも確立しない。

<a id="51-exact-versioned-identity"></a>
# 51. Exact Versioned Identity

exact-versioned identifierは1つのimmutable semantic versionを示す。version syntaxは所有するspecificationまたはregistryが定義する。CoreはSemantic Versioningまたは特定のpath layoutを要求しない。

Capability ContractおよびProfile identityには、次のpropertyが要求される（REQUIRED）。

- identifierがabsoluteである。
- 1つのspecific semantic versionを示す。
- 識別されたnormative meaningが、そのidentifierを維持したままincompatibleに変更されない。
- resolved definitionが、要求されたexact identifierによってself-identifyする。

`latest`、`current`、mutable branch name、またはunversioned family identifierのようなmoving labelは、exact-versioned normative identityではない。そのようなlabelをdiscoveryに使用してもよいが（MAY）、deterministicなContract resolution、Profile resolution、projection validation、またはProfile conformanceの前に、discoveryはexact-versioned identifierを生成しなければならない（MUST）。

exact identifierはdefinitionのbytesを二度とrepublishできないというclaimではない。2つのnon-equivalent semantic definitionが同じexact identifierをclaimする場合、Section 54におけるconflicting definitionである。

version間のcompatibility metadataはidentityをmergeしない。processorはversionがcompatibleであると判断したために、1つのexact identifierを別のものへsilentにreplaceしてはならない（MUST NOT）。

要求されたexact identityは、documentが保持するlexical identifierである。redirect、dereferenced resource、registry source、またはcanonicalized retrieval URIはalternate spellingではなく、ContractまたはProfileのidentity comparison中にsubstituteしてはならない（MUST NOT）。

次はdistinct operationである。

```text
discover a version
select an exact identifier
resolve the exact definition
validate semantic compatibility
```

Applicationはpolicyに従ってdiscoveryおよびselectionを実行してもよい（MAY）。Core validationおよびdeterministic conformanceは、その結果得られたexact identityに対して動作する。

<a id="52-semantic-registry"></a>
# 52. Semantic Registry

Semantic RegistryはSemantic Identifierをsemantic definitionへmapする。これはconceptual componentであり、本仕様は単一のnetwork service、単一のstorage format、または単一のglobal authorityを要求しない。

概念的には次のとおりである。

```text
resolve(semanticIdentifier, expectedDefinitionKind)
→ RESOLVED(definition, provenance)
  | UNRESOLVED(reason, candidates)
```

`expectedDefinitionKind`は、例えばCapability Contract、Profile、vocabulary definitionを区別する。返されるdefinitionは、要求されたidentifierによってself-identifyしなければならず（MUST）、expected kindでなければならない（MUST）。

registry implementationは、次を報告するのに十分なprovenanceを保持することが望ましい（SHOULD）。

- 各candidateを提供したsource
- cacheが使用されたか
- どのtrustまたはapplication policyがcandidateをfilterしたか
- candidateがequivalentであったかconflictingであったか
- 最終resultがresolvedまたはunresolvedとなった理由

semantic definitionはAR-XML Entity description dataとは別にexposeされる。Capability ContractのresolutionによってそのfieldをEntityのAR-DOMへ挿入してはならない（MUST NOT）。ProfileのresolutionによってProfile Claimをverified conformanceへ変換してはならない（MUST NOT）。

registry lookupはeager、lazy、またはapplication-requestedであってよい（MAY）。semantic definitionが利用できない場合でも、Core-valid documentはload可能なままである。

registryはsemantic resolutionのside effectとして、Capabilityをexecuteしたり、credentialをacquireしたり、Entityをauthenticateしたり、authorization decisionを行ったり、Runtime routeをselectしたりしてはならない（MUST NOT）。

<a id="53-resolution-sources"></a>
# 53. Resolution Source

Semantic Registryは、次を含む1つ以上のsourceからcandidateを取得してもよい（MAY）。

```text
built-in definitions
local registry
cache
application-provided registry
installed Extension or plugin
network source
```

Coreは、どのsource categoryにもuniversal priorityを定義しない。source order、allowlist、trust anchor、offline behavior、freshness、およびnetwork policyはRuntimeまたはApplicationのpolicyである。

conforming policyは、同じcandidate setおよびpolicy inputに対してdeterministicでなければならない（MUST）。arrival orderまたはunspecified iteration orderをsemantic precedenceとしてsilentに使用してはならない（MUST NOT）。

## 53.1 Built-inおよびInstalled Source

built-in definitionおよびinstalled Extensionまたはpluginは、offline resolutionを提供してもよい（MAY）。installationはRuntimeに対するavailabilityを確立するが、そのdefinitionを参照するすべてのdocumentに対するautomatic trustは確立しない。

## 53.2 LocalおよびApplication-provided Registry

localおよびapplication-provided registryは、private、deployment-specific、またはtest definitionを提供してもよい（MAY）。definitionのsourceは、宣言されたSemantic Identifierを変更しない。

applicationは、consultするregistryを制限してもよい（MAY）。除外されたsourceをconsultしないことはpolicy behaviorであり、semantic identifierがinvalidであることのevidenceではない。

## 53.3 Cache

cacheはexact-versioned identifierのresolutionをsatisfyしてもよい（MAY）。provenance、integrity metadata、expiry、およびstorage layoutはimplementation detailであり、mandatory Core cache fieldではない。cache freshness policyはmutable aliasをexact identityへtransformしてはならない（MUST NOT）。

cached candidateが同じexact identifierに対する別のacceptable candidateとconflictする場合、Section 54が適用される。cache orderはsilent first-wins behaviorをauthorizeしない。

## 53.4 Network

Semantic IdentifierがHTTPまたはHTTPS URIである場合を含め、network resolutionはOPTIONALである。Runtimeはnetwork resolutionをprohibitし、originをrestrictし、integrity metadataをrequireし、または完全にofflineでoperationしてもよい（MAY）。

network failure、DNS failure、TLS failure、HTTP failure、CORS policy、またはdereference refusalは、candidate sourceがunavailableであることを表す。AR-XML documentをstructurally invalidにはせず、Semantic Identifierがinvalidであることを証明しない。

network経由のsemantic resolutionはdefinition-retrieval operationである。Capability executionではない。

<a id="54-conflicting-definitions"></a>
# 54. Conflicting Definition

複数のsourceが、同じexact Semantic Identifierに対するcandidateを返すことがある。registryは、definition formatが規定するequivalenceまたはintegrity ruleに基づいてcandidateがsemantically equivalentであるかを判断しなければならない（MUST）。

byte-identicalまたはnormatively equivalentなduplicateは、すべてのprovenanceを保持したまま1つのresolved definitionとして扱ってもよい（MAY）。title、description、version label、選択されたfield、またはexampleが似て見えるという理由だけでdefinitionをequivalentとして扱ってはならない（MUST NOT）。

2つのacceptable candidateがnon-equivalentで、同じexact identifierをclaimする場合は次のとおりである。

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

明示的なtrustまたはapplication policyがsemantic selectionの前に1つを除くすべてのcandidateをdeterministicallyにexcludeしない限り、registryはconflictを報告し、`UNRESOLVED`を返さなければならない（MUST）。

trust policyは、configured source identity、signature、integrity metadata、allowlist、または同等のexternal evidenceを使用してcandidateをfilterしてもよい。resolution自体はそのpolicyを定義も暗示もしない。

conflict diagnosticは、credentialまたはsecretをexposeせずに、Semantic Identifier、expected definition kind、candidate source、および利用可能なintegrityまたはversion metadataを識別することが望ましい（SHOULD）。

conflicting Capability Contract definitionは、独立した既知Entity projection contradictionがすでに`CONFLICT`を生成する場合を除き、Contract resolutionを`UNRESOLVED`、projectionを`UNVALIDATED`にする。conflicting Profile definitionは、Profile resolutionを`UNRESOLVED`、Profile conformanceを`UNDETERMINED`にする。

processorは、conforming deterministic resolutionの一部として、AIまたはhuman-language heuristicにconflicting normative definition間の選択を行わせてはならない（MUST NOT）。

<a id="55-entity-resolver-separation"></a>
# 55. Entity Resolverの分離

Entity resolutionとsemantic-definition resolutionは別々の責務である。

```text
Entity Resolver
= entity identity or application reference → AR-XML location

Semantic Registry
= Semantic Identifier → semantic definition
```

Entity ResolverはAR-XML representationをlocateする。次のことは行わない。

- Capability ContractまたはProfileをresolveする。
- どのsemantic definitionがauthoritativeであるかを決定する。
- Entityまたはdocument issuerをauthenticateする。
- authorizationをgrantする。
- Capability availabilityをevaluateする。
- Capabilityをexecuteする。

Semantic Registryはsemantic definitionをresolveする。applicationが同じimplementationを両方のroleに別途configureしない限り、Entityの現在のAR-XML representationをlocateしない。1つのsoftware componentが両方のroleを実装する場合でも、そのinput、output、state、diagnostic、およびsecurity policyは区別可能なままでなければならない（MUST）。

Entity Identifierは自動的にLocatorまたはCanonical Entity Identityにはならない。applicationまたはidentity schemeは、どのidentifierをEntity Resolver inputとして使用するかを明示的に決定しなければならない。

AR-XML document retrieval URLはRuntime contextである。Part IXのHTTP Extension ruleなど、明示的に定義されたrelative locator resolutionのbaseとして機能する場合があるが、implicit Entity Identifier、Property、またはCanonical Entity Identityにはならない。

概念的に、loadは次のままである。

```text
ARRuntime.load()
= Resolve Entity / Fetch / Parse / Validate / Expose
```

semantic definition resolutionは、load中、exposure後のlazy処理、または明示的application request時に実行してもよい（MAY）。どのtimingを選択しても、Capabilityを自動的にinvokeしてはならない（MUST NOT）。

次の分離は常に適用される。

```text
Resolution ≠ Trust
Resolution ≠ Authentication
Resolution ≠ Authorization
Resolution ≠ Availability
Resolution ≠ Execution
```

---

<a id="part-vii--validation-and-processing"></a>
# Part VII — Validation and Processing

<a id="56-processing-model"></a>
# 56. Processing Model

## 56.1 Load Pipeline

AR-XML Runtimeのload operationは、次のconceptual pipelineに従う。

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

このpipelineは次の基本ruleをrefineするが、変更しない。

```text
ARRuntime.load()
= Resolve / Fetch / Parse / Validate / Expose
```

loadのどのstepもCapabilityをauthorizeまたはinvokeしない。AR-XML resourceのfetchはdocument retrievalであり、記述されたCapabilityのexecutionではない。

semantic ContractまたはProfile resolutionは、load中、AR-DOM exposure後、または明示的application request時に実行してもよい（MAY）。Core structural validityには要求されず、Capability executionを引き起こしてはならない（MUST NOT）。

## 56.2 Distinct Processing Outcome

processorは、次のoutcome categoryを区別して保持しなければならない（MUST）。

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

あるcategoryを別のcategoryとしてsilentに報告してはならない（MUST NOT）。例えば、unresolved Capability ContractはCore validation failureではなく、HTTP authorization failureはAR-XML documentがinvalidである証拠ではない。

## 56.3 DeterminismおよびNo Repair

Core parsingおよびvalidationはdeterministicでなければならず（MUST）、AI、LLM、Semantic Identifierのnetwork dereferencing、またはhuman interpretationを要求してはならない（MUST NOT）。

processorは複数のdiagnosticを収集してもよいが（MAY）、originalをvalidateしたとclaimしながらinvalid documentをrepairしてはならない（MUST NOT）。prohibited silent repairの例には次が含まれる。

- unknown Core elementまたはattributeをdeleteする。
- duplicate local IDの1つをchooseする。
- dangling referenceのarbitrary targetをselectする。
- foreign contentをExtension Slotへmoveする。
- 欠落したEntity projection fieldをContractからfillする。
- malformed XMLをvalid AR-DOMとして扱う。

applicationは別個のrepair workflowを提供してもよいが（MAY）、repaired contentはnew documentであり、revalidateされなければならない（MUST）。

## 56.4 Safe XML Parsing

processorはuntrusted inputに適したXML parser configurationを使用しなければならない（MUST）。Core parsing中にimplicit side effectとしてexternal entityまたはexternal DTD resourceをfetchしてはならない（MUST NOT）。resource limitはdeployment environmentに従ってdocument size、nesting depth、attribute count、およびexpanded textをboundすることが望ましい（SHOULD）。

parser security policyはExtension mechanismではない。documentはRuntimeのXML security configurationをweakenできない。

<a id="57-core-structural-validation"></a>
# 57. Core Structural Validation

Core structural validationは、semantic-definition resolutionおよびExtension固有meaningとは独立して、parsed documentがCore grammarにconformするかを判断する。

Core validatorは少なくとも次をverifyしなければならない（MUST）。

1. resourceがwell-formed XMLである。
2. document elementがCore `ar-entity`である。
3. Core namespaceおよび`version="0.1"`が正しい。
4. 定義済みCore elementおよびattributeのみが現れる。
5. foreign elementがexplicit Extension Slot内にのみ現れる。
6. singleton elementおよびcontainerがrepeatしない。
7. required attributeおよびnon-empty lexical valueが存在する。
8. Core child containmentおよびcardinalityがsatisfiedである。
9. Core data typeおよびboolean lexical valueがpermittedである。
10. InputおよびOutput constraint wrapperがそのslot envelopeをsatisfyする。
11. Attachment、Realization、Mapping、およびRequirement body envelopeがvalidである。
12. すべてのInterfaceがAttachmentまたはRealizationを含む。
13. Section 58のuniquenessおよびreference ruleが成立する。

Core child orderはvalidityに影響してはならない（MUST NOT）。non-canonicalだがそれ以外はpermittedなchild orderを使用するdocumentはvalidである。

## 57.1 Unknown Content

validationは次のmatrixを適用する。

| Content | Location | Core result |
|---|---|---|
| known Core elementまたはattribute | permitted Core location | validationを継続 |
| unknown Core-namespace element | anywhere | invalid |
| Core element上のunknown unqualifiedまたはCore attribute | anywhere | invalid |
| foreign element | permitted Extension Slot | slot envelopeがvalidならCore-valid |
| foreign element | Extension Slot外 | invalid |
| Core element上のforeign namespaced attribute | Section 32.3に基づくmetadata | Core-valid。metadata semanticsは別途validate |

foreign Extension elementをrecognizeしても、Core定義slot外で許可されるわけではない。valid slot内のforeign Extension elementをrecognizeできなくても、documentはCore-invalidにならない。Core element上のforeign metadata attributeには、element-slot envelope ruleではなくSection 32.3を使用する。

## 57.2 Structural ValidityおよびSemantic Evaluation

Core validityは次を要求しない。

- Entity Identifier、Interface、またはCapability
- CPU、network connection、API、またはRuntime implementation
- Capability Contract、Profile、またはvocabulary termのresolution
- Extension processor support
- Profile conformance
- Runtime availability
- successful authentication、authorization、またはexecution

empty passive EntityはCore-validである。逆に、semantically familiarまたはexecutableなdocumentであっても、Core grammarに違反すればCore-invalidである。

<a id="58-reference-and-uniqueness-validation"></a>
# 58. ReferenceおよびUniqueness Validation

## 58.1 Typed Local ID Collection

local IDは各typed collection内でuniqueでなければならない（MUST）。

```text
Subject.id
Interface.id
Capability.id
```

collectionは別々である。同じlexical IDが、異なる各typed collectionに1回ずつ現れてもcollisionしない（MAY）。

ID comparisonは、XML attribute-value processing後のexact code-point equalityを使用する。future Core revisionがそのようなnormalizationを明示的に定義しない限り、validatorはcase-fold、trim、URI-normalize、Unicode-normalize、またはその他の方法でequivalenceを推測してはならない（MUST NOT）。

## 58.2 Scoped Name

Input nameは、それを含むInvocation内でuniqueでなければならない（MUST）。Output nameは、それを含むResult内でuniqueでなければならない（MUST）。

InputおよびOutputのname collectionは別々である。同じnameをInputとして1回、Outputとして1回使用してもよい（MAY）。異なるCapability内のnameはcollisionしない。

## 58.3 Local Reference

次のreferenceは同じAR-XML document内でresolveしなければならない（MUST）。

```text
Capability.subject-ref → Subject.id
Identifier.subject-ref → Subject.id
InterfaceUse.ref       → Interface.id
```

reference matchingはIDと同じexact equality ruleを使用する。referenceはnetwork access、Semantic Registry、Entity Resolver、label matching、またはcross-document inferenceによってresolveしてはならない（MUST NOT）。

forward referenceはvalidである。したがってprocessorは、referenceをdanglingとして報告する前にcollection constructionを完了しなければならない（MUST）。

dangling local referenceはCore structural validation errorである。processorはplaceholder targetを作成したり、referencing itemをsilentにdropしたりしてはならない（MUST NOT）。

## 58.4 Permitted Repetition

次のrepetitionは明示的にpermittedである。

- 同じ`type`を持つ複数のIdentifier
- 同じ`type`を持つ複数のProperty
- 1つのCapability内で同じ`ref`を持つ複数のInterfaceUse
- 同じInterfaceを参照する異なるCapability
- 同じSubjectを参照する異なるIdentifierまたはCapability

permitted repetitionはorder、preference、aliasing、aggregation、equivalence、またはconflict resolutionを意味しない。

<a id="59-extension-validation"></a>
# 59. Extension Validation

## 59.1 Separate Validation Layer

Extension-specific validationはCore slot-envelope validationの後または並行して行われるが、別個のresultを生成する。

各foreign semantic rootについて、processorは概念的に次を判断する。

```text
Extension recognized?
Extension processor supported?
Extension subtree valid under that Extension?
```

Extension processorはCore validation resultを変更したり、Core cardinalityをrelaxしたり、Core attributeをreinterpretしたりしてはならない（MUST NOT）。そのslotまたはmetadata-attribute definitionに割り当てられたforeign semanticsだけをvalidateする。

## 59.2 Recognized Extension

recognizedかつsupportedなExtensionについて、processorはrootのnamespace URI、local name、およびslot contextに関連付けられたExtension specificationを適用しなければならない（MUST）。

Extension validation failureは、foreign root、slot、Extension specificationまたはversion、およびviolated ruleを識別することが望ましい（SHOULD）。Core structureを遡及的にinvalidにするのではなく、適用可能なExtension conformance classに対してExtension instanceをinvalidにする。

processorは、ExtensionのXMLをpreserveまたはdisplayできるという理由だけで、そのExtensionへのconformanceをclaimしてはならない（MUST NOT）。

## 59.3 UnknownまたはUnsupported Extension

valid Extension Slot内のunknownまたはunsupported foreign rootについては、次のとおりである。

- Core validationはvalidのままである。
- Extension-specific validityは確立されない。
- subtreeはopaque dataとしてpreserveすることが望ましい（SHOULD）。
- semantic meaningを推測してはならない。
- 適用可能なRuntimeまたはconformance evaluationは規定されたunknown stateを使用する。

特に、unknown Requirement bodyは、evaluationが必要な場合に`RequirementEvaluation = UNKNOWN`を生成する。unknown Attachment semanticsは、routeがevaluationを必要とする場合に`AttachmentEvaluation = UNKNOWN`を生成する。Realization、Mapping、およびconstraint semanticsはPart VIIIで別々に扱う。

## 59.4 Extension Processor Isolation

Extension processorはforeign subtree contentをuntrusted inputとして扱わなければならない（MUST）。Extension syntaxをvalidateするためだけに、scriptをexecuteしたり、arbitrary resourceをfetchしたり、credentialへaccessしたり、Capabilityをinvokeしたりしてはならない（MUST NOT）。

Extensionは明示的resolution behaviorを定義してもよいが、resolutionはRuntime policyに従い、validationおよびexecutionから区別可能なままでなければならない（MUST）。

<a id="60-preservation-and-exposure"></a>
# 60. PreservationおよびExposure

## 60.1 AR-DOM Construction

Core validation成功後、processorはCore Information Modelを表すimplementation-independentなAR-DOMをconstructまたはexposeする。

AR-DOMは次をpreserveしなければならない（MUST）。

- modelが要求するすべてのCore information itemとそのlexical value
- collection membership
- preferenceを割り当てることなく、faithful reserializationに必要なdocument order
- local IDおよびreference
- 利用可能な場合、別個のRuntime contextとしてのAR-XML retrieval locationまたはdocument base
- Section 36のpreservation ruleに従うforeign Extension subtree

AR-DOMはbrowser DOMではなく、untrusted XMLをHTMLへ挿入してexposeしてはならない（MUST NOT）。

## 60.2 DescriptionおよびDerived State

exposeされたEntity descriptionは、次を含むderived dataから分離したままでなければならない（MUST）。

- resolved ContractおよびProfile definition
- resolution provenance
- projection validation state
- Profile conformance state
- Requirement evaluation
- Runtime supportおよびavailability
- selected route
- credentialおよびauthorization state
- invocationまたはexecutionのresult

processorは、関連するevaluation objectまたはAPIを通じてこれらをexposeしてもよいが（MAY）、derived stateがdeclaredであるかのように見せるためissuer-authored AR-DOMをmutateしてはならない（MUST NOT）。

resolved Contract fieldを、欠落したCapability fieldへinjectしてはならない（MUST NOT）。applicationが明示的にnew documentを作成してrevalidateしない限り、Profile constraintをEntity declarationとしてserializeし戻してはならない（MUST NOT）。

## 60.3 Invalid Document

processorはinvalid documentをconforming AR-DOMとしてexposeしてはならない（MUST NOT）。representationがvalid AR-DOMと明確に区別されるなら、parseまたはvalidation diagnosticとnon-conforming inspection representationをexposeしてもよい（MAY）。

partial parsing、editor recovery、またはbest-effort inspectionをconformance、projection validation、Profile conformance、availability、またはinvocationに使用してはならない（MUST NOT）。

## 60.4 Reserialization

serializerは、collection membershipおよびExtension semanticsをpreserveしながら、Section 21のcanonical Core child orderでemitすることが望ましい（SHOULD）。collection itemのreorderingをpreference伝達に使用してはならない（MUST NOT）。

processorがclaimするserialization modeに対してunknown Extension subtreeを十分にpreserveできない場合、そのlossをdiscloseしなければならず（MUST）、lossless round-trip behaviorをclaimしてはならない（MUST NOT）。

## 60.5 Exposure Is Not Execution

AR-DOM、Capability、Interface、InterfaceUse、resolved definition、またはavailability stateのexposureはobservationalである。Capability executionを開始してはならない（MUST NOT）。

side effectを伴うexecutionは、Runtime invocation operationを介した明示的なApplicationまたはHuman requestの後にのみ開始する。

---

<a id="part-viii--runtime-evaluation"></a>
# Part VIII — Runtime Evaluation

<a id="61-description-and-runtime-state"></a>
# 61. DescriptionおよびRuntime State

AR-XMLはdescription dataを含む。Runtime evaluationは、そのdescription、resolved semantic definition、Runtime implementation support、policy、およびcurrent contextからderived stateを生成する。

次のstate domainはdistinctである。

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

processorは、これらのdomainを`valid`、`supported`、`available`などの1つのbooleanにcollapseしてはならない（MUST NOT）。

evaluation stateはissuer-authored AR-XML documentへserializeされない。diagnostic、provenance、policy context、およびevaluation timeとともに、関連するRuntime APIを通じてexposeしてもよい（MAY）。

evaluation resultはsnapshotである。registry、installed Extension、permission、credential、connectivity、device state、Runtime policy、またはその他のcontextが変化すると変更される場合がある。evaluation resultの変更はdescriptionをmutateしない。

Core structural validityはconforming Runtime evaluationのprerequisiteである。RuntimeはpartialまたはinvalidなAR-DOMを介してinvokeしてはならない（MUST NOT）。

deterministic evaluationはAIまたはLLMを要求してはならない（MUST NOT）。applicationはassisted recommendationを別途提示してもよいが（MAY）、それはCore evaluation stateではない。

<a id="62-contract-resolution"></a>
# 62. Contract Resolution

各Capabilityについて、Runtimeは`capability/@type`内のexact Capability Contract identifierをevaluateする。

```text
RESOLVED
= exactly one usable Contract definition selected

UNRESOLVED
= no usable definition selected
```

`UNRESOLVED`には、unavailable definitionと、同じidentifierをclaimするnon-equivalent definition間のunresolved conflictが含まれる。

Contract resolutionはCore document validityから独立している。Contractがunresolvedでも、Core-valid Capabilityはexposeされたままである。

Runtimeは、requested identifierとfailure reasonを含むresolution provenanceおよびdiagnosticをexposeすることが望ましい（SHOULD）。異なるContract versionをsilentにsubstituteしたり、policyに反してidentifierをdereferenceしたり、first-wins conflict handlingを使用したりしてはならない（MUST NOT）。

Contract resolutionはtrust、Runtime support、authorization、availability、またはexecution successを証明しない。

unresolved Contractは通常、ProjectionValidationを`UNVALIDATED`にし、Contract-dependent semantic validationが必要な場合にrouteが`READY`となることを妨げる。

<a id="63-projection-validation"></a>
# 63. Projection Validation

ProjectionValidationはPart IVに従ってevaluateされる。

```text
VALIDATED
= all applicable comparisons are deterministically compatible

UNVALIDATED
= compatibility cannot be fully determined

CONFLICT
= a known semantic contradiction exists
```

Runtimeは、他のcomparisonがunknownであってもknown conflictをpreserveしなければならない（MUST）。evaluatorの欠落によって、検出済みtype mismatch、required Inputの欠落、prohibited widening、またはその他のknown conflictが消えることはない。

`CONFLICT`はknown semantic blockerであり、そのCapabilityのすべてのinvocation routeを`UNAVAILABLE`にする。

`UNVALIDATED`はuncertaintyを表す。invocationをauthorizeせず、incompatibilityも証明しない。baseline route algorithmでは、別のknown blockerがrouteを`UNAVAILABLE`にしない限り`UNKNOWN`に寄与する。

`VALIDATED`が確立するのはContract projection compatibilityだけである。Interface support、satisfied Requirement、Profile conformance、authorization、availability、またはexecution successを確立しない。

<a id="64-requirement-evaluation"></a>
# 64. Requirement Evaluation

## 64.1 State

各applicable Requirementは、current Runtime contextにおいて次のようにevaluateされる。

```text
SATISFIED
= available evidence deterministically satisfies the Requirement

UNSATISFIED
= available evidence deterministically violates or lacks a mandatory prerequisite

UNKNOWN
= the Runtime cannot determine satisfaction
```

unknown Requirement type、unknown Requirement Extension data、unavailable evidence、unsupported evaluator、またはambiguous policyは、assumed `SATISFIED`または`UNSATISFIED`ではなく`UNKNOWN`を生成する。

## 64.2 Scope

effective Capability prerequisite setは、Section 40.5に基づくresolved Contract RequirementとEntity Capability Requirementのconjunctionである。両方とも、そのCapabilityのすべてのInterfaceUse routeに適用される。Interface Requirementは、そのInterfaceを使用するrouteだけにprerequisiteを追加する。Contract、Entity Capability、およびInterface declarationのprovenanceは別々に保持する。evaluationはresolved Contract RequirementをAR-DOMへinjectしてはならない（MUST NOT）。

Contractがunresolvedの場合、known EntityおよびInterface Requirementを引き続きevaluateしてもよいが、そのresultはすべてのuniversal prerequisiteがknownまたはsatisfiedであることを確立しない。ContractResolutionはSection 66に基づく独立したroute-evaluation inputのままである。

routeについて、applicable Requirement resultは次のようにaggregateされる。

```text
if any applicable Requirement is UNSATISFIED
→ aggregate UNSATISFIED

else if any applicable Requirement is UNKNOWN
→ aggregate UNKNOWN

else
→ aggregate SATISFIED
```

このcalculationでは、empty applicable Requirement setは`SATISFIED`へaggregateされる。declared Requirementが存在しない範囲を超えて、authorizationまたはsafetyをassertするものではない。

## 64.3 AuthenticationおよびAuthorization

authentication Requirementは、required authentication contextまたはcredential capabilityがlocalで利用可能かをevaluateする場合がある。このevaluationはremote responseをauthenticateせず、credentialがacceptされることを保証しない。

authorization Requirement declarationはauthorizationをgrantしない。local Runtimeはauthorizationがabsentであることを把握できる場合があるが、routeが`READY`であった後でもremote authorizationは失敗し得る。

Requirement evaluationはsecretをdiscloseしたり、credentialをAR-DOMへserializeしたりしてはならない（MUST NOT）。documentがloadされたという理由だけでcredentialをsendしたり、permissionをpromptしたり、side effectを伴うCapabilityをperformしたりしてはならない（MUST NOT）。active acquisition stepには、明示的application operationまたはRuntime policyが必要である。

<a id="65-runtime-support"></a>
# 65. Runtime Support

Supportは、現在のRuntime implementationがapplicable semanticまたはmechanismをprocessできるかを表す。

```text
SUPPORTED
= the Runtime implements the required behavior

UNSUPPORTED
= the Runtime knows it does not implement the required behavior

UNKNOWN
= support cannot be determined
```

Supportは、Realization root、Mapping root、constraint evaluator、media representation、およびInterface Extension behaviorを含む、routeに必要なconcrete interaction featureについてevaluateされる。Attachment access-condition satisfactionは、Section 66.5に基づく`AttachmentEvaluation`として別途evaluateされる。knowledgeの欠落またはAttachment condition evaluatorが利用できないことは、そのdomainにおける`UNKNOWN`を生成し、physical access conditionがunsatisfiedである証拠にはならない。Attachment Extensionはaccess-boundary semanticsとそのcondition evaluationを定義する。Attachment slotを通じてInvocation execution mechanismを提供してはならない（MUST NOT）。concrete interaction mechanismはRealizationとして宣言されなければならない（MUST）。Attachment satisfactionとRealization supportは別々のcheckのままである。

Extension specificationが存在しても、Runtimeにsupportされることにはならない。逆に、unknown subtreeをpreserveしてもsemantic supportにはならない。

Supportはfeature-specificである場合がある。HTTP `GET`をsupportしてもrequired request encodingまたはresult mappingをsupportしないRuntimeは、HTTP namespaceをrecognizeするという理由だけでroute全体をsupportedとして報告してはならない（MUST NOT）。

routeのSupport aggregationは次に従う。

```text
if any required feature is UNSUPPORTED
→ aggregate UNSUPPORTED

else if any required feature is UNKNOWN
→ aggregate UNKNOWN

else
→ aggregate SUPPORTED
```

optional MappingがabsentならMapping supportは必要ない。plain InterfaceUseは、参照されるInterface Extensionのruleを使用してevaluateされる。

<a id="66-interfaceuse-route-evaluation"></a>
# 66. InterfaceUse Route Evaluation

## 66.1 Route Input

各InterfaceUseはdistinct routeとしてevaluateされる。evaluationでは次を考慮する。

- invocation availabilityがrequestされた場合のrequest-oriented Invocationのpresence
- ContractResolution
- ProjectionValidation
- applicable Capability Requirement
- applicableな参照先Interface Requirement
- Attachmentが存在する場合、参照先InterfaceのAttachmentEvaluation
- Realizationのpresenceと、そのrequired interaction mechanismのsupport
- Mappingが存在する場合のMapping support
- applicable constraintおよびRepresentation support
- RuntimeおよびApplication policy

同じ`ref`を持つ複数のInterfaceUseはdistinct routeのままである。InterfaceUseおよびInterfaceのdocument orderをpreferenceまたはfallback priorityとして使用してはならない（MUST NOT）。

## 66.2 Baseline Decision Algorithm

Core-valid documentおよびrequest-oriented Capabilityについて、route Availabilityは次のprecedence orderで決定される。

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

known blockerはunrelated uncertaintyより優先する。例えば、known unsupported Mappingは、別のRequirement evaluatorがunknownでもrouteを`UNAVAILABLE`にする。

Core three-state invocation Availability evaluationは、Invocationを持つCapabilityにのみ適用される。Invocationを持たないCapabilityについて、RuntimeはCore Availability valueを生成してはならない（MUST NOT）。このinteraction modelがnot applicableであることをdiagnosticとして報告してもよいが（MAY）、第4のAvailability stateとしてはならない。Invocationが存在するがInterfaceUseが存在しない場合、Section 67がempty route-set resultを定義する。

AttachmentとRealizationの両方を持つInterfaceは、他のroute prerequisiteとともにAttachment conditionがsatisfiedであることを要求する。known unsatisfied AttachmentはそのInterfaceUseをblockする。別のknown blockerがすでに`UNAVAILABLE`を生成する場合を除き、unknown Attachment conditionは`READY`を妨げる。Attachment-only Interfaceはaccess boundaryのstructurally validなdescriptionのままである。request-oriented Invocationについて、Realizationを持たないInterfaceへのrouteは、interaction mechanismを宣言していないため、Attachment evaluationが`SATISFIED`である場合や別のevaluationがunknownである場合でも`UNAVAILABLE`である。Mappingはsubstitute Realizationを提供してはならない（MUST NOT）。このknown absenceはpassive Interfaceをinvalidateせず、unsatisfied Attachmentも意味しない。

## 66.3 READYの意味

`READY`は次を意味する。

> Runtimeは、evaluateされたdescription、definition、support、Requirement、context、およびpolicyの下で、このroute上の明示的invocation attemptを妨げるknown local reasonを持たない。

`READY`は、Runtimeがすでにtargetへcontactしたことを意味しない。Runtimeはrouteが`READY`であるかを判断するためだけにCapabilityをinvokeしてはならない（MUST NOT）。

## 66.4 Diagnostic

Runtimeは、Capability内のInterfaceUse identity、参照先Interface ID、relevant Extension root、contributing state value、evaluated policy context、およびaggregate resultのreasonを含むroute diagnosticをexposeすることが望ましい（SHOULD）。

diagnosticはknown blockerとunknown informationを区別しなければならず（MUST）、credentialまたはsecretをexposeしてはならない（MUST NOT）。known unsatisfied Attachmentはreason `ATTACHMENT_UNSATISFIED`によって識別されなければならない（MUST）。unknown Attachment evaluationは`ATTACHMENT_UNKNOWN`によって区別可能であることが望ましい（SHOULD）。

## 66.5 Attachment Evaluation

evaluateされる各request-oriented InterfaceUse routeについて、Runtimeはpresent Attachmentを、そのAttachment Extensionのdeterministic semanticsを使用してcurrent evidenceに対してevaluateしなければならない（MUST）。

- `SATISFIED`: available evidenceによってdeclared access conditionが確立される。
- `UNSATISFIED`: available evidenceによってdeclared access conditionが満たされていないと確立される。
- `UNKNOWN`: Extension、evaluator、required evidence、またはcomparison semanticsが利用できないか、決定には不十分である。

Attachmentの欠落はaccess conditionに寄与しない。aggregationではneutralな`SATISFIED` inputとして扱ってもよく（MAY）、diagnosticにはAttachmentが宣言されていないことを記録する。unknown metadataまたはmissing evidenceをsatisfactionまたはfailureへ推測してはならない（MUST NOT）。Extensionがaccess conditionを明示的に定義しないknown descriptive Attachmentは、そのsemanticsに基づいて`SATISFIED`とevaluateできる。Runtimeはunknown Extensionに対してその解釈をassumeしてはならない（MUST NOT）。

AttachmentEvaluationはderived Runtime contextであり、RequirementEvaluation、Support、およびissuer-authored Attachmentとは別である。descriptionへserializeしてはならない（MUST NOT）。evidenceを取得するためだけにcontact、pairing、connection、movement、authentication、またはCapability executionを開始してはならない（MUST NOT）。明示的なApplicationまたはHuman actionが、reevaluation用のnew contextを別途確立する場合がある。

それ以外はreadyとなるrouteについて、`SATISFIED`は`READY`を許可し、`UNSATISFIED`は`UNAVAILABLE`を生成し、`UNKNOWN`は`UNKNOWN`を生成する。複数のInterfaceUseがある場合、これらのresultはSection 67に基づいてaggregateされる。あるInterfaceのunsatisfied Attachmentは、独立してreadyな別routeをblockしない。Invocationを持たないCapabilityにはCore Availabilityが生成されず、参照されないpassive Interfaceをroute-evaluateする必要はない。

<a id="67-capability-availability-aggregation"></a>
# 67. Capability Availability Aggregation

Invocationを持つCapabilityについて、Capability Availabilityはorder-based preferenceを割り当てずに、applicableなすべてのInterfaceUse route resultをaggregateする。

```text
if any route is READY
→ Capability READY

else if any route is UNKNOWN
→ Capability UNKNOWN

else
→ Capability UNAVAILABLE
```

したがって、別のrouteがunavailableまたはunknownであっても、1つのready routeでCapability `READY`には十分である。ready routeがないが、unknown informationのresolution後に少なくとも1つがusableとなる可能性がある場合、resultは`UNKNOWN`である。

Invocationを持ちInterfaceUseが0のCapabilityは、このdocument内のinvocation routeを明示的にevaluateする場合にのみ`UNAVAILABLE`へaggregateされる。そのrequestに対するrouteが記述されていないためである。semantic functionがimpossibleである、またはdescriptionがinvalidであるというstatementではない。Invocationを持たないsemantic-only Capabilityには、InterfaceUse countに関係なくCore Availability valueは存在しない。

Invocationを持たないCapabilityは、InterfaceUseを持っていてもCore request-oriented Availability evaluationの対象外である。そのCore Availability valueはabsentである。別のinteraction patternを定義するfuture Extensionが、別個のavailability modelをexposeする場合がある。

Capability AvailabilityはRuntime-specificかつcontext-specificである。同じdescriptionについても、installed supportまたはpolicyが異なるため、異なるconforming Runtimeが異なるstateを報告する場合があるが、それぞれのinputには同じdeterministic ruleを使用する。

actual invocationのroute selectionは別個のRuntime operationである。`READY` routeはeligible setを形成する。document orderによってその中からselectしてはならない（MUST NOT）。ApplicationまたはInterface Extensionは明示的なdeterministic selection policyを適用してもよい（MAY）。

<a id="68-profile-resolution-and-conformance"></a>
# 68. Profile ResolutionおよびConformance

Profile resolutionおよびProfile conformanceはPart Vで定義されたstateを使用する。

```text
ProfileResolution:
  RESOLVED | UNRESOLVED

ProfileConformance:
  CONFORMANT | NON_CONFORMANT | UNDETERMINED
```

unresolved claimed Profileはconformance `UNDETERMINED`を生成する。known Profile violationは`NON_CONFORMANT`を生成する。unknown required semanticsは、既知violationによってresultがすでに決定しない場合に`UNDETERMINED`を生成する。

Profile evaluationはProfile Claimをmutateしない。claimはevaluated resultに関係なくissuer dataのままである。

Profile conformanceとAvailabilityは独立したdimensionである。Runtimeは一方から他方をderiveしてはならない（MUST NOT）。

```text
CONFORMANT does not imply READY
NON_CONFORMANT does not imply UNAVAILABLE
READY does not imply CONFORMANT
```

passive Entityはinvocable Capabilityを持たずにdescriptive Profileへconformする場合がある。selected interoperability ProfileへconformしないEntityにavailable routeが存在する場合がある。

<a id="69-availability-authorization-and-execution"></a>
# 69. Availability、Authorization、およびExecution

Availability、authorization、およびexecutionは異なる問いに答える。

```text
Availability
= may this Runtime attempt the described interaction route?

Authorization
= will the controlling authority permit this operation?

Execution
= did the requested operation actually occur and produce a result?
```

`READY`は次を保証しない。

- successful authentication
- remote serviceまたはphysical controllerによるauthorization
- network reachabilityまたはtarget presence
- current remote device state
- business-rule acceptance
- physical safety
- semantic success
- 特定のResult

次のsequenceはvalidである。

```text
Capability READY
→ explicit invocation attempt
→ remote authorization denial
```

`UNAVAILABLE`は、current policyの下でknown local blockerがattemptを妨げることを意味する。EntityまたはContractに関するpermanent statementではない。

`UNKNOWN`は、Runtimeがlocal attempt readinessを判断できないことを意味する。`READY`として提示してはならない（MUST NOT）が、applicationはuncertaintyの下でuserがinvocationをattemptできるか、またどのようにattemptできるかを決定する明示的policyを適用してもよい（MAY）。

Availability evaluationはside effectを伴うCapabilityをprobeとしてexecuteしてはならない（MUST NOT）。特に`door.unlock`、`light.setState`、payment、またはactuator movementなどのoperationを、availability testのためだけにinvokeしてはならない（MUST NOT）。

<a id="70-load-and-explicit-invocation"></a>
# 70. LoadおよびExplicit Invocation

## 70.1 Non-executing Load

`ARRuntime.load()`および同等のparse、validation、resolution、inspection、Profile evaluation、またはAvailability APIは、記述されたCapabilityを自動的にinvokeしてはならない（MUST NOT）。

load-time Entity retrievalおよびpolicy-permitted semantic-definition retrievalはCapability executionではない。diagnosticおよびsecurity policyにおいて区別可能なままでなければならない（MUST）。

## 70.2 Initiating Intent

side effectを伴うCapability executionは、ApplicationまたはHumanに帰属する明示的requestからのみ開始しなければならない（MUST）。Entityを単にviewすること、Capabilityをenumerateすること、Contractをresolveすること、Requirementをevaluateすること、または`READY`をobserveすることはinvocation requestではない。

Runtime APIは、retry、redirect、credential acquisition、およびroute selectionによってpassive loadがexecutionへ変わらないように、asynchronous processingを通じてinitiating intentをpreserveすることが望ましい（SHOULD）。

## 70.3 Conceptual Invocation Pipeline

明示的requestの後、Runtimeは概念的に次を実行し得る。

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

各stepは独立してfailする場合があり、本仕様が定義するerror-layer distinctionをpreserveしなければならない（MUST）。

credential acquisition、authorization prompt、device access、network request、およびphysical actionは、Runtimeおよびhost-environment policyの管理下にある。AR-XMLはbrowser、operating-system、network、またはdevice security controlをbypassしない。

invocation resultはdescriptionを書き換えない。ApplicationはRuntime Contextまたはobservationを別途維持してもよい（MAY）。

---

<a id="part-ix--standard-extensions--http"></a>
# Part IX — Standard Extensions / HTTP

<a id="71-http-extension-scope"></a>
# 71. HTTP ExtensionのScope

HTTPはAR-XML Draft 5における最初のStandard Interface Extensionである。Core Capability semantic modelの一部ではない。

HTTP Extension namespaceは次のとおりである。

```text
https://relink.dev/ns/arxml/http/0.1
```

このPartは2つのforeign semantic rootを定義する。

```text
http:api
→ Interface Realization

http:operation
→ InterfaceUse Mapping
```

`http:api`はInterfaceが共有するHTTP configurationを記述する。`http:operation`は1つのCapabilityがそのInterfaceをどのように使用するかを記述する。

HTTP elementはCapability Contract内に直接現れてはならない（MUST NOT）。HTTP method、path、URL、header、status code、またはJSON mappingはimplementation routing informationであり、normative Capability meaningではない。

HTTP ExtensionはCapability Input、Output、Requirement、またはconstraintをredefineしない。すでに定義されたsemantic InvocationをHTTPへmapする。

このbaselineはcommon semantic requestおよびJSON Result mappingを定義する。GETはSection 74.2に基づくwire-equivalent serializationを許可するが、receiver-specific lexical conventionまたはquery-name collisionを扱わない。そのようなcaseはimplicit deployment agreementだけによってbaselineでsupportされるとclaimしてはならない（MUST NOT）。次は定義しない。

- arbitrary header mapping DSL
- cookieまたはcredential storage
- OAuth token acquisition
- HTTP status-to-semantic-error mapping
- multipart body
- streaming、subscription、またはevent semantics
- arbitrary object、array、またはbinary GET query serialization
- あらゆるHTTP content negotiation strategy

このExtensionでpermittedなHTTP methodがRuntimeに実装されているとは限らない。methodおよびfeature supportはPart VIIIの`Support` stateを通じてevaluateされる。

<a id="72-http-interface-realization"></a>
# 72. HTTP Interface Realization

HTTP Interfaceは`http:api`を`realization`のsingle semantic rootとして使用する。

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

`http:api`はunqualified `base` attributeを持ってもよい（MAY）。存在する場合、`base`はshared HTTP base contextを識別するabsoluteまたはrelative URI referenceである。empty referenceもpermittedである。省略時のbase contextはfinal AR-XML document retrieval URIである。明示的`base`がabsoluteの場合、そのschemeは`http`または`https`でなければならない（MUST。scheme comparisonはcase-insensitive）。relativeまたはempty `base`のresolution結果も同様に、non-empty hostを持つ`http`または`https` URIでなければならない（MUST）。

baseline `base + path` modelでは、URI syntaxおよびreference resolutionはSection 5.2のstrict reference-resolution algorithmを使用して[RFC 3986](https://www.rfc-editor.org/rfc/rfc3986.html)に従わなければならない（MUST）。present relativeまたはempty `base`はfinal AR-XML document retrieval URIに対してresolveされる。omitted `base`はそのfinal URIを直接使用する。このretrieval URIはabsoluteでなければならず（MUST）、結果のbase contextはnon-empty hostを持つ`http`または`https`を使用しなければならない（MUST）。redirectされたdocument retrievalでは、original request URIではなくfinal retrieval URIを使用する。Host Application document URLを代用してはならない（MUST NOT）。

trailing `/`はrequiredではない。通常のRFC 3986 path-merging effectを持つ。directory-style baseは`/`で終わり、file-style baseではrelative operation pathをresolveすると最後のsegmentがreplaceされる。`base`とoperation `path`はどちらもqueryまたはfragmentを含み得る。Section 73で規定するように、operation `path`はschemeおよびauthorityを持たないものでなければならない（MUST）。RFC 3986が、emptyおよびquery-only referenceを含む各referenceのquery inheritanceまたはreplacementを決定する。HTTP request-target constructionはresolved fragmentを除外する。fragmentはInvocation Inputではない。

resolution前にURI syntaxをvalidateする。raw backslash、raw non-ASCII character、space、control、およびmalformed percent escapeは、これらのURI inputではinvalidである。browser error recoveryによってaccepted baseline referenceへrepairしてはならない（MUST NOT）。internationalized nameまたはnon-ASCII pathは、baseline processing前に適切なASCII URI formで提供されなければならない。事前にpercent-decodeせず、literal `.`および`..` segmentにRFC 3986 dot-segment removalを適用する。`%2e`および`%2E`はこのalgorithmにおけるliteral dot segmentではない。これらのruleはlocatorだけをgovernし、ContractまたはProfile identityをnormalizeしてはならない（MUST NOT）。

HTTP implementationはrequest発行時にresolved authorityおよびpath semanticsをpreserveしなければならない（MUST）。underlying URL APIがそれらを変更する場合（例えばencoded dot segmentをpath traversalとして解釈する場合）、異なるtargetへsilentにaccessせず、unsupported target handlingを報告してinvocationを防止しなければならない（MUST）。support limitationはHTTP Extension syntax validityとは別のままである。

例:

```text
AR-XML retrieval URL:
https://example.org/entities/lab/ar.xml

http:api base:
./api/

resolved HTTP base:
https://example.org/entities/lab/api/
```

`base`がomitted、empty、またはrelativeで、final AR-XML retrieval URIが利用できない場合、Runtimeはtarget URLをconstructできない。documentはstructurally validなままでよいが、そのHTTP routeはrequired resolution contextがないためevaluationにおいて`UNAVAILABLE`である。absolute `http:api@base`はretrieval URIなしでもshared contextを提供できる。`http:operation@path`は独自のschemeまたはauthorityを提供できない。HTTP baselineはapplication-supplied replacement baseまたはそのprecedence ruleを定義しない。Applicationは独自policyの下でknown retrieval URLを用いてresourceをreloadまたはre-evaluateしてもよい。non-`http`/`https` resolved schemeはHTTP Extension validation failureであり、`READY` routeを生成できない。

explicit baseを持たないrealizationはvalidである。

```xml
<realization xmlns="https://relink.dev/ns/arxml/core/0.1"
             xmlns:http="https://relink.dev/ns/arxml/http/0.1">
  <http:api />
</realization>
```

final retrieval URIが`https://example.org/entities/lab/ar.xml?rev=5`、operation pathが`light/state`の場合、次のtarget URLがdeterministicである。

| `base` declaration | Input query mapping前のOperation target |
|---|---|
| Omitted | `https://example.org/entities/lab/light/state` |
| Empty string | `https://example.org/entities/lab/light/state` |
| `./api/` | `https://example.org/entities/lab/api/light/state` |
| `https://example.org/api` | `https://example.org/light/state` |
| `https://example.org/api/?v=1#anchor` | `https://example.org/api/light/state` |

baselineはその他の`http:api` attributeまたはchild elementを定義しない。後のcompatible Extension revisionが定義しない限り、HTTP Extension processorは`http:api`下のunknown unqualified attributeまたはHTTP-namespace childをrejectしなければならない（MUST）。

authenticationは`http:api`のsecretまたはcredential attributeとしてencodeされない。shared authentication prerequisiteはInterface Requirementに属し、credentialはRuntimeの管理下に残る。

cross-origin permission、DNS、TLS、CORS、proxy behavior、origin allowlist、およびnetwork accessはRuntimeまたはhost-environment policyである。absoluteまたはresolved URLはrequestが許可されることを保証しない。

<a id="73-http-operation-mapping"></a>
# 73. HTTP Operation Mapping

HTTP Capability routeは`http:operation`を`mapping`のsingle semantic rootとして使用する。

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

`http:operation`はunqualified attribute `method`および`path`を持たなければならない（MUST）。

`method`はnon-empty valid HTTP method tokenでなければならない（MUST）。Extensionはmethodを`GET`および`POST`に限定しない。standard methodはregistered uppercase spellingを使用することが望ましい（SHOULD）。method tokenはcase-sensitiveである。processorはunknown methodをuppercaseしてequivalenceをassumeしてはならない（MUST NOT）。

`path`はpresentで、schemeもauthority componentも持たないRFC 3986 URI-referenceでなければならない（MUST）。これはnetwork-path alternativeを除外した`relative-ref`のsubsetである。`relative-ref`だけではauthorityも許可してしまう。empty、relative-path、absolute-path（single leading `/`）、query-bearing、およびfragment-bearing referenceはpermittedである。absolute URI referenceおよび`//`で始まるnetwork-path referenceは、baseと同じauthorityをnameする場合を含め、HTTP Extension validationによってrejectされなければならない（MUST）。

Section 72で規定されたRFC 3986 Section 5.2 algorithmを使用し、このreferenceをshared Interface base contextに対してresolveしてtargetをconstructする。resolved HTTP targetはbase contextのschemeおよびauthorityをinheritし、`http`または`https`を使用し、non-empty hostを持たなければならない（MUST）。異なるschemeまたはauthorityには、独自の`http:api` Realizationを持つ別のInterfaceが必要である。fragmentはHTTP request targetから除外される。`base + path`という表記はURI-reference resolutionを示し、raw string concatenationまたはbrowser URL repairではない。

例:

```text
resolved base:
https://example.org/entities/lab/api/

operation path:
light/state

request URL before Input query mapping:
https://example.org/entities/lab/api/light/state
```

base context `https://example.org/api/?mode=read`について、次の追加reference formはvalidである。

| Operation `path` | Input mapping前のResolved URI | Input mapping前のHTTP target |
|---|---|---|
| `/api/x` | `https://example.org/api/x` | `https://example.org/api/x` |
| `x?mode=write` | `https://example.org/api/x?mode=write` | `https://example.org/api/x?mode=write` |
| `?mode=write` | `https://example.org/api/?mode=write` | `https://example.org/api/?mode=write` |
| Empty string | `https://example.org/api/?mode=read` | `https://example.org/api/?mode=read` |
| `#result` | `https://example.org/api/?mode=read#result` | `https://example.org/api/?mode=read` |

対照的に、`https://other.example/action`および`//other.example/action`はschemeまたはauthorityを提供するため、operation `path` valueとしてinvalidである。そのserver上のoperationには別のInterfaceが必要である。その`http:api@base`を`https://other.example/`、operation `path`を`action`にしてよい。これらはHTTP Extension validation outcomeであり、Core envelope errorではない。

参照先Interfaceは`http:api` Realizationを持たなければならない（MUST）。異なる、またはabsent Realizationを持つInterfaceへ適用された`http:operation` Mappingは、このHTTP Extensionの下でinvalidである。

baselineはその他の`http:operation` attributeまたはchild elementを定義しない。authenticationおよびauthorizationはRequirementであり、Mapping attributeではない。staticまたはdynamic generic header mappingはこのbaselineの範囲外である。

同じCapabilityは、同じHTTP Interface上の複数operationを含む、HTTP operationを持つ複数のInterfaceUseを含んでもよい（MAY）。各routeは別々にevaluateされ、document orderはpreferenceを表さない。

<a id="74-http-request-mapping"></a>
# 74. HTTP Request Mapping

## 74.1 Common Rule

serialization前に、Runtimeはsupplied valueをCapabilityのeffective Input semanticsに対してvalidateしなければならない（MUST）。missing required Inputまたはknown typeもしくはconstraint validationにfailするvalueはrequestをpreventしなければならない（MUST）。

Input nameはsemantic keyである。baselineはそのままJSON object member nameまたはGET query parameter nameとして使用する。renaming ruleは定義しない。

absent optional Inputはomittedとなる。Coreは`null` shortcutを定義しない。applicable semantic definitionが明示的にpermitしてmapしない限り、JSON `null` valueはCore Inputにacceptedされない。

credential、authorization header、cookie、およびambient authenticationは、policyに従ってRuntimeまたはhost environmentが提供する。AR-XMLに埋め込まれたsecretから読み取ってはならない（MUST NOT）。

## 74.2 GET Query Mapping

`method="GET"`について、baselineはrequest bodyを送信しない。present scalar Inputはquery parameterへmapされる。

```text
query parameter name  = Input name
query parameter value = scalar lexical form
```

supported GET baseline Input typeは次のとおりである。

```text
string
number
integer
boolean
```

lexical formは次のとおりである。

- `string`: string value
- `number`: 後述のwire-equivalence boundaryに従い、supplied numeric valueおよびapplicable numeric constraintをpreserveするnumeric lexical form
- `integer`: 同じboundaryの下でsupplied integer valueをpreserveするintegral numeric lexical form
- `boolean`: 正確に`true`または`false`

Core primitive vocabularyはquery valueについてcanonical numeric spelling、precision、またはexponent policyを選択しない。GET baselineが異なるnumeric spellingを許可するのは、receiverで同じtyped Input valueをpreserveする場合だけである。APIが特定のspellingを要求する場合、numerically equalなspellingを異なるものとして扱う場合、またはreceiver-specific numeric conventionを適用する場合、そのrequirementはbaselineの範囲外である。例えば`1`と`1.0`がinterchangeableなのは、両方が同じoperation meaningを持つ同じpermitted numeric Input valueへdecodeされる場合だけである。これはarbitrary APIに対するuniversal equivalence assertionではない。

baselineは複数のwire-equivalent query serializationを許可する。ここでwire equivalenceとは、parameter decodingおよびtyped Input interpretationが同じInput nameとvalueを生成し、既存locator parameterをpreserveし、operation meaningを変更しないことを意味する。byte-identical request、parameter sorting、single space encoding、fixed percent-escape set、またはhexadecimal letter caseは要求しない。parameter orderはpreferenceを表さない。

HTTP stackのquery encoderを使用するだけではwire equivalenceを確立しない。特に`+`と`%20`はuniversally interchangeableではない。receiverが`+`をliteralに解釈する場合がある。同様に、byte-level signature requirementを含むreceiverにとってsignificantなlexical distinctionは、別のAPIが無視する場合でもbaselineの範囲外である。Runtimeはreceiver-specific conventionをsilentに選択したり、undocumented deployment agreementをbaseline semanticsとして扱ったりしてはならない（MUST NOT）。

resolved operation URI内のexisting queryはlocator dataのままである。present Inputはexisting parameterのmeaningを変更せずにparameterを追加する。InputがなければInput parameterは追加されない。existing decoded query parameterとpresent Input間のname collisionはbaselineの範囲外である。baseline-only Runtimeはrequired collision-handling featureを`Support = UNSUPPORTED`として報告しなければならず（MUST）、replacement、repetition、またはsilent omissionを選択してはならない（MUST NOT）。query mappingはquery componentに対して動作し、fragmentに対しては動作しない。

receiver-sensitive numeric spellingまたはその他のreceiver-specific encodingが必要な場合にも、同じsupport boundaryが適用される。baseline-only Runtimeはrequired mapping featureを`UNSUPPORTED`として報告しなければならず（MUST）、Section 66に従ってaffected routeを`UNAVAILABLE`にする。unknown compatibilityまたはunknown query-decoding semanticsは、assumed equivalenceまたは`READY`ではなく`Support = UNKNOWN`を生成する。これらはmapping-support outcomeであり、Core validity failureではない。evaluationはequivalenceを確立するためにCapabilityをexecuteしてprobeしてはならない（MUST NOT）。

追加conventionには、Part IIIのExtension modelを使用し、Mapping subtreeから明示的に識別可能な、別途規定されたversioned Mapping Extension semanticsが必要である。このbaselineは`http:operation`にconvention selectorを導入せず、generic mapping DSLも導入しない。conforming baseline-only implementationはそのような追加featureのsupportをclaimしない。識別されたExtensionを実装するprocessorは、そのExtensionのsupportを別途evaluateする。document-external agreementだけをbaseline conformanceへpromoteしてはならない（MUST NOT）。

value例:

```text
q = relink
page = 2
active = true
```

これは次とequivalentなqueryを生成する。

```text
?active=true&page=2&q=relink
```

`object`、`array`、または`binary`のGET serializationはbaselineの範囲外である。そのようなInputがGET operationにpresentまたはrequiredな場合、baseline-only Runtimeは必要なmapping featureを`UNSUPPORTED`として報告する。JSON-in-query、repeated-key、base64、またはその他のserializationを発明してはならない（MUST NOT）。

## 74.3 JSON Object Request Mapping

`POST`、`PUT`、および`PATCH`について、baselineはpresent Inputを1つのJSON objectへmapする。

```text
JSON member name  = Input name
JSON member value = Input value represented by its Core data type
```

Input例:

```text
on = true
level = 0.75
```

これは次を生成する。

```json
{
  "on": true,
  "level": 0.75
}
```

request `Content-Type`は`application/json`である。JSON member orderはsemantic significanceを持たない。present Inputを持たないInvocationは`{}`へmapされる。

Core `string`、`number`、`integer`、`boolean`、`object`、および`array` valueは対応するJSON value kindへmapされる。`integer`はintegral meaningを持つJSON numberで表現される。JSON serializationはJSON syntaxに従い、JSON syntaxは`NaN`またはinfinity tokenを提供しない。baselineはarbitrary-precision requirement、universal numeric range、exact-decimal、またはrounding policyを追加しない。applicable numeric constraintおよびRuntimeのdeclared supportが、valueをusableかどうか決定する。Core `binary`にはbaseline JSON request mappingがなく、追加mapping specificationが必要である。

`GET`、`POST`、`PUT`、および`PATCH`以外のmethodも`http:operation`でpermittedだが、そのrequest Input mappingはこのbaselineでは定義されない。Runtimeは追加のversioned HTTP mapping specificationを通じてそのようなmethodをsupportしてもよい。それ以外の場合、Input serializationが必要ならrouteは`UNSUPPORTED`である。

## 74.4 No Generic Header DSL

baselineはInput nameをHTTP header nameとして解釈してはならず（MUST NOT）、arbitrary header-expression languageを提供しない。`Content-Type`およびrepresentation negotiation headerを含むRuntime生成のstandard protocol headerはsemantic Input remappingではない。

<a id="75-http-response-and-result-mapping"></a>
# 75. HTTP ResponseおよびResult Mapping

## 75.1 HTTP-level Outcome

`2xx` classのすべてのHTTP statusはHTTP-level successである。non-`2xx` statusはbaselineにおけるHTTP Interface-level non-successである。

HTTP statusはCapability semantic error identifierではない。

```text
HTTP status
≠ Capability semantic result
≠ Capability semantic error
```

baselineはHTTP statusだけから`control-denied`、`insufficient-funds`、または`emergency-stop-active`などのdomain errorをinferしてはならない（MUST NOT）。別個のversioned semantic error mapping specificationが必要である。

network failure、timeout、TLS failure、CORS rejection、およびmalformed HTTPはtransportまたはInterface failureであり、Core validation failureではない。

## 75.2 Representation Selection

Representation selectionは概念的に次に基づく。

```text
caller preference
∩ Runtime support
∩ declared Entity Representations
∩ applicable HTTP support
```

Representationのdocument orderはpreferenceを表してはならない（MUST NOT）。Runtimeは明示的selection policyからstandard HTTP `Accept` negotiationを生成してもよい（MAY）。これはgeneric header mapping DSLではない。

baseline JSON Result mappingは、Resultがpresentの場合にdeclared `application/json` Representationを要求する。Resultがabsentの場合は代わりにSection 75.4が適用される。selectまたはvalidateするResult Representationは存在しない。

このJSON baselineでは、compatibilityは次のruleによって決定され、Application sniffingまたはrecovery policyによっては決定されない。

1. [RFC 9110 Section 8.3.1](https://httpwg.org/specs/rfc9110.html#media.type)のmedia-type syntaxを使用して、declared media typeおよびresponse `Content-Type`をparseする。responseはsyntactically validな`Content-Type` field valueを正確に1つ含まなければならない（MUST）。missing、malformed、repeated field、media typeのlist、またはduplicate parameter name（ASCII case-insensitiveに比較）はRepresentation failureである。
2. typeおよびsubtypeをASCII case-insensitiveに比較する。selected declarationとresponseはどちらも`application/json`でなければならない（MUST）。`application/problem+json`のようなstructured suffixは、単に`+json`で終わるという理由ではmatchしない。
3. parameter orderはsignificanceを持たない。このbaselineでは、`charset`およびunknown extra parameterを含む、syntactically validでnon-duplicateなすべてのmedia-type parameterは両側でignoreされ、compatibilityまたはdecodingに影響してはならない（MUST NOT）。baseline semantic constraintを提供しない。JSONは[RFC 8259 Sections 8.1 and 11](https://www.rfc-editor.org/rfc/rfc8259.html#section-8.1)に従ってUTF-8としてdecodeされる。parameterは別のcharacter encodingをselectできない。valid UTF-8 JSONでないcontentはRepresentation failureである。
4. media typeのmatchingはbodyをvalidateしない。Section 75.3は引き続きJSON objectおよびsemantic Output checkを要求する。その他のmedia typeおよびparameter-dependent mappingには別途識別されるmapping specificationが必要であり、このbaseline claimの範囲外である。

declared `application/json`について、次のcompatibility resultはfixedである（applicableな場合、valid UTF-8 JSON bodyを仮定する）。

| Received Content-Type | Baseline media-type result |
|---|---|
| `application/json` | Compatible |
| `Application/JSON; Charset="utf-8"` | Compatible。parameterはignored |
| `application/json; vendor=example` | Compatible。extra parameterはignored |
| `application/problem+json` | Representation failure |
| Content-Type fieldなし | Resultがpresentの場合、Representation failure |

Application policyはprocessingを別途blockまたはabortしてもよいが、baseline mismatchをcompatibleとしてrelabelしたり、policy固有recoveryをbaseline conformance resultにしたりしてはならない（MUST NOT）。

## 75.3 Baseline JSON Result

JSON Result bodyはtop-level JSON objectでなければならない（MUST）。各declared Outputはexact nameによって1つのobject memberへmapされる。

```text
JSON member name  = Output name
JSON member value = Output value
```

`temperature`という名前のsingle Outputについても、baseline responseはobjectである。

```json
{
  "temperature": 21.4
}
```

次のscalar shortcutはそのdeclarationに対するvalid baseline JSON Resultではない。

```json
21.4
```

すべてのdeclared Outputは対応するobject memberを持たなければならない（MUST）。各member valueはOutputのCore structural data typeおよびunderstood semantic constraintをすべてsatisfyしなければならない（MUST）。numeric decodingはselected JSON implementationおよびapplicable numeric constraintに従う。baselineはarbitrary-precisionまたはexact-decimal preservation requirementを追加しない。Runtimeはnumeric support limitationをCore document validityとは別に報告する。

Capability Contract、Profile、またはapplicable Extensionがdeterministicallyにprohibitしない限り、unknown JSON object memberはignoreしてもよい（MAY）。unknown memberをignoreしても、AR-DOMまたはsemantic Resultに追加されない。

JSON member orderはsemantic significanceを持たない。multiple Outputも同じname-to-member ruleを使用する。

## 75.4 No ResultおよびHTTP 204

`204 No Content`はHTTP-level successである。semantic invocationにreturned valueがないことを表すabsent Resultとcompatibleである。empty ResultおよびOutputを宣言しないResultはinvalid Draft 5 Core structureである。

1つ以上のOutputが宣言されている場合、`204` responseまたはその他のabsent bodyはsuccessful semantic Output productionではなく、ResultまたはRepresentation mapping failureである。

Resultがabsentの場合、Runtimeはresponse bodyからOutputを発明してはならない（MUST NOT）。valid `2xx` HTTP responseについて、bodyがabsentでもpresentでも、baselineはsemantic Outputなしでinvocation mappingを完了する。bodyはCapability Result interpretationでignoreされなければならず（MUST）、parseせずdiscardしてもよい（MAY）。そのpresence、content、およびContent-Typeによってbaseline ResultまたはRepresentation failureを生じさせてはならない（MUST NOT）。このruleはremote business outcomeをinferせず、transport failure、invalid HTTP framing、または独立して報告されたpolicy abortをoverrideしない。non-`2xx` responseはHTTP Interface-level non-successのままである。otherwise undeclared bodyを解釈するmappingには別のversioned mapping specificationが必要である。Application policyはbaseline outcomeをsilentにredefineしてはならない（MUST NOT）。

## 75.5 AuthenticationおよびAuthorization

shared HTTP authentication prerequisiteはInterface Requirementとして宣言することが望ましい（SHOULD）。Capability-specific authorization prerequisiteはCapability Requirementとして宣言してもよい（MAY）。

HTTP ExtensionはRuntime policy外でcredentialをissue、store、refresh、またはforwardしない。`READY`はserverがrequestをauthenticateまたはauthorizeすることを保証しない。

---

<a id="part-x--conformance-classes"></a>
# Part X — Conformance Classes

<a id="76-conformance-overview"></a>
# 76. Conformance Overview

conformanceはnamed classおよびspecification versionに対してclaimされる。productまたはdocumentが単に「AR-XML compliant」であるというstatementは、適用可能なclassがcontextから明確でない限りincompleteである。

Draft 5は次のprincipal classを定義する。

| Conformance class | Conforming subject | Primary responsibility |
|---|---|---|
| AR-XML Producer | authoring toolまたはserializer | structurally validなAR-XMLをproduceし、declared semanticsをpreserveする |
| AR-XML Consumer | parser、validator、またはAR-DOM consumer | Coreをdeterministicallyにprocessし、model boundaryをpreserveする |
| Runtime | evaluationおよびinteraction implementation | separated stateをexposeし、explicit requestによってのみexecuteする |
| Extension | 識別されたExtensionのspecificationおよびimplementation | Core slot内のnamed semanticsをdefineおよびprocessする |
| Profile Evaluator | Profile conformance implementation | required subsetをdeterministicallyにevaluateし、uncertaintyをreportする |

conforming implementationは複数classをclaimしてもよい（MAY）。あるclassへのconformanceは別のclassへのconformanceを意味しない。これらが5つのbaseline classである。Core Document validityはdocument propertyであり、第6のimplementation classではない。以下のCore Processor、Extension Processor、Runtime Evaluator、HTTP Extension Processor、およびInvoking Runtimeという用語は、これらのclass内のoperationまたはfeature subsetを記述するものであり、baseline classを置換または追加しない。

例:

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

conformance claimはDraft 5またはexact specification versionを識別しなければならず（MUST）、claimed classおよびfeatureを超えるsupportを暗示してはならない（MUST NOT）。

test result、verified conformance、およびcertificationはself-declared conformance claimとは別である。本仕様はcertification authorityを作成しない。

<a id="77-ar-xml-producer-and-document-conformance"></a>
# 77. AR-XML ProducerおよびDocument Conformance

conforming **AR-XML Producer**は、すべてのapplicable Core structural requirementをsatisfyするdocumentをemitしなければならず（MUST）、AR-DOMのserialization時にdeclared semanticsをpreserveしなければならない（MUST）。そのoutputは、次のrequirementをsatisfyするとCore-valid documentである。

- well-formed XML
- document elementとしてのCore `ar-entity`
- Core 0.1 namespaceおよび`version="0.1"`
- permitted Core element、attribute、containment、およびcardinality
- singleton container rule
- required lexical valueおよびCore data type
- explicit Extension Slot envelope rule
- Interface Attachment-or-Realization requirement
- typed local ID uniqueness
- InputおよびOutput scoped-name uniqueness
- すべてのlocal-reference integrity rule

Core Documentはvalid Extension Slot内にunknown foreign Extension rootを含んでもよい（MAY）。current processorがそれらのExtensionをvalidateまたはexecuteできなくてもCore-conformingのままである。

Core DocumentはCategory、Identifier、Property、Subject、Profile Claim、Interface、またはCapabilityを含む必要がない。empty passive Entityもconformできる。

Core Document conformanceは次を要求しない。

- Capability ContractまたはProfile resolution
- `VALIDATED` projection
- Profile conformance
- RuntimeまたはExtension support
- network accessibility
- authenticationまたはauthorization
- executable Capability

unknown Core element、unknown Coreまたはunqualified attribute、slot外のforeign element、duplicate typed ID、dangling local reference、duplicate scoped InputまたはOutput name、またはempty Interfaceはdocumentをnon-conformingにする。

non-canonical Core child orderは、それ以外はvalidなdocumentをnon-conformingにしない。

<a id="78-ar-xml-consumer-conformance"></a>
# 78. AR-XML Consumer Conformance

conforming **AR-XML Consumer**は、次のCore parsingおよびvalidation requirementを実装し（MUST）、advertised exposure operationについてinformation modelをpreserveしなければならない。「Core Processor」はこれらのoperationを表すdescriptive roleである。Section 78.3のSerializer requirementはAR-XML Producer classに適用される。

## 78.1 ParserおよびValidator

conforming Core parserおよびvalidatorは次を行わなければならない（MUST）。

- untrusted inputに適したconfigurationを使用し、XMLをnamespace-awareにparseする。
- 明示的にselectされたDraft 5 processing contextの下でCore namespaceおよび`version="0.1"`をrecognizeする。
- unknown Core contentをsilentにdiscardせずrejectする。
- cardinalityおよびcontainmentをenforceしながらorder-insensitiveにvalidateする。
- typed uniqueness、scoped-name uniqueness、およびlocal referenceをenforceする。
- Extension knowledgeを要求せずExtension Slot envelopeをvalidateする。
- XML parse errorとCore validation errorを区別する。
- valid slot内のunknown foreign rootをacceptする。
- Core validityのprerequisiteとしてSemantic Identifierのnetwork dereferencingを行わない。
- Core-valid documentに対してのみAR-DOMをconstructまたはexposeする。
- parsing、validation、またはexposure中にCapabilityをexecuteしない。

Core parsingおよびvalidationはdeterministicでなければならず（MUST）、AIまたはhuman interpretationに依存してはならない（MUST NOT）。

## 78.2 AR-DOM Exposure

AR-DOMをexposeするCore ProcessorはCore information modelをpreserveし、issuer-authored descriptionをresolved definitionおよびderived Runtime stateから分離したままにしなければならない（MUST）。

unknown foreign subtreeをopaque dataとしてpreserveすることが望ましい（SHOULD）。round-trip preservationをadvertiseする場合、保持できないlexical informationをdiscloseしなければならず（MUST）、Extension contentをsilentにdropしてはならない（MUST NOT）。

## 78.3 Serializer

conforming Draft 5 serializerは、Core namespaceおよび`version="0.1"`を使用してwell-formed XMLをemitしなければならない（MUST）。Core modelにvalidなstructureだけをemitしなければならず（MUST）、Section 21で定義されたrecommended canonical Core child orderを使用することが望ましい（SHOULD）。

canonical child orderは、preferenceを暗示するためのcollection member reorderingをauthorizeしない。serializerはsemantic collection membership、local reference、およびExtension subtree meaningをpreserveしなければならない（MUST）。

implementationはparser、validator、AR-DOM、またはserializer functionalityを別々にclaimしてもよいが、general Core Processor claimがambiguousとなる場合、supported operationを明示しなければならない（MUST）。

<a id="79-extension-conformance"></a>
# 79. Extension Conformance

**Extension** conformance claimは、Extension specification、namespace version、semantic root、およびsupported slot contextを識別しなければならない（MUST）。Extension specificationは、explicit slot grammar、deterministic semantics、およびCore meaningのpreservationを含むPart IIIをsatisfyしなければならない（MUST）。Extension classをclaimするimplementationは、以下のExtension Processor operationを実行する。claimはspecification、そのimplementation、または両方のいずれに関するものかを明示しなければならない（MUST）。

conforming Extension Processorは次を行わなければならない（MUST）。

- prefixではなくnamespace URIおよびlocal nameによってExtension elementをidentifyする。
- permitted Core slot内でのみExtension rootをvalidateする。
- Extensionのdeclared grammarおよびsemanticsをapplyする。
- そのExtension conformance classについてinvalidなknown Extension contentをrejectする。
- Core validationをseparate resultとしてpreserveする。
- Core cardinality、reference、またはsemantic ruleを変更しない。
- behaviorを発明せず、unsupported Extension featureを`Support`を通じてreportする。
- Extension contentをuntrusted inputとして扱う。
- validation中にexecution、credential access、またはunrequested network activityを行わない。

unknown subtreeをstore、display、またはreserializeするだけのimplementationは、そのExtensionへのsemantic conformanceをclaimしてはならない（MUST NOT）。

Extension Processorはinteroperabilityに関係するfeature limitationを識別しなければならない（MUST）。例えば、required constraint evaluatorを省略しながらExtension namespaceをrecognizeしても、そのconstraintのfull supportにはならない。

Extension validityはCore validityではない。foreign subtreeはCore-valid slot内にありながらrecognized Extension grammarにfailする場合がある。逆に、unknown ExtensionはExtension-specific conformance resultなしでCore-validのままであり得る。

Extension specificationは追加のnamed processor classを定義してもよいが（MAY）、これらのCore separation requirementをweakenしてはならない（MUST NOT）。

<a id="80-runtime-and-profile-evaluator-conformance"></a>
# 80. RuntimeおよびProfile Evaluator Conformance

## 80.1 Runtime Evaluator

evaluationを実装するconforming **Runtime**（Runtime Evaluator role）は次を行わなければならない（MUST）。

- description dataをevaluation stateから分離して保持する。
- Part VIIIで定義されたstate domainおよびvalueをbooleanへcollapseせずexposeする。
- unresolved、unknown、unsupported、unsatisfied、およびconflicting conditionを区別する。
- Attachment satisfactionを別途evaluateし、`ATTACHMENT_UNSATISFIED`を含むInterfaceUse route evaluationにknown-blocker precedenceを適用する。
- Invocationを持つCapabilityにだけCore Availabilityを生成し、そのrouteを`any READY`、それ以外は`any UNKNOWN`、それ以外は`UNAVAILABLE`としてaggregateする。
- Profile conformanceをAvailabilityから独立させる。
- document orderをimplicit route preferenceとして使用しない。
- known blockerとuncertaintyを区別するのに十分なdiagnosticを提供する。
- availability testのためにCapabilityをexecuteしない。

Runtime EvaluatorはInterface Extensionのsubsetだけを実装してもよい（MAY）。unsupported implementation capabilityは`Support`を通じて表現される。specification capabilityの変更ではない。

## 80.2 Invoking Runtime

executionを実装するconforming **Runtime**（Invoking Runtime role）は、さらに次を行わなければならない（MUST）。

- Capability execution前に明示的なApplicationまたはHuman requestを要求する。
- route selectionおよびasynchronous workを通じてinitiating intentをpreserveする。
- serialization前に、実装されたすべてのsemantic ruleの下でInputをvalidateする。
- Runtimeおよびhost security policyをapplyする。
- credential handlingをAR-DOM外に保つ。
- transport、Interface、Representation、Contract、およびsemantic outcomeを区別する。
- execution stateまたはresultによってdescriptionを書き換えない。

Invoking Runtimeは、記述されたすべてのInterfaceまたはCapabilityをsupportする必要はない。claimするfeatureのsupportおよびavailabilityを正確にreportしなければならない（MUST）。

## 80.3 HTTP Extension Processor

conforming **HTTP Extension Processor**は次を行わなければならない（MUST）。

- Part IXのHTTP Extension namespaceをrecognizeする。
- `http:api`をRealization内だけ、`http:operation`をMapping内だけでvalidateする。
- required `method`と`path`、およびpresentな場合のoptional `base` attributeをvalidateする。
- `base`がomittedの場合はfinal AR-XML retrieval URIを使用し、relativeまたはempty `base`をHost Application URLではなくそのURIに対してresolveする。
- schemeまたはauthorityを含むoperation `path` valueをrejectし、shared Interfaceのschemeおよびauthorityを用いたstrict RFC 3986 reference resolutionでoperation URLをconstructする。
- method supportをmethod syntax validityとは別に扱う。
- HTTP authenticationおよびauthorizationをRequirementおよびRuntime policy内に保つ。
- HTTP-level outcomeをsemantic Capability outcomeから区別する。

## 80.4 HTTP Baseline Mapping Feature

対応するbaseline mapping featureをclaimするHTTP Runtimeは、それを正確に実装しなければならない（MUST）。

| Feature claim | Required behavior |
|---|---|
| HTTP GET scalar request mapping | Section 74.2のwire-equivalenceおよびno-collision boundary内で、`string`、`number`、`integer`、および`boolean` Inputをquery parameterへmap |
| HTTP JSON object request mapping | `POST`、`PUT`、および`PATCH` Inputを1つのJSON objectへmap |
| HTTP JSON Result mapping | single Outputの場合を含め、Output nameをkeyとするtop-level JSON object |
| HTTP status classification | すべての`2xx`はHTTP-level success。non-`2xx`はInterface-level non-success |
| HTTP 204 handling | HTTP-level success。Result mappingはResultがabsentの場合だけsuccess |
| HTTP response media-type matching | Section 75.2に基づくexact baseline type/subtype comparisonおよびparameter handling。sniffing fallbackなし |
| HTTP no-Result response | valid `2xx`ではsemantic interpretationのためのbodyをignore。invented Outputなし |

implementationがincompatible scalar shortcutを使用する場合、query mapping中にsemantic Input nameまたはtypeを変更する場合、generic header DSLをbaselineであるかのように使用する場合、またはHTTP statusからsemantic errorをinferする場合、mapping featureをclaimしてはならない（MUST NOT）。HTTP baseline conformanceが許可するのはSection 74.2に基づくwire-equivalent query serializationであり、arbitrary receiver-dependent encodingではない。baseline-only Runtimeはrequired receiver-specific lexical conventionまたはquery-name collision handlingを`UNSUPPORTED`として、unknown compatibilityを`UNKNOWN`として報告しなければならない（MUST）。追加のversioned Mapping Extension semanticsはMapping subtreeから明示的に識別可能でなければならない。implicit deployment agreementはbaseline conformanceを確立しない。

HTTP Extension Processorはすべてのvalid HTTP methodを実装する必要はない。syntactically validだがunimplementedなmethodまたはmapping featureについて、AR-XML Core documentをinvalidと宣言するのではなく`UNSUPPORTED`を報告しなければならない（MUST）。

## 80.5 Conformance Reporting

implementation conformance statementは次を識別することが望ましい（SHOULD）。

- specification version
- claimed class
- supported Extension namespaceおよびversion
- supported HTTP methodおよびmapping feature
- implemented semantic resolverおよびconstraint evaluator
- relevant Runtime policy limitation
- conformance test suiteを使用する場合、そのtest-suite version

Entity document内のProfile ClaimはRuntimeのimplementation conformance statementではない。

## 80.6 Profile Evaluator

conforming **Profile Evaluator**は次を行わなければならない（MUST）。

- Core document validityをsemantic conformanceとは別に確立する。
- exact Contract/Profile identityおよびSections 38と43のusable-definition ruleを使用する。
- ProfileResolutionをProfileConformanceとは別にexposeする。
- Sections 44–45のfixed existential matchingおよびcandidate aggregation ruleによりrequired Capability、Property、およびIdentifier itemをevaluateし、custom cardinalityまたはquantifier overrideを使用しない。
- optional-item diagnosticをbaseline required-subset aggregationから除外し、optional itemにpresence-conditional constraintを合成しない。
- open-world defaultおよびplacement-scoped Requirement policyをapplyする。
- known invalid Profile definitionをEntityの責任にせず、conformance `UNDETERMINED`を伴う`UNRESOLVED`としてrejectする。
- unknown required semanticsを`UNDETERMINED`としてpreserveし、compatible narrowingをassumeしない。
- Profile Claim、verified evaluation、certification、Runtime Support、およびAvailabilityを分離して保持する。
- required AI inferenceまたはautomatic Capability executionなしでevaluateする。

Profile Evaluator conformanceはinvocation supportまたはnetwork resolutionを要求しない。unsupported semantic featureはdiscloseされ、定義済みuncertainty stateによって扱われなければならない（MUST）。

---

<a id="part-xi--examples"></a>
# Part XI — Examples

<a id="81-empty-passive-entity"></a>
# 81. Empty Passive Entity

最小のDraft 5 documentは、他のdeclarationを持たないvalid passive Entityを記述する。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ar-entity
  xmlns="https://relink.dev/ns/arxml/core/0.1"
  version="0.1" />
```

このdocumentはCore-validである。CPU、network connection、API、Interface、Capability、Canonical Entity Identity、またはcurrent availabilityを意味しない。

<a id="82-properties-only-entity"></a>
# 82. Properties-only Entity

Entityはinvocableでなくてもdeclared characteristicを含み得る。

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

repeated Property `type`はvalidである。Coreはどのvoltageがpreferred、current、または特定configurationでapplicableかをinferしない。

<a id="83-identifier-and-subject"></a>
# 83. IdentifierおよびSubject

Identifierはdescribed Entityまたはlightweight Subjectのいずれにも適用できる。

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

`temperature-module`はnested Entityではない。どちらのIdentifierも自動的にLocator、credential、またはCanonical Entity Identityにはならない。

<a id="84-attachment-only-interface"></a>
# 84. Attachment-only Interface

passive physical connectorはCapabilityまたはnetwork Realizationなしで記述できる。

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

AttachmentがpresentなのでInterfaceはvalidである。Core validationは`phys:connector` semanticsを理解する必要がない。

<a id="85-capability-without-invocation"></a>
# 85. Invocationを持たないCapability

Capabilityはrequest-oriented Invocationを定義せずにsemantic affordanceを記述できる。

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

documentはvalidである。このCapabilityのCore request-oriented Availabilityは`UNAVAILABLE`である。このdeclarationはsemantic descriptionとして、またはfuture observation Extensionにとって引き続き有用な場合がある。

<a id="86-capability-without-interfaceuse"></a>
# 86. InterfaceUseを持たないCapability

Capabilityはrouteを宣言せずにrequestおよびResult contract projectionを定義できる。

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

CapabilityはCore-validだが、InterfaceUse routeは0である。RuntimeはContract identifierからendpointを発明しない。

<a id="87-shared-http-interface"></a>
# 87. Shared HTTP Interface

1つのEntity-level HTTP Interfaceを複数のCapabilityで共有できる。

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

`http:api`はshared HTTP configurationを保持する。各`http:operation`はCapability-specific methodおよびpathだけを保持する。

<a id="88-multiple-interfaceuses"></a>
# 88. Multiple InterfaceUses

1つのsemantic Capabilityは、Capabilityをduplicateせずに異なるInterface Extension経由のrouteを持つことができる。

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

これは独立してevaluateされる2つのrouteを持つ1つのCapabilityである。そのorderはpreferenceではない。RuntimeはHTTP、BLE、両方、またはいずれもsupportしない場合がある。

<a id="89-unknown-foreign-extension"></a>
# 89. Unknown Foreign Extension

unknown foreign contentは、permitted Extension Slotに現れる場合Core-validのままである。

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

vendor namespaceをrecognizeしないCore processorもCore structureをacceptし、両方のforeign subtreeをpreserveすることが望ましい。そのvendor Extensionがvalidまたはsupportedであるとはclaimしない。

<a id="90-reference-lab-light-control"></a>
# 90. Reference Lab Light Control

Reference Lab light controlのsemantic intentは次のとおりである。

```text
light.setState(on:boolean)
```

1つのsemantic Capability、1つのEntity-level shared HTTP Interface、および1つのHTTP InterfaceUse Mappingによって表現される。

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

baseline request body:

```json
{
  "on": true
}
```

このInvocationはOutputを宣言しないため、HTTP `204 No Content` responseはcompatibleである。このdocumentのloadingによってrequestを送信してはならない（MUST NOT）。

<a id="91-reference-lab-temperature-reading"></a>
# 91. Reference Lab Temperature Reading

Reference Lab temperatureのsemantic intentは次のとおりである。

```text
temperature.read()
→ temperature:number
```

次のcomplete documentは同じEntity-level HTTP Interfaceを共有しながら、これをlight control Capabilityと組み合わせる。

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

baseline temperature response:

```json
{
  "temperature": 21.4
}
```

single OutputでもJSON objectを使用する。scalar `21.4` responseはbaseline mappingではない。

Entity ResolverはReference Lab Entity identityまたはapplication referenceをこのAR-XML resource locationへmapしてもよい。2つのCapability Contractをresolveしたり、HTTP routeをchooseしたり、いずれかのCapabilityをexecuteしたりはしない。それらの責務はSemantic Registryおよびexplicit Runtime operationに残る。

---

<a id="part-xii--security-and-privacy-considerations"></a>
# Part XII — Security and Privacy Considerations

<a id="92-security-considerations"></a>
# 92. Security Considerations

**Normative Core boundary.** 適用可能なProducer、Consumer、Runtime、Extension、およびProfile Evaluator requirementは、ここでは次に限定される。

- ConsumerはSection 92.1で規定するsecure namespace-aware XML processingを実行しなければならない（MUST）。
- ProducerはAR-XMLにCredentialまたはreusable secretを埋め込んではならず（MUST NOT）、consumerはRequirement dataをCredentialとして扱ってはならない（MUST NOT）。
- loading、resolution、validation、exposure、およびevaluationによって記述されたCapabilityをinvokeしてはならない（MUST NOT）。Executionは明示的なApplicationまたはHuman requestに由来しなければならない（MUST）。
- claim、resolution、availability、authentication、authorization、およびexecutionは区別されたままでなければならない（MUST）。issuer dataはparsingだけによってverified truthになってはならない（MUST NOT）。
- deterministic interoperabilityおよびconformanceはAIまたはLLM inferenceを要求してはならない（MUST NOT）。

以下の導入discussionおよびSections 92.2–92.8は**informative implementation guidance**である。Core conformance gateを追加せず、network target、cache protection、redirect、retry、replay、isolation、およびphysical safetyに関するdeployment adviceを保持する。他sectionをrestatementする場合、そのsectionがnormative sourceのままであり、deployment policyとそのenforcementはCoreの範囲外に残る。

AR-XMLはEntity、semantic contract、interaction surface、および可能なinvocation mappingを記述する。ApplicationがCapabilityを明示的にinvokeすると、descriptionがnetwork accessまたはphysical behaviorへ影響する場合がある。したがってimplementationは、独立したtrust policyによって別途確立されない限り、すべてのAR-XML document、resolved semantic definition、Extension subtree、Runtime response、およびregistry resultをuntrusted inputとして扱わなければならない。

Core validityはsecurity decisionではない。documentはstructurally validであっても、deceptive issuer claim、dangerous operation mapping、hostile endpoint location、privacy-sensitive data、またはconsumerがtrustすべきでないsemanticsを含み得る。同様に、resolved Capability ContractまたはProfileは、identifierがsyntactically validまたはdefinitionがavailableというだけではtrustedではない。

## 92.1 Secure XML Processing

AR-XML processorはnamespace-aware XML parserを使用しなければならず（MUST）、parsingのside effectとしてexternal entity、external DTD subset、schema、stylesheet、またはその他のexternal resourceをfetchしてはならない（MUST NOT）。processorはentity expansion、recursive inclusion、またはimplementation-dependent network accessを生じ得るconstructをrejectまたはdisableすることが望ましい（SHOULD）。

implementationはdocument size、element depth、attribute countおよびsize、text length、collection length、およびdiagnostic accumulationのlimitを含む、そのenvironmentに適したresource limitを適用しなければならない（MUST）。opaque dataとしてpreserveされる場合でも、Extension subtreeには同じresource controlが適用される。

Core processorは本仕様が定義するclosed Core vocabularyをenforceしなければならない（MUST）。unknown Core elementまたはCore/unqualified attributeをsilentにdropしたり、Extensionとして扱ったり、replacementをguessしたりしてrepairしてはならない（MUST NOT）。foreign child elementはExtension Slot内だけでacceptedされる。foreign metadata attributeはSection 32.3に従う。unknown foreign subtreeのacceptanceは、unsafe format-specific processorでparseしたり、その中のcontentをexecuteしたりすることをauthorizeしない。

## 92.2 Claim、Trust、およびSemantic Definition

Identifier、Property、Profile Claim、Interface declaration、およびCapability projectionはissuer-declared dataである。AR-XML外でevaluateされたevidenceなしに、verified identity、ownership、authority、certification、current state、またはpermissionとして扱ってはならない。

特に次のとおりである。

- Identifierは自動的にCanonical Entity Identity、locator、Credential、またはproof of possessionにはならない。
- Profile ClaimはVerified ConformanceまたはCertificationではない。
- declared RequirementはRequirementがsatisfiedまたはenforcedであることを証明しない。
- `READY` Availability resultはauthorization、remote acceptance、safe execution、またはsuccessful outcomeを証明しない。
- Extensionのsupportは、そのExtensionを使用するdocumentへのtrustを確立しない。

Semantic Registry implementationはdefinition substitution、cache poisoning、downgrade、およびconflicting definitionを防御しなければならない。exact versioned identityをpreserveしなければならず、異なるdefinitionが同じidentifierをclaimする場合にsilent first-wins behaviorを適用してはならない。registryおよびcache entryはsource、retrieval time、利用可能な場合のintegrity information、およびdefinitionをadmitしたtrust decisionを保持することが望ましい。Applicationはsignature、digest、authenticated delivery、local approval、またはその他のprovenance policyを要求してもよい。このようなmechanismはCoreの範囲外である。

semantic definitionのnetwork retrievalはoptionalである。preferred sourceからdefinitionを取得できないという理由だけで、Runtimeはtrust policyをweakenしてはならない。definitionのresolutionまたはtrustのfailureはunresolvedまたはpolicy-specific failure stateを生成し、そのsemanticsをguessすることを正当化しない。

## 92.3 ResolutionおよびNetwork Target Security

Entity resolution、semantic resolution、およびCapability executionは別々のactivityであり、別々のpolicy boundaryを使用することが望ましい。Entity ResolverはEntity identityをAR-XML locationへmapする。Semantic Registryはsemantic identifierをsemantic definitionへmapする。いずれのoperationも後のexecutionをauthorizeしない。

Entity Resolver、semantic definition、Interface Realization、Mapping、redirect、またはExtensionから得られたnetwork locationはすべて、access前にApplicationおよびdeployment policyに対してvalidateしなければならない。implementationは、次を含むserver-side request forgeryおよび関連target-confusion attackを防御することが望ましい。

- disallowed URI schemeまたはport
- loopback、link-local、private、multicast、metadata-service、およびその他のprotected address range
- DNS rebinding、およびvalidationとconnection間の変更
- less trusted originまたはschemeへのredirect
- user information、Unicode、percent encoding、またはnormalization differenceによるauthority confusion
- attacker-controlledまたはincorrect baseに対するrelative URL resolution

HTTP baselineはrelative `http:api` `base`をAR-XML retrieval URLに対してresolveする。このdeterministic ruleは結果のoriginをtrustedにしない。RuntimeはURL resolution後および各redirect後にtarget policyを適用しなければならない。Applicationはdeploymentに適したorigin allowlist、transport requirement、redirect limit、およびnetwork isolationを使用することが望ましい。

document retrieval、semantic resolution、Availability evaluation、および`ARRuntime.load()`は、記述されたCapabilityをinvokeしたり、mapped Capability Inputをprobeとして送信したりしてはならない。Runtimeはdescriptionのresolveまたはfetchに必要な明示的configured retrievalを実行してもよいが、そのtrafficをCapability executionから区別したままにしなければならない。

## 92.4 Credential、Authentication、およびAuthorization

AR-XML documentはpassword、private key、bearer token、API secret、refresh token、session cookie、またはその他のreusable secretを含んではならない。Requirement dataはauthenticationまたはauthorization mechanism、credential class、audience、またはpolicyを識別してもよいが、Credential自体を埋め込んではならない。

Credentialは、独立したpolicyの下でRuntime、Host Application、operating environment、またはuser agentによって提供および管理される。Runtimeはleast privilegeを適用し、Credentialをintended originおよびoperationにscopeし、unapproved redirectを越えるforwardingを防止し、Extension processorまたはdiagnostic outputへのexposureを避けることが望ましい。ambient browser credentialおよびcookieにはexplicit cross-originおよびrequest-forgery protectionが必要である。そのpresenceをInterface declarationだけからinferしてはならない。

successful authenticationはauthorizationを意味しない。Requirement evaluationはtarget systemによるenforcementを置換しない。Applicationはremote systemまたはphysical controllerがexecution時に独自のauthorization decisionを行うことを想定しなければならない。

## 92.5 Explicit ExecutionおよびSide Effect

`ARRuntime.load()`はResolve、Fetch、Parse、Validate、およびExposeから成る。Capabilityを自動的にexecuteしてはならない。Availability evaluation、Profile validation、preview generation、route discovery、およびUI enumerationも同様にside effectを伴うinvocationを引き起こしてはならない。

executionはApplicationまたはHumanによるexplicit requestからのみ開始する。Invoking Runtimeはroute selection、asynchronous processing、redirect、authentication challenge、およびretryを通じてinitiating intentをpreserveしなければならない。background discovery、prefetch、またはvalidationをexecution requestへ変換してはならない。

人、property、money、access control、またはphysical environmentへ影響し得るoperationについて、Applicationは追加confirmation、policy approval、rate limit、またはsafety interlockを要求することが望ましい。AR-XMLはoperationがCapability Contractによって記述されている、または`READY`とevaluateされるという理由だけでsafeであるとは確立しない。

retryはside effectをduplicateし得る。RuntimeはHTTP method、Capability name、またはsemantic similarityだけからidempotencyをassumeしてはならない。automatic retryがpermittedなのは、applicable contract、Extension semantics、またはApplication policyがsafe retry behaviorを確立する場合だけである。freshnessまたはone-time authorizationが重要な場合、implementationはreplayを防御することが望ましい。

## 92.6 InvocationおよびResult Handling

serialization前に、Invoking Runtimeは実装するすべてのCore、resolved Contract、Profile、Extension、およびApplication ruleの下でsupplied Inputをvalidateしなければならない。unknownまたはunvalidated constraintはcallerに可視のままでなければならず、satisfiedとして扱ってはならない。Runtimeはinvocation processingについてsize limit、timeout、cancellation、response limit、およびbounded concurrencyをenforceすることが望ましい。

transport successはsemantic successではない。HTTP `2xx`はHTTP-level successだけを示す。逆に、response bodyをparseできるという理由だけでnon-`2xx` responseをsuccessful Capability outcomeとしてreclassifyしてはならない。

すべてのresponse representationはuntrustedである。implementationはtyped Outputをexposeする前にmedia type、representation size、syntax、およびsemantic shapeをvalidateしなければならない。JSON object、XML content、binary data、text、URL、およびerror messageは、formatに適したsafe parserおよびoutput encodingを使用して処理しなければならない。Runtimeはreturned textまたはmarkupを、そのcontextが要求するprotectionなしにexecutable HTML、script、command、template、またはquery contextへinjectしてはならない。

Representation orderはtrust rankingではない。Content-Typeだけではcontentがsafeまたはauthenticである証明にならない。returned representationがselectedまたはnegotiated Representationとmatchしない場合、Runtimeはheuristic interpretationでcoerceせずmismatchを報告しなければならない。

## 92.7 Extension ProcessorおよびPlugin Isolation

Extension processorはAttachment、Realization、Mapping、Requirement、Property、Constraint、またはその他のextension-defined dataを解釈する場合がある。したがってExtensionのsupportはRuntimeのattack surfaceを拡大し得る。

Extension processorはdeclared functionに必要なleast privilegeでrunすることが望ましい。Extensionを単にvalidateまたはpreserveするだけで、unrestricted file、network、process、device、UI、またはCredential accessをgrantしてはならない。Extension validationはdeterministicでexternally visibleなside effectを伴わないことが望ましい。Extension subtreeへ埋め込まれたexecutable scriptまたはcodeはCore processingによってexecuteされない。

Runtimeは次を区別しなければならない。

- Extension namespaceをrecognizeすること
- syntaxをvalidateすること
- semanticsをevaluateすること
- Runtime supportをdetermineすること
- それを使用するoperationをauthorizeおよびexecuteすること

あるstageでのsuccessは、後のstageでのsuccessまたはpermissionを意味しない。

## 92.8 PhysicalおよびOperational Safety

Capabilityは、described Entity自体にCPUまたはnetwork interfaceがない場合でも、physical harmを生じ得るdeviceまたはprocessをcontrolする場合がある。Interfaceはgateway、adapter、Human procedure、またはその他のexternal realizationを経由する場合がある。したがって明白なnetwork endpointのabsenceはexecutionがharmlessである証拠ではない。

本仕様はhazard analysis、emergency-stop behavior、interlock、operator qualification、safe motion、medical safety、industrial control safety、またはfunctional-safety certificationを定義しない。そのようなdomainで動作するApplicationはinvocation前にrelevant independent safety ruleを適用しなければならない。Runtime Availability stateはそのdecisionへのinformational inputであり、safety approvalではない。

AIまたはLLM processingはuser interface、authoring、またはdiagnosticをassistしてもよいが、deterministic validation、security policy enforcement、conformance classification、およびauthorizationはprobabilistic AI interpretationに依存してはならない。AI-generated mapping、target、Input、またはexplanationは、その他のinputと同じexplicitかつdeterministic controlによってacceptされるまでuntrustedとして扱わなければならない。

<a id="93-privacy-considerations"></a>
# 93. Privacy Considerations

**Informative implementation guidance.** このsectionはlegal basis、consent mechanism、retention、disclosure policy、telemetry、またはdeployment controlに関するCore conformance requirementを追加しない。secret、issuer claim、explicit invocation、およびdescriptionとRuntime stateの分離に関するCore requirementは、それぞれを定義するsectionでnormativeのままである。

AR-XML documentはtransport endpointよりはるかに多くの情報を明らかにし得る。Identifier、Property、Subject、Profile Claim、Capability name、Interface detail、Requirement、semantic identifier、およびextension dataは、人またはorganizationを識別し、device characteristicをexposeし、accessibilityまたはhealth-related functionを記述し、operational stateを明らかにし、またはattack surfaceをadvertiseする場合がある。passiveまたはoffline Entityを記述する場合でもdocumentはprivacy-sensitiveである。

publisherおよびprocessorはdeploymentに適したdata minimization、purpose limitation、access control、retention limit、およびdeletion policyを適用することが望ましい。Core modelが許可するという理由だけでdataをpublishすることは避けることが望ましい。documentのdistributionはintended useに必要な範囲を超えないことが望ましい。

## 93.1 Identifier、Subject、Property、およびClaim

CoreはIdentifierをperson identityとして自動的に解釈しないが、stable Identifier valueはdocument、registry、location、およびtimeを横断するcorrelationを可能にし得る。複数のnon-unique IdentifierまたはPropertyを組み合わせるとunique fingerprintを生成し得る。同じpurposeをscoped、rotated、pseudonymous、またはuser-mediated referenceで満たせる場合、implementationはfull stable identifierのexposureを避けることが望ましい。

`subjectRef`はsemantic referenceであり、privacy boundaryではない。lightweight Subjectも、described Entityとのassociationがsensitiveなperson、body part、room、asset、またはcomponentを表す場合がある。processorはSubject dataがnested Entityではないためharmlessだとassumeせず、参照されるdataにaccessおよびdisclosure policyを適用しなければならない。

Propertyはissuer-declared characteristicまたはstateであり、absolute truthではない。それでもcollection、indexing、またはredistributionにはprivacy consequenceがあり得る。Profile Claimはmembership、role、product class、accessibility feature、またはclaimed certificationをexposeし得る。consumerはそのclaimをverified factとして提示してはならず、publisherはclaim自体をdiscloseすべきか検討することが望ましい。

## 93.2 LocationおよびRuntime Context

Coreはdirect latitudeまたはlongitude fieldを意図的に定義しない。stable declared locationはGeo Extensionまたは別のtyped Propertyによって表現できる一方、moving Entityのcurrent positionは通常Runtime Context、または`position.read`などのCapability resultである。この分離によってlocation dataがnon-sensitiveになるわけではない。

precise、repeated、historical、inferred、またはreal-time locationはhabit、occupancy、identity、およびsafety-relevant informationを明らかにし得る。location producerおよびconsumerはprecision、frequency、retention、およびaudienceをminimizeし、適用可能な場合はpurposeおよびlegal basisを確立し、requiredな場合はuser controlまたはconsentを取得することが望ましい。cached locationは、stale valueがcurrentとしてsilentに提示されないよう適切なfreshness metadataを保持しなければならない。

Applicationはlocation-related Property、Capability、Contract、またはProfile Claimのpresenceからcurrent location retrievalへのconsentをinferしてはならない。current positionのreadingはinvocationであり、その他のCapabilityと同じexplicit request、Requirement evaluation、およびauthorization handlingを必要とする。

## 93.3 Invocation DataおよびTelemetry

Capability InputおよびOutputは、Capability typeがroutineに見える場合でもpersonal dataを含み得る。query parameterはbrowser history、intermediary log、server log、analytics system、およびreferrer dataに記録され得る。Contractおよびdeploymentが明示的に要求し、適切なcontrolが存在しない限り、HTTP mappingはsensitive valueをURLへ置くことを避けることが望ましい。invocation data、Credential、identifier、またはoperational detailがprotectionを必要とする場合、transport confidentialityおよびintegrityを使用することが望ましい。

ApplicationおよびRuntimeはstated purposeに必要なInput、Output、error、timing data、およびnetwork metadataだけをcollectおよびretainすることが望ましい。diagnostic recordはsemantic identifier、state、validation category、およびAR-DOM pathなどのstructural informationを優先することが望ましい。必要で保護される場合を除き、Credential material、Identifier value、Property value、InputおよびOutput value、response body、sensitive queryを含むURL、およびopaque Extension payloadをredactまたはomitすることが望ましい。

Semantic ResultはEntity descriptionではなくinvocation outcomeに属する。RuntimeはResultをPropertyとしてsilentにpersistしたり、AR-XMLでrepublishしたりしてはならない。そのようなtransformationはprovenance、freshness、consent、およびretention policyに従う別個のApplication actionである。

## 93.4 ResolutionおよびRegistry Privacy

resolution requestは、userまたはApplicationがどのEntity、Capability Contract、Profile、またはExtensionに関心を持つかをdiscloseし得る。repeated requestは、retrieved definitionがpublicでもinventory、behavior、location、またはorganizational relationshipを明らかにし得る。

resolverおよびSemantic Registryはbuilt-in definition、local registry、cache、Application-provided registry、およびinstalled pluginなどprivacy-preserving deployment choiceをsupportすることが望ましい。network resolutionはmandatoryではない。network resolutionを使用する場合、implementationはtransmitted contextをminimizeし、明示的にrequiredでない限りfull Entity documentの送信を避け、cross-user correlationが問題となる場合はcacheをpartitionし、requested identifierにretentionおよびlogging controlを適用することが望ましい。

exact versioned absolute identifierはsemantic identityであり、そのURI formが示唆するすべてのnetwork locationへcontactするconsentではない。dereferencing policyはidentifier comparisonおよびvalidationから分離されたままでなければならない。

## 93.5 Unknown ExtensionおよびDerived Information

unknown Extension subtreeはCoreがopaqueにpreserveする場合でもpersonalまたはconfidential dataを含み得る。opaque preservation、copying、canonical serialization、logging、signing、またはforwardingはすべてdata processing actionである。implementationはunknown Extension contentをpotentially sensitiveとして扱い、不要なinspectionまたはpropagationを避けることが望ましい。

deterministic interoperabilityはdeclared semanticsを超えるbehavioralまたはpersonal inferenceを要求しない。implementationはprivacy-sensitive meaning、conformance、またはdisclosure policyの決定にAIまたはLLM inferenceを要求してはならない。AIを使用してAR-XMLをsummarizeまたはenrichするApplicationは、適切な場合はそのprocessingをdiscloseし、submitted dataをminimizeし、別個のlawfulかつuser-visible basisなしにsensitive attributeをderiveすることを避けることが望ましい。

AR-XML conformanceはprivacy、data-protection、communications、sector-specific、またはrecords-retention lawへのcomplianceを確立しない。publisher、registry operator、Runtime provider、およびApplicationは、そのprocessingおよびdeploymentに適用されるobligationについて引き続き責任を負う。

---

<a id="part-xiii--namespace-registry-and-evolution-considerations"></a>
# Part XIII — Namespace, Registry, and Evolution Considerations

<a id="94-namespace-considerations"></a>
# 94. Namespace Considerations

XML namespaceはclosed AR-XML Core vocabularyを独立して定義されたExtension vocabularyから区別する。vocabularyを識別するものであり、trust、ownership、availability、authorization、またはnetwork retrieval requirementを確立しない。

## 94.1 Core NamespaceおよびDocument Version

Core 0.1 namespace nameは次のとおりである。

```text
https://relink.dev/ns/arxml/core/0.1
```

Draft 5 root versionは次のとおりである。

```text
0.1
```

namespaceおよびroot `version` valueはCore 0.1 familyを識別する。Draft 5 grammarのselectionには、Section 19で定義されたexplicit processing contextも必要である。processorはnamespace nameおよびversion valueを正確に比較しなければならない（MUST）。URI normalization、redirect、fetched content、prefix spelling、またはlocal-name-only comparisonを用いて別のnameがequivalentであると判断してはならない（MUST NOT）。

namespace nameはidentifierであり、schemaまたはその他のresourceをretrieveするinstructionではない。processorはbuilt-inまたはlocally installed schemaを使用してもよいが（MAY）、parsingおよびCore validationはnamespace URIのdereferencingに依存してはならない（MUST NOT）。

unqualified root `version` attributeはCore serializationの一部である。default XML namespaceはattributeへ適用されない。したがってProducerは、本仕様が別途明示しない限りCore attributeをunqualifiedでemitしなければならない（MUST）。namespace declarationはXML syntaxであり、AR-DOM Propertyまたはattributeではない。

`https://relink.dev/ns/arxml/core/0.1` namespaceはAR-XML Core 0.1 specification familyが定義するelementおよびattribute用にreservedである。ApplicationおよびExtensionはそのnamespaceにprivate elementまたはattributeをmintしてはならない（MUST NOT）。

## 94.2 Core Vocabulary Closure

Draft 5はclosed Core vocabularyである。次はinvalidである。

- unknown Core-namespace element
- unknown Core-namespace attribute
- Core element上のunknown unqualified attribute
- explicit Extension Slot外のforeign element

implementationはforward compatibilityを得るためだけにinvalid Core contentをExtensionとしてreinterpretしてはならない（MUST NOT）。またfuture Core elementをignoreしてacceptしてはならない（MUST NOT）。future Core grammarは独自のexplicitly recognized version ruleの下でprocessされる。

XML namespace aliasはsemantic significanceを持たない。次のdeclarationは同じCore namespaceを示し得る。

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

processorはprefix spellingではなくnamespace identityをpreserveしなければならない（MUST）。canonical serializerはstable prefixを選択してもよいが（MAY）、prefixだけを変更してもAR-DOM semanticsは変わらない。

## 94.3 Extension Namespace Ownership

すべてのExtension semantic elementはnon-Core namespaceを使用し、Part IIIがpermitするExtension Slotに現れなければならない（MUST）。Extension specificationは次をpublishすることが望ましい（SHOULD）。

- maintainerがcontrolするauthority下のstable namespace name
- Extension versioning policy
- 各applicable slotでpermittedなelementおよびattribute
- deterministic validationおよびprocessing rule
- 定義または使用するsemantic identifier
- compatibilityおよびdeprecation policy
- securityおよびprivacy consideration

Extension namespaceの使用はCore specificationによるendorsementを意味しない。namespace controlは特定のdocument、definition、processor、またはpublisherがtrustedであることを証明しない。

ExtensionはCore element、Core attribute、Core cardinality、local reference rule、またはRuntime evaluation stateへ新しいmeaningを割り当ててはならない（MUST NOT）。applicable slot内のdeclared Extension elementを通じてelement-based semanticsを追加し、Section 32.3で定義されたforeign attributeを通じてmetadataを追加してもよい（MAY）。incompatible Core structureを必要とするExtensionには、namespace trickまたはout-of-slot contentではなくfuture Core versionが必要である。

## 94.4 NamespaceおよびSemantic Identifierの分離

XML namespaceはvocabularyを識別する。Semantic IdentifierはCapability Contract、Profile、Property type、Identifier scheme、Requirement type、Subject type、またはその他のregistered conceptなどのsemantic definitionを識別する。これらのroleはdistinctである。

```text
XML namespace
= vocabulary identity

Semantic Identifier
= semantic definition identity
```

Extension namespaceもabsolute URIであってよいが（MAY）、そのvocabulary内のすべてのsemantic definitionのexact identifierに対するimplicit substituteとして使用してはならない（MUST NOT）。逆に、URI authorityまたはstring prefixの共有はsemantic equivalence、compatibility、trust、またはcommon governanceを確立しない。

Coreは`http`、`phys`、`auth`、または`geo`などのshort prefixをreserveしない。exampleではpresentationのためだけにreadable prefixを使用する。Producerおよびconsumerはexample prefixではなくnamespace nameを比較しなければならない（MUST）。

<a id="95-registry-considerations"></a>
# 95. Registry Considerations

AR-XMLはmandatory centralized registryを要求しない。deterministic resolutionはbuilt-in definition、local registry、cache、Application-provided registry、installed Extensionまたはplugin、network service、あるいはこれらsourceのpolicy-controlled combinationを使用できる。

normative Core registry boundaryはPart VIのresolution modelである。built-in、local、cache、Application、plugin、およびnetwork sourceがpermittedであり、source priorityはRuntime policyであり、exact identityはpreserveされなければならず（MUST）、conflicting acceptable definitionにsilent first-winsを使用してはならず（MUST NOT）、resolutionはtrust、authentication、authorization、およびexecutionから分離されたままでなければならない（MUST）。cache designはimplementation detailである。registry protocol、discovery、registration record、lifecycle、governance、federation、およびtrust mechanismはCoreの範囲外である。

以下のSections 95.1–95.5は**informative implementation guidance**であり、mandatory registry fieldまたは新しいCore conformance gateを定義せずにrationaleおよびoperational optionを保持する。resolution ruleをsummaryするstatementはPart VIを参照する。

## 95.1 Registry Role

Semantic Registryはexact Semantic Identifierをsemantic definitionへmapする。次をcontainまたはresolveし得る。

- Capability Contract
- Profile
- PropertyおよびIdentifier type definition
- Requirement semantics
- SubjectまたはCategory vocabulary
- Extension definitionおよびconstraint semantics
- AR-XML processorが使用するその他のversioned semantic resource

Semantic RegistryはEntity Resolverとは別である。

```text
Entity Resolver
= Entity identity → AR-XML location

Semantic Registry
= Semantic Identifier → semantic definition
```

別途configured Entity Resolver ruleがmappingを定義しない限り、registryはEntity Identifierをdocument locatorとして扱ってはならない。またdefinitionを返したという理由だけでCapabilityをexecuteしたり、Credentialをsupplyしたり、publisherをauthenticateしたり、callerをauthorizeしたり、conformanceをcertifyしたりしてはならない。

## 95.2 Registration RecordおよびExact Identity

registry recordは少なくとも次をpreserveすることが望ましい。

- exact Semantic Identifier
- semantic resource kind
- versioned definitionまたはそのstable reference
- sourceおよびprovenance information
- 利用可能な場合のintegrity information
- relevantな場合のpublication、retrieval、またはcache time
- active、deprecated、withdrawnなどのlifecycle status
- definitionがusableとなるtrustまたはadmission policy

applicable specificationが明示しない限り、registry metadataはsemantic definitionの一部ではない。retrieval time、popularity、source priority、またはlifecycle statusによってContractまたはProfile meaningをsilentに変更してはならない。

normative Capability ContractおよびProfile identityはexact-versioned absolute identifierでなければならない。`latest`などのmoving aliasをdiscovery用に提供してもよいが、registryはdeterministic validation前にexact identifierをreturnまたはselectしなければならない。alias自体をnormative ContractまたはProfile identityとしてAR-XMLにstoreしてはならない。

いったんpublishedとなったexact identifier関連definitionはimmutableであることが望ましい。normative semantic changeにはnew exact identifierが必要である。transport metadata、registry indexing、またはeditorial descriptionのcorrectionがidentifierを維持できるのは、deterministic interpretationまたはconformance resultを変更し得ない場合だけである。

## 95.3 ConflictおよびMultiple Source

複数registry sourceが同じexact identifierに対するcandidateを返す場合がある。定義済みcomparison ruleの下でcandidateがsemanticallyまたはbytewise equivalentなら、registryはprovenanceをpreserveしながらcoalesceしてもよい。conflictする場合、silent first-wins、source order、document order、cache timing、またはlexical preferenceをimplicit decision ruleとして使用してはならない。

policyはsemantic resolution前にuntrusted candidateをdeterministicallyにrejectしてもよい。そのpolicy適用後、exactly one usable definitionが残る場合だけresolutionは`RESOLVED`である。それ以外は`UNRESOLVED`であり、processorはsensitive registryまたはcredential dataをexposeせずにconflicting sourceをreportすることが望ましい。

implementationはnamespaceまたはidentifier squatting、malicious re-registration、cache poisoning、rollback、downgrade、stale entry、およびsubstitutionを防御することが望ましい。適切なcontrolにはauthenticated publication、signature、content digest、append-only log、administrator approval、pinned definition、またはtrusted local packageが含まれ得る。Coreは単一のtrust mechanismをmandateしない。

## 95.4 CachingおよびOffline Operation

cachingはpermittedだが、exact identity、source、およびapplicable trust policyをpreserveしなければならない。cacheはexact identifierに対してnewer、older、またはallegedly compatibleなdefinitionでanswerしてはならない。cache invalidationおよびretention policyはdeployment concernだが、staleまたはwithdrawn statusがpolicyへ影響し得る場合はApplicationからobservableであることが望ましい。

negative cachingはboundedで、temporary failureをpermanent `UNRESOLVED` resultに変えない限り、repeated failed lookupを削減し得る。cached definitionは過去に正常にcacheされたという理由だけでtrustedになってはならない。

offline operationはfirst-class deployment modeである。conforming processorはsupportするすべてのsemanticsをbuilt-in、local、cached、またはApplication-provided sourceからresolveしてもよい。Semantic IdentifierがHTTPまたはHTTPS URI formを使用するという理由だけでnetwork accessが要求されることはない。

## 95.5 Registry ExtensibilityおよびGovernance

registryはDraft 5で定義されたもの以外のresource kindをsupportしてもよいが、unknown kindをknown kindへcoerceしてはならない。resource-kind dispatch、definition validation、およびprocessor supportはexplicitかつversionedであることが望ましい。

registry governanceはidentifier allocation、maintainer authority、review policy、immutability、deprecation、dispute handling、archival availability、およびsecurity responseを定義することが望ましい。federated registryはfederation orderをsemantic truthとして提示せず、authorityおよびprecedence ruleを可視にすることが望ましい。

Coreはexternal identifier systemまたはstandardを再実装しない。GTIN、VIN、MAC、IPv6、IMEI、OPC UA、AAS、WoT、およびその他のdomain identifierは、それぞれのspecificationによってgovernされる。registry definitionはそのようなschemeを参照してもよいが、AR-XML-specific enumの下でsilentにredefineしてはならない。

<a id="96-evolution-and-compatibility"></a>
# 96. EvolutionおよびCompatibility

evolutionはmachine readabilityおよびsemantic certaintyをpreserveしなければならない。compatibility claimはexplicitかつversionedでなければならず（MUST）、similar name、shared URI prefix、document order、successful parse、またはAI-generated comparisonからinferしてはならない（MUST NOT）。

## 96.1 Draft 5およびEarlier Draft

Draft 5は以前のAR-XML draftとのsyntax compatibilityを保証しない。wire tokenは`version="0.1"`のままであり、draft discriminatorではない。Draft 5用にconfiguredされたconsumerはDraft 5に対してvalidateしなければならず（MUST）、earlier grammarをsilentにacceptしてはならない（MUST NOT）。absentまたはunsupported root versionは、そのprocessing contextの下でinvalidである。

earlier draftからのmigrationはexplicit transformationである。migration toolは次を行うことが望ましい（SHOULD）。

- 可能な場合、source grammarの下でsource documentをvalidateする。
- source dataおよびprovenanceをpreserveする。
- dropped、synthesized、split、merged、またはsemantically uncertainなすべてのitemをreportする。
- deterministic mappingがない場合にpolicyまたはuser inputをrequireする。
- resultをDraft 5として独立してvalidateする。

migrationはambiguous legacy contentからCapability Contract、Profile conformance、authorization、Interface mapping、Canonical Entity Identity、またはcurrent Runtime stateをinferしてはならない（MUST NOT）。well-formed Draft 5 XMLを正常にproduceしてもsourceとのsemantic equivalenceを証明しない。

## 96.2 Core Grammar Evolution

exact Draft 5 version内ではCore grammarはclosedである。processorはunknown Core elementまたはattributeをcompatible additive featureとassumeしてはならない（MUST NOT）。Core element、Core attribute、cardinality、default、reference rule、validation rule、またはprocessing behaviorの追加には、明示的にdistinguishableなfuture specification versionが必要である。

deterministic parsing、validation、AR-DOM、semantic comparison、Runtime state、またはconformance requirementを変更しないeditorial correctionはdocument identityを変更せずにpublishしてもよい。これらresultのいずれかを変更し得るnormative changeにはnew version designationおよびdocumented compatibility and migration policyが必要である。

future specificationは独自のnamespaceおよびversion pairingを決定する。Draft 5 processorはSection 19で定義されたexact pairingおよびexplicit draft-selection contextを使用しなければならず（MUST）、unsupported Core versionではfail closedしなければならない（MUST）。unsupported documentをraw dataとしてexposeしたり別processorへ渡したりしてもよいが（MAY）、それに対してDraft 5 validationまたはconformanceをclaimしてはならない（MUST NOT）。

canonical serialization orderはrevision間でstableなままの場合があるが、order stabilityだけではcompatibilityではない。consumerはserializerまたはparser profileを適用する前にversionおよびvocabularyをvalidateしなければならない（MUST）。

## 96.3 Extension Evolution

各Extension specificationはversionの識別方法を定義しなければならない（MUST）。versioned namespace name、exact versioned semantic root、またはそのExtensionに適した別のdeterministic mechanismを使用してもよい。syntax、semantic interpretation、validation、mapping、constraint comparison、security behavior、またはRuntime support expectationを変更するExtension changeは、prior versionからdistinguishableでなければならない（MUST）。

unknown foreign semantic rootはcorrect Extension Slotに配置される場合Core-validのままである。これはCore-level forward carriageを提供するが、Extension-level compatibilityではない。Extensionを実装しないprocessorは、本仕様の別sectionで定義されたunknown validation、evaluation、またはsupport stateをreportする。new semanticsをguessしてはならない（MUST NOT）。

opaque preservationはcomplete foreign subtreeおよびnamespace identityを保持することが望ましい（SHOULD）。external signatureまたはbyte-preservation mechanismが要求しない限り、original prefix spelling、attribute order、quote style、またはinsignificant XML formattingのpreservationは要求しない。XML processing modelがclaimに必要なpropertyをpreserveできない場合、processorはlossless round-trippingをclaimしてはならない（MUST NOT）。

evolved Extensionはnew contentを使用してCore requirementをweakenしたり、old Core dataをreinterpretしたりしてはならない（MUST NOT）。new behaviorがExtension SlotでないCore locationを必要とする場合、appropriate future Core versionを待つかtargetにしなければならない。

## 96.4 ContractおよびProfile Evolution

Capability ContractまたはProfileのすべてのnormative revisionはnew exact-versioned Semantic Identifierを使用する。このruleはcompatibleおよびincompatibleなnormative revisionの両方に適用される。compatibility metadataは2つのexact versionを関連付けてもよいが（MAY）、identifierをinterchangeableにはしない。

Applicationはvalidation前にexplicit policyを通じて異なるContractまたはProfile versionをselectしてもよい（MAY）。その後、selected exact identifierおよびdefinitionをconsistentlyに使用しなければならない。Semantic RegistryまたはRuntimeはversionをsilentにupgrade、downgrade、またはsubstituteしてはならない（MUST NOT）。

revised Capability Contractはearlier identifierを参照するexisting Entity projectionのmeaningをretroactivelyに変更してはならない（MUST NOT）。revised Profileはearlier Profile identifierに対するconformance evaluation resultをretroactivelyに変更してはならない（MUST NOT）。deprecationはnew useに対してwarningを出してもよいが、historical semanticsを書き換えない。

Contract compatibilityはInterface compatibilityを意味しない。Profile compatibilityはRuntime Availabilityを意味しない。いずれもtrust、authorization、Certification、またはsuccessful executionを意味しない。

## 96.5 RuntimeおよびImplementation Evolution

Runtime implementationはExtension、transport、method、representation、constraint evaluator、またはregistry sourceのsupportをgainまたはloseする場合がある。このようなchangeは`Support`、evaluation certainty、およびAvailabilityへ影響するが、documentが記述するspecification capabilityを変更しない。

```text
Spec Capability
≠ Runtime Implementation Capability
```

implementationはclaimed conformance classおよびsupported Extension featureをversion化してdiscloseすることが望ましい（SHOULD）。newer implementationは自身のfeature setにmatchさせるためだけにvalid descriptionを書き換えてはならない（MUST NOT）。older implementationはknown supportを宣言したりresultを発明したりせず、定義済みstateを通じてunsupportedまたはunknown semanticsを表現しなければならない（MUST）。

ここで定義するevolution mechanismはいずれもautomatic executionをauthorizeしない。loading、migrating、resolving、validating、registry cacheのupgrading、またはExtension supportのinstallingによってCapabilityをinvokeしてはならない（MUST NOT）。side effectを伴うexecutionは引き続きexplicit ApplicationまたはHuman requestを必要とする。

## 96.6 Deferred Feature

Draft 5はRelations、Observation、Subscription、Event、Stream、workflow、generic mapping DSL、AR-XMLのJSON serialization、credential management、authorization enforcement、およびcentralized registry requirementを意図的にCoreの範囲外とする。そのabsenceはunknown Core contentとしてencodeしたり、Invocationへcontradictory semanticsをoverloadしたりする誘因ではない。

future specificationはappropriate Extension、companion specification、またはnew Core versionを通じてそのようなfeatureを定義してもよい（MAY）。EntityとLocation、CapabilityとInterfaceおよびInvocation、DescriptionとExecution、ResolutionとAuthentication、AuthenticationとAuthorization、ResultとRepresentation、ならびにProfile ClaimとVerified ConformanceおよびCertificationなど、Draft 5が依拠する分離をpreserveしなければならない（MUST）。

---
