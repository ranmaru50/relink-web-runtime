// src/adapters/web/BrowserXMLParser.ts
/** ブラウザ DOMParser を XML の namespace-aware 中間表現へ接続する Adapter です。 */

import type { ParsedARDocument, ParsedAttribute, ParsedElement } from "../../application/parsing";
import { ParseError } from "../../domain/errors";
import type { XMLParser } from "../../ports/runtime";

/** XML 構文だけを解析し、意味解決・認証・実行を一切行いません。 */
export class BrowserXMLParser implements XMLParser {
  public parse(xml: string): ParsedARDocument {
    const document = new DOMParser().parseFromString(xml, "application/xml");
    if (document.querySelector("parsererror")) throw new ParseError("AR-XML の XML 構文が正しくありません");
    const root = document.documentElement;
    if (!root) throw new ParseError("AR-XML の root element がありません");
    const parsedRoot = parseElement(root);
    return { root: parsedRoot, namespace: parsedRoot.namespace, rootName: parsedRoot.localName, version: attribute(parsedRoot, "", "version") };
  }
}

/** DOM Element を Core validator が利用できる不変の中間構造へ変換します。 */
function parseElement(element: Element): ParsedElement {
  const children = Array.from(element.children, parseElement);
  const directText = Array.from(element.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE || node.nodeType === Node.CDATA_SECTION_NODE).map((node) => node.nodeValue ?? "").join("");
  const attributes: ParsedAttribute[] = [];
  for (const item of Array.from(element.attributes)) {
    if (item.namespaceURI === "http://www.w3.org/2000/xmlns/") continue;
    attributes.push({ namespace: item.namespaceURI ?? "", localName: item.localName, value: item.value });
  }
  return { namespace: element.namespaceURI ?? "", localName: element.localName, attributes, children, text: directText };
}

/** 中間要素から namespace-aware attribute を取得します。 */
function attribute(element: ParsedElement, namespace: string, localName: string): string | undefined {
  return element.attributes.find((item) => item.namespace === namespace && item.localName === localName)?.value;
}
