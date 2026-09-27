// src/ports/extension.ts
/** Core の Extension Slot と、Extension 固有処理を分離する Port です。 */

import type { OpaqueExtensionElement, SupportState } from "../domain/model";

/** Draft 5 が定義する Extension Slot の識別子です。 */
export type ExtensionSlot = "property" | "requirement" | "attachment" | "realization" | "mapping" | "constraint";
/** Extension 固有検証の結果です。Core 構造検証とは別の結果として扱います。 */
export interface ExtensionValidationResult { readonly recognized: boolean; readonly supported: SupportState; readonly valid: boolean; readonly diagnostics: readonly string[]; }
/** 特定の namespace/localName/slot を処理する Extension Adapter です。 */
export interface ExtensionProcessor {
  readonly namespace: string;
  readonly localName: string;
  readonly slots: readonly ExtensionSlot[];
  validate(element: OpaqueExtensionElement, slot: ExtensionSlot): ExtensionValidationResult;
}
/** Extension processor を first-wins ではなく expanded name と slot で検索する Registry です。 */
export interface ExtensionRegistry { find(element: OpaqueExtensionElement, slot: ExtensionSlot): ExtensionProcessor | undefined; }
/** Application が登録した Extension processor の deterministic registry です。 */
export class InMemoryExtensionRegistry implements ExtensionRegistry {
  private readonly processors: readonly ExtensionProcessor[];
  public constructor(processors: readonly ExtensionProcessor[] = []) { this.processors = processors; }
  public find(element: OpaqueExtensionElement, slot: ExtensionSlot): ExtensionProcessor | undefined { return this.processors.find((item) => item.namespace === element.namespace && item.localName === element.localName && item.slots.includes(slot)); }
}
