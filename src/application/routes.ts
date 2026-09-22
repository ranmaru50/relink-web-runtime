// src/application/routes.ts
/** Draft 5 の InterfaceUse を document order に依存せず識別する route handle を生成します。 */

import type { InterfaceUse, OpaqueExtensionElement } from "../domain/model";

/** Capability と InterfaceUse の意味内容から、実行対象を一意に指定する handle を作ります。 */
export function routeHandleFor(capabilityId: string, use: InterfaceUse, allUses: readonly InterfaceUse[]): string {
  const signature = routeSignature(use);
  const occurrence = allUses.slice(0, allUses.indexOf(use)).filter((candidate) => routeSignature(candidate) === signature).length + 1;
  return `route:${encodeURIComponent(capabilityId)}:${encodeURIComponent(use.ref)}:${stableHash(signature)}:${occurrence}`;
}

/** Mapping の expanded name と内容だけを canonical な route 識別材料へ変換します。 */
function routeSignature(use: InterfaceUse): string {
  return `${use.ref}|${opaqueSignature(use.mapping?.extension)}`;
}

function opaqueSignature(element: OpaqueExtensionElement | undefined): string {
  if (!element) return "";
  const attributes = [...element.attributes].sort((left, right) => `${left.namespace}:${left.localName}:${left.value}`.localeCompare(`${right.namespace}:${right.localName}:${right.value}`));
  return `${element.namespace}:${element.localName}[${attributes.map((item) => `${item.namespace}:${item.localName}=${item.value}`).join(";")}](${element.children.map(opaqueSignature).join("|")})${element.text ?? ""}`;
}

function stableHash(value: string): string {
  let hash = 2166136261;
  for (const character of value) hash = Math.imul(hash ^ character.codePointAt(0)!, 16777619);
  return (hash >>> 0).toString(16).padStart(8, "0");
}
