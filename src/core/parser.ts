// src/core/parser.ts
import { ARActionElement, ARButtonElement, ARDocument, AREventBinding, ARTextElement } from "../dom/ARDocument";
import { ARXMLParseError, ARXMLValidationError } from "../errors/errors";

/** AR-XML の最小サブセットを AR-DOM へ変換します。 */
export function parseARXML(xml: string): ARDocument {
  const parsed = new DOMParser().parseFromString(xml, "application/xml");
  if (parsed.querySelector("parsererror")) throw new ARXMLParseError("AR-XML の形式が正しくありません");
  const root = parsed.documentElement;
  if (root.localName !== "ar-content") throw new ARXMLValidationError("ar-content 要素が必要です");
  const document = new ARDocument();
  const outputs = root.querySelector(":scope > outputs");
  if (outputs) {
    for (const element of Array.from(outputs.children)) {
      const id = element.getAttribute("id");
      if (element.localName === "text") document.addOutput(new ARTextElement(required(id, "text", "id"), element.textContent?.trim() ?? ""));
      if (element.localName === "button") document.addOutput(new ARButtonElement(required(id, "button", "id"), element.textContent?.trim() ?? ""));
    }
  }
  const actions = root.querySelector(":scope > actions");
  if (actions) for (const element of Array.from(actions.children)) {
    if (element.localName !== "action") continue;
    const type = required(element.getAttribute("type"), "action", "type");
    const method = required(element.getAttribute("method"), "action", "method").toUpperCase();
    if (type !== "http" || (method !== "GET" && method !== "POST")) throw new ARXMLValidationError("action の type または method が未対応です");
    const endpoint = required(element.getAttribute("endpoint"), "action", "endpoint");
    document.addAction(new ARActionElement(required(element.getAttribute("id"), "action", "id"), type, method, endpoint));
  }
  const events = root.querySelector(":scope > events");
  if (events) for (const element of Array.from(events.children)) {
    if (element.localName !== "event") continue;
    if (required(element.getAttribute("on"), "event", "on") !== "click") throw new ARXMLValidationError("click 以外の event は未対応です");
    const targetId = required(element.getAttribute("target"), "event", "target");
    const actionId = required(element.getAttribute("action"), "event", "action");
    document.addEventBinding(new AREventBinding(
      targetId, actionId,
      element.getAttribute("success-target") ?? undefined, element.getAttribute("success-text") ?? undefined,
      element.getAttribute("error-target") ?? undefined, element.getAttribute("error-text") ?? undefined,
    ));
  }
  for (const binding of document.eventBindings) {
    if (!(document.getElementById(binding.targetId) instanceof ARButtonElement)) throw new ARXMLValidationError("event target は button 要素である必要があります");
    if (!(document.getElementById(binding.actionId) instanceof ARActionElement)) throw new ARXMLValidationError("event action が見つかりません");
    validateTextTarget(document, binding.successTargetId, "success-target");
    validateTextTarget(document, binding.errorTargetId, "error-target");
  }
  return document;
}

function required(value: string | null, element: string, attribute: string): string {
  if (!value) throw new ARXMLValidationError(`${element} 要素には ${attribute} 属性が必要です`);
  return value;
}

function validateTextTarget(document: ARDocument, targetId: string | undefined, attribute: string): void {
  if (targetId && !(document.getElementById(targetId) instanceof ARTextElement)) throw new ARXMLValidationError(`event ${attribute} は text 要素である必要があります`);
}
