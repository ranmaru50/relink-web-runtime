var Rt = Object.defineProperty;
var gt = (t, e, r) => e in t ? Rt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var U = (t, e, r) => gt(t, typeof e != "symbol" ? e + "" : e, r);
class O extends Error {
  constructor(e, r, n) {
    super(r), this.category = e, this.cause = n, this.name = e;
  }
}
class Y extends O {
  constructor(e, r) {
    super("ParseError", e, r);
  }
}
class l extends O {
  constructor(e) {
    super("ValidationError", e);
  }
}
class Ae extends O {
  constructor(e) {
    super("ContractResolutionError", e);
  }
}
class Ie extends O {
  constructor(e) {
    super("ContractError", e);
  }
}
class C extends O {
  constructor(e, r) {
    super("TransportError", e, r);
  }
}
class F extends O {
  constructor(e, r) {
    super("HTTPResponseError", `AR-XML の取得に失敗しました (${e})`), this.status = e, this.url = r;
  }
}
class Tt extends O {
  constructor(e, r) {
    super("HTTPSDowngradeError", "HTTPS から HTTP へのダウングレードは許可されません"), this.fromUrl = e, this.toUrl = r;
  }
}
class Et extends O {
  constructor(e) {
    super("NetworkPolicyError", "Runtime のネットワークポリシーによりドキュメント取得先が拒否されました"), this.url = e;
  }
}
class _ extends O {
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
class I extends _ {
  constructor(e) {
    super("ManifestValidationError", e);
  }
}
class N extends O {
  constructor(e) {
    super("InterfaceError", e);
  }
}
class P extends O {
  constructor(e) {
    super("RepresentationError", e);
  }
}
class Se extends O {
  constructor(e) {
    super("CapabilityError", e);
  }
}
class vt {
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
      throw new C("AR-XML の取得中に通信エラーが発生しました", u);
    }
    const c = n.url || e, i = n.headers.get("content-type") ?? void 0;
    if (!n.ok) return { requestedUrl: e, responseUrl: c, status: n.status, body: "", contentType: i };
    try {
      return { requestedUrl: e, responseUrl: c, status: n.status, body: await n.text(), contentType: i };
    } catch (u) {
      throw new C("AR-XML 応答の読み取り中に通信エラーが発生しました", u);
    }
  }
  /** 旧ResourceFetcher APIを維持し、成功時の本文だけを返します。 */
  async fetchText(e, r) {
    const n = await this.fetchResource(e, { signal: r });
    if (n.status < 200 || n.status >= 300) throw new F(n.status, n.responseUrl);
    return n.body;
  }
}
class bt {
  /** 既定の fetch はブラウザの globalThis に束縛して Illegal invocation を防ぎます。 */
  constructor(e = globalThis.fetch.bind(globalThis)) {
    this.fetcher = e;
  }
  async invoke(e, r) {
    try {
      return await this.fetcher(e, { ...r, redirect: "error" });
    } catch (n) {
      throw new C("HTTP 呼び出し中に通信エラーが発生しました", n);
    }
  }
}
class Ut {
  parse(e) {
    const r = new DOMParser().parseFromString(e, "application/xml");
    if (r.querySelector("parsererror")) throw new Y("AR-XML の XML 構文が正しくありません");
    const n = r.documentElement;
    if (!n) throw new Y("AR-XML の root element がありません");
    const s = rt(n);
    return { root: s, namespace: s.namespace, rootName: s.localName, version: Ot(s, "", "version") };
  }
}
function rt(t) {
  const e = Array.from(t.children, rt), r = Array.from(t.childNodes).filter((s) => s.nodeType === Node.TEXT_NODE || s.nodeType === Node.CDATA_SECTION_NODE).map((s) => s.nodeValue ?? "").join(""), n = [];
  for (const s of Array.from(t.attributes))
    s.namespaceURI !== "http://www.w3.org/2000/xmlns/" && n.push({ namespace: s.namespaceURI ?? "", localName: s.localName, value: s.value });
  return { namespace: t.namespaceURI ?? "", localName: t.localName, attributes: n, children: e, text: r };
}
function Ot(t, e, r) {
  var n;
  return (n = t.attributes.find((s) => s.namespace === e && s.localName === r)) == null ? void 0 : n.value;
}
function At(t, e) {
  try {
    return new URL(e, t);
  } catch {
    throw new N("HTTP endpoint が不正です");
  }
}
function nt(t, e, r) {
  const n = Z(e), s = r.slice(0, r.indexOf(e)).filter((o) => Z(o) === n).length + 1;
  return `route:${encodeURIComponent(t)}:${encodeURIComponent(e.ref)}:${It(n)}:${s}`;
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
function It(t) {
  let e = 2166136261;
  for (const r of t) e = Math.imul(e ^ r.codePointAt(0), 16777619);
  return (e >>> 0).toString(16).padStart(8, "0");
}
class St {
  permits(e, r) {
    return e.origin === new URL(r).origin;
  }
}
const J = "https://relink.dev/ns/arxml/http/0.1";
async function Q(t, e, r, n, s, o, c) {
  if (t.legacyDraft4) return Pt(t, r, n, s, o, c);
  const i = t.invocation;
  if (!i) throw new N("Capability に Invocation がありません");
  const a = t.interfaceUses.map((d) => ({ routeId: nt(t.localId, d, t.interfaceUses), use: d, definition: e.find((g) => g.id === d.ref) })).filter((d) => d.definition !== void 0).filter(({ routeId: d, use: g, definition: p }) => {
    var y;
    return (s.routeId === void 0 || d === s.routeId) && (s.interfaceRef === void 0 || g.ref === s.interfaceRef) && Mt((y = p.realization) == null ? void 0 : y.extension);
  });
  if (a.length === 0) throw new N("指定された HTTP Extension route がありません");
  if (a.length > 1) throw new N("InterfaceUse route が一意に選択されていません");
  const f = a[0];
  return Lt(i, f.definition, f.use, r, n, s, o, c);
}
async function Pt(t, e, r, n, s, o) {
  var y, m, T;
  const c = t.invocation, i = (y = t.interfaces) == null ? void 0 : y[0];
  if (!c || !i) throw new N("呼び出し可能な HTTP Interface がありません");
  const u = At(e, i.endpoint);
  if (!o.permits(u, e)) throw new N("Runtime のネットワークポリシーにより endpoint が拒否されました");
  const a = qt(c.result, n.accept), f = ot(i.method, u, c, r, a, n.signal), d = await s.invoke(u, f);
  if (d.status < 200 || d.status >= 300) throw new N(`HTTP Interface が非成功を返しました (${d.status})`);
  if (!c.result) return { values: {} };
  if ((((T = (m = d.headers.get("content-type")) == null ? void 0 : m.split(";", 1)[0]) == null ? void 0 : T.trim().toLowerCase()) ?? "") !== (a == null ? void 0 : a.mediaType.toLowerCase())) throw new P("Response Content-Type が宣言済み Representation と一致しません");
  let p;
  try {
    p = JSON.parse(await d.text());
  } catch {
    throw new P("JSON Response の解析に失敗しました");
  }
  if (c.result.outputs.length === 1) {
    const L = c.result.outputs[0];
    if (!L || !B(p, L.type)) throw new P("Response 値が Output type と一致しません");
    return { values: { [L.name]: p }, representation: a == null ? void 0 : a.mediaType };
  }
  return { values: it(c.result.outputs, p), representation: a == null ? void 0 : a.mediaType };
}
async function Lt(t, e, r, n, s, o, c, i) {
  var T, L;
  const u = at((T = e.realization) == null ? void 0 : T.extension), a = ct((L = r.mapping) == null ? void 0 : L.extension);
  if (!a) throw new N("HTTP InterfaceUse に http:operation mapping がありません");
  const f = $t(n, u.base, a.path);
  if (!i.permits(f, n)) throw new N("Runtime のネットワークポリシーにより endpoint が拒否されました");
  const d = xt(t.result, o.accept), g = ot(a.method, f, t, s, d, o.signal), p = await c.invoke(f, g);
  if (p.status < 200 || p.status >= 300) throw new N(`HTTP Interface が非成功を返しました (${p.status})`);
  if (!t.result) return { values: {} };
  if (p.status === 204) throw new P("Result が宣言されているため 204 Response をマッピングできません");
  if (!jt(p.headers.get("content-type"))) throw new P("JSON Result に Content-Type: application/json が必要です");
  let m;
  try {
    m = JSON.parse(await p.text());
  } catch {
    throw new P("JSON Response の解析に失敗しました");
  }
  return { values: it(t.result.outputs, m), representation: d == null ? void 0 : d.mediaType };
}
function ot(t, e, r, n, s, o) {
  Ct(r.inputs, n);
  const c = new Headers();
  if (s && c.set("Accept", s.mediaType), t === "GET") {
    for (const u of r.inputs) {
      const a = n[u.name];
      if (a !== void 0) {
        if (!["string", "number", "integer", "boolean"].includes(u.type)) throw new N(`GET では ${u.type} Input を直列化できません`);
        if (e.searchParams.has(u.name)) throw new N(`既存 query と Input name が衝突しています: ${u.name}`);
        e.searchParams.append(u.name, Dt(a, u.type));
      }
    }
    return { method: t, headers: c, signal: o };
  }
  if (t !== "POST" && t !== "PUT" && t !== "PATCH") throw new N(`HTTP method の Input mapping に対応していません: ${t}`);
  const i = {};
  for (const u of r.inputs) {
    const a = n[u.name];
    if (a !== void 0) {
      if (u.type === "binary") throw new N("binary Input の JSON mapping は未対応です");
      i[u.name] = a;
    }
  }
  return c.set("Content-Type", "application/json"), { method: t, headers: c, body: JSON.stringify(i), signal: o };
}
function Ct(t, e) {
  for (const r of t) {
    const n = e[r.name];
    if (n === void 0) {
      if (r.required) throw new l(`required Input が不足しています: ${r.name}`);
      continue;
    }
    if (!B(n, r.type)) throw new l(`Input の型が一致しません: ${r.name}`);
  }
}
function Dt(t, e) {
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
function xt(t, e) {
  if (!t) return;
  const r = t.representations.find((n) => n.mediaType.toLowerCase() === "application/json");
  if (!r) throw new N("Draft 5 HTTP JSON baseline には application/json Representation が必要です");
  if (e && !e.split(",").some((n) => ut(n.trim().toLowerCase(), r.mediaType.toLowerCase()))) throw new N("指定された Accept と Representation が一致しません");
  return r;
}
function qt(t, e) {
  if (!t) return;
  const r = t.representations[0];
  if (!r) throw new N("Result Representation がありません");
  if (e && !ut(e.toLowerCase(), r.mediaType.toLowerCase())) throw new N("指定された Accept と Representation が一致しません");
  return r;
}
function it(t, e) {
  if (typeof e != "object" || e === null || Array.isArray(e)) throw new P("JSON Result は top-level object である必要があります");
  const r = e, n = {};
  for (const s of t) {
    if (!(s.name in r)) throw new P(`Response に Output がありません: ${s.name}`);
    const o = r[s.name];
    if (!B(o, s.type)) throw new P(`Output の型が一致しません: ${s.name}`);
    n[s.name] = o;
  }
  return n;
}
function at(t) {
  var r;
  if (!t || t.namespace !== J || t.localName !== "api") throw new N("http:api Realization がありません");
  const e = (r = t.attributes.find((n) => n.namespace === "" && n.localName === "base")) == null ? void 0 : r.value;
  if (t.attributes.some((n) => n.namespace === "" && n.localName !== "base")) throw new N("http:api の未知属性です");
  if (t.text || t.children.length > 0) throw new N("http:api に子要素や文字データは指定できません");
  return { kind: "http:api", ...e !== void 0 ? { base: e } : {}, extension: t };
}
function ct(t) {
  var n, s;
  if (!t) return;
  if (t.namespace !== J || t.localName !== "operation") throw new N("未対応の HTTP Mapping です");
  const e = (n = t.attributes.find((o) => o.namespace === "" && o.localName === "method")) == null ? void 0 : n.value, r = (s = t.attributes.find((o) => o.namespace === "" && o.localName === "path")) == null ? void 0 : s.value;
  if (!e || !/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(e) || r === void 0) throw new N("http:operation の method/path が不正です");
  if (t.attributes.some((o) => o.namespace === "" && o.localName !== "method" && o.localName !== "path")) throw new N("http:operation の未知属性です");
  if (t.text || t.children.length > 0 || !M(r) || ft(r)) throw new N("http:operation path が不正です");
  return { kind: "http:operation", method: e, path: r, extension: t };
}
function $t(t, e, r) {
  if (!M(t) || !M(e ?? "") || !M(r) || ft(r)) throw new N("HTTP URI reference が不正です");
  let n;
  try {
    n = new URL(t);
  } catch {
    throw new N("AR-XML retrieval URL が不正です");
  }
  const s = new URL(e ?? "", n);
  if (s.protocol !== "http:" && s.protocol !== "https:" || !s.hostname) throw new N("HTTP base context が不正です");
  const o = new URL(r, s);
  if (o.hash = "", o.protocol !== "http:" && o.protocol !== "https:" || !o.hostname) throw new N("HTTP target が不正です");
  return o;
}
function Mt(t) {
  return (t == null ? void 0 : t.namespace) === J && t.localName === "api";
}
function jt(t) {
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
function M(t) {
  return !/[^\x00-\x7f]/.test(t) && !/[\\\s\u0000-\u001f\u007f]/.test(t) && !/(?:^|[^%])%(?![0-9A-Fa-f]{2})/.test(t);
}
function ft(t) {
  return t.startsWith("//") || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(t);
}
class kt {
  resolveCapability(e) {
    return [];
  }
  resolveProfile(e) {
    return [];
  }
}
class Pe {
  constructor(e = [], r = []) {
    U(this, "capabilities");
    U(this, "profiles");
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
    const u = t.capabilities.filter((f) => f.semanticType === i.contractIdentifier);
    if (u.length === 0) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
    const a = u.map((f) => Vt(f, i));
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
function Vt(t, e) {
  var s, o, c, i, u, a;
  if ((((s = e.requiredInputNames) == null ? void 0 : s.length) ?? 0) > 0 && !t.invocation || (((o = e.requiredOutputNames) == null ? void 0 : o.length) ?? 0) > 0 && !((c = t.invocation) != null && c.result)) return "UNDETERMINED";
  const r = new Set((i = t.invocation) == null ? void 0 : i.inputs.map((f) => f.name));
  if ((e.requiredInputNames ?? []).some((f) => !r.has(f))) return "NON_CONFORMANT";
  const n = new Set((a = (u = t.invocation) == null ? void 0 : u.result) == null ? void 0 : a.outputs.map((f) => f.name));
  return (e.requiredOutputNames ?? []).some((f) => !n.has(f)) ? "NON_CONFORMANT" : "CONFORMANT";
}
function Ft(t, e) {
  const r = e.resolveCapability(t).filter((n) => n.identifier === t);
  return r.length !== 1 ? { state: "UNRESOLVED" } : { state: "RESOLVED", contract: r[0] };
}
function Ht(t, e, r) {
  var i, u;
  if (r !== "RESOLVED" || !e) return "UNVALIDATED";
  const n = e.invocation;
  let s = !1, o = !1;
  if (!n && t.invocation && (s = !0), n && !t.invocation && (s = !0), n && t.invocation) {
    const a = n.inputs ?? [], f = t.invocation.inputs;
    a.length !== f.length && (s = !0);
    const d = new Set(e.permittedInputRequirednessNarrowing ?? []);
    for (const p of a) {
      const y = f.find((m) => m.name === p.name);
      if (!y || y.type !== p.type) {
        s = !0;
        continue;
      }
      p.required && !y.required && (s = !0), !p.required && y.required && !d.has(p.name) && (s = !0), (y.format !== p.format || y.unit !== p.unit) && (o = !0);
    }
    if (!!n.result != !!t.invocation.result && (s = !0), n.result && t.invocation.result) {
      n.result.outputs.length !== t.invocation.result.outputs.length && (s = !0);
      for (const m of n.result.outputs) {
        const T = t.invocation.result.outputs.find((L) => L.name === m.name);
        if (!T || T.type !== m.type) {
          s = !0;
          continue;
        }
        (T.format !== m.format || T.unit !== m.unit) && (o = !0);
      }
      const p = n.result.representations.map((m) => m.mediaType.toLowerCase()).sort(), y = t.invocation.result.representations.map((m) => m.mediaType.toLowerCase()).sort();
      (p.length !== y.length || p.some((m, T) => m !== y[T])) && (s = !0);
    }
    ((n.inputs ?? []).some((p) => {
      var y;
      return (((y = p.constraints) == null ? void 0 : y.length) ?? 0) > 0;
    }) || t.invocation.inputs.some((p) => {
      var y;
      return (((y = p.constraints) == null ? void 0 : y.length) ?? 0) > 0;
    }) || ((i = n.result) == null ? void 0 : i.outputs.some((p) => {
      var y;
      return (((y = p.constraints) == null ? void 0 : y.length) ?? 0) > 0;
    })) === !0 || ((u = t.invocation.result) == null ? void 0 : u.outputs.some((p) => {
      var y;
      return (((y = p.constraints) == null ? void 0 : y.length) ?? 0) > 0;
    })) === !0) && (o = !0);
  }
  const c = _t(lt(e), t.requirements);
  return s || c.conflict ? "CONFLICT" : o || c.unknown ? "UNVALIDATED" : "VALIDATED";
}
function Wt(t, e, r) {
  if (t.legacyDraft4) return { contractResolution: "UNRESOLVED", projectionValidation: "UNVALIDATED", availability: "READY", routes: [] };
  const n = Ft(t.semanticType, r), s = Ht(t, n.contract, n.state);
  if (!t.invocation) return { contractResolution: n.state, projectionValidation: s, routes: [] };
  const o = W(t.requirements), c = n.contract ? lt(n.contract) : [], i = n.state === "RESOLVED" ? W(c) : "UNKNOWN", u = t.interfaceUses.map((f) => zt(nt(t.localId, f, t.interfaceUses), f, e.find((d) => d.id === f.ref), s, o, i)), a = Kt(u);
  return { contractResolution: n.state, projectionValidation: s, ...a ? { availability: a } : {}, routes: u };
}
function zt(t, e, r, n, s, o) {
  var g;
  if (!r) return { routeId: t, interfaceRef: e.ref, requirement: tt([s, o]), capabilityRequirement: s, contractRequirement: o, interfaceRequirement: "SATISFIED", attachment: "SATISFIED", support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "Interface が存在しません" };
  const c = W(r.requirements), i = tt([s, o, c]), u = r.attachment ? "UNKNOWN" : "SATISFIED";
  if (!r.realization) return { routeId: t, interfaceRef: e.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "Realization がありません" };
  if (r.realization.extension.namespace !== "https://relink.dev/ns/arxml/http/0.1" || r.realization.extension.localName !== "api") return { routeId: t, interfaceRef: e.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: "UNKNOWN", availability: "UNKNOWN", reason: "未知の Realization です" };
  try {
    at(r.realization.extension);
  } catch {
    return { routeId: t, interfaceRef: e.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "HTTP Realization が不正です" };
  }
  let a = "SUPPORTED", f = "";
  const d = (g = e.mapping) == null ? void 0 : g.extension;
  if (d && (d.namespace !== "https://relink.dev/ns/arxml/http/0.1" || d.localName !== "operation"))
    a = "UNKNOWN";
  else
    try {
      const p = ct(d);
      p ? f = p.method : a = "UNSUPPORTED";
    } catch {
      a = "UNSUPPORTED";
    }
  return a === "SUPPORTED" && !["GET", "POST", "PUT", "PATCH"].includes(f) && (a = "UNSUPPORTED"), n === "CONFLICT" || a === "UNSUPPORTED" || i === "UNSATISFIED" ? { routeId: t, interfaceRef: e.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: a, availability: "UNAVAILABLE", reason: n === "CONFLICT" ? "Capability projection が CONFLICT です" : "HTTP Mapping が未対応です" } : n === "UNVALIDATED" || i === "UNKNOWN" || u === "UNKNOWN" || a === "UNKNOWN" ? { routeId: t, interfaceRef: e.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: a, availability: "UNKNOWN", reason: "必要な評価が UNKNOWN です" } : { routeId: t, interfaceRef: e.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: a, availability: "READY" };
}
function W(t) {
  return t.length === 0 ? "SATISFIED" : "UNKNOWN";
}
function tt(t) {
  return t.includes("UNSATISFIED") ? "UNSATISFIED" : t.includes("UNKNOWN") ? "UNKNOWN" : "SATISFIED";
}
function lt(t) {
  return t.requirements ?? [];
}
function _t(t, e) {
  const r = /* @__PURE__ */ new Set();
  let n = !1;
  for (const s of t) {
    const o = e.findIndex((c, i) => !r.has(i) && Jt(s, c));
    if (o >= 0) {
      r.add(o);
      continue;
    }
    if (e.some((c) => c.type === s.type)) {
      n = !0;
      continue;
    }
    return { conflict: !0, unknown: n };
  }
  return { conflict: !1, unknown: n };
}
function Jt(t, e) {
  return t.type === e.type && ht(t.extensions, e.extensions);
}
function ht(t, e) {
  return t.length !== e.length ? !1 : t.every((r, n) => {
    const s = e[n];
    return r.namespace === (s == null ? void 0 : s.namespace) && r.localName === s.localName && r.text === s.text && r.attributes.length === ((s == null ? void 0 : s.attributes.length) ?? -1) && r.attributes.every((o, c) => {
      const i = s == null ? void 0 : s.attributes[c];
      return o.namespace === (i == null ? void 0 : i.namespace) && o.localName === i.localName && o.value === i.value;
    }) && Bt(r.children, (s == null ? void 0 : s.children) ?? []);
  });
}
function Bt(t, e) {
  return t.length !== e.length ? !1 : t.every((r, n) => ht([r], e[n] ? [e[n]] : []));
}
function Kt(t) {
  return t.some((e) => e.availability === "READY") ? "READY" : t.some((e) => e.availability === "UNKNOWN") ? "UNKNOWN" : (t.length > 0, "UNAVAILABLE");
}
function Le(t, e, r) {
  return pt(t, e, r);
}
function Xt(t, e) {
  let r;
  try {
    Zt(t), r = JSON.parse(t);
  } catch (g) {
    throw g instanceof H ? g : new H(`Manifest JSON の構文が正しくありません: ${e}`, g);
  }
  if (!dt(r)) throw new I("Manifest は JSON object である必要があります");
  if (r.manifestVersion !== "0.1") throw new I("Manifest の manifestVersion は 0.1 である必要があります");
  const n = q(r, "anchor"), s = q(r, "entity"), o = q(r, "description"), c = q(r, "lifecycle"), i = $(n, "id", "anchor"), u = $(s, "id", "entity"), a = $(o, "location", "description"), f = $(c, "status", "lifecycle");
  if (!Yt.test(i)) throw new I("Manifest の anchor.id が UUID ではありません");
  if (!Gt(u)) throw new I("Manifest の entity.id は絶対 URI である必要があります");
  let d;
  try {
    d = new URL(a);
  } catch {
    throw new I(`Manifest の description.location が不正です: ${a}`);
  }
  if (d.protocol !== "https:") throw new I("Manifest の description.location は HTTPS URL である必要があります");
  if (f !== "active" && f !== "suspended" && f !== "retired") throw new I("Manifest の lifecycle.status が不正です");
  return ee(i, e), { manifestVersion: "0.1", anchorId: i, entityId: u, descriptionLocation: d.href, lifecycleStatus: f };
}
const Yt = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function q(t, e) {
  const r = t[e];
  if (!dt(r)) throw new I(`Manifest の ${e} は object である必要があります`);
  return r;
}
function $(t, e, r) {
  const n = t[e];
  if (typeof n != "string" || n.length === 0) throw new I(`Manifest の ${r}.${e} は必須の文字列です`);
  return n;
}
function Gt(t) {
  try {
    return new URL(t).protocol.length > 0;
  } catch {
    return !1;
  }
}
function Zt(t) {
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
    const s = Qt(t, r);
    r = s.end;
    const o = te(t, r);
    if (t[o] !== ":" || e.length === 0) continue;
    const c = e[e.length - 1];
    if (c) {
      if (c.has(s.value)) throw new H(`Manifest JSON に重複した member name があります: ${s.value}`);
      c.add(s.value);
    }
  }
}
function Qt(t, e) {
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
function te(t, e) {
  let r = e;
  for (; r < t.length && /\s/.test(t[r] ?? ""); ) r += 1;
  return r;
}
function ee(t, e) {
  let r;
  try {
    r = new URL(e);
  } catch {
    return;
  }
  const n = r.pathname.match(/\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/manifest\/?$/i);
  if (n && n[1].toLowerCase() !== t.toLowerCase()) throw new I("Manifest の anchor.id が取得URLの UUID と一致しません");
}
function dt(t) {
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
const v = "https://relink.dev/ns/arxml/core/0.1", re = ["string", "number", "integer", "boolean", "binary", "object", "array"], mt = "http://www.w3.org/2000/xmlns/";
function ne(t, e, r = {}) {
  const n = t.root;
  if (!n || n.localName !== "ar-entity" || n.namespace !== v) throw new l("Draft 5 の ar-entity root が必要です");
  if (w(n, ["version"]), h(n, "version") !== "0.1") throw new l("version 属性には 0.1 が必要です");
  R(n, "ar-entity");
  const s = D(n, ["category", "identifiers", "properties", "subjects", "profiles", "interfaces", "capabilities"]), o = s.get("category"), c = o ? Ne(o, "category") : void 0, i = se(s.get("identifiers")), u = ie(s.get("subjects")), a = V(u.map((m) => m.id), "Subject"), f = oe(s.get("properties")), d = ae(s.get("profiles")), g = ce(s.get("interfaces")), p = V(g.map((m) => m.id), "Interface"), y = ue(s.get("capabilities"), r.format === "draft4");
  V(y.map((m) => m.localId), "Capability");
  for (const m of i) if (m.subjectRef && !a.has(m.subjectRef)) throw new l(`Identifier の subject-ref が解決できません: ${m.subjectRef}`);
  for (const m of y) {
    if (m.subjectRef && !a.has(m.subjectRef)) throw new l(`Capability の subject-ref が解決できません: ${m.subjectRef}`);
    for (const T of m.interfaceUses) if (!p.has(T.ref)) throw new l(`InterfaceUse の ref が解決できません: ${T.ref}`);
  }
  return { url: e, ...c ? { category: c } : {}, metadata: b(n), identifiers: i, properties: f.properties, propertyExtensions: f.extensions, subjects: u, profileClaims: d, interfaces: g, capabilities: y };
}
function D(t, e) {
  const r = /* @__PURE__ */ new Map();
  for (const n of t.children) {
    if (A(n), !e.includes(n.localName)) throw new l(`未知の Core 要素です: ${n.localName}`);
    if (r.has(n.localName)) throw new l(`Core container が重複しています: ${n.localName}`);
    r.set(n.localName, n);
  }
  return r;
}
function se(t) {
  return t ? (w(t, []), R(t, "identifiers"), t.children.map((e) => {
    A(e, "identifier"), w(e, ["type", "value", "subject-ref"]), x(e, "identifier");
    const r = E(h(e, "type"), "identifier/@type"), n = E(h(e, "value"), "identifier/@value");
    return { type: r, value: n, ...h(e, "subject-ref") ? { subjectRef: h(e, "subject-ref") } : {}, metadata: b(e) };
  })) : [];
}
function oe(t) {
  if (!t) return { properties: [], extensions: [] };
  w(t, []), R(t, "properties");
  const e = [], r = [];
  for (const n of t.children) {
    if (n.namespace !== v) {
      e.push(K(n));
      continue;
    }
    A(n, "property"), w(n, ["type", "value", "unit"]), x(n, "property");
    const s = n.children.map((o) => k(o, "property"));
    r.push({ type: E(h(n, "type"), "property/@type"), value: E(h(n, "value"), "property/@value"), ...h(n, "unit") ? { unit: h(n, "unit") } : {}, ...s.length > 0 ? { extensions: s } : {}, metadata: b(n) });
  }
  return { properties: r, extensions: e };
}
function ie(t) {
  return t ? (w(t, []), R(t, "subjects"), t.children.map((e) => (A(e, "subject"), w(e, ["id", "type"]), x(e, "subject"), { id: E(h(e, "id"), "subject/@id"), ...h(e, "type") ? { type: h(e, "type") } : {}, metadata: b(e) }))) : [];
}
function ae(t) {
  return t ? (w(t, []), R(t, "profiles"), t.children.map((e) => (A(e, "conforms-to"), w(e, ["href"]), x(e, "conforms-to"), { href: X(h(e, "href"), "conforms-to/@href"), metadata: b(e) }))) : [];
}
function ce(t) {
  return t ? (w(t, []), R(t, "interfaces"), t.children.map((e) => {
    A(e, "interface"), w(e, ["id"]), R(e, "interface");
    const r = D(e, ["attachment", "realization", "requirements"]), n = r.get("attachment"), s = r.get("realization");
    if (!n && !s) throw new l("Interface には attachment または realization が必要です");
    return { id: E(h(e, "id"), "interface/@id"), ...n ? { attachment: { extension: z(n, "attachment") } } : {}, ...s ? { realization: { extension: z(s, "realization") } } : {}, requirements: yt(r.get("requirements")), metadata: b(e) };
  })) : [];
}
function ue(t, e) {
  return t ? (w(t, []), R(t, "capabilities"), t.children.map((r) => {
    if (A(r, "capability"), w(r, ["id", "type", "subject-ref"]), R(r, "capability"), r.children.some((c) => c.namespace === v && ["inputs", "result", "interfaces"].includes(c.localName))) {
      if (!e) throw new l("Draft 4 Capability grammar は明示的な format=draft4 でのみ受理できます");
      return fe(r);
    }
    const n = D(r, ["requirements", "invocation", "interface-uses"]), s = de(n.get("invocation"));
    return { localId: E(h(r, "id"), "capability/@id"), semanticType: X(h(r, "type"), "capability/@type"), ...h(r, "subject-ref") ? { subjectRef: h(r, "subject-ref") } : {}, requirements: yt(n.get("requirements")), ...s ? { invocation: s } : {}, interfaceUses: we(n.get("interface-uses")), metadata: b(r) };
  })) : [];
}
function fe(t) {
  w(t, ["id", "type"]);
  const e = t.children.find((a) => a.namespace === v && a.localName === "inputs"), r = t.children.find((a) => a.namespace === v && a.localName === "result"), n = t.children.find((a) => a.namespace === v && a.localName === "interfaces"), s = e ? pe(e) : [], o = r ? le(r) : void 0, c = n ? he(n) : [], i = E(h(t, "id"), "capability/@id"), u = X(h(t, "type"), "capability/@type");
  return { localId: i, semanticType: u, inputs: s, result: o, interfaces: c, requirements: [], invocation: { inputs: s, ...o ? { result: o } : {} }, interfaceUses: [], legacyDraft4: !0, contractResolution: "UNRESOLVED", projectionValidation: "UNVALIDATED", availability: "READY", metadata: b(t) };
}
function pe(t) {
  return w(t, []), R(t, "inputs"), t.children.map((e) => j(e, !0));
}
function le(t) {
  w(t, []), R(t, "result");
  const e = t.children.find((n) => n.localName === "outputs");
  if (!e) throw new l("result には outputs が必要です");
  w(e, []), R(e, "outputs");
  const r = t.children.find((n) => n.localName === "representations");
  return { outputs: e.children.map((n) => j(n, !1)), representations: r ? wt(r) : [] };
}
function he(t) {
  return w(t, []), R(t, "interfaces"), t.children.map((e) => {
    A(e, "interface"), w(e, ["type", "method", "endpoint", "encoding"]), x(e, "interface");
    const r = h(e, "type"), n = h(e, "method");
    if (r !== "http" || n !== "GET" && n !== "POST") throw new l("Draft 4 HTTP Interface が不正です");
    const s = E(h(e, "endpoint"), "interface/@endpoint"), o = h(e, "encoding");
    if (o !== void 0 && o !== "json") throw new l("interface/@encoding が不正です");
    return { type: "http", method: n, endpoint: s, ...o ? { encoding: o } : {} };
  });
}
function de(t) {
  if (!t) return;
  w(t, []), R(t, "invocation");
  const e = D(t, ["inputs", "result"]), r = e.get("inputs");
  let n = [];
  r && (w(r, []), R(r, "inputs"), n = r.children.map((c) => j(c, !0)), Nt(n, "input"));
  const s = e.get("result"), o = s ? me(s) : void 0;
  return { inputs: n, ...o ? { result: o } : {}, metadata: b(t) };
}
function me(t) {
  w(t, []), R(t, "result");
  const e = D(t, ["outputs", "representations"]), r = e.get("outputs");
  if (!r) throw new l("result には outputs が必要です");
  w(r, []), R(r, "outputs");
  const n = r.children.map((c) => j(c, !1));
  if (Nt(n, "output"), n.length === 0) throw new l("result の outputs は1件以上必要です");
  const s = e.get("representations"), o = s ? wt(s) : [];
  return { outputs: n, representations: o };
}
function wt(t) {
  return w(t, []), R(t, "representations"), t.children.map((e) => {
    A(e, "representation"), w(e, ["media-type"]), x(e, "representation");
    const r = E(h(e, "media-type"), "representation/@media-type");
    if (!Re(r)) throw new l("representation media-type が不正です");
    return { mediaType: r, metadata: b(e) };
  });
}
function j(t, e) {
  A(t, e ? "input" : "output"), w(t, e ? ["name", "type", "required", "format", "unit"] : ["name", "type", "format", "unit"]), R(t, e ? "input" : "output");
  const r = ye(t);
  for (const i of t.children) if (i.namespace !== v || i.localName !== "constraints") throw new l(`${e ? "input" : "output"} の未知の子要素です: ${i.localName}`);
  const n = E(h(t, "name"), `${e ? "input" : "output"}/@name`), s = h(t, "type");
  if (!s || !re.includes(s)) throw new l(`${e ? "input" : "output"} type が未定義です: ${s ?? ""}`);
  const o = { name: n, type: s, ...h(t, "format") ? { format: h(t, "format") } : {}, ...h(t, "unit") ? { unit: h(t, "unit") } : {}, ...r.length > 0 ? { constraints: r } : {}, metadata: b(t) };
  if (!e) return o;
  const c = h(t, "required");
  if (c !== void 0 && c !== "true" && c !== "false") throw new l("input/@required は true または false である必要があります");
  return { ...o, required: c !== "false" };
}
function yt(t) {
  return t ? (w(t, []), R(t, "requirements"), t.children.map((e) => {
    A(e, "requirement"), w(e, ["type"]);
    const r = e.children.map((n) => k(n, "requirement"));
    return R(e, "requirement"), { type: E(h(e, "type"), "requirement/@type"), extensions: r, metadata: b(e) };
  })) : [];
}
function we(t) {
  return t ? (w(t, []), R(t, "interface-uses"), t.children.map((e) => {
    A(e, "interface-use"), w(e, ["ref"]), R(e, "interface-use");
    const n = D(e, ["mapping"]).get("mapping");
    return { ref: E(h(e, "ref"), "interface-use/@ref"), ...n ? { mapping: { extension: z(n, "mapping") } } : {}, metadata: b(e) };
  })) : [];
}
function z(t, e) {
  if (w(t, []), R(t, e), t.children.length !== 1) throw new l(`${e} には foreign Extension root が1つ必要です`);
  return k(t.children[0], e);
}
function k(t, e) {
  if (t.namespace === v || t.namespace.length === 0) throw new l(`${e} には foreign namespaced Extension が必要です`);
  return K(t);
}
function ye(t) {
  const e = t.children.filter((n) => n.namespace === v && n.localName === "constraints");
  if (e.length > 1) throw new l("constraints wrapper が重複しています");
  const r = e[0];
  return r ? (w(r, []), R(r, "constraints"), r.children.map((n) => k(n, "constraints"))) : [];
}
function A(t, e) {
  if (t.namespace !== v || e && t.localName !== e) throw new l(`Core 要素が不正です: ${t.localName}`);
}
function w(t, e) {
  for (const r of t.attributes)
    if (r.namespace !== mt && !(r.namespace !== "" && r.namespace !== v) && (r.namespace === v || !e.includes(r.localName)))
      throw new l(`未知の Core/unqualified attribute です: ${t.localName}/@${r.localName}`);
}
function b(t) {
  return t.attributes.filter((e) => e.namespace !== "" && e.namespace !== v && e.namespace !== mt).map((e) => ({ namespace: e.namespace, localName: e.localName, value: e.value }));
}
function h(t, e) {
  var r;
  return (r = t.attributes.find((n) => n.namespace === "" && n.localName === e)) == null ? void 0 : r.value;
}
function R(t, e) {
  if (t.text.trim().length > 0) throw new l(`${e} に予期しない文字データがあります`);
}
function x(t, e) {
  if (R(t, e), t.children.length > 0) throw new l(`${e} に予期しない子要素があります`);
}
function Ne(t, e) {
  const r = t.text.trim();
  if (r.length === 0 || t.children.length > 0) throw new l(`${e} は空でない文字列が必要です`);
  return w(t, []), r;
}
function E(t, e) {
  if (!t || t.trim().length === 0) throw new l(`${e} は必須です`);
  return t;
}
function V(t, e) {
  const r = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (r.has(n)) throw new l(`${e} id が重複しています: ${n}`);
    r.add(n);
  }
  return r;
}
function Nt(t, e) {
  const r = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (r.has(n.name)) throw new l(`${e} name が重複しています: ${n.name}`);
    r.add(n.name);
  }
}
function X(t, e) {
  var o;
  const r = E(t, e);
  let n;
  try {
    n = new URL(r);
  } catch {
    throw new l(`${e} は絶対 Semantic Identifier が必要です`);
  }
  if (!n.protocol || (n.protocol === "http:" || n.protocol === "https:") && !n.hostname) throw new l(`${e} は絶対 Semantic Identifier が必要です`);
  const s = (o = n.pathname.split("/").filter(Boolean).at(-1)) == null ? void 0 : o.toLowerCase();
  if (!s || s === "latest") throw new l(`${e} は exact-versioned identifier が必要です`);
  return r;
}
function Re(t) {
  return /^[^\s/;]+\/[^\s/;]+(?:\s*;\s*[^\s=;]+\s*=\s*(?:[^\s;]+|"[^"]*"))*$/.test(t);
}
class ge {
  permits(e, r) {
    const n = new URL(r);
    return e.protocol !== "http:" && e.protocol !== "https:" ? !1 : n.protocol !== "https:" || e.protocol === "https:";
  }
}
class Ce {
  constructor(e = {}) {
    U(this, "xmlParser");
    U(this, "resourceFetcher");
    U(this, "httpInvoker");
    U(this, "networkPolicy");
    U(this, "resourceNetworkPolicy");
    U(this, "semanticRegistry");
    U(this, "documentFormat");
    this.xmlParser = e.xmlParser ?? new Ut(), this.resourceFetcher = e.resourceFetcher ?? new vt(globalThis.fetch.bind(globalThis), { credentials: e.resourceCredentials }), this.httpInvoker = e.httpInvoker ?? new bt(), this.networkPolicy = e.networkPolicy ?? new St(), this.resourceNetworkPolicy = e.resourceNetworkPolicy ?? new ge(), this.semanticRegistry = e.semanticRegistry ?? new kt(), this.documentFormat = e.documentFormat ?? "draft5";
  }
  /** AR-XML または明示 Manifest 経由の description を取得します。Capability は実行しません。 */
  async load(e, r = {}) {
    const n = S(e), s = await this.fetchDocumentResource(e, n.href, r, Te(n.href));
    if (et(s)) {
      const o = Xt(s.body, S(s.responseUrl).href), c = S(o.descriptionLocation);
      return this.buildRuntimeDocument(await this.fetchDocumentResource(c.href, c.href, r, !1));
    }
    return this.buildRuntimeDocument(s);
  }
  async fetchDocumentResource(e, r, n, s) {
    const o = S(r);
    this.assertResourceRequest(S(e), o.href);
    const c = { signal: n.signal, credentials: n.credentials, beforeRequest: (a) => this.assertResourceRequest(S(a), o.href) };
    let i;
    try {
      i = await Ee(this.resourceFetcher, e, c);
    } catch (a) {
      throw s ? new G("Manifest の取得中に通信エラーが発生しました", e, void 0, a) : a;
    }
    if (i.status < 200 || i.status >= 300)
      throw s || et(i) ? new G(`Manifest の取得に失敗しました (${i.status})`, i.responseUrl, i.status, new F(i.status, i.responseUrl)) : new F(i.status, i.responseUrl);
    const u = S(i.responseUrl);
    this.assertResourceRequest(u, o.href);
    for (const a of i.redirectUrls ?? []) this.assertResourceRequest(S(a), o.href);
    return i;
  }
  buildRuntimeDocument(e) {
    const r = S(e.responseUrl);
    return new ve(ne(this.xmlParser.parse(e.body), r.href, { format: this.documentFormat }), this.httpInvoker, this.networkPolicy, this.semanticRegistry);
  }
  assertResourceRequest(e, r) {
    if (new URL(r).protocol === "https:" && e.protocol === "http:") throw new Tt(r, e.href);
    if (!this.resourceNetworkPolicy.permits(e, r)) throw new Et(e.href);
  }
}
function et(t) {
  var r, n;
  const e = (n = (r = t.contentType) == null ? void 0 : r.split(";", 1)[0]) == null ? void 0 : n.trim().toLowerCase();
  return e === "application/json" || (e == null ? void 0 : e.endsWith("+json")) === !0 || t.body.trimStart().startsWith("{");
}
function Te(t) {
  const e = new URL(t).pathname.toLowerCase();
  return e.endsWith("/manifest") || e.endsWith("/manifest.json") || e.endsWith(".manifest");
}
function S(t) {
  let e;
  try {
    e = new URL(t);
  } catch (r) {
    throw new C("AR-XML のURLが不正です", r);
  }
  if (e.protocol !== "http:" && e.protocol !== "https:") throw new C("AR-XML のURLにはHTTP(S)を指定してください");
  return e;
}
async function Ee(t, e, r) {
  if (t.fetchResource) return t.fetchResource(e, r);
  if (t.fetchText) return { requestedUrl: e, responseUrl: e, status: 200, body: await t.fetchText(e, r.signal) };
  throw new C("AR-XML の取得Adapterが設定されていません");
}
class ve {
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
    return r ? new be(r, this.document, this.httpInvoker, this.networkPolicy, this.semanticRegistry) : void 0;
  }
  evaluateCapability(e) {
    var r;
    return (r = this.getCapability(e)) == null ? void 0 : r.evaluation;
  }
  evaluateProfile(e) {
    return pt(this.document, e, this.semanticRegistry);
  }
}
class be {
  constructor(e, r, n, s, o) {
    U(this, "snapshot");
    this.capability = e, this.document = r, this.httpInvoker = n, this.networkPolicy = s, this.snapshot = Wt(e, r.interfaces, o);
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
      if (this.snapshot.availability !== "READY") throw new l(`Capability route が READY ではありません: ${this.snapshot.availability ?? "UNAVAILABLE"}`);
      return Q(this.capability, this.document.interfaces, this.document.url, e, r, this.httpInvoker, this.networkPolicy);
    }
    const n = this.snapshot.routes.filter((o) => o.availability === "READY"), s = r.routeId !== void 0 ? n.find((o) => o.routeId === r.routeId) : r.interfaceRef !== void 0 ? Ue(n, r.interfaceRef) : n.length === 1 ? n[0] : void 0;
    if (!s) throw new l(`READY な InterfaceUse route が一意に選択されていません: ${r.routeId ?? r.interfaceRef ?? this.snapshot.availability ?? "UNAVAILABLE"}`);
    if (r.interfaceRef !== void 0 && s.interfaceRef !== r.interfaceRef) throw new l("routeId と interfaceRef が一致しません");
    return Q(this.capability, this.document.interfaces, this.document.url, e, { ...r, routeId: s.routeId, interfaceRef: s.interfaceRef }, this.httpInvoker, this.networkPolicy);
  }
}
function Ue(t, e) {
  const r = t.filter((n) => n.interfaceRef === e);
  return r.length === 1 ? r[0] : void 0;
}
class De {
  constructor(e = []) {
    U(this, "processors");
    this.processors = e;
  }
  find(e, r) {
    return this.processors.find((n) => n.namespace === e.namespace && n.localName === e.localName && n.slots.includes(r));
  }
}
export {
  Ce as ARRuntime,
  O as ARRuntimeError,
  Se as CapabilityError,
  Ie as ContractError,
  Ae as ContractResolutionError,
  ge as DefaultResourceNetworkPolicy,
  kt as EmptySemanticRegistry,
  F as HTTPResponseError,
  Tt as HTTPSDowngradeError,
  De as InMemoryExtensionRegistry,
  Pe as InMemorySemanticRegistry,
  N as InterfaceError,
  _ as ManifestError,
  G as ManifestFetchError,
  H as ManifestParseError,
  I as ManifestValidationError,
  Et as NetworkPolicyError,
  Y as ParseError,
  P as RepresentationError,
  be as RuntimeCapability,
  ve as RuntimeDocument,
  C as TransportError,
  l as ValidationError,
  Wt as evaluateCapability,
  Le as evaluateProfile,
  pt as evaluateProfileDocument,
  Ft as resolveContract,
  Ht as validateProjection
};
