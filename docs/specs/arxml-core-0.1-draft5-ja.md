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
