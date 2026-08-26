// src/adapters/web/BrowserXMLParser.ts
import type { ParsedARDocument, ParsedCapability, ParsedInterface } from "../../application/parsing";
import { ParseError } from "../../domain/errors";
import type { CapabilityErrorDefinition, InputDefinition, OutputDefinition, ProfileClaim, RepresentationDefinition, RequirementDefinition } from "../../domain/model";
import type { XMLParser } from "../../ports/runtime";

/** ブラウザの DOMParser を用いて XML を中間構造へ抽出します。 */
export class BrowserXMLParser implements XMLParser {
  public parse(xml: string): ParsedARDocument {
    const document = new DOMParser().parseFromString(xml, "application/xml");
    if (document.querySelector("parsererror")) throw new ParseError("AR-XML の XML 構文が正しくありません");
    const root = document.documentElement;
    return { namespace: root.namespaceURI, rootName: root.localName, version: root.getAttribute("version"), category: textOf(child(root, "category")), profileClaims: children(child(root, "profiles"), "conforms-to").map((element): ProfileClaim => ({ href: element.getAttribute("href") ?? "" })), capabilities: children(child(root, "capabilities"), "capability").map(parseCapability) };
  }
}

function parseCapability(element: Element): ParsedCapability {
  const result = child(element, "result");
  const inputs = children(child(element, "inputs"), "input").map((item): InputDefinition => ({ name: item.getAttribute("name") ?? "", type: (item.getAttribute("type") ?? "") as InputDefinition["type"], required: item.getAttribute("required") === "true", format: optional(item, "format"), unit: optional(item, "unit") }));
  const outputs = children(child(result, "outputs"), "output").map((item): OutputDefinition => ({ name: item.getAttribute("name") ?? "", type: (item.getAttribute("type") ?? "") as OutputDefinition["type"], format: optional(item, "format"), unit: optional(item, "unit") }));
  const representations = children(child(result, "representations"), "representation").map((item): RepresentationDefinition => ({ mediaType: item.getAttribute("media-type") ?? "" }));
  const errors = children(child(result, "errors"), "error").map((item): CapabilityErrorDefinition => ({ type: item.getAttribute("type") ?? "" }));
  const requirements = children(child(element, "requirements"), "require").map((item): RequirementDefinition => ({ type: item.getAttribute("type") ?? "" }));
  const interfaces = children(child(element, "interfaces"), "interface").map((item): ParsedInterface => { const authentication = child(item, "authentication"); return { type: item.getAttribute("type") ?? "", method: optional(item, "method"), endpoint: optional(item, "endpoint"), encoding: optional(item, "encoding"), authentication: authentication ? { type: authentication.getAttribute("type") ?? "", scope: optional(authentication, "scope") } : undefined }; });
  return { id: optional(element, "id"), type: optional(element, "type"), inputs, outputs, representations, errors, requirements, interfaces, hasResult: result !== undefined };
}
function child(parent: Element | undefined, name: string): Element | undefined { return children(parent, name)[0]; }
function children(parent: Element | undefined, name: string): Element[] { return parent ? Array.from(parent.children).filter((element) => element.localName === name) : []; }
function optional(element: Element, attribute: string): string | undefined { return element.getAttribute(attribute) ?? undefined; }
function textOf(element: Element | undefined): string | undefined { const text = element?.textContent?.trim(); return text || undefined; }
