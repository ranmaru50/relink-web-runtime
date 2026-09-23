var Rt = Object.defineProperty;
var gt = (e, t, r) => t in e ? Rt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var U = (e, t, r) => gt(e, typeof t != "symbol" ? t + "" : t, r);
class O extends Error {
  constructor(t, r, n) {
    super(r), this.category = t, this.cause = n, this.name = t;
  }
}
class Y extends O {
  constructor(t, r) {
    super("ParseError", t, r);
  }
}
class l extends O {
  constructor(t) {
    super("ValidationError", t);
  }
}
class Ae extends O {
  constructor(t) {
    super("ContractResolutionError", t);
  }
}
class Ie extends O {
  constructor(t) {
    super("ContractError", t);
  }
}
class C extends O {
  constructor(t, r) {
    super("TransportError", t, r);
  }
}
class F extends O {
  constructor(t, r) {
    super("HTTPResponseError", `AR-XML の取得に失敗しました (${t})`), this.status = t, this.url = r;
  }
}
class Tt extends O {
  constructor(t, r) {
    super("HTTPSDowngradeError", "HTTPS から HTTP へのダウングレードは許可されません"), this.fromUrl = t, this.toUrl = r;
  }
}
class Et extends O {
  constructor(t) {
    super("NetworkPolicyError", "Runtime のネットワークポリシーによりドキュメント取得先が拒否されました"), this.url = t;
  }
}
class _ extends O {
  constructor(t, r, n) {
    super(t, r, n);
  }
}
class G extends _ {
  constructor(t, r, n, s) {
    super("ManifestFetchError", t, s), this.url = r, this.status = n;
  }
}
class H extends _ {
  constructor(t, r) {
    super("ManifestParseError", t, r);
  }
}
class I extends _ {
  constructor(t) {
    super("ManifestValidationError", t);
  }
}
class N extends O {
  constructor(t) {
    super("InterfaceError", t);
  }
}
class P extends O {
  constructor(t) {
    super("RepresentationError", t);
  }
}
class Se extends O {
  constructor(t) {
    super("CapabilityError", t);
  }
}
class vt {
  /** 既定の fetch はブラウザの globalThis に束縛して Illegal invocation を防ぎます。 */
  constructor(t = globalThis.fetch.bind(globalThis), r = {}) {
    this.fetcher = t, this.defaultOptions = r;
  }
  /** ブラウザのFetchリダイレクト処理後のレスポンス情報をRuntimeへ渡します。redirect先の制御はブラウザのFetch/CORS/mixed-contentに委ねます。 */
  async fetchResource(t, r = {}) {
    let n;
    const s = { signal: r.signal, redirect: "follow" }, o = r.credentials ?? this.defaultOptions.credentials;
    o !== void 0 && (s.credentials = o);
    try {
      n = await this.fetcher(t, s);
    } catch (u) {
      throw new C("AR-XML の取得中に通信エラーが発生しました", u);
    }
    const c = n.url || t, i = n.headers.get("content-type") ?? void 0;
    if (!n.ok) return { requestedUrl: t, responseUrl: c, status: n.status, body: "", contentType: i };
    try {
      return { requestedUrl: t, responseUrl: c, status: n.status, body: await n.text(), contentType: i };
    } catch (u) {
      throw new C("AR-XML 応答の読み取り中に通信エラーが発生しました", u);
    }
  }
  /** 旧ResourceFetcher APIを維持し、成功時の本文だけを返します。 */
  async fetchText(t, r) {
    const n = await this.fetchResource(t, { signal: r });
    if (n.status < 200 || n.status >= 300) throw new F(n.status, n.responseUrl);
    return n.body;
  }
}
class bt {
  /** 既定の fetch はブラウザの globalThis に束縛して Illegal invocation を防ぎます。 */
  constructor(t = globalThis.fetch.bind(globalThis)) {
    this.fetcher = t;
  }
  async invoke(t, r) {
    try {
      return await this.fetcher(t, { ...r, redirect: "error" });
    } catch (n) {
      throw new C("HTTP 呼び出し中に通信エラーが発生しました", n);
    }
  }
}
class Ut {
  parse(t) {
    const r = new DOMParser().parseFromString(t, "application/xml");
    if (r.querySelector("parsererror")) throw new Y("AR-XML の XML 構文が正しくありません");
    const n = r.documentElement;
    if (!n) throw new Y("AR-XML の root element がありません");
    const s = rt(n);
    return { root: s, namespace: s.namespace, rootName: s.localName, version: Ot(s, "", "version") };
  }
}
function rt(e) {
  const t = Array.from(e.children, rt), r = Array.from(e.childNodes).filter((s) => s.nodeType === Node.TEXT_NODE || s.nodeType === Node.CDATA_SECTION_NODE).map((s) => s.nodeValue ?? "").join(""), n = [];
  for (const s of Array.from(e.attributes))
    s.namespaceURI !== "http://www.w3.org/2000/xmlns/" && n.push({ namespace: s.namespaceURI ?? "", localName: s.localName, value: s.value });
  return { namespace: e.namespaceURI ?? "", localName: e.localName, attributes: n, children: t, text: r };
}
function Ot(e, t, r) {
  var n;
  return (n = e.attributes.find((s) => s.namespace === t && s.localName === r)) == null ? void 0 : n.value;
}
function At(e, t) {
  try {
    return new URL(t, e);
  } catch {
    throw new N("HTTP endpoint が不正です");
  }
}
function nt(e, t, r) {
  const n = Z(t), s = r.slice(0, r.indexOf(t)).filter((o) => Z(o) === n).length + 1;
  return `route:${encodeURIComponent(e)}:${encodeURIComponent(t.ref)}:${It(n)}:${s}`;
}
function Z(e) {
  var t;
  return `${e.ref}|${st((t = e.mapping) == null ? void 0 : t.extension)}`;
}
function st(e) {
  if (!e) return "";
  const t = [...e.attributes].sort((r, n) => `${r.namespace}:${r.localName}:${r.value}`.localeCompare(`${n.namespace}:${n.localName}:${n.value}`));
  return `${e.namespace}:${e.localName}[${t.map((r) => `${r.namespace}:${r.localName}=${r.value}`).join(";")}](${e.children.map(st).join("|")})${e.text ?? ""}`;
}
function It(e) {
  let t = 2166136261;
  for (const r of e) t = Math.imul(t ^ r.codePointAt(0), 16777619);
  return (t >>> 0).toString(16).padStart(8, "0");
}
class St {
  permits(t, r) {
    return t.origin === new URL(r).origin;
  }
}
const J = "https://relink.dev/ns/arxml/http/0.1";
async function Q(e, t, r, n, s, o, c) {
  if (e.legacyDraft4) return Pt(e, r, n, s, o, c);
  const i = e.invocation;
  if (!i) throw new N("Capability に Invocation がありません");
  const a = e.interfaceUses.map((d) => ({ routeId: nt(e.localId, d, e.interfaceUses), use: d, definition: t.find((g) => g.id === d.ref) })).filter((d) => d.definition !== void 0).filter(({ routeId: d, use: g, definition: p }) => {
    var y;
    return (s.routeId === void 0 || d === s.routeId) && (s.interfaceRef === void 0 || g.ref === s.interfaceRef) && Mt((y = p.realization) == null ? void 0 : y.extension);
  });
  if (a.length === 0) throw new N("指定された HTTP Extension route がありません");
  if (a.length > 1) throw new N("InterfaceUse route が一意に選択されていません");
  const f = a[0];
  return Lt(i, f.definition, f.use, r, n, s, o, c);
}
async function Pt(e, t, r, n, s, o) {
  var y, m, T;
  const c = e.invocation, i = (y = e.interfaces) == null ? void 0 : y[0];
  if (!c || !i) throw new N("呼び出し可能な HTTP Interface がありません");
  const u = At(t, i.endpoint);
  if (!o.permits(u, t)) throw new N("Runtime のネットワークポリシーにより endpoint が拒否されました");
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
async function Lt(e, t, r, n, s, o, c, i) {
  var T, L;
  const u = at((T = t.realization) == null ? void 0 : T.extension), a = ct((L = r.mapping) == null ? void 0 : L.extension);
  if (!a) throw new N("HTTP InterfaceUse に http:operation mapping がありません");
  const f = $t(n, u.base, a.path);
  if (!i.permits(f, n)) throw new N("Runtime のネットワークポリシーにより endpoint が拒否されました");
  const d = xt(e.result, o.accept), g = ot(a.method, f, e, s, d, o.signal), p = await c.invoke(f, g);
  if (p.status < 200 || p.status >= 300) throw new N(`HTTP Interface が非成功を返しました (${p.status})`);
  if (!e.result) return { values: {} };
  if (p.status === 204) throw new P("Result が宣言されているため 204 Response をマッピングできません");
  if (!jt(p.headers.get("content-type"))) throw new P("JSON Result に Content-Type: application/json が必要です");
  let m;
  try {
    m = JSON.parse(await p.text());
  } catch {
    throw new P("JSON Response の解析に失敗しました");
  }
  return { values: it(e.result.outputs, m), representation: d == null ? void 0 : d.mediaType };
}
function ot(e, t, r, n, s, o) {
  Ct(r.inputs, n);
  const c = new Headers();
  if (s && c.set("Accept", s.mediaType), e === "GET") {
    for (const u of r.inputs) {
      const a = n[u.name];
      if (a !== void 0) {
        if (!["string", "number", "integer", "boolean"].includes(u.type)) throw new N(`GET では ${u.type} Input を直列化できません`);
        if (t.searchParams.has(u.name)) throw new N(`既存 query と Input name が衝突しています: ${u.name}`);
        t.searchParams.append(u.name, Dt(a, u.type));
      }
    }
    return { method: e, headers: c, signal: o };
  }
  if (e !== "POST" && e !== "PUT" && e !== "PATCH") throw new N(`HTTP method の Input mapping に対応していません: ${e}`);
  const i = {};
  for (const u of r.inputs) {
    const a = n[u.name];
    if (a !== void 0) {
      if (u.type === "binary") throw new N("binary Input の JSON mapping は未対応です");
      i[u.name] = a;
    }
  }
  return c.set("Content-Type", "application/json"), { method: e, headers: c, body: JSON.stringify(i), signal: o };
}
function Ct(e, t) {
  for (const r of e) {
    const n = t[r.name];
    if (n === void 0) {
      if (r.required) throw new l(`required Input が不足しています: ${r.name}`);
      continue;
    }
    if (!B(n, r.type)) throw new l(`Input の型が一致しません: ${r.name}`);
  }
}
function Dt(e, t) {
  return t === "boolean" ? e === !0 ? "true" : "false" : String(e);
}
function B(e, t) {
  switch (t) {
    case "string":
      return typeof e == "string";
    case "number":
      return typeof e == "number" && Number.isFinite(e);
    case "integer":
      return typeof e == "number" && Number.isInteger(e);
    case "boolean":
      return typeof e == "boolean";
    case "object":
      return typeof e == "object" && e !== null && !Array.isArray(e);
    case "array":
      return Array.isArray(e);
    case "binary":
      return typeof Blob < "u" && e instanceof Blob;
  }
}
function xt(e, t) {
  if (!e) return;
  const r = e.representations.find((n) => n.mediaType.toLowerCase() === "application/json");
  if (!r) throw new N("Draft 5 HTTP JSON baseline には application/json Representation が必要です");
  if (t && !t.split(",").some((n) => ut(n.trim().toLowerCase(), r.mediaType.toLowerCase()))) throw new N("指定された Accept と Representation が一致しません");
  return r;
}
function qt(e, t) {
  if (!e) return;
  const r = e.representations[0];
  if (!r) throw new N("Result Representation がありません");
  if (t && !ut(t.toLowerCase(), r.mediaType.toLowerCase())) throw new N("指定された Accept と Representation が一致しません");
  return r;
}
function it(e, t) {
  if (typeof t != "object" || t === null || Array.isArray(t)) throw new P("JSON Result は top-level object である必要があります");
  const r = t, n = {};
  for (const s of e) {
    if (!(s.name in r)) throw new P(`Response に Output がありません: ${s.name}`);
    const o = r[s.name];
    if (!B(o, s.type)) throw new P(`Output の型が一致しません: ${s.name}`);
    n[s.name] = o;
  }
  return n;
}
function at(e) {
  var r;
  if (!e || e.namespace !== J || e.localName !== "api") throw new N("http:api Realization がありません");
  const t = (r = e.attributes.find((n) => n.namespace === "" && n.localName === "base")) == null ? void 0 : r.value;
  if (e.attributes.some((n) => n.namespace === "" && n.localName !== "base")) throw new N("http:api の未知属性です");
  if (e.text || e.children.length > 0) throw new N("http:api に子要素や文字データは指定できません");
  return { kind: "http:api", ...t !== void 0 ? { base: t } : {}, extension: e };
}
function ct(e) {
  var n, s;
  if (!e) return;
  if (e.namespace !== J || e.localName !== "operation") throw new N("未対応の HTTP Mapping です");
  const t = (n = e.attributes.find((o) => o.namespace === "" && o.localName === "method")) == null ? void 0 : n.value, r = (s = e.attributes.find((o) => o.namespace === "" && o.localName === "path")) == null ? void 0 : s.value;
  if (!t || !/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(t) || r === void 0) throw new N("http:operation の method/path が不正です");
  if (e.attributes.some((o) => o.namespace === "" && o.localName !== "method" && o.localName !== "path")) throw new N("http:operation の未知属性です");
  if (e.text || e.children.length > 0 || !M(r) || ft(r)) throw new N("http:operation path が不正です");
  return { kind: "http:operation", method: t, path: r, extension: e };
}
function $t(e, t, r) {
  if (!M(e) || !M(t ?? "") || !M(r) || ft(r)) throw new N("HTTP URI reference が不正です");
  let n;
  try {
    n = new URL(e);
  } catch {
    throw new N("AR-XML retrieval URL が不正です");
  }
  const s = new URL(t ?? "", n);
  if (s.protocol !== "http:" && s.protocol !== "https:" || !s.hostname) throw new N("HTTP base context が不正です");
  const o = new URL(r, s);
  if (o.hash = "", o.protocol !== "http:" && o.protocol !== "https:" || !o.hostname) throw new N("HTTP target が不正です");
  return o;
}
function Mt(e) {
  return (e == null ? void 0 : e.namespace) === J && e.localName === "api";
}
function jt(e) {
  var n;
  if (!e) return !1;
  const t = e.split(";");
  if (((n = t[0]) == null ? void 0 : n.trim().toLowerCase()) !== "application/json") return !1;
  const r = /* @__PURE__ */ new Set();
  for (const s of t.slice(1)) {
    const o = /^\s*([^=\s;]+)\s*=\s*(?:"(?:[^"\\]|\\.)*"|[^\s;]+)\s*$/.exec(s);
    if (!o || r.has(o[1].toLowerCase())) return !1;
    r.add(o[1].toLowerCase());
  }
  return !0;
}
function ut(e, t) {
  return e === t || e === "*/*" || e.endsWith("/*") && t.startsWith(e.slice(0, -1));
}
function M(e) {
  return !/[^\x00-\x7f]/.test(e) && !/[\\\s\u0000-\u001f\u007f]/.test(e) && !/(?:^|[^%])%(?![0-9A-Fa-f]{2})/.test(e);
}
function ft(e) {
  return e.startsWith("//") || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(e);
}
class kt {
  resolveCapability(t) {
    return [];
  }
  resolveProfile(t) {
    return [];
  }
}
class Pe {
  constructor(t = [], r = []) {
    U(this, "capabilities");
    U(this, "profiles");
    this.capabilities = t, this.profiles = r;
  }
  resolveCapability(t) {
    return this.capabilities.filter((r) => r.identifier === t);
  }
  resolveProfile(t) {
    return this.profiles.filter((r) => r.identifier === t);
  }
}
function pt(e, t, r) {
  const n = r.resolveProfile(t).filter((i) => i.identifier === t);
  if (n.length !== 1) return { resolution: "UNRESOLVED", conformance: "UNDETERMINED" };
  const s = n[0], o = new Set(e.capabilities.map((i) => i.semanticType));
  for (const i of s.requiredCapabilities ?? []) if (!o.has(i)) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  let c = !1;
  for (const i of s.capabilityRequirements ?? []) {
    if (i.required === !1) continue;
    const u = e.capabilities.filter((f) => f.semanticType === i.contractIdentifier);
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
    if (!e.properties.some((a) => a.type === i.type && (i.value === void 0 || a.value === i.value)) && i.required !== !1) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  for (const i of s.identifierRequirements ?? [])
    if (!e.identifiers.some((a) => a.type === i.type && (i.value === void 0 || a.value === i.value)) && i.required !== !1) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  for (const i of s.interfaceRequirements ?? [])
    if (!e.interfaces.some((a) => (i.id === void 0 || a.id === i.id) && (!i.requireRealization || a.realization !== void 0)) && i.required !== !1) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  return { resolution: "RESOLVED", conformance: c ? "UNDETERMINED" : "CONFORMANT" };
}
function Vt(e, t) {
  var s, o, c, i, u, a;
  if ((((s = t.requiredInputNames) == null ? void 0 : s.length) ?? 0) > 0 && !e.invocation || (((o = t.requiredOutputNames) == null ? void 0 : o.length) ?? 0) > 0 && !((c = e.invocation) != null && c.result)) return "UNDETERMINED";
  const r = new Set((i = e.invocation) == null ? void 0 : i.inputs.map((f) => f.name));
  if ((t.requiredInputNames ?? []).some((f) => !r.has(f))) return "NON_CONFORMANT";
  const n = new Set((a = (u = e.invocation) == null ? void 0 : u.result) == null ? void 0 : a.outputs.map((f) => f.name));
  return (t.requiredOutputNames ?? []).some((f) => !n.has(f)) ? "NON_CONFORMANT" : "CONFORMANT";
}
function Ft(e, t) {
  const r = t.resolveCapability(e).filter((n) => n.identifier === e);
  return r.length !== 1 ? { state: "UNRESOLVED" } : { state: "RESOLVED", contract: r[0] };
}
function Ht(e, t, r) {
  var i, u;
  if (r !== "RESOLVED" || !t) return "UNVALIDATED";
  const n = t.invocation;
  let s = !1, o = !1;
  if (!n && e.invocation && (s = !0), n && !e.invocation && (s = !0), n && e.invocation) {
    const a = n.inputs ?? [], f = e.invocation.inputs;
    a.length !== f.length && (s = !0);
    const d = new Set(t.permittedInputRequirednessNarrowing ?? []);
    for (const p of a) {
      const y = f.find((m) => m.name === p.name);
      if (!y || y.type !== p.type) {
        s = !0;
        continue;
      }
      p.required && !y.required && (s = !0), !p.required && y.required && !d.has(p.name) && (s = !0), (y.format !== p.format || y.unit !== p.unit) && (o = !0);
    }
    if (!!n.result != !!e.invocation.result && (s = !0), n.result && e.invocation.result) {
      n.result.outputs.length !== e.invocation.result.outputs.length && (s = !0);
      for (const m of n.result.outputs) {
        const T = e.invocation.result.outputs.find((L) => L.name === m.name);
        if (!T || T.type !== m.type) {
          s = !0;
          continue;
        }
        (T.format !== m.format || T.unit !== m.unit) && (o = !0);
      }
      const p = n.result.representations.map((m) => m.mediaType.toLowerCase()).sort(), y = e.invocation.result.representations.map((m) => m.mediaType.toLowerCase()).sort();
      (p.length !== y.length || p.some((m, T) => m !== y[T])) && (s = !0);
    }
    ((n.inputs ?? []).some((p) => {
      var y;
      return (((y = p.constraints) == null ? void 0 : y.length) ?? 0) > 0;
    }) || e.invocation.inputs.some((p) => {
      var y;
      return (((y = p.constraints) == null ? void 0 : y.length) ?? 0) > 0;
    }) || ((i = n.result) == null ? void 0 : i.outputs.some((p) => {
      var y;
      return (((y = p.constraints) == null ? void 0 : y.length) ?? 0) > 0;
    })) === !0 || ((u = e.invocation.result) == null ? void 0 : u.outputs.some((p) => {
      var y;
      return (((y = p.constraints) == null ? void 0 : y.length) ?? 0) > 0;
    })) === !0) && (o = !0);
  }
  const c = _t(lt(t), e.requirements);
  return s || c.conflict ? "CONFLICT" : o || c.unknown ? "UNVALIDATED" : "VALIDATED";
}
function Wt(e, t, r) {
  if (e.legacyDraft4) return { contractResolution: "UNRESOLVED", projectionValidation: "UNVALIDATED", availability: "READY", routes: [] };
  const n = Ft(e.semanticType, r), s = Ht(e, n.contract, n.state);
  if (!e.invocation) return { contractResolution: n.state, projectionValidation: s, routes: [] };
  const o = W(e.requirements), c = n.contract ? lt(n.contract) : [], i = n.state === "RESOLVED" ? W(c) : "UNKNOWN", u = e.interfaceUses.map((f) => zt(nt(e.localId, f, e.interfaceUses), f, t.find((d) => d.id === f.ref), s, o, i)), a = Kt(u);
  return { contractResolution: n.state, projectionValidation: s, ...a ? { availability: a } : {}, routes: u };
}
function zt(e, t, r, n, s, o) {
  var g;
  if (!r) return { routeId: e, interfaceRef: t.ref, requirement: tt([s, o]), capabilityRequirement: s, contractRequirement: o, interfaceRequirement: "SATISFIED", attachment: "SATISFIED", support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "Interface が存在しません" };
  const c = W(r.requirements), i = tt([s, o, c]), u = r.attachment ? "UNKNOWN" : "SATISFIED";
  if (!r.realization) return { routeId: e, interfaceRef: t.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "Realization がありません" };
  if (r.realization.extension.namespace !== "https://relink.dev/ns/arxml/http/0.1" || r.realization.extension.localName !== "api") return { routeId: e, interfaceRef: t.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: "UNKNOWN", availability: "UNKNOWN", reason: "未知の Realization です" };
  try {
    at(r.realization.extension);
  } catch {
    return { routeId: e, interfaceRef: t.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "HTTP Realization が不正です" };
  }
  let a = "SUPPORTED", f = "";
  const d = (g = t.mapping) == null ? void 0 : g.extension;
  if (d && (d.namespace !== "https://relink.dev/ns/arxml/http/0.1" || d.localName !== "operation"))
    a = "UNKNOWN";
  else
    try {
      const p = ct(d);
      p ? f = p.method : a = "UNSUPPORTED";
    } catch {
      a = "UNSUPPORTED";
    }
  return a === "SUPPORTED" && !["GET", "POST", "PUT", "PATCH"].includes(f) && (a = "UNSUPPORTED"), n === "CONFLICT" || a === "UNSUPPORTED" || i === "UNSATISFIED" ? { routeId: e, interfaceRef: t.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: a, availability: "UNAVAILABLE", reason: n === "CONFLICT" ? "Capability projection が CONFLICT です" : "HTTP Mapping が未対応です" } : n === "UNVALIDATED" || i === "UNKNOWN" || u === "UNKNOWN" || a === "UNKNOWN" ? { routeId: e, interfaceRef: t.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: a, availability: "UNKNOWN", reason: "必要な評価が UNKNOWN です" } : { routeId: e, interfaceRef: t.ref, requirement: i, capabilityRequirement: s, contractRequirement: o, interfaceRequirement: c, attachment: u, support: a, availability: "READY" };
}
function W(e) {
  return e.length === 0 ? "SATISFIED" : "UNKNOWN";
}
function tt(e) {
  return e.includes("UNSATISFIED") ? "UNSATISFIED" : e.includes("UNKNOWN") ? "UNKNOWN" : "SATISFIED";
}
function lt(e) {
  var t;
  return [...e.requirements ?? [], ...((t = e.invocation) == null ? void 0 : t.requirements) ?? []];
}
function _t(e, t) {
  const r = /* @__PURE__ */ new Set();
  let n = !1;
  for (const s of e) {
    const o = t.findIndex((c, i) => !r.has(i) && Jt(s, c));
    if (o >= 0) {
      r.add(o);
      continue;
    }
    if (t.some((c) => c.type === s.type)) {
      n = !0;
      continue;
    }
    return { conflict: !0, unknown: n };
  }
  return { conflict: !1, unknown: n };
}
function Jt(e, t) {
  return e.type === t.type && ht(e.extensions, t.extensions);
}
function ht(e, t) {
  return e.length !== t.length ? !1 : e.every((r, n) => {
    const s = t[n];
    return r.namespace === (s == null ? void 0 : s.namespace) && r.localName === s.localName && r.text === s.text && r.attributes.length === ((s == null ? void 0 : s.attributes.length) ?? -1) && r.attributes.every((o, c) => {
      const i = s == null ? void 0 : s.attributes[c];
      return o.namespace === (i == null ? void 0 : i.namespace) && o.localName === i.localName && o.value === i.value;
    }) && Bt(r.children, (s == null ? void 0 : s.children) ?? []);
  });
}
function Bt(e, t) {
  return e.length !== t.length ? !1 : e.every((r, n) => ht([r], t[n] ? [t[n]] : []));
}
function Kt(e) {
  return e.some((t) => t.availability === "READY") ? "READY" : e.some((t) => t.availability === "UNKNOWN") ? "UNKNOWN" : (e.length > 0, "UNAVAILABLE");
}
function Le(e, t, r) {
  return pt(e, t, r);
}
function Xt(e, t) {
  let r;
  try {
    Zt(e), r = JSON.parse(e);
  } catch (g) {
    throw g instanceof H ? g : new H(`Manifest JSON の構文が正しくありません: ${t}`, g);
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
  return ee(i, t), { manifestVersion: "0.1", anchorId: i, entityId: u, descriptionLocation: d.href, lifecycleStatus: f };
}
const Yt = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function q(e, t) {
  const r = e[t];
  if (!dt(r)) throw new I(`Manifest の ${t} は object である必要があります`);
  return r;
}
function $(e, t, r) {
  const n = e[t];
  if (typeof n != "string" || n.length === 0) throw new I(`Manifest の ${r}.${t} は必須の文字列です`);
  return n;
}
function Gt(e) {
  try {
    return new URL(e).protocol.length > 0;
  } catch {
    return !1;
  }
}
function Zt(e) {
  const t = [];
  let r = 0;
  for (; r < e.length; ) {
    const n = e[r];
    if (n === "{") {
      t.push(/* @__PURE__ */ new Set()), r += 1;
      continue;
    }
    if (n === "}") {
      t.pop(), r += 1;
      continue;
    }
    if (n !== '"') {
      r += 1;
      continue;
    }
    const s = Qt(e, r);
    r = s.end;
    const o = te(e, r);
    if (e[o] !== ":" || t.length === 0) continue;
    const c = t[t.length - 1];
    if (c) {
      if (c.has(s.value)) throw new H(`Manifest JSON に重複した member name があります: ${s.value}`);
      c.add(s.value);
    }
  }
}
function Qt(e, t) {
  let r = t + 1;
  for (; r < e.length; ) {
    if (e[r] === "\\") {
      r += 2;
      continue;
    }
    if (e[r] === '"') {
      const n = e.slice(t, r + 1);
      return { value: JSON.parse(n), end: r + 1 };
    }
    r += 1;
  }
  throw new SyntaxError("Unterminated JSON string");
}
function te(e, t) {
  let r = t;
  for (; r < e.length && /\s/.test(e[r] ?? ""); ) r += 1;
  return r;
}
function ee(e, t) {
  let r;
  try {
    r = new URL(t);
  } catch {
    return;
  }
  const n = r.pathname.match(/\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/manifest\/?$/i);
  if (n && n[1].toLowerCase() !== e.toLowerCase()) throw new I("Manifest の anchor.id が取得URLの UUID と一致しません");
}
function dt(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function K(e) {
  const t = e.text.trim();
  return {
    namespace: e.namespace,
    localName: e.localName,
    attributes: e.attributes.map((r) => ({ namespace: r.namespace, localName: r.localName, value: r.value })),
    children: e.children.map(K),
    ...t.length > 0 ? { text: t } : {}
  };
}
const v = "https://relink.dev/ns/arxml/core/0.1", re = ["string", "number", "integer", "boolean", "binary", "object", "array"], mt = "http://www.w3.org/2000/xmlns/";
function ne(e, t, r = {}) {
  const n = e.root;
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
  return { url: t, ...c ? { category: c } : {}, metadata: b(n), identifiers: i, properties: f.properties, propertyExtensions: f.extensions, subjects: u, profileClaims: d, interfaces: g, capabilities: y };
}
function D(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of e.children) {
    if (A(n), !t.includes(n.localName)) throw new l(`未知の Core 要素です: ${n.localName}`);
    if (r.has(n.localName)) throw new l(`Core container が重複しています: ${n.localName}`);
    r.set(n.localName, n);
  }
  return r;
}
function se(e) {
  return e ? (w(e, []), R(e, "identifiers"), e.children.map((t) => {
    A(t, "identifier"), w(t, ["type", "value", "subject-ref"]), x(t, "identifier");
    const r = E(h(t, "type"), "identifier/@type"), n = E(h(t, "value"), "identifier/@value");
    return { type: r, value: n, ...h(t, "subject-ref") ? { subjectRef: h(t, "subject-ref") } : {}, metadata: b(t) };
  })) : [];
}
function oe(e) {
  if (!e) return { properties: [], extensions: [] };
  w(e, []), R(e, "properties");
  const t = [], r = [];
  for (const n of e.children) {
    if (n.namespace !== v) {
      t.push(K(n));
      continue;
    }
    A(n, "property"), w(n, ["type", "value", "unit"]), x(n, "property");
    const s = n.children.map((o) => k(o, "property"));
    r.push({ type: E(h(n, "type"), "property/@type"), value: E(h(n, "value"), "property/@value"), ...h(n, "unit") ? { unit: h(n, "unit") } : {}, ...s.length > 0 ? { extensions: s } : {}, metadata: b(n) });
  }
  return { properties: r, extensions: t };
}
function ie(e) {
  return e ? (w(e, []), R(e, "subjects"), e.children.map((t) => (A(t, "subject"), w(t, ["id", "type"]), x(t, "subject"), { id: E(h(t, "id"), "subject/@id"), ...h(t, "type") ? { type: h(t, "type") } : {}, metadata: b(t) }))) : [];
}
function ae(e) {
  return e ? (w(e, []), R(e, "profiles"), e.children.map((t) => (A(t, "conforms-to"), w(t, ["href"]), x(t, "conforms-to"), { href: X(h(t, "href"), "conforms-to/@href"), metadata: b(t) }))) : [];
}
function ce(e) {
  return e ? (w(e, []), R(e, "interfaces"), e.children.map((t) => {
    A(t, "interface"), w(t, ["id"]), R(t, "interface");
    const r = D(t, ["attachment", "realization", "requirements"]), n = r.get("attachment"), s = r.get("realization");
    if (!n && !s) throw new l("Interface には attachment または realization が必要です");
    return { id: E(h(t, "id"), "interface/@id"), ...n ? { attachment: { extension: z(n, "attachment") } } : {}, ...s ? { realization: { extension: z(s, "realization") } } : {}, requirements: yt(r.get("requirements")), metadata: b(t) };
  })) : [];
}
function ue(e, t) {
  return e ? (w(e, []), R(e, "capabilities"), e.children.map((r) => {
    if (A(r, "capability"), w(r, ["id", "type", "subject-ref"]), R(r, "capability"), r.children.some((c) => c.namespace === v && ["inputs", "result", "interfaces"].includes(c.localName))) {
      if (!t) throw new l("Draft 4 Capability grammar は明示的な format=draft4 でのみ受理できます");
      return fe(r);
    }
    const n = D(r, ["requirements", "invocation", "interface-uses"]), s = de(n.get("invocation"));
    return { localId: E(h(r, "id"), "capability/@id"), semanticType: X(h(r, "type"), "capability/@type"), ...h(r, "subject-ref") ? { subjectRef: h(r, "subject-ref") } : {}, requirements: yt(n.get("requirements")), ...s ? { invocation: s } : {}, interfaceUses: we(n.get("interface-uses")), metadata: b(r) };
  })) : [];
}
function fe(e) {
  w(e, ["id", "type"]);
  const t = e.children.find((a) => a.namespace === v && a.localName === "inputs"), r = e.children.find((a) => a.namespace === v && a.localName === "result"), n = e.children.find((a) => a.namespace === v && a.localName === "interfaces"), s = t ? pe(t) : [], o = r ? le(r) : void 0, c = n ? he(n) : [], i = E(h(e, "id"), "capability/@id"), u = X(h(e, "type"), "capability/@type");
  return { localId: i, semanticType: u, inputs: s, result: o, interfaces: c, requirements: [], invocation: { inputs: s, ...o ? { result: o } : {} }, interfaceUses: [], legacyDraft4: !0, contractResolution: "UNRESOLVED", projectionValidation: "UNVALIDATED", availability: "READY", metadata: b(e) };
}
function pe(e) {
  return w(e, []), R(e, "inputs"), e.children.map((t) => j(t, !0));
}
function le(e) {
  w(e, []), R(e, "result");
  const t = e.children.find((n) => n.localName === "outputs");
  if (!t) throw new l("result には outputs が必要です");
  w(t, []), R(t, "outputs");
  const r = e.children.find((n) => n.localName === "representations");
  return { outputs: t.children.map((n) => j(n, !1)), representations: r ? wt(r) : [] };
}
function he(e) {
  return w(e, []), R(e, "interfaces"), e.children.map((t) => {
    A(t, "interface"), w(t, ["type", "method", "endpoint", "encoding"]), x(t, "interface");
    const r = h(t, "type"), n = h(t, "method");
    if (r !== "http" || n !== "GET" && n !== "POST") throw new l("Draft 4 HTTP Interface が不正です");
    const s = E(h(t, "endpoint"), "interface/@endpoint"), o = h(t, "encoding");
    if (o !== void 0 && o !== "json") throw new l("interface/@encoding が不正です");
    return { type: "http", method: n, endpoint: s, ...o ? { encoding: o } : {} };
  });
}
function de(e) {
  if (!e) return;
  w(e, []), R(e, "invocation");
  const t = D(e, ["inputs", "result"]), r = t.get("inputs");
  let n = [];
  r && (w(r, []), R(r, "inputs"), n = r.children.map((c) => j(c, !0)), Nt(n, "input"));
  const s = t.get("result"), o = s ? me(s) : void 0;
  return { inputs: n, ...o ? { result: o } : {}, metadata: b(e) };
}
function me(e) {
  w(e, []), R(e, "result");
  const t = D(e, ["outputs", "representations"]), r = t.get("outputs");
  if (!r) throw new l("result には outputs が必要です");
  w(r, []), R(r, "outputs");
  const n = r.children.map((c) => j(c, !1));
  if (Nt(n, "output"), n.length === 0) throw new l("result の outputs は1件以上必要です");
  const s = t.get("representations"), o = s ? wt(s) : [];
  return { outputs: n, representations: o };
}
function wt(e) {
  return w(e, []), R(e, "representations"), e.children.map((t) => {
    A(t, "representation"), w(t, ["media-type"]), x(t, "representation");
    const r = E(h(t, "media-type"), "representation/@media-type");
    if (!Re(r)) throw new l("representation media-type が不正です");
    return { mediaType: r, metadata: b(t) };
  });
}
function j(e, t) {
  A(e, t ? "input" : "output"), w(e, t ? ["name", "type", "required", "format", "unit"] : ["name", "type", "format", "unit"]), R(e, t ? "input" : "output");
  const r = ye(e);
  for (const i of e.children) if (i.namespace !== v || i.localName !== "constraints") throw new l(`${t ? "input" : "output"} の未知の子要素です: ${i.localName}`);
  const n = E(h(e, "name"), `${t ? "input" : "output"}/@name`), s = h(e, "type");
  if (!s || !re.includes(s)) throw new l(`${t ? "input" : "output"} type が未定義です: ${s ?? ""}`);
  const o = { name: n, type: s, ...h(e, "format") ? { format: h(e, "format") } : {}, ...h(e, "unit") ? { unit: h(e, "unit") } : {}, ...r.length > 0 ? { constraints: r } : {}, metadata: b(e) };
  if (!t) return o;
  const c = h(e, "required");
  if (c !== void 0 && c !== "true" && c !== "false") throw new l("input/@required は true または false である必要があります");
  return { ...o, required: c !== "false" };
}
function yt(e) {
  return e ? (w(e, []), R(e, "requirements"), e.children.map((t) => {
    A(t, "requirement"), w(t, ["type"]);
    const r = t.children.map((n) => k(n, "requirement"));
    return R(t, "requirement"), { type: E(h(t, "type"), "requirement/@type"), extensions: r, metadata: b(t) };
  })) : [];
}
function we(e) {
  return e ? (w(e, []), R(e, "interface-uses"), e.children.map((t) => {
    A(t, "interface-use"), w(t, ["ref"]), R(t, "interface-use");
    const n = D(t, ["mapping"]).get("mapping");
    return { ref: E(h(t, "ref"), "interface-use/@ref"), ...n ? { mapping: { extension: z(n, "mapping") } } : {}, metadata: b(t) };
  })) : [];
}
function z(e, t) {
  if (w(e, []), R(e, t), e.children.length !== 1) throw new l(`${t} には foreign Extension root が1つ必要です`);
  return k(e.children[0], t);
}
function k(e, t) {
  if (e.namespace === v || e.namespace.length === 0) throw new l(`${t} には foreign namespaced Extension が必要です`);
  return K(e);
}
function ye(e) {
  const t = e.children.filter((n) => n.namespace === v && n.localName === "constraints");
  if (t.length > 1) throw new l("constraints wrapper が重複しています");
  const r = t[0];
  return r ? (w(r, []), R(r, "constraints"), r.children.map((n) => k(n, "constraints"))) : [];
}
function A(e, t) {
  if (e.namespace !== v || t && e.localName !== t) throw new l(`Core 要素が不正です: ${e.localName}`);
}
function w(e, t) {
  for (const r of e.attributes)
    if (r.namespace !== mt && !(r.namespace !== "" && r.namespace !== v) && (r.namespace === v || !t.includes(r.localName)))
      throw new l(`未知の Core/unqualified attribute です: ${e.localName}/@${r.localName}`);
}
function b(e) {
  return e.attributes.filter((t) => t.namespace !== "" && t.namespace !== v && t.namespace !== mt).map((t) => ({ namespace: t.namespace, localName: t.localName, value: t.value }));
}
function h(e, t) {
  var r;
  return (r = e.attributes.find((n) => n.namespace === "" && n.localName === t)) == null ? void 0 : r.value;
}
function R(e, t) {
  if (e.text.trim().length > 0) throw new l(`${t} に予期しない文字データがあります`);
}
function x(e, t) {
  if (R(e, t), e.children.length > 0) throw new l(`${t} に予期しない子要素があります`);
}
function Ne(e, t) {
  const r = e.text.trim();
  if (r.length === 0 || e.children.length > 0) throw new l(`${t} は空でない文字列が必要です`);
  return w(e, []), r;
}
function E(e, t) {
  if (!e || e.trim().length === 0) throw new l(`${t} は必須です`);
  return e;
}
function V(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (r.has(n)) throw new l(`${t} id が重複しています: ${n}`);
    r.add(n);
  }
  return r;
}
function Nt(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (r.has(n.name)) throw new l(`${t} name が重複しています: ${n.name}`);
    r.add(n.name);
  }
}
function X(e, t) {
  var o;
  const r = E(e, t);
  let n;
  try {
    n = new URL(r);
  } catch {
    throw new l(`${t} は絶対 Semantic Identifier が必要です`);
  }
  if (!n.protocol || (n.protocol === "http:" || n.protocol === "https:") && !n.hostname) throw new l(`${t} は絶対 Semantic Identifier が必要です`);
  const s = (o = n.pathname.split("/").filter(Boolean).at(-1)) == null ? void 0 : o.toLowerCase();
  if (!s || s === "latest") throw new l(`${t} は exact-versioned identifier が必要です`);
  return r;
}
function Re(e) {
  return /^[^\s/;]+\/[^\s/;]+(?:\s*;\s*[^\s=;]+\s*=\s*(?:[^\s;]+|"[^"]*"))*$/.test(e);
}
class ge {
  permits(t, r) {
    const n = new URL(r);
    return t.protocol !== "http:" && t.protocol !== "https:" ? !1 : n.protocol !== "https:" || t.protocol === "https:";
  }
}
class Ce {
  constructor(t = {}) {
    U(this, "xmlParser");
    U(this, "resourceFetcher");
    U(this, "httpInvoker");
    U(this, "networkPolicy");
    U(this, "resourceNetworkPolicy");
    U(this, "semanticRegistry");
    U(this, "documentFormat");
    this.xmlParser = t.xmlParser ?? new Ut(), this.resourceFetcher = t.resourceFetcher ?? new vt(globalThis.fetch.bind(globalThis), { credentials: t.resourceCredentials }), this.httpInvoker = t.httpInvoker ?? new bt(), this.networkPolicy = t.networkPolicy ?? new St(), this.resourceNetworkPolicy = t.resourceNetworkPolicy ?? new ge(), this.semanticRegistry = t.semanticRegistry ?? new kt(), this.documentFormat = t.documentFormat ?? "draft5";
  }
  /** AR-XML または明示 Manifest 経由の description を取得します。Capability は実行しません。 */
  async load(t, r = {}) {
    const n = S(t), s = await this.fetchDocumentResource(t, n.href, r, Te(n.href));
    if (et(s)) {
      const o = Xt(s.body, S(s.responseUrl).href), c = S(o.descriptionLocation);
      return this.buildRuntimeDocument(await this.fetchDocumentResource(c.href, c.href, r, !1));
    }
    return this.buildRuntimeDocument(s);
  }
  async fetchDocumentResource(t, r, n, s) {
    const o = S(r);
    this.assertResourceRequest(S(t), o.href);
    const c = { signal: n.signal, credentials: n.credentials, beforeRequest: (a) => this.assertResourceRequest(S(a), o.href) };
    let i;
    try {
      i = await Ee(this.resourceFetcher, t, c);
    } catch (a) {
      throw s ? new G("Manifest の取得中に通信エラーが発生しました", t, void 0, a) : a;
    }
    if (i.status < 200 || i.status >= 300)
      throw s || et(i) ? new G(`Manifest の取得に失敗しました (${i.status})`, i.responseUrl, i.status, new F(i.status, i.responseUrl)) : new F(i.status, i.responseUrl);
    const u = S(i.responseUrl);
    this.assertResourceRequest(u, o.href);
    for (const a of i.redirectUrls ?? []) this.assertResourceRequest(S(a), o.href);
    return i;
  }
  buildRuntimeDocument(t) {
    const r = S(t.responseUrl);
    return new ve(ne(this.xmlParser.parse(t.body), r.href, { format: this.documentFormat }), this.httpInvoker, this.networkPolicy, this.semanticRegistry);
  }
  assertResourceRequest(t, r) {
    if (new URL(r).protocol === "https:" && t.protocol === "http:") throw new Tt(r, t.href);
    if (!this.resourceNetworkPolicy.permits(t, r)) throw new Et(t.href);
  }
}
function et(e) {
  var r, n;
  const t = (n = (r = e.contentType) == null ? void 0 : r.split(";", 1)[0]) == null ? void 0 : n.trim().toLowerCase();
  return t === "application/json" || (t == null ? void 0 : t.endsWith("+json")) === !0 || e.body.trimStart().startsWith("{");
}
function Te(e) {
  const t = new URL(e).pathname.toLowerCase();
  return t.endsWith("/manifest") || t.endsWith("/manifest.json") || t.endsWith(".manifest");
}
function S(e) {
  let t;
  try {
    t = new URL(e);
  } catch (r) {
    throw new C("AR-XML のURLが不正です", r);
  }
  if (t.protocol !== "http:" && t.protocol !== "https:") throw new C("AR-XML のURLにはHTTP(S)を指定してください");
  return t;
}
async function Ee(e, t, r) {
  if (e.fetchResource) return e.fetchResource(t, r);
  if (e.fetchText) return { requestedUrl: t, responseUrl: t, status: 200, body: await e.fetchText(t, r.signal) };
  throw new C("AR-XML の取得Adapterが設定されていません");
}
class ve {
  constructor(t, r, n, s) {
    this.document = t, this.httpInvoker = r, this.networkPolicy = n, this.semanticRegistry = s;
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
  getCapability(t) {
    const r = this.document.capabilities.find((n) => n.localId === t);
    return r ? new be(r, this.document, this.httpInvoker, this.networkPolicy, this.semanticRegistry) : void 0;
  }
  evaluateCapability(t) {
    var r;
    return (r = this.getCapability(t)) == null ? void 0 : r.evaluation;
  }
  evaluateProfile(t) {
    return pt(this.document, t, this.semanticRegistry);
  }
}
class be {
  constructor(t, r, n, s, o) {
    U(this, "snapshot");
    this.capability = t, this.document = r, this.httpInvoker = n, this.networkPolicy = s, this.snapshot = Wt(t, r.interfaces, o);
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
  async invoke(t, r = {}) {
    if (this.capability.legacyDraft4) {
      if (this.snapshot.availability !== "READY") throw new l(`Capability route が READY ではありません: ${this.snapshot.availability ?? "UNAVAILABLE"}`);
      return Q(this.capability, this.document.interfaces, this.document.url, t, r, this.httpInvoker, this.networkPolicy);
    }
    const n = this.snapshot.routes.filter((o) => o.availability === "READY"), s = r.routeId !== void 0 ? n.find((o) => o.routeId === r.routeId) : r.interfaceRef !== void 0 ? Ue(n, r.interfaceRef) : n.length === 1 ? n[0] : void 0;
    if (!s) throw new l(`READY な InterfaceUse route が一意に選択されていません: ${r.routeId ?? r.interfaceRef ?? this.snapshot.availability ?? "UNAVAILABLE"}`);
    if (r.interfaceRef !== void 0 && s.interfaceRef !== r.interfaceRef) throw new l("routeId と interfaceRef が一致しません");
    return Q(this.capability, this.document.interfaces, this.document.url, t, { ...r, routeId: s.routeId, interfaceRef: s.interfaceRef }, this.httpInvoker, this.networkPolicy);
  }
}
function Ue(e, t) {
  const r = e.filter((n) => n.interfaceRef === t);
  return r.length === 1 ? r[0] : void 0;
}
class De {
  constructor(t = []) {
    U(this, "processors");
    this.processors = t;
  }
  find(t, r) {
    return this.processors.find((n) => n.namespace === t.namespace && n.localName === t.localName && n.slots.includes(r));
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
