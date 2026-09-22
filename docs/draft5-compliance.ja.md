# AR-XML Core 0.1 Draft 5 適合チェックリスト

**確認日:** 2026-09-23  
**ブランチ:** `codex/issue-12-draft5-runtime`  
**規範仕様:** [`docs/specs/arxml-core-0.1-draft5.md`](specs/arxml-core-0.1-draft5.md)

## 目的と証跡

このチェックリストは、現在の Runtime が Draft 5 のどの要件を実装済みか、どの要件が部分対応か、どの要件に作業が残っているかを記録するものです。作業ドラフト全体への完全適合を宣言するものではありません。

主な自動検証の証跡は次のとおりです。

- `tests/draft5-runtime.test.ts`: Draft 5 固有の Core、Extension、評価、Profile、HTTP の振る舞い。
- `tests/document-loading.test.ts`、`tests/runtime.test.ts`、`tests/distribution.test.ts`、`tests/harness.test.ts`: 既存の公開 Runtime API の回帰検証。
- 直近の結果: 5 テストファイル成功、54 テスト成功。

状態の意味:

- **PASS** — 対応するベースラインを実装し、焦点を絞った自動検証がある。
- **PARTIAL** — 有用なベースラインはあるが、規範範囲全体または専用テストが不足している。
- **GAP** — 未実装、または実行可能なテストで未確認。

## チェックリスト

| ID | Draft 5 章 | 要件領域 | 状態 | 実装・テスト証跡 / 残課題 |
|---|---|---|---|---|
| D5-01 | 4–8, 81–82 | Entity は空、受動的、Properties-only でよく、ロードは実行を意味しない。 | **PASS** | `ARDocument` がこれらを受け付ける。`empty/passive/Properties-only Entity` と `load では HTTP を呼び出さない` で確認済み。 |
| D5-02 | 7, 14–18 | Capability、Interface、InterfaceUse、Invocation、Result、Representation を別概念として扱う。 | **PASS** | 別々のドメイン型・パーサーを使用。Attachment-only Interface と Invocation なし Capability をテスト済み。 |
| D5-03 | 9–13 | Category、Identifier、Property、Subject、Profile Claim を Core フィールドとして表現する。 | **PARTIAL** | Category、Identifier、Property、Subject の解析・検証はある。Profile Claim の各規則を網羅する専用の正常系・異常系テストは未追加。 |
| D5-04 | 19–21 | Core namespace/version/root と順序に依存しない Core コンテナを検証する。 | **PARTIAL** | namespace、version、root、閉じた child grammar、singleton 検査はある。全順列の組合せと Appendix B の全 cardinality は未網羅。 |
| D5-05 | 22–30 | Core XML の属性、必須項目、空要素制約、シリアライズ規則を検証する。 | **PARTIAL** | 主要モデルを検証し、未知 Core 属性・child を拒否する。章ごとの完全な serialization fixture は未整備。 |
| D5-06 | 23, 26, 29, 50–51, 58 | typed local ID、厳密な ref、exact-versioned Contract/Profile identifier、重複 ID を検査する。 | **PASS** | typed ID 重複、dangling ref、exact identifier、`latest` 拒否を検証と registry テストで確認済み。 |
| D5-07 | 11, 24, 60 | foreign metadata と許可された opaque Extension を Core の意味を変えずに保持する。 | **PARTIAL** | foreign attribute と property Extension root を opaque に保持する。lossless serializer がないため round-trip 保持は未証明。 |
| D5-08 | 31–36, 59 | Extension Slot を明示し、未知 foreign element は許可 Slot 内だけ Core-valid とする。 | **PASS** | Attachment、Realization、Requirement、Mapping の未知 Extension を各 Slot で保持。Slot 外の不正 foreign child は拒否。 |
| D5-09 | 32, 36, 79 | Extension 処理を Core 検証から分離し、未対応意味論を報告できる。 | **PARTIAL** | `ExtensionRegistry` と opaque モデルがあり、HTTP 対応も分離。任意 Extension を Runtime 評価へ接続する部分は未実装。 |
| D5-10 | 33–35 | Attachment、Realization、Mapping の Slot 意味論を分け、Core を再定義しない。 | **PASS** | Slot ごとの解析・評価を分離。Attachment-only route を実行可能な HTTP route として扱わない。 |
| D5-11 | 37–41, 62–63 | Contract 解決は exact identity を使い、未解決・競合を first-wins にせず Projection 状態と分ける。 | **PASS** | exact registry 解決、重複定義の競合、`CONFLICT`、`UNVALIDATED` をテスト済み。 |
| D5-12 | 39–40 | Entity 側 Capability projection と Contract の input/output、型、required、format、unit、Result 有無を比較する。 | **PARTIAL** | Representation 比較、Requirement の考慮、constraint を安全に `UNVALIDATED` とする処理を追加。Requirement compatibility、narrowing、Contract 定義不備の個別報告は未実装。 |
| D5-13 | 42–49, 68 | Profile identity と Capability/Property/Identifier/Interface 必須要件を Runtime availability と分けて評価する。 | **PARTIAL** | 公開 `RuntimeDocument.evaluateProfile()` を文書全体 evaluator へ統合し、Invocation/Output の証拠不足を `UNDETERMINED` とする処理を追加。candidate 集約、optional、subject scope、claim、narrowing、Extension policy は未完成。 |
| D5-14 | 50–55 | Semantic identifier は exact code-point identity とし、解決を Entity loading から分離する。 | **PARTIAL** | exact registry lookup と競合は実装済み。Registry source、定義検証、全 resolution source/error state は未実装。 |
| D5-15 | 56–60 | Core validity、Extension validity、preservation、exposure を別層で処理する。 | **PARTIAL** | Core 検証と HTTP Extension 検証を Contract/Profile 評価から分離。分類済み error/result API の全体設計は残課題。 |
| D5-16 | 61, 69–70 | Description data と可変 Runtime state を分離し、availability を authorization/execution と混同しない。 | **PASS** | Runtime 評価を別計算し、load 中の Capability 実行なし。HTTP 失敗も Core invalidity ではなく Interface error として報告。 |
| D5-17 | 64–67 | Requirement、Support、route 評価、availability 集約を明示的な状態で扱う。 | **PARTIAL** | Capability、Contract、Interface の Requirement を合成し、証拠なしでは `UNKNOWN` として false `READY` を防止。差分を埋める evidence provider と既知の `UNSATISFIED` 経路は未実装。 |
| D5-18 | 66–67, 70 | 複数 InterfaceUse を document order の可用性優先なしに評価し、実行時は明示的に route を選ぶ。 | **PARTIAL** | 安定した `routeId`、曖昧選択の拒否、明示選択、自動 retry なしを実装・テスト。handle 以外の caller 選択 policy は残る。 |
| D5-19 | 71–73 | HTTP を Extension とし、`http:api`/`http:operation` の namespace、属性、method、path を厳密検証する。 | **PASS** | HTTP root、未知属性・child、method token、relative path、URI syntax、fragment 除去を検証。 |
| D5-20 | 72–73 | HTTP base/path 解決を RFC 3986 と最終 retrieval URL に従わせ、operation path の scheme/authority 変更を拒否する。 | **PARTIAL** | relative base、既存 query、fragment 除去、不正 URI 文字、absolute operation 拒否、Invocation redirect の fail-closed を確認。encoded dot segment と redirect 後の最終 URL 統合は未テスト。 |
| D5-21 | 74 | scalar GET query と JSON POST/PUT/PATCH body、input/type 検証をベースラインとして扱う。 | **PASS** | GET query/衝突、scalar 検証、JSON method、required input、binary JSON 拒否を実装・テスト。全 wire-equivalent serialization は対象外。 |
| D5-22 | 75 | 成功・非成功 status、JSON Content-Type、malformed JSON、missing output、型不一致、204 を区別する。 | **PASS** | malformed JSON、missing Output、wrong Content-Type、Result あり/なし 204、型 mapping、non-2xx を専用テスト済み。 |
| D5-23 | 76–80 | Producer、Consumer、Extension、Runtime、Profile Evaluator の適合クラスを独立に示す。 | **PARTIAL** | Core/Extension/evaluation モジュールと回帰テストは分離。正式な conformance-class harness と producer/consumer fixture は未整備。 |
| D5-24 | 81–91 | 規範例と issue の参照シナリオを executable regression fixture とする。 | **PARTIAL** | empty、Properties-only、Attachment-only、no-Invocation、shared HTTP、multiple-use、unknown Extension をテストに反映。全 reference lab 例と専用 fixture ファイルは未網羅。 |
| D5-25 | 92–96, Appendix C–E | Security/privacy、namespace evolution、registry、compatibility、error category、Draft 4→5 移行を文書・テストで扱う。 | **PARTIAL** | same-origin default、Invocation redirect fail-closed、load-time side effect なし、Draft 4 compatibility、層別 error、必須 GitHub Actions CI workflow を追加。完全な security suite、namespace evolution matrix、Appendix C/D/E harness は未実装。 |

## 明示的な対象外

AI 推論、credential の発行・保存・更新、authorization 判断、汎用 mapping DSL、必須の中央集権 registry、AR-XML の JSON serialization、HTTP 以外の transport protocol は、Draft 5 Core のベースライン対象外です。Issue #12 の未実装項目としては数えていません。

## 次の実装優先順位

1. 全 Core container と Appendix B の各行を対象にした order/cardinality fixture を追加する。
2. round-trip serializer を追加するか、lossless preservation の制約を公開 API に明示する。
3. Contract/Profile 定義検証と、unresolved/defective/conflicting source state を完成させる。
4. Extension processor と requirement evidence provider を Runtime 評価へ接続する。
5. encoded dot segment と redirect 後の最終 retrieval URL を含む RFC 3986 fixture を追加する。
6. 規範例と二つの reference lab scenario の conformance-class fixture を追加する。
