// src/application/validation.ts
/** Draft 5 Core の閉じた XML 文法、参照、型、Extension Slot envelope を検証します。 */

import type { ParsedARDocument, ParsedElement } from "./parsing";
import { toOpaqueExtension } from "./parsing";
import { ValidationError } from "../domain/errors";
import type { ARDocument, ARDocumentFormat, Capability, CoreDataType, ForeignMetadataAttribute, Identifier, InputDefinition, InterfaceDefinition, InterfaceUse, InvocationDefinition, OpaqueExtensionElement, OutputDefinition, ProfileClaim, Property, RepresentationDefinition, RequirementDefinition, ResultDefinition, Subject } from "../domain/model";

/** AR-XML Core 0.1 Draft 5 の namespace です。 */
export const ARXML_CORE_NAMESPACE = "https://relink.dev/ns/arxml/core/0.1";
/** Core が定義するデータ型の集合です。 */
const CORE_TYPES: readonly CoreDataType[] = ["string", "number", "integer", "boolean", "binary", "object", "array"];
const XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
/** Draft 4 compatibility を暗黙に有効化しないための build option です。 */
export interface ARDocumentBuildOptions { readonly format?: ARDocumentFormat; }

/** 中間構造を検証し、Runtime 状態を含まない Draft 5 AR-DOM を構築します。 */
export function buildARDocument(parsed: ParsedARDocument, url: string, options: ARDocumentBuildOptions = {}): ARDocument {
  const root = parsed.root;
  if (!root || root.localName !== "ar-entity" || root.namespace !== ARXML_CORE_NAMESPACE) throw new ValidationError("Draft 5 の ar-entity root が必要です");
  requireAttributes(root, ["version"]);
  if (attribute(root, "version") !== "0.1") throw new ValidationError("version 属性には 0.1 が必要です");
  rejectText(root, "ar-entity");

  const containers = singletonChildren(root, ["category", "identifiers", "properties", "subjects", "profiles", "interfaces", "capabilities"]);
  const categoryElement = containers.get("category");
  const category = categoryElement ? requiredText(categoryElement, "category") : undefined;
  const identifiers = parseIdentifiers(containers.get("identifiers"));
  const subjects = parseSubjects(containers.get("subjects"));
  const subjectIds = uniqueIds(subjects.map((item) => item.id), "Subject");
  const propertyResult = parseProperties(containers.get("properties"));
  const profileClaims = parseProfiles(containers.get("profiles"));
  const interfaces = parseInterfaces(containers.get("interfaces"));
  const interfaceIds = uniqueIds(interfaces.map((item) => item.id), "Interface");
  const capabilities = parseCapabilities(containers.get("capabilities"), options.format === "draft4");
  const capabilityIds = uniqueIds(capabilities.map((item) => item.localId), "Capability");

  for (const identifier of identifiers) if (identifier.subjectRef && !subjectIds.has(identifier.subjectRef)) throw new ValidationError(`Identifier の subject-ref が解決できません: ${identifier.subjectRef}`);
  for (const capability of capabilities) {
    if (capability.subjectRef && !subjectIds.has(capability.subjectRef)) throw new ValidationError(`Capability の subject-ref が解決できません: ${capability.subjectRef}`);
    for (const use of capability.interfaceUses) if (!interfaceIds.has(use.ref)) throw new ValidationError(`InterfaceUse の ref が解決できません: ${use.ref}`);
  }
  void capabilityIds;
  return { url, ...(category ? { category } : {}), metadata: foreignAttributes(root), identifiers, properties: propertyResult.properties, propertyExtensions: propertyResult.extensions, subjects, profileClaims, interfaces, capabilities };
}

/** Root 直下の Core container を取得し、未知要素・重複 singleton を拒否します。 */
function singletonChildren(parent: ParsedElement, allowed: readonly string[]): Map<string, ParsedElement> {
  const result = new Map<string, ParsedElement>();
  for (const child of parent.children) {
    requireCoreElement(child);
    if (!allowed.includes(child.localName)) throw new ValidationError(`未知の Core 要素です: ${child.localName}`);
    if (result.has(child.localName)) throw new ValidationError(`Core container が重複しています: ${child.localName}`);
    result.set(child.localName, child);
  }
  return result;
}

function parseIdentifiers(container: ParsedElement | undefined): Identifier[] {
  if (!container) return [];
  requireAttributes(container, []);
  rejectText(container, "identifiers");
  return container.children.map((element) => {
    requireCoreElement(element, "identifier"); requireAttributes(element, ["type", "value", "subject-ref"]); rejectLeaf(element, "identifier");
    const type = nonEmpty(attribute(element, "type"), "identifier/@type"); const value = nonEmpty(attribute(element, "value"), "identifier/@value");
    return { type, value, ...(attribute(element, "subject-ref") ? { subjectRef: attribute(element, "subject-ref") } : {}), metadata: foreignAttributes(element) };
  });
}

function parseProperties(container: ParsedElement | undefined): { readonly properties: Property[]; readonly extensions: OpaqueExtensionElement[] } {
  if (!container) return { properties: [], extensions: [] };
  requireAttributes(container, []); rejectText(container, "properties");
  const extensions: OpaqueExtensionElement[] = [];
  const properties: Property[] = [];
  for (const element of container.children) {
    if (element.namespace !== ARXML_CORE_NAMESPACE) { extensions.push(toOpaqueExtension(element)); continue; }
    requireCoreElement(element, "property"); requireAttributes(element, ["type", "value", "unit"]); rejectLeaf(element, "property");
    const propertyExtensions = element.children.map((child) => foreignExtension(child, "property"));
    properties.push({ type: nonEmpty(attribute(element, "type"), "property/@type"), value: nonEmpty(attribute(element, "value"), "property/@value"), ...(attribute(element, "unit") ? { unit: attribute(element, "unit") } : {}), ...(propertyExtensions.length > 0 ? { extensions: propertyExtensions } : {}), metadata: foreignAttributes(element) });
  }
  return { properties, extensions };
}

function parseSubjects(container: ParsedElement | undefined): Subject[] {
  if (!container) return [];
  requireAttributes(container, []); rejectText(container, "subjects");
  return container.children.map((element) => { requireCoreElement(element, "subject"); requireAttributes(element, ["id", "type"]); rejectLeaf(element, "subject"); return { id: nonEmpty(attribute(element, "id"), "subject/@id"), ...(attribute(element, "type") ? { type: attribute(element, "type") } : {}), metadata: foreignAttributes(element) }; });
}

function parseProfiles(container: ParsedElement | undefined): ProfileClaim[] {
  if (!container) return [];
  requireAttributes(container, []); rejectText(container, "profiles");
  return container.children.map((element) => { requireCoreElement(element, "conforms-to"); requireAttributes(element, ["href"]); rejectLeaf(element, "conforms-to"); const href = absoluteVersionedIdentifier(attribute(element, "href"), "conforms-to/@href"); return { href, metadata: foreignAttributes(element) }; });
}

function parseInterfaces(container: ParsedElement | undefined): InterfaceDefinition[] {
  if (!container) return [];
  requireAttributes(container, []); rejectText(container, "interfaces");
  return container.children.map((element) => {
    requireCoreElement(element, "interface"); requireAttributes(element, ["id"]); rejectText(element, "interface");
    const children = singletonChildren(element, ["attachment", "realization", "requirements"]);
    const attachment = children.get("attachment"); const realization = children.get("realization");
    if (!attachment && !realization) throw new ValidationError("Interface には attachment または realization が必要です");
    const result: InterfaceDefinition = { id: nonEmpty(attribute(element, "id"), "interface/@id"), ...(attachment ? { attachment: { extension: singleExtension(attachment, "attachment") } } : {}), ...(realization ? { realization: { extension: singleExtension(realization, "realization") } } : {}), requirements: parseRequirements(children.get("requirements")), metadata: foreignAttributes(element) };
    return result;
  });
}

function parseCapabilities(container: ParsedElement | undefined, allowDraft4: boolean): Capability[] {
  if (!container) return [];
  requireAttributes(container, []); rejectText(container, "capabilities");
  return container.children.map((element) => {
    requireCoreElement(element, "capability"); requireAttributes(element, ["id", "type", "subject-ref"]); rejectText(element, "capability");
    if (element.children.some((child) => child.namespace === ARXML_CORE_NAMESPACE && ["inputs", "result", "interfaces"].includes(child.localName))) {
      if (!allowDraft4) throw new ValidationError("Draft 4 Capability grammar は明示的な format=draft4 でのみ受理できます");
      return parseLegacyCapability(element);
    }
    const children = singletonChildren(element, ["requirements", "invocation", "interface-uses"]);
    const invocation = parseInvocation(children.get("invocation"));
    const result: Capability = { localId: nonEmpty(attribute(element, "id"), "capability/@id"), semanticType: absoluteVersionedIdentifier(attribute(element, "type"), "capability/@type"), ...(attribute(element, "subject-ref") ? { subjectRef: attribute(element, "subject-ref") } : {}), requirements: parseRequirements(children.get("requirements")), ...(invocation ? { invocation } : {}), interfaceUses: parseInterfaceUses(children.get("interface-uses")), metadata: foreignAttributes(element) };
    return result;
  });
}

/** Draft 4 形式を既存 consumer の移行用に限定して AR-DOM へ変換します。 */
function parseLegacyCapability(element: ParsedElement): Capability {
  requireAttributes(element, ["id", "type"]);
  const inputsElement = element.children.find((child) => child.namespace === ARXML_CORE_NAMESPACE && child.localName === "inputs");
  const resultElement = element.children.find((child) => child.namespace === ARXML_CORE_NAMESPACE && child.localName === "result");
  const interfacesElement = element.children.find((child) => child.namespace === ARXML_CORE_NAMESPACE && child.localName === "interfaces");
  const inputs = inputsElement ? parseLegacyInputs(inputsElement) : [];
  const result = resultElement ? parseLegacyResult(resultElement) : undefined;
  const legacyInterfaces = interfacesElement ? parseLegacyInterfaces(interfacesElement) : [];
  const localId = nonEmpty(attribute(element, "id"), "capability/@id");
  const semanticType = absoluteVersionedIdentifier(attribute(element, "type"), "capability/@type");
  return { localId, semanticType, inputs, result, interfaces: legacyInterfaces, requirements: [], invocation: { inputs, ...(result ? { result } : {}) }, interfaceUses: [], legacyDraft4: true, contractResolution: "UNRESOLVED", projectionValidation: "UNVALIDATED", availability: "READY", metadata: foreignAttributes(element) };
}

function parseLegacyInputs(container: ParsedElement): InputDefinition[] { requireAttributes(container, []); rejectText(container, "inputs"); return container.children.map((item) => parseInputOutput(item, true) as InputDefinition); }
function parseLegacyResult(element: ParsedElement): ResultDefinition { requireAttributes(element, []); rejectText(element, "result"); const outputs = element.children.find((child) => child.localName === "outputs"); if (!outputs) throw new ValidationError("result には outputs が必要です"); requireAttributes(outputs, []); rejectText(outputs, "outputs"); const representations = element.children.find((child) => child.localName === "representations"); return { outputs: outputs.children.map((item) => parseInputOutput(item, false) as OutputDefinition), representations: representations ? parseRepresentations(representations) : [] }; }
function parseLegacyInterfaces(container: ParsedElement): import("../domain/model").LegacyHTTPInterfaceDefinition[] { requireAttributes(container, []); rejectText(container, "interfaces"); return container.children.map((element) => { requireCoreElement(element, "interface"); requireAttributes(element, ["type", "method", "endpoint", "encoding"]); rejectLeaf(element, "interface"); const type = attribute(element, "type"); const method = attribute(element, "method"); if (type !== "http" || (method !== "GET" && method !== "POST")) throw new ValidationError("Draft 4 HTTP Interface が不正です"); const endpoint = nonEmpty(attribute(element, "endpoint"), "interface/@endpoint"); const encoding = attribute(element, "encoding"); if (encoding !== undefined && encoding !== "json") throw new ValidationError("interface/@encoding が不正です"); return { type: "http", method, endpoint, ...(encoding ? { encoding } : {}) }; }); }

function parseInvocation(element: ParsedElement | undefined): InvocationDefinition | undefined {
  if (!element) return undefined;
  requireAttributes(element, []); rejectText(element, "invocation");
  const children = singletonChildren(element, ["inputs", "result"]);
  const inputsContainer = children.get("inputs");
  let inputs: InputDefinition[] = [];
  if (inputsContainer) { requireAttributes(inputsContainer, []); rejectText(inputsContainer, "inputs"); inputs = inputsContainer.children.map((item) => parseInputOutput(item, true) as InputDefinition); validateUniqueNames(inputs, "input"); }
  const resultElement = children.get("result");
  const result = resultElement ? parseResult(resultElement) : undefined;
  return { inputs, ...(result ? { result } : {}), metadata: foreignAttributes(element) };
}

function parseResult(element: ParsedElement): ResultDefinition {
  requireAttributes(element, []); rejectText(element, "result");
  const children = singletonChildren(element, ["outputs", "representations"]);
  const outputsElement = children.get("outputs");
  if (!outputsElement) throw new ValidationError("result には outputs が必要です");
  requireAttributes(outputsElement, []); rejectText(outputsElement, "outputs");
  const outputs = outputsElement.children.map((item) => parseInputOutput(item, false) as OutputDefinition);
  validateUniqueNames(outputs, "output");
  if (outputs.length === 0) throw new ValidationError("result の outputs は1件以上必要です");
  const representationsElement = children.get("representations");
  const representations = representationsElement ? parseRepresentations(representationsElement) : [];
  return { outputs, representations };
}

function parseRepresentations(container: ParsedElement): RepresentationDefinition[] {
  requireAttributes(container, []); rejectText(container, "representations");
  return container.children.map((element) => { requireCoreElement(element, "representation"); requireAttributes(element, ["media-type"]); rejectLeaf(element, "representation"); const mediaType = nonEmpty(attribute(element, "media-type"), "representation/@media-type"); if (!isMediaType(mediaType)) throw new ValidationError("representation media-type が不正です"); return { mediaType, metadata: foreignAttributes(element) }; });
}

function parseInputOutput(element: ParsedElement, input: true): InputDefinition;
function parseInputOutput(element: ParsedElement, input: false): OutputDefinition;
function parseInputOutput(element: ParsedElement, input: boolean): InputDefinition | OutputDefinition {
  requireCoreElement(element, input ? "input" : "output"); requireAttributes(element, input ? ["name", "type", "required", "format", "unit"] : ["name", "type", "format", "unit"]); rejectText(element, input ? "input" : "output");
  const constraints = optionalConstraints(element);
  for (const child of element.children) if (child.namespace !== ARXML_CORE_NAMESPACE || child.localName !== "constraints") throw new ValidationError(`${input ? "input" : "output"} の未知の子要素です: ${child.localName}`);
  const name = nonEmpty(attribute(element, "name"), `${input ? "input" : "output"}/@name`); const type = attribute(element, "type");
  if (!type || !CORE_TYPES.includes(type as CoreDataType)) throw new ValidationError(`${input ? "input" : "output"} type が未定義です: ${type ?? ""}`);
  const common = { name, type: type as CoreDataType, ...(attribute(element, "format") ? { format: attribute(element, "format") } : {}), ...(attribute(element, "unit") ? { unit: attribute(element, "unit") } : {}), ...(constraints.length > 0 ? { constraints } : {}), metadata: foreignAttributes(element) };
  if (!input) return common;
  const requiredValue = attribute(element, "required");
  if (requiredValue !== undefined && requiredValue !== "true" && requiredValue !== "false") throw new ValidationError("input/@required は true または false である必要があります");
  return { ...common, required: requiredValue !== "false" };
}

function parseRequirements(container: ParsedElement | undefined): RequirementDefinition[] {
  if (!container) return [];
  requireAttributes(container, []); rejectText(container, "requirements");
  return container.children.map((element) => { requireCoreElement(element, "requirement"); requireAttributes(element, ["type"]); const extensions = element.children.map((child) => foreignExtension(child, "requirement")); rejectText(element, "requirement"); return { type: nonEmpty(attribute(element, "type"), "requirement/@type"), extensions, metadata: foreignAttributes(element) }; });
}

function parseInterfaceUses(container: ParsedElement | undefined): InterfaceUse[] {
  if (!container) return [];
  requireAttributes(container, []); rejectText(container, "interface-uses");
  return container.children.map((element) => { requireCoreElement(element, "interface-use"); requireAttributes(element, ["ref"]); rejectText(element, "interface-use"); const children = singletonChildren(element, ["mapping"]); const mapping = children.get("mapping"); return { ref: nonEmpty(attribute(element, "ref"), "interface-use/@ref"), ...(mapping ? { mapping: { extension: singleExtension(mapping, "mapping") } } : {}), metadata: foreignAttributes(element) }; });
}

/** Core wrapper 内の exactly-one foreign root を opaque に保持します。 */
function singleExtension(wrapper: ParsedElement, slot: string): OpaqueExtensionElement {
  requireAttributes(wrapper, []); rejectText(wrapper, slot); if (wrapper.children.length !== 1) throw new ValidationError(`${slot} には foreign Extension root が1つ必要です`); return foreignExtension(wrapper.children[0], slot);
}
/** Extension slot の foreign namespace envelope を検証します。 */
function foreignExtension(element: ParsedElement, slot: string): OpaqueExtensionElement { if (element.namespace === ARXML_CORE_NAMESPACE || element.namespace.length === 0) throw new ValidationError(`${slot} には foreign namespaced Extension が必要です`); return toOpaqueExtension(element); }
function optionalConstraints(element: ParsedElement): OpaqueExtensionElement[] { const constraints = element.children.filter((item) => item.namespace === ARXML_CORE_NAMESPACE && item.localName === "constraints"); if (constraints.length > 1) throw new ValidationError("constraints wrapper が重複しています"); const wrapper = constraints[0]; if (!wrapper) return []; requireAttributes(wrapper, []); rejectText(wrapper, "constraints"); return wrapper.children.map((child) => foreignExtension(child, "constraints")); }

function requireCoreElement(element: ParsedElement, expected?: string): void { if (element.namespace !== ARXML_CORE_NAMESPACE || (expected && element.localName !== expected)) throw new ValidationError(`Core 要素が不正です: ${element.localName}`); }
function requireAttributes(element: ParsedElement, allowed: readonly string[]): void { for (const item of element.attributes) { if (item.namespace === XMLNS_NAMESPACE) continue; if (item.namespace !== "" && item.namespace !== ARXML_CORE_NAMESPACE) continue; if (item.namespace === ARXML_CORE_NAMESPACE || !allowed.includes(item.localName)) throw new ValidationError(`未知の Core/unqualified attribute です: ${element.localName}/@${item.localName}`); } }
function foreignAttributes(element: ParsedElement): ForeignMetadataAttribute[] { return element.attributes.filter((item) => item.namespace !== "" && item.namespace !== ARXML_CORE_NAMESPACE && item.namespace !== XMLNS_NAMESPACE).map((item) => ({ namespace: item.namespace, localName: item.localName, value: item.value })); }
function attribute(element: ParsedElement, name: string): string | undefined { return element.attributes.find((item) => item.namespace === "" && item.localName === name)?.value; }
function rejectText(element: ParsedElement, name: string): void { if (element.text.trim().length > 0) throw new ValidationError(`${name} に予期しない文字データがあります`); }
function rejectLeaf(element: ParsedElement, name: string): void { rejectText(element, name); if (element.children.length > 0) throw new ValidationError(`${name} に予期しない子要素があります`); }
function requiredText(element: ParsedElement, name: string): string { const value = element.text.trim(); if (value.length === 0 || element.children.length > 0) throw new ValidationError(`${name} は空でない文字列が必要です`); requireAttributes(element, []); return value; }
function nonEmpty(value: string | undefined, name: string): string { if (!value || value.trim().length === 0) throw new ValidationError(`${name} は必須です`); return value; }
function uniqueIds(ids: readonly string[], kind: string): Set<string> { const result = new Set<string>(); for (const id of ids) { if (result.has(id)) throw new ValidationError(`${kind} id が重複しています: ${id}`); result.add(id); } return result; }
function validateUniqueNames(items: readonly { readonly name: string }[], kind: string): void { const names = new Set<string>(); for (const item of items) { if (names.has(item.name)) throw new ValidationError(`${kind} name が重複しています: ${item.name}`); names.add(item.name); } }
function absoluteVersionedIdentifier(value: string | undefined, name: string): string { const identifier = nonEmpty(value, name); let parsed: URL; try { parsed = new URL(identifier); } catch { throw new ValidationError(`${name} は絶対 Semantic Identifier が必要です`); } if (!parsed.protocol || (parsed.protocol === "http:" || parsed.protocol === "https:") && !parsed.hostname) throw new ValidationError(`${name} は絶対 Semantic Identifier が必要です`); const last = parsed.pathname.split("/").filter(Boolean).at(-1)?.toLowerCase(); if (!last || last === "latest") throw new ValidationError(`${name} は exact-versioned identifier が必要です`); return identifier; }
function isMediaType(value: string): boolean { return /^[^\s/;]+\/[^\s/;]+(?:\s*;\s*[^\s=;]+\s*=\s*(?:[^\s;]+|"[^"]*"))*$/.test(value); }
