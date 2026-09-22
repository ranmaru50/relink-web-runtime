// src/application/parsing.ts
/** XML Adapter と Draft 5 validator の間で受け渡す DOM 非依存の中間モデルです。 */

import type { OpaqueExtensionAttribute, OpaqueExtensionElement } from "../domain/model";

/** XML 属性の展開名付き中間表現です。namespace は空文字を unqualified とします。 */
export interface ParsedAttribute extends OpaqueExtensionAttribute {}
/** XML 要素を namespace-aware に保持する中間表現です。 */
export interface ParsedElement {
  readonly namespace: string;
  readonly localName: string;
  readonly attributes: readonly ParsedAttribute[];
  readonly children: readonly ParsedElement[];
  readonly text: string;
}
/** XML parser が返す Draft 5 の中間文書です。 */
export interface ParsedARDocument {
  readonly root: ParsedElement;
  /** Draft 4 adapter injection を段階移行するための legacy optional fields です。 */
  readonly namespace?: string | null;
  readonly rootName?: string;
  readonly version?: string | null;
}
/** 旧 parser 実装との互換用です。新規 parser は ParsedElement を返します。 */
export interface ParsedInterface { readonly type: string; readonly method?: string; readonly endpoint?: string; readonly encoding?: string; readonly authentication?: { readonly type: string; readonly scope?: string }; }
/** 旧 validation adapter との互換用の最小型です。 */
export interface ParsedCapability { readonly id?: string; readonly type?: string; readonly inputs: readonly never[]; readonly outputs: readonly never[]; readonly representations: readonly never[]; readonly errors: readonly never[]; readonly requirements: readonly never[]; readonly interfaces: readonly ParsedInterface[]; readonly hasResult: boolean; }

/** 中間要素を opaque Extension element に変換します。 */
export function toOpaqueExtension(element: ParsedElement): OpaqueExtensionElement {
  const text = element.text.trim();
  return {
    namespace: element.namespace,
    localName: element.localName,
    attributes: element.attributes.map((attribute) => ({ namespace: attribute.namespace, localName: attribute.localName, value: attribute.value })),
    children: element.children.map(toOpaqueExtension),
    ...(text.length > 0 ? { text } : {}),
  };
}
