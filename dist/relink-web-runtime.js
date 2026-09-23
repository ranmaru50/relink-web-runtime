var yt = Object.defineProperty;
var Nt = (t, e, r) => e in t ? yt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var b = (t, e, r) => Nt(t, typeof e != "symbol" ? e + "" : e, r);
class I extends Error {
  constructor(e, r, n) {
    super(r), this.category = e, this.cause = n, this.name = e;
  }
}
class Y extends I {
  constructor(e, r) {
    super("ParseError", e, r);
  }
}
class h extends I {
  constructor(e) {
    super("ValidationError", e);
  }
}
class Ee extends I {
  constructor(e) {
    super("ContractResolutionError", e);
  }
}
class ve extends I {
  constructor(e) {
    super("ContractError", e);
  }
}
class S extends I {
  constructor(e, r) {
    super("TransportError", e, r);
  }
}
class V extends I {
  constructor(e, r) {
    super("HTTPResponseError", `AR-XML の取得に失敗しました (${e})`), this.status = e, this.url = r;
  }
}
class Rt extends I {
  constructor(e, r) {
    super("HTTPSDowngradeError", "HTTPS から HTTP へのダウングレードは許可されません"), this.fromUrl = e, this.toUrl = r;
  }
}
class Tt extends I {
  constructor(e) {
    super("NetworkPolicyError", "Runtime のネットワークポリシーによりドキュメント取得先が拒否されました"), this.url = e;
  }
}
class _ extends I {
  constructor(e, r, n) {
    super(e, r, n);
  }
}
class G extends _ {
  constructor(e, r, n, s) {
    super("ManifestFetchError", e, s), this.url = r, this.status = n;
  }
}
class H extends _ {
  constructor(e, r) {
    super("ManifestParseError", e, r);
  }
}
class U extends _ {
  constructor(e) {
    super("ManifestValidationError", e);
  }
}
class y extends I {
  constructor(e) {
    super("InterfaceError", e);
  }
}
class C extends I {
  constructor(e) {
    super("RepresentationError", e);
  }
}
class be extends I {
  constructor(e) {
    super("CapabilityError", e);
  }
}
class gt {
  /** 既定の fetch はブラウザの globalThis に束縛して Illegal invocation を防ぎます。 */
  constructor(e = globalThis.fetch.bind(globalThis), r = {}) {
    this.fetcher = e, this.defaultOptions = r;
  }
  /** ブラウザのFetchリダイレクト処理後のレスポンス情報をRuntimeへ渡します。redirect先の制御はブラウザのFetch/CORS/mixed-contentに委ねます。 */
  async fetchResource(e, r = {}) {
    let n;
    const s = { signal: r.signal, redirect: "follow" }, o = r.credentials ?? this.defaultOptions.credentials;
    o !== void 0 && (s.credentials = o);
    try {
      n = await this.fetcher(e, s);
    } catch (u) {
      throw new S("AR-XML の取得中に通信エラーが発生しました", u);
    }
    const c = n.url || e, i = n.headers.get("content-type") ?? void 0;
    if (!n.ok) return { requestedUrl: e, responseUrl: c, status: n.status, body: "", contentType: i };
    try {
      return { requestedUrl: e, responseUrl: c, status: n.status, body: await n.text(), contentType: i };
    } catch (u) {
      throw new S("AR-XML 応答の読み取り中に通信エラーが発生しました", u);
    }
  }
  /** 旧ResourceFetcher APIを維持し、成功時の本文だけを返します。 */
  async fetchText(e, r) {
    const n = await this.fetchResource(e, { signal: r });
    if (n.status < 200 || n.status >= 300) throw new V(n.status, n.responseUrl);
    return n.body;
  }
}
class Et {
  /** 既定の fetch はブラウザの globalThis に束縛して Illegal invocation を防ぎます。 */
  constructor(e = globalThis.fetch.bind(globalThis)) {
    this.fetcher = e;
  }
  async invoke(e, r) {
    try {
      return await this.fetcher(e, { ...r, redirect: "error" });
    } catch (n) {
      throw new S("HTTP 呼び出し中に通信エラーが発生しました", n);
    }
  }
}
class vt {
  parse(e) {
    const r = new DOMParser().parseFromString(e, "application/xml");
    if (r.querySelector("parsererror")) throw new Y("AR-XML の XML 構文が正しくありません");
    const n = r.documentElement;
    if (!n) throw new Y("AR-XML の root element がありません");
    const s = rt(n);
    return { root: s, namespace: s.namespace, rootName: s.localName, version: bt(s, "", "version") };
  }
}
function rt(t) {
  const e = Array.from(t.children, rt), r = Array.from(t.childNodes).filter((s) => s.nodeType === Node.TEXT_NODE || s.nodeType === Node.CDATA_SECTION_NODE).map((s) => s.nodeValue ?? "").join(""), n = [];
  for (const s of Array.from(t.attributes))
    s.namespaceURI !== "http://www.w3.org/2000/xmlns/" && n.push({ namespace: s.namespaceURI ?? "", localName: s.localName, value: s.value });
  return { namespace: t.namespaceURI ?? "", localName: t.localName, attributes: n, children: e, text: r };
}
function bt(t, e, r) {
  var n;
  return (n = t.attributes.find((s) => s.namespace === e && s.localName === r)) == null ? void 0 : n.value;
}
function It(t, e) {
  try {
    return new URL(e, t);
  } catch {
    throw new y("HTTP endpoint が不正です");
  }
}
function nt(t, e, r) {
  const n = Z(e), s = r.slice(0, r.indexOf(e)).filter((o) => Z(o) === n).length + 1;
  return `route:${encodeURIComponent(t)}:${encodeURIComponent(e.ref)}:${Ot(n)}:${s}`;
}
function Z(t) {
  var e;
  return `${t.ref}|${st((e = t.mapping) == null ? void 0 : e.extension)}`;
}
function st(t) {
  if (!t) return "";
  const e = [...t.attributes].sort((r, n) => `${r.namespace}:${r.localName}:${r.value}`.localeCompare(`${n.namespace}:${n.localName}:${n.value}`));
  return `${t.namespace}:${t.localName}[${e.map((r) => `${r.namespace}:${r.localName}=${r.value}`).join(";")}](${t.children.map(st).join("|")})${t.text ?? ""}`;
}
function Ot(t) {
  let e = 2166136261;
  for (const r of t) e = Math.imul(e ^ r.codePointAt(0), 16777619);
  return (e >>> 0).toString(16).padStart(8, "0");
}
class Ut {
  permits(e, r) {
    return e.origin === new URL(r).origin;
  }
}
const J = "https://relink.dev/ns/arxml/http/0.1";
async function Q(t, e, r, n, s, o, c) {
  if (t.legacyDraft4) return At(t, r, n, s, o, c);
  const i = t.invocation;
  if (!i) throw new y("Capability に Invocation がありません");
  const a = t.interfaceUses.map((f) => ({ routeId: nt(t.localId, f, t.interfaceUses), use: f, definition: e.find((p) => p.id === f.ref) })).filter((f) => f.definition !== void 0).filter(({ routeId: f, use: p, definition: w }) => {
    var T;
    return (s.routeId === void 0 || f === s.routeId) && (s.interfaceRef === void 0 || p.ref === s.interfaceRef) && xt((T = w.realization) == null ? void 0 : T.extension);
  });
  if (a.length === 0) throw new y("指定された HTTP Extension route がありません");
  if (a.length > 1) throw new y("InterfaceUse route が一意に選択されていません");
  const l = a[0];
  return Ct(i, l.definition, l.use, r, n, s, o, c);
}
async function At(t, e, r, n, s, o) {
  var T, R, L;
  const c = t.invocation, i = (T = t.interfaces) == null ? void 0 : T[0];
  if (!c || !i) throw new y("呼び出し可能な HTTP Interface がありません");
  const u = It(e, i.endpoint);
  if (!o.permits(u, e)) throw new y("Runtime のネットワークポリシーにより endpoint が拒否されました");
  const a = Dt(c.result, n.accept), l = ot(i.method, u, c, r, a, n.signal), f = await s.invoke(u, l);
  if (f.status < 200 || f.status >= 300) throw new y(`HTTP Interface が非成功を返しました (${f.status})`);
  if (!c.result) return { values: {} };
  if ((((L = (R = f.headers.get("content-type")) == null ? void 0 : R.split(";", 1)[0]) == null ? void 0 : L.trim().toLowerCase()) ?? "") !== (a == null ? void 0 : a.mediaType.toLowerCase())) throw new C("Response Content-Type が宣言済み Representation と一致しません");
  let w;
  try {
    w = JSON.parse(await f.text());
  } catch {
    throw new C("JSON Response の解析に失敗しました");
  }
  if (c.result.outputs.length === 1) {
    const P = c.result.outputs[0];
    if (!P || !B(w, P.type)) throw new C("Response 値が Output type と一致しません");
    return { values: { [P.name]: w }, representation: a == null ? void 0 : a.mediaType };
  }
  return { values: it(c.result.outputs, w), representation: a == null ? void 0 : a.mediaType };
}
async function Ct(t, e, r, n, s, o, c, i) {
  var L, P;
  const u = at((L = e.realization) == null ? void 0 : L.extension), a = ct((P = r.mapping) == null ? void 0 : P.extension);
  if (!a) throw new y("HTTP InterfaceUse に http:operation mapping がありません");
  const l = $t(n, u.base, a.path);
  if (!i.permits(l, n)) throw new y("Runtime のネットワークポリシーにより endpoint が拒否されました");
  const f = St(t.result, o.accept), p = ot(a.method, l, t, s, f, o.signal), w = await c.invoke(l, p);
  if (w.status < 200 || w.status >= 300) throw new y(`HTTP Interface が非成功を返しました (${w.status})`);
  if (!t.result) return { values: {} };
  if (w.status === 204) throw new C("Result が宣言されているため 204 Response をマッピングできません");
  if (!Mt(w.headers.get("content-type"))) throw new C("JSON Result に Content-Type: application/json が必要です");
  let R;
  try {
    R = JSON.parse(await w.text());
  } catch {
    throw new C("JSON Response の解析に失敗しました");
  }
  return { values: it(t.result.outputs, R), representation: f == null ? void 0 : f.mediaType };
}
function ot(t, e, r, n, s, o) {
  Lt(r.inputs, n);
  const c = new Headers();
  if (s && c.set("Accept", s.mediaType), t === "GET") {
    for (const u of r.inputs) {
      const a = n[u.name];
      if (a !== void 0) {
        if (!["string", "number", "integer", "boolean"].includes(u.type)) throw new y(`GET では ${u.type} Input を直列化できません`);
        if (e.searchParams.has(u.name)) throw new y(`既存 query と Input name が衝突しています: ${u.name}`);
        e.searchParams.append(u.name, Pt(a, u.type));
      }
    }
    return { method: t, headers: c, signal: o };
  }
  if (t !== "POST" && t !== "PUT" && t !== "PATCH") throw new y(`HTTP method の Input mapping に対応していません: ${t}`);
  const i = {};
  for (const u of r.inputs) {
    const a = n[u.name];
    if (a !== void 0) {
      if (u.type === "binary") throw new y("binary Input の JSON mapping は未対応です");
      i[u.name] = a;
    }
  }
  return c.set("Content-Type", "application/json"), { method: t, headers: c, body: JSON.stringify(i), signal: o };
}
function Lt(t, e) {
  for (const r of t) {
    const n = e[r.name];
    if (n === void 0) {
      if (r.required) throw new h(`required Input が不足しています: ${r.name}`);
      continue;
    }
    if (!B(n, r.type)) throw new h(`Input の型が一致しません: ${r.name}`);
  }
}
function Pt(t, e) {
  return e === "boolean" ? t === !0 ? "true" : "false" : String(t);
}
function B(t, e) {
  switch (e) {
    case "string":
      return typeof t == "string";
    case "number":
      return typeof t == "number" && Number.isFinite(t);
    case "integer":
      return typeof t == "number" && Number.isInteger(t);
    case "boolean":
      return typeof t == "boolean";
    case "object":
      return typeof t == "object" && t !== null && !Array.isArray(t);
    case "array":
      return Array.isArray(t);
    case "binary":
      return typeof Blob < "u" && t instanceof Blob;
  }
}
function St(t, e) {
  if (!t) return;
  const r = t.representations.find((n) => n.mediaType.toLowerCase() === "application/json");
  if (!r) throw new y("Draft 5 HTTP JSON baseline には application/json Representation が必要です");
  if (e && !e.split(",").some((n) => ut(n.trim().toLowerCase(), r.mediaType.toLowerCase()))) throw new y("指定された Accept と Representation が一致しません");
  return r;
}
function Dt(t, e) {
  if (!t) return;
  const r = t.representations[0];
  if (!r) throw new y("Result Representation がありません");
  if (e && !ut(e.toLowerCase(), r.mediaType.toLowerCase())) throw new y("指定された Accept と Representation が一致しません");
  return r;
}
function it(t, e) {
  if (typeof e != "object" || e === null || Array.isArray(e)) throw new C("JSON Result は top-level object である必要があります");
  const r = e, n = {};
  for (const s of t) {
    if (!(s.name in r)) throw new C(`Response に Output がありません: ${s.name}`);
    const o = r[s.name];
    if (!B(o, s.type)) throw new C(`Output の型が一致しません: ${s.name}`);
    n[s.name] = o;
  }
  return n;
}
function at(t) {
  var r;
  if (!t || t.namespace !== J || t.localName !== "api") throw new y("http:api Realization がありません");
  const e = (r = t.attributes.find((n) => n.namespace === "" && n.localName === "base")) == null ? void 0 : r.value;
  if (t.attributes.some((n) => n.namespace === "" && n.localName !== "base")) throw new y("http:api の未知属性です");
  if (t.text || t.children.length > 0) throw new y("http:api に子要素や文字データは指定できません");
  return { kind: "http:api", ...e !== void 0 ? { base: e } : {}, extension: t };
}
function ct(t) {
  var n, s;
  if (!t) return;
  if (t.namespace !== J || t.localName !== "operation") throw new y("未対応の HTTP Mapping です");
  const e = (n = t.attributes.find((o) => o.namespace === "" && o.localName === "method")) == null ? void 0 : n.value, r = (s = t.attributes.find((o) => o.namespace === "" && o.localName === "path")) == null ? void 0 : s.value;
  if (!e || !/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(e) || r === void 0) throw new y("http:operation の method/path が不正です");
  if (t.attributes.some((o) => o.namespace === "" && o.localName !== "method" && o.localName !== "path")) throw new y("http:operation の未知属性です");
  if (t.text || t.children.length > 0 || !q(r) || ft(r)) throw new y("http:operation path が不正です");
  return { kind: "http:operation", method: e, path: r, extension: t };
}
function $t(t, e, r) {
  if (!q(t) || !q(e ?? "") || !q(r) || ft(r)) throw new y("HTTP URI reference が不正です");
  let n;
  try {
    n = new URL(t);
  } catch {
    throw new y("AR-XML retrieval URL が不正です");
  }
  const s = new URL(e ?? "", n);
  if (s.protocol !== "http:" && s.protocol !== "https:" || !s.hostname) throw new y("HTTP base context が不正です");
  const o = new URL(r, s);
  if (o.hash = "", o.protocol !== "http:" && o.protocol !== "https:" || !o.hostname) throw new y("HTTP target が不正です");
  return o;
}
function xt(t) {
  return (t == null ? void 0 : t.namespace) === J && t.localName === "api";
}
function Mt(t) {
  var n;
  if (!t) return !1;
  const e = t.split(";");
  if (((n = e[0]) == null ? void 0 : n.trim().toLowerCase()) !== "application/json") return !1;
  const r = /* @__PURE__ */ new Set();
  for (const s of e.slice(1)) {
    const o = /^\s*([^=\s;]+)\s*=\s*(?:"(?:[^"\\]|\\.)*"|[^\s;]+)\s*$/.exec(s);
    if (!o || r.has(o[1].toLowerCase())) return !1;
    r.add(o[1].toLowerCase());
  }
  return !0;
}
function ut(t, e) {
  return t === e || t === "*/*" || t.endsWith("/*") && e.startsWith(t.slice(0, -1));
}
function q(t) {
  return !/[^\x00-\x7f]/.test(t) && !/[\\\s\u0000-\u001f\u007f]/.test(t) && !/(?:^|[^%])%(?![0-9A-Fa-f]{2})/.test(t);
}
function ft(t) {
  return t.startsWith("//") || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(t);
}
class qt {
  resolveCapability(e) {
    return [];
  }
  resolveProfile(e) {
    return [];
  }
}
class Ie {
  constructor(e = [], r = []) {
    b(this, "capabilities");
    b(this, "profiles");
    this.capabilities = e, this.profiles = r;
  }
  resolveCapability(e) {
    return this.capabilities.filter((r) => r.identifier === e);
  }
  resolveProfile(e) {
    return this.profiles.filter((r) => r.identifier === e);
  }
}
function pt(t, e, r) {
  const n = r.resolveProfile(e).filter((i) => i.identifier === e);
  if (n.length !== 1) return { resolution: "UNRESOLVED", conformance: "UNDETERMINED" };
  const s = n[0], o = new Set(t.capabilities.map((i) => i.semanticType));
  for (const i of s.requiredCapabilities ?? []) if (!o.has(i)) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  let c = !1;
  for (const i of s.capabilityRequirements ?? []) {
    if (i.required === !1) continue;
    const u = t.capabilities.filter((l) => l.semanticType === i.contractIdentifier);
    if (u.length === 0) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
    const a = u.map((l) => jt(l, i));
    if (!a.includes("CONFORMANT")) {
      if (a.includes("UNDETERMINED")) {
        c = !0;
        continue;
      }
      return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
    }
  }
  for (const i of s.propertyRequirements ?? [])
    if (!t.properties.some((a) => a.type === i.type && (i.value === void 0 || a.value === i.value)) && i.required !== !1) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  for (const i of s.identifierRequirements ?? [])
    if (!t.identifiers.some((a) => a.type === i.type && (i.value === void 0 || a.value === i.value)) && i.required !== !1) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  for (const i of s.interfaceRequirements ?? [])
    if (!t.interfaces.some((a) => (i.id === void 0 || a.id === i.id) && (!i.requireRealization || a.realization !== void 0)) && i.required !== !1) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  return { resolution: "RESOLVED", conformance: c ? "UNDETERMINED" : "CONFORMANT" };
}
function jt(t, e) {
  var s, o, c, i, u, a;
  if ((((s = e.requiredInputNames) == null ? void 0 : s.length) ?? 0) > 0 && !t.invocation || (((o = e.requiredOutputNames) == null ? void 0 : o.length) ?? 0) > 0 && !((c = t.invocation) != null && c.result)) return "UNDETERMINED";
  const r = new Set((i = t.invocation) == null ? void 0 : i.inputs.map((l) => l.name));
  if ((e.requiredInputNames ?? []).some((l) => !r.has(l))) return "NON_CONFORMANT";
  const n = new Set((a = (u = t.invocation) == null ? void 0 : u.result) == null ? void 0 : a.outputs.map((l) => l.name));
  return (e.requiredOutputNames ?? []).some((l) => !n.has(l)) ? "NON_CONFORMANT" : "CONFORMANT";
}
function Ft(t, e) {
  const r = e.resolveCapability(t).filter((n) => n.identifier === t);
  return r.length !== 1 ? { state: "UNRESOLVED" } : { state: "RESOLVED", contract: r[0] };
}
function kt(t, e, r) {
  var a, l;
  if (r !== "RESOLVED" || !e) return "UNVALIDATED";
  const n = e.invocation;
  if (!n && t.invocation || n && !t.invocation) return "CONFLICT";
  if (!n || !t.invocation) return "VALIDATED";
  const s = n.inputs ?? [], o = t.invocation.inputs;
  let c = !1;
  if (s.length !== o.length) return "CONFLICT";
  for (const f of s) {
    const p = o.find((w) => w.name === f.name);
    if (!p || p.type !== f.type) return "CONFLICT";
    (p.required !== f.required || p.format !== f.format || p.unit !== f.unit) && (c = !0);
  }
  if (!!n.result != !!t.invocation.result) return "CONFLICT";
  if (n.result && t.invocation.result) {
    if (n.result.outputs.length !== t.invocation.result.outputs.length) return "CONFLICT";
    for (const w of n.result.outputs) {
      const T = t.invocation.result.outputs.find((R) => R.name === w.name);
      if (!T || T.type !== w.type) return "CONFLICT";
      (T.format !== w.format || T.unit !== w.unit) && (c = !0);
    }
    const f = n.result.representations.map((w) => w.mediaType.toLowerCase()).sort(), p = t.invocation.result.representations.map((w) => w.mediaType.toLowerCase()).sort();
    if (f.length !== p.length || f.some((w, T) => w !== p[T])) return "CONFLICT";
  }
  const i = e.requirements ?? n.requirements ?? [];
  return s.some((f) => {
    var p;
    return (((p = f.constraints) == null ? void 0 : p.length) ?? 0) > 0;
  }) || o.some((f) => {
    var p;
    return (((p = f.constraints) == null ? void 0 : p.length) ?? 0) > 0;
  }) || ((a = n.result) == null ? void 0 : a.outputs.some((f) => {
    var p;
    return (((p = f.constraints) == null ? void 0 : p.length) ?? 0) > 0;
  })) === !0 || ((l = t.invocation.result) == null ? void 0 : l.outputs.some((f) => {
    var p;
    return (((p = f.constraints) == null ? void 0 : p.length) ?? 0) > 0;
  })) === !0 || i.length > 0 || t.requirements.length > 0 || c ? "UNVALIDATED" : "VALIDATED";
}
function Vt(t, e, r) {
  var l;
  if (t.legacyDraft4) return { contractResolution: "UNRESOLVED", projectionValidation: "UNVALIDATED", availability: "READY", routes: [] };
  const n = Ft(t.semanticType, r), s = kt(t, n.contract, n.state);
  if (!t.invocation) return { contractResolution: n.state, projectionValidation: s, routes: [] };
  const o = W(t.requirements), c = n.contract ? n.contract.requirements ?? ((l = n.contract.invocation) == null ? void 0 : l.requirements) ?? [] : [], i = n.state === "RESOLVED" ? W(c) : "UNKNOWN", u = t.interfaceUses.map((f) => Ht(nt(t.localId, f, t.interfaceUses), f, e.find((p) => p.id === f.ref), s, o, i)), a = Wt(u);
  return { contractResolution: n.state, projectionValidation: s, ...a ? { availability: a } : {}, routes: u };
}
function Ht(t, e, r, n, s, o) {
  var p;
  if (!r) return { routeId: t, interfaceRef: e.ref, requirement: tt([s, o]), capabilityRequirement: s, contractRequirement: o, interfaceRequirement: "SATISFIED", attachment: "SATISFIED", support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "Interface が存在しません" };
  const c = W(r.requirements), i = tt([s, o, c]), u = r.attachment ? "UNKNOWN" : "SATISFIED";
  if (!r.realization) return { routeId: t, interfaceRef: e.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "Realization がありません" };
  if (r.realization.extension.namespace !== "https://relink.dev/ns/arxml/http/0.1" || r.realization.extension.localName !== "api") return { routeId: t, interfaceRef: e.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: "UNKNOWN", availability: "UNKNOWN", reason: "未知の Realization です" };
  try {
    at(r.realization.extension);
  } catch {
    return { routeId: t, interfaceRef: e.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "HTTP Realization が不正です" };
  }
  let a = "SUPPORTED", l = "";
  const f = (p = e.mapping) == null ? void 0 : p.extension;
  if (f && (f.namespace !== "https://relink.dev/ns/arxml/http/0.1" || f.localName !== "operation"))
    a = "UNKNOWN";
  else
    try {
      const w = ct(f);
      w ? l = w.method : a = "UNSUPPORTED";
    } catch {
      a = "UNSUPPORTED";
    }
  return a === "SUPPORTED" && !["GET", "POST", "PUT", "PATCH"].includes(l) && (a = "UNSUPPORTED"), n === "CONFLICT" || a === "UNSUPPORTED" || i === "UNSATISFIED" ? { routeId: t, interfaceRef: e.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: a, availability: "UNAVAILABLE", reason: n === "CONFLICT" ? "Capability projection が CONFLICT です" : "HTTP Mapping が未対応です" } : n === "UNVALIDATED" || i === "UNKNOWN" || u === "UNKNOWN" || a === "UNKNOWN" ? { routeId: t, interfaceRef: e.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: a, availability: "UNKNOWN", reason: "必要な評価が UNKNOWN です" } : { routeId: t, interfaceRef: e.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: a, availability: "READY" };
}
function W(t) {
  return t.length === 0 ? "SATISFIED" : "UNKNOWN";
}
function tt(t) {
  return t.includes("UNSATISFIED") ? "UNSATISFIED" : t.includes("UNKNOWN") ? "UNKNOWN" : "SATISFIED";
}
function Wt(t) {
  return t.some((e) => e.availability === "READY") ? "READY" : t.some((e) => e.availability === "UNKNOWN") ? "UNKNOWN" : (t.length > 0, "UNAVAILABLE");
}
function Oe(t, e, r) {
  return pt(t, e, r);
}
function zt(t, e) {
  let r;
  try {
    Bt(t), r = JSON.parse(t);
  } catch (p) {
    throw p instanceof H ? p : new H(`Manifest JSON の構文が正しくありません: ${e}`, p);
  }
  if (!lt(r)) throw new U("Manifest は JSON object である必要があります");
  if (r.manifestVersion !== "0.1") throw new U("Manifest の manifestVersion は 0.1 である必要があります");
  const n = x(r, "anchor"), s = x(r, "entity"), o = x(r, "description"), c = x(r, "lifecycle"), i = M(n, "id", "anchor"), u = M(s, "id", "entity"), a = M(o, "location", "description"), l = M(c, "status", "lifecycle");
  if (!_t.test(i)) throw new U("Manifest の anchor.id が UUID ではありません");
  if (!Jt(u)) throw new U("Manifest の entity.id は絶対 URI である必要があります");
  let f;
  try {
    f = new URL(a);
  } catch {
    throw new U(`Manifest の description.location が不正です: ${a}`);
  }
  if (f.protocol !== "https:") throw new U("Manifest の description.location は HTTPS URL である必要があります");
  if (l !== "active" && l !== "suspended" && l !== "retired") throw new U("Manifest の lifecycle.status が不正です");
  return Yt(i, e), { manifestVersion: "0.1", anchorId: i, entityId: u, descriptionLocation: f.href, lifecycleStatus: l };
}
const _t = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function x(t, e) {
  const r = t[e];
  if (!lt(r)) throw new U(`Manifest の ${e} は object である必要があります`);
  return r;
}
function M(t, e, r) {
  const n = t[e];
  if (typeof n != "string" || n.length === 0) throw new U(`Manifest の ${r}.${e} は必須の文字列です`);
  return n;
}
function Jt(t) {
  try {
    return new URL(t).protocol.length > 0;
  } catch {
    return !1;
  }
}
function Bt(t) {
  const e = [];
  let r = 0;
  for (; r < t.length; ) {
    const n = t[r];
    if (n === "{") {
      e.push(/* @__PURE__ */ new Set()), r += 1;
      continue;
    }
    if (n === "}") {
      e.pop(), r += 1;
      continue;
    }
    if (n !== '"') {
      r += 1;
      continue;
    }
    const s = Kt(t, r);
    r = s.end;
    const o = Xt(t, r);
    if (t[o] !== ":" || e.length === 0) continue;
    const c = e[e.length - 1];
    if (c) {
      if (c.has(s.value)) throw new H(`Manifest JSON に重複した member name があります: ${s.value}`);
      c.add(s.value);
    }
  }
}
function Kt(t, e) {
  let r = e + 1;
  for (; r < t.length; ) {
    if (t[r] === "\\") {
      r += 2;
      continue;
    }
    if (t[r] === '"') {
      const n = t.slice(e, r + 1);
      return { value: JSON.parse(n), end: r + 1 };
    }
    r += 1;
  }
  throw new SyntaxError("Unterminated JSON string");
}
function Xt(t, e) {
  let r = e;
  for (; r < t.length && /\s/.test(t[r] ?? ""); ) r += 1;
  return r;
}
function Yt(t, e) {
  let r;
  try {
    r = new URL(e);
  } catch {
    return;
  }
  const n = r.pathname.match(/\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/manifest\/?$/i);
  if (n && n[1].toLowerCase() !== t.toLowerCase()) throw new U("Manifest の anchor.id が取得URLの UUID と一致しません");
}
function lt(t) {
  return typeof t == "object" && t !== null && !Array.isArray(t);
}
function K(t) {
  const e = t.text.trim();
  return {
    namespace: t.namespace,
    localName: t.localName,
    attributes: t.attributes.map((r) => ({ namespace: r.namespace, localName: r.localName, value: r.value })),
    children: t.children.map(K),
    ...e.length > 0 ? { text: e } : {}
  };
}
const E = "https://relink.dev/ns/arxml/core/0.1", Gt = ["string", "number", "integer", "boolean", "binary", "object", "array"], ht = "http://www.w3.org/2000/xmlns/";
function Zt(t, e, r = {}) {
  const n = t.root;
  if (!n || n.localName !== "ar-entity" || n.namespace !== E) throw new h("Draft 5 の ar-entity root が必要です");
  if (m(n, ["version"]), d(n, "version") !== "0.1") throw new h("version 属性には 0.1 が必要です");
  N(n, "ar-entity");
  const s = D(n, ["category", "identifiers", "properties", "subjects", "profiles", "interfaces", "capabilities"]), o = s.get("category"), c = o ? he(o, "category") : void 0, i = Qt(s.get("identifiers")), u = ee(s.get("subjects")), a = k(u.map((R) => R.id), "Subject"), l = te(s.get("properties")), f = re(s.get("profiles")), p = ne(s.get("interfaces")), w = k(p.map((R) => R.id), "Interface"), T = se(s.get("capabilities"), r.format === "draft4");
  k(T.map((R) => R.localId), "Capability");
  for (const R of i) if (R.subjectRef && !a.has(R.subjectRef)) throw new h(`Identifier の subject-ref が解決できません: ${R.subjectRef}`);
  for (const R of T) {
    if (R.subjectRef && !a.has(R.subjectRef)) throw new h(`Capability の subject-ref が解決できません: ${R.subjectRef}`);
    for (const L of R.interfaceUses) if (!w.has(L.ref)) throw new h(`InterfaceUse の ref が解決できません: ${L.ref}`);
  }
  return { url: e, ...c ? { category: c } : {}, metadata: v(n), identifiers: i, properties: l.properties, propertyExtensions: l.extensions, subjects: u, profileClaims: f, interfaces: p, capabilities: T };
}
function D(t, e) {
  const r = /* @__PURE__ */ new Map();
  for (const n of t.children) {
    if (O(n), !e.includes(n.localName)) throw new h(`未知の Core 要素です: ${n.localName}`);
    if (r.has(n.localName)) throw new h(`Core container が重複しています: ${n.localName}`);
    r.set(n.localName, n);
  }
  return r;
}
function Qt(t) {
  return t ? (m(t, []), N(t, "identifiers"), t.children.map((e) => {
    O(e, "identifier"), m(e, ["type", "value", "subject-ref"]), $(e, "identifier");
    const r = g(d(e, "type"), "identifier/@type"), n = g(d(e, "value"), "identifier/@value");
    return { type: r, value: n, ...d(e, "subject-ref") ? { subjectRef: d(e, "subject-ref") } : {}, metadata: v(e) };
  })) : [];
}
function te(t) {
  if (!t) return { properties: [], extensions: [] };
  m(t, []), N(t, "properties");
  const e = [], r = [];
  for (const n of t.children) {
    if (n.namespace !== E) {
      e.push(K(n));
      continue;
    }
    O(n, "property"), m(n, ["type", "value", "unit"]), $(n, "property");
    const s = n.children.map((o) => F(o, "property"));
    r.push({ type: g(d(n, "type"), "property/@type"), value: g(d(n, "value"), "property/@value"), ...d(n, "unit") ? { unit: d(n, "unit") } : {}, ...s.length > 0 ? { extensions: s } : {}, metadata: v(n) });
  }
  return { properties: r, extensions: e };
}
function ee(t) {
  return t ? (m(t, []), N(t, "subjects"), t.children.map((e) => (O(e, "subject"), m(e, ["id", "type"]), $(e, "subject"), { id: g(d(e, "id"), "subject/@id"), ...d(e, "type") ? { type: d(e, "type") } : {}, metadata: v(e) }))) : [];
}
function re(t) {
  return t ? (m(t, []), N(t, "profiles"), t.children.map((e) => (O(e, "conforms-to"), m(e, ["href"]), $(e, "conforms-to"), { href: X(d(e, "href"), "conforms-to/@href"), metadata: v(e) }))) : [];
}
function ne(t) {
  return t ? (m(t, []), N(t, "interfaces"), t.children.map((e) => {
    O(e, "interface"), m(e, ["id"]), N(e, "interface");
    const r = D(e, ["attachment", "realization", "requirements"]), n = r.get("attachment"), s = r.get("realization");
    if (!n && !s) throw new h("Interface には attachment または realization が必要です");
    return { id: g(d(e, "id"), "interface/@id"), ...n ? { attachment: { extension: z(n, "attachment") } } : {}, ...s ? { realization: { extension: z(s, "realization") } } : {}, requirements: mt(r.get("requirements")), metadata: v(e) };
  })) : [];
}
function se(t, e) {
  return t ? (m(t, []), N(t, "capabilities"), t.children.map((r) => {
    if (O(r, "capability"), m(r, ["id", "type", "subject-ref"]), N(r, "capability"), r.children.some((c) => c.namespace === E && ["inputs", "result", "interfaces"].includes(c.localName))) {
      if (!e) throw new h("Draft 4 Capability grammar は明示的な format=draft4 でのみ受理できます");
      return oe(r);
    }
    const n = D(r, ["requirements", "invocation", "interface-uses"]), s = ue(n.get("invocation"));
    return { localId: g(d(r, "id"), "capability/@id"), semanticType: X(d(r, "type"), "capability/@type"), ...d(r, "subject-ref") ? { subjectRef: d(r, "subject-ref") } : {}, requirements: mt(n.get("requirements")), ...s ? { invocation: s } : {}, interfaceUses: pe(n.get("interface-uses")), metadata: v(r) };
  })) : [];
}
function oe(t) {
  m(t, ["id", "type"]);
  const e = t.children.find((a) => a.namespace === E && a.localName === "inputs"), r = t.children.find((a) => a.namespace === E && a.localName === "result"), n = t.children.find((a) => a.namespace === E && a.localName === "interfaces"), s = e ? ie(e) : [], o = r ? ae(r) : void 0, c = n ? ce(n) : [], i = g(d(t, "id"), "capability/@id"), u = X(d(t, "type"), "capability/@type");
  return { localId: i, semanticType: u, inputs: s, result: o, interfaces: c, requirements: [], invocation: { inputs: s, ...o ? { result: o } : {} }, interfaceUses: [], legacyDraft4: !0, contractResolution: "UNRESOLVED", projectionValidation: "UNVALIDATED", availability: "READY", metadata: v(t) };
}
function ie(t) {
  return m(t, []), N(t, "inputs"), t.children.map((e) => j(e, !0));
}
function ae(t) {
  m(t, []), N(t, "result");
  const e = t.children.find((n) => n.localName === "outputs");
  if (!e) throw new h("result には outputs が必要です");
  m(e, []), N(e, "outputs");
  const r = t.children.find((n) => n.localName === "representations");
  return { outputs: e.children.map((n) => j(n, !1)), representations: r ? dt(r) : [] };
}
function ce(t) {
  return m(t, []), N(t, "interfaces"), t.children.map((e) => {
    O(e, "interface"), m(e, ["type", "method", "endpoint", "encoding"]), $(e, "interface");
    const r = d(e, "type"), n = d(e, "method");
    if (r !== "http" || n !== "GET" && n !== "POST") throw new h("Draft 4 HTTP Interface が不正です");
    const s = g(d(e, "endpoint"), "interface/@endpoint"), o = d(e, "encoding");
    if (o !== void 0 && o !== "json") throw new h("interface/@encoding が不正です");
    return { type: "http", method: n, endpoint: s, ...o ? { encoding: o } : {} };
  });
}
function ue(t) {
  if (!t) return;
  m(t, []), N(t, "invocation");
  const e = D(t, ["inputs", "result"]), r = e.get("inputs");
  let n = [];
  r && (m(r, []), N(r, "inputs"), n = r.children.map((c) => j(c, !0)), wt(n, "input"));
  const s = e.get("result"), o = s ? fe(s) : void 0;
  return { inputs: n, ...o ? { result: o } : {}, metadata: v(t) };
}
function fe(t) {
  m(t, []), N(t, "result");
  const e = D(t, ["outputs", "representations"]), r = e.get("outputs");
  if (!r) throw new h("result には outputs が必要です");
  m(r, []), N(r, "outputs");
  const n = r.children.map((c) => j(c, !1));
  if (wt(n, "output"), n.length === 0) throw new h("result の outputs は1件以上必要です");
  const s = e.get("representations"), o = s ? dt(s) : [];
  return { outputs: n, representations: o };
}
function dt(t) {
  return m(t, []), N(t, "representations"), t.children.map((e) => {
    O(e, "representation"), m(e, ["media-type"]), $(e, "representation");
    const r = g(d(e, "media-type"), "representation/@media-type");
    if (!de(r)) throw new h("representation media-type が不正です");
    return { mediaType: r, metadata: v(e) };
  });
}
function j(t, e) {
  O(t, e ? "input" : "output"), m(t, e ? ["name", "type", "required", "format", "unit"] : ["name", "type", "format", "unit"]), N(t, e ? "input" : "output");
  const r = le(t);
  for (const i of t.children) if (i.namespace !== E || i.localName !== "constraints") throw new h(`${e ? "input" : "output"} の未知の子要素です: ${i.localName}`);
  const n = g(d(t, "name"), `${e ? "input" : "output"}/@name`), s = d(t, "type");
  if (!s || !Gt.includes(s)) throw new h(`${e ? "input" : "output"} type が未定義です: ${s ?? ""}`);
  const o = { name: n, type: s, ...d(t, "format") ? { format: d(t, "format") } : {}, ...d(t, "unit") ? { unit: d(t, "unit") } : {}, ...r.length > 0 ? { constraints: r } : {}, metadata: v(t) };
  if (!e) return o;
  const c = d(t, "required");
  if (c !== void 0 && c !== "true" && c !== "false") throw new h("input/@required は true または false である必要があります");
  return { ...o, required: c !== "false" };
}
function mt(t) {
  return t ? (m(t, []), N(t, "requirements"), t.children.map((e) => {
    O(e, "requirement"), m(e, ["type"]);
    const r = e.children.map((n) => F(n, "requirement"));
    return N(e, "requirement"), { type: g(d(e, "type"), "requirement/@type"), extensions: r, metadata: v(e) };
  })) : [];
}
function pe(t) {
  return t ? (m(t, []), N(t, "interface-uses"), t.children.map((e) => {
    O(e, "interface-use"), m(e, ["ref"]), N(e, "interface-use");
    const n = D(e, ["mapping"]).get("mapping");
    return { ref: g(d(e, "ref"), "interface-use/@ref"), ...n ? { mapping: { extension: z(n, "mapping") } } : {}, metadata: v(e) };
  })) : [];
}
function z(t, e) {
  if (m(t, []), N(t, e), t.children.length !== 1) throw new h(`${e} には foreign Extension root が1つ必要です`);
  return F(t.children[0], e);
}
function F(t, e) {
  if (t.namespace === E || t.namespace.length === 0) throw new h(`${e} には foreign namespaced Extension が必要です`);
  return K(t);
}
function le(t) {
  const e = t.children.filter((n) => n.namespace === E && n.localName === "constraints");
  if (e.length > 1) throw new h("constraints wrapper が重複しています");
  const r = e[0];
  return r ? (m(r, []), N(r, "constraints"), r.children.map((n) => F(n, "constraints"))) : [];
}
function O(t, e) {
  if (t.namespace !== E || e && t.localName !== e) throw new h(`Core 要素が不正です: ${t.localName}`);
}
function m(t, e) {
  for (const r of t.attributes)
    if (r.namespace !== ht && !(r.namespace !== "" && r.namespace !== E) && (r.namespace === E || !e.includes(r.localName)))
      throw new h(`未知の Core/unqualified attribute です: ${t.localName}/@${r.localName}`);
}
function v(t) {
  return t.attributes.filter((e) => e.namespace !== "" && e.namespace !== E && e.namespace !== ht).map((e) => ({ namespace: e.namespace, localName: e.localName, value: e.value }));
}
function d(t, e) {
  var r;
  return (r = t.attributes.find((n) => n.namespace === "" && n.localName === e)) == null ? void 0 : r.value;
}
function N(t, e) {
  if (t.text.trim().length > 0) throw new h(`${e} に予期しない文字データがあります`);
}
function $(t, e) {
  if (N(t, e), t.children.length > 0) throw new h(`${e} に予期しない子要素があります`);
}
function he(t, e) {
  const r = t.text.trim();
  if (r.length === 0 || t.children.length > 0) throw new h(`${e} は空でない文字列が必要です`);
  return m(t, []), r;
}
function g(t, e) {
  if (!t || t.trim().length === 0) throw new h(`${e} は必須です`);
  return t;
}
function k(t, e) {
  const r = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (r.has(n)) throw new h(`${e} id が重複しています: ${n}`);
    r.add(n);
  }
  return r;
}
function wt(t, e) {
  const r = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (r.has(n.name)) throw new h(`${e} name が重複しています: ${n.name}`);
    r.add(n.name);
  }
}
function X(t, e) {
  var o;
  const r = g(t, e);
  let n;
  try {
    n = new URL(r);
  } catch {
    throw new h(`${e} は絶対 Semantic Identifier が必要です`);
  }
  if (!n.protocol || (n.protocol === "http:" || n.protocol === "https:") && !n.hostname) throw new h(`${e} は絶対 Semantic Identifier が必要です`);
  const s = (o = n.pathname.split("/").filter(Boolean).at(-1)) == null ? void 0 : o.toLowerCase();
  if (!s || s === "latest") throw new h(`${e} は exact-versioned identifier が必要です`);
  return r;
}
function de(t) {
  return /^[^\s/;]+\/[^\s/;]+(?:\s*;\s*[^\s=;]+\s*=\s*(?:[^\s;]+|"[^"]*"))*$/.test(t);
}
class me {
  permits(e, r) {
    const n = new URL(r);
    return e.protocol !== "http:" && e.protocol !== "https:" ? !1 : n.protocol !== "https:" || e.protocol === "https:";
  }
}
class Ue {
  constructor(e = {}) {
    b(this, "xmlParser");
    b(this, "resourceFetcher");
    b(this, "httpInvoker");
    b(this, "networkPolicy");
    b(this, "resourceNetworkPolicy");
    b(this, "semanticRegistry");
    b(this, "documentFormat");
    this.xmlParser = e.xmlParser ?? new vt(), this.resourceFetcher = e.resourceFetcher ?? new gt(globalThis.fetch.bind(globalThis), { credentials: e.resourceCredentials }), this.httpInvoker = e.httpInvoker ?? new Et(), this.networkPolicy = e.networkPolicy ?? new Ut(), this.resourceNetworkPolicy = e.resourceNetworkPolicy ?? new me(), this.semanticRegistry = e.semanticRegistry ?? new qt(), this.documentFormat = e.documentFormat ?? "draft5";
  }
  /** AR-XML または明示 Manifest 経由の description を取得します。Capability は実行しません。 */
  async load(e, r = {}) {
    const n = A(e), s = await this.fetchDocumentResource(e, n.href, r, we(n.href));
    if (et(s)) {
      const o = zt(s.body, A(s.responseUrl).href), c = A(o.descriptionLocation);
      return this.buildRuntimeDocument(await this.fetchDocumentResource(c.href, c.href, r, !1));
    }
    return this.buildRuntimeDocument(s);
  }
  async fetchDocumentResource(e, r, n, s) {
    const o = A(r);
    this.assertResourceRequest(A(e), o.href);
    const c = { signal: n.signal, credentials: n.credentials, beforeRequest: (a) => this.assertResourceRequest(A(a), o.href) };
    let i;
    try {
      i = await ye(this.resourceFetcher, e, c);
    } catch (a) {
      throw s ? new G("Manifest の取得中に通信エラーが発生しました", e, void 0, a) : a;
    }
    if (i.status < 200 || i.status >= 300)
      throw s || et(i) ? new G(`Manifest の取得に失敗しました (${i.status})`, i.responseUrl, i.status, new V(i.status, i.responseUrl)) : new V(i.status, i.responseUrl);
    const u = A(i.responseUrl);
    this.assertResourceRequest(u, o.href);
    for (const a of i.redirectUrls ?? []) this.assertResourceRequest(A(a), o.href);
    return i;
  }
  buildRuntimeDocument(e) {
    const r = A(e.responseUrl);
    return new Ne(Zt(this.xmlParser.parse(e.body), r.href, { format: this.documentFormat }), this.httpInvoker, this.networkPolicy, this.semanticRegistry);
  }
  assertResourceRequest(e, r) {
    if (new URL(r).protocol === "https:" && e.protocol === "http:") throw new Rt(r, e.href);
    if (!this.resourceNetworkPolicy.permits(e, r)) throw new Tt(e.href);
  }
}
function et(t) {
  var r, n;
  const e = (n = (r = t.contentType) == null ? void 0 : r.split(";", 1)[0]) == null ? void 0 : n.trim().toLowerCase();
  return e === "application/json" || (e == null ? void 0 : e.endsWith("+json")) === !0 || t.body.trimStart().startsWith("{");
}
function we(t) {
  const e = new URL(t).pathname.toLowerCase();
  return e.endsWith("/manifest") || e.endsWith("/manifest.json") || e.endsWith(".manifest");
}
function A(t) {
  let e;
  try {
    e = new URL(t);
  } catch (r) {
    throw new S("AR-XML のURLが不正です", r);
  }
  if (e.protocol !== "http:" && e.protocol !== "https:") throw new S("AR-XML のURLにはHTTP(S)を指定してください");
  return e;
}
async function ye(t, e, r) {
  if (t.fetchResource) return t.fetchResource(e, r);
  if (t.fetchText) return { requestedUrl: e, responseUrl: e, status: 200, body: await t.fetchText(e, r.signal) };
  throw new S("AR-XML の取得Adapterが設定されていません");
}
class Ne {
  constructor(e, r, n, s) {
    this.document = e, this.httpInvoker = r, this.networkPolicy = n, this.semanticRegistry = s;
  }
  get url() {
    return this.document.url;
  }
  get category() {
    return this.document.category;
  }
  get metadata() {
    return this.document.metadata;
  }
  get identifiers() {
    return this.document.identifiers;
  }
  get properties() {
    return this.document.properties;
  }
  get propertyExtensions() {
    return this.document.propertyExtensions;
  }
  get subjects() {
    return this.document.subjects;
  }
  get profileClaims() {
    return this.document.profileClaims;
  }
  get interfaces() {
    return this.document.interfaces;
  }
  get capabilities() {
    return this.document.capabilities;
  }
  getCapability(e) {
    const r = this.document.capabilities.find((n) => n.localId === e);
    return r ? new Re(r, this.document, this.httpInvoker, this.networkPolicy, this.semanticRegistry) : void 0;
  }
  evaluateCapability(e) {
    var r;
    return (r = this.getCapability(e)) == null ? void 0 : r.evaluation;
  }
  evaluateProfile(e) {
    return pt(this.document, e, this.semanticRegistry);
  }
}
class Re {
  constructor(e, r, n, s, o) {
    b(this, "snapshot");
    this.capability = e, this.document = r, this.httpInvoker = n, this.networkPolicy = s, this.snapshot = Vt(e, r.interfaces, o);
  }
  get definition() {
    return this.capability;
  }
  get evaluation() {
    return this.snapshot;
  }
  get availability() {
    return this.snapshot.availability;
  }
  async invoke(e, r = {}) {
    if (this.capability.legacyDraft4) {
      if (this.snapshot.availability !== "READY") throw new h(`Capability route が READY ではありません: ${this.snapshot.availability ?? "UNAVAILABLE"}`);
      return Q(this.capability, this.document.interfaces, this.document.url, e, r, this.httpInvoker, this.networkPolicy);
    }
    const n = this.snapshot.routes.filter((o) => o.availability === "READY"), s = r.routeId !== void 0 ? n.find((o) => o.routeId === r.routeId) : r.interfaceRef !== void 0 ? Te(n, r.interfaceRef) : n.length === 1 ? n[0] : void 0;
    if (!s) throw new h(`READY な InterfaceUse route が一意に選択されていません: ${r.routeId ?? r.interfaceRef ?? this.snapshot.availability ?? "UNAVAILABLE"}`);
    if (r.interfaceRef !== void 0 && s.interfaceRef !== r.interfaceRef) throw new h("routeId と interfaceRef が一致しません");
    return Q(this.capability, this.document.interfaces, this.document.url, e, { ...r, routeId: s.routeId, interfaceRef: s.interfaceRef }, this.httpInvoker, this.networkPolicy);
  }
}
function Te(t, e) {
  const r = t.filter((n) => n.interfaceRef === e);
  return r.length === 1 ? r[0] : void 0;
}
class Ae {
  constructor(e = []) {
    b(this, "processors");
    this.processors = e;
  }
  find(e, r) {
    return this.processors.find((n) => n.namespace === e.namespace && n.localName === e.localName && n.slots.includes(r));
  }
}
export {
  Ue as ARRuntime,
  I as ARRuntimeError,
  be as CapabilityError,
  ve as ContractError,
  Ee as ContractResolutionError,
  me as DefaultResourceNetworkPolicy,
  qt as EmptySemanticRegistry,
  V as HTTPResponseError,
  Rt as HTTPSDowngradeError,
  Ae as InMemoryExtensionRegistry,
  Ie as InMemorySemanticRegistry,
  y as InterfaceError,
  _ as ManifestError,
  G as ManifestFetchError,
  H as ManifestParseError,
  U as ManifestValidationError,
  Tt as NetworkPolicyError,
  Y as ParseError,
  C as RepresentationError,
  Re as RuntimeCapability,
  Ne as RuntimeDocument,
  S as TransportError,
  h as ValidationError,
  Vt as evaluateCapability,
  Oe as evaluateProfile,
  pt as evaluateProfileDocument,
  Ft as resolveContract,
  kt as validateProjection
};
