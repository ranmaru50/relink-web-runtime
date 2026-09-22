var wt = Object.defineProperty;
var yt = (e, t, r) => t in e ? wt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var I = (e, t, r) => yt(e, typeof t != "symbol" ? t + "" : t, r);
class b extends Error {
  constructor(t, r, n) {
    super(r), this.category = t, this.cause = n, this.name = t;
  }
}
class Y extends b {
  constructor(t, r) {
    super("ParseError", t, r);
  }
}
class d extends b {
  constructor(t) {
    super("ValidationError", t);
  }
}
class ge extends b {
  constructor(t) {
    super("ContractResolutionError", t);
  }
}
class Ee extends b {
  constructor(t) {
    super("ContractError", t);
  }
}
class P extends b {
  constructor(t, r) {
    super("TransportError", t, r);
  }
}
class F extends b {
  constructor(t, r) {
    super("HTTPResponseError", `AR-XML の取得に失敗しました (${t})`), this.status = t, this.url = r;
  }
}
class Nt extends b {
  constructor(t, r) {
    super("HTTPSDowngradeError", "HTTPS から HTTP へのダウングレードは許可されません"), this.fromUrl = t, this.toUrl = r;
  }
}
class Rt extends b {
  constructor(t) {
    super("NetworkPolicyError", "Runtime のネットワークポリシーによりドキュメント取得先が拒否されました"), this.url = t;
  }
}
class _ extends b {
  constructor(t, r, n) {
    super(t, r, n);
  }
}
class G extends _ {
  constructor(t, r, n, o) {
    super("ManifestFetchError", t, o), this.url = r, this.status = n;
  }
}
class H extends _ {
  constructor(t, r) {
    super("ManifestParseError", t, r);
  }
}
class A extends _ {
  constructor(t) {
    super("ManifestValidationError", t);
  }
}
class N extends b {
  constructor(t) {
    super("InterfaceError", t);
  }
}
class C extends b {
  constructor(t) {
    super("RepresentationError", t);
  }
}
class ve extends b {
  constructor(t) {
    super("CapabilityError", t);
  }
}
class Tt {
  /** 既定の fetch はブラウザの globalThis に束縛して Illegal invocation を防ぎます。 */
  constructor(t = globalThis.fetch.bind(globalThis), r = {}) {
    this.fetcher = t, this.defaultOptions = r;
  }
  /** ブラウザのFetchリダイレクト処理後のレスポンス情報をRuntimeへ渡します。redirect先の制御はブラウザのFetch/CORS/mixed-contentに委ねます。 */
  async fetchResource(t, r = {}) {
    let n;
    const o = { signal: r.signal, redirect: "follow" }, s = r.credentials ?? this.defaultOptions.credentials;
    s !== void 0 && (o.credentials = s);
    try {
      n = await this.fetcher(t, o);
    } catch (p) {
      throw new P("AR-XML の取得中に通信エラーが発生しました", p);
    }
    const a = n.url || t, f = n.headers.get("content-type") ?? void 0;
    if (!n.ok) return { requestedUrl: t, responseUrl: a, status: n.status, body: "", contentType: f };
    try {
      return { requestedUrl: t, responseUrl: a, status: n.status, body: await n.text(), contentType: f };
    } catch (p) {
      throw new P("AR-XML 応答の読み取り中に通信エラーが発生しました", p);
    }
  }
  /** 旧ResourceFetcher APIを維持し、成功時の本文だけを返します。 */
  async fetchText(t, r) {
    const n = await this.fetchResource(t, { signal: r });
    if (n.status < 200 || n.status >= 300) throw new F(n.status, n.responseUrl);
    return n.body;
  }
}
class gt {
  /** 既定の fetch はブラウザの globalThis に束縛して Illegal invocation を防ぎます。 */
  constructor(t = globalThis.fetch.bind(globalThis)) {
    this.fetcher = t;
  }
  async invoke(t, r) {
    try {
      return await this.fetcher(t, { ...r, redirect: "error" });
    } catch (n) {
      throw new P("HTTP 呼び出し中に通信エラーが発生しました", n);
    }
  }
}
class Et {
  parse(t) {
    const r = new DOMParser().parseFromString(t, "application/xml");
    if (r.querySelector("parsererror")) throw new Y("AR-XML の XML 構文が正しくありません");
    const n = r.documentElement;
    if (!n) throw new Y("AR-XML の root element がありません");
    const o = rt(n);
    return { root: o, namespace: o.namespace, rootName: o.localName, version: vt(o, "", "version") };
  }
}
function rt(e) {
  const t = Array.from(e.children, rt), r = Array.from(e.childNodes).filter((o) => o.nodeType === Node.TEXT_NODE || o.nodeType === Node.CDATA_SECTION_NODE).map((o) => o.nodeValue ?? "").join(""), n = [];
  for (const o of Array.from(e.attributes))
    o.namespaceURI !== "http://www.w3.org/2000/xmlns/" && n.push({ namespace: o.namespaceURI ?? "", localName: o.localName, value: o.value });
  return { namespace: e.namespaceURI ?? "", localName: e.localName, attributes: n, children: t, text: r };
}
function vt(e, t, r) {
  var n;
  return (n = e.attributes.find((o) => o.namespace === t && o.localName === r)) == null ? void 0 : n.value;
}
function bt(e, t) {
  try {
    return new URL(t, e);
  } catch {
    throw new N("HTTP endpoint が不正です");
  }
}
function nt(e, t, r) {
  const n = Z(t), o = r.slice(0, r.indexOf(t)).filter((s) => Z(s) === n).length + 1;
  return `route:${encodeURIComponent(e)}:${encodeURIComponent(t.ref)}:${Ot(n)}:${o}`;
}
function Z(e) {
  var t;
  return `${e.ref}|${ot((t = e.mapping) == null ? void 0 : t.extension)}`;
}
function ot(e) {
  if (!e) return "";
  const t = [...e.attributes].sort((r, n) => `${r.namespace}:${r.localName}:${r.value}`.localeCompare(`${n.namespace}:${n.localName}:${n.value}`));
  return `${e.namespace}:${e.localName}[${t.map((r) => `${r.namespace}:${r.localName}=${r.value}`).join(";")}](${e.children.map(ot).join("|")})${e.text ?? ""}`;
}
function Ot(e) {
  let t = 2166136261;
  for (const r of e) t = Math.imul(t ^ r.codePointAt(0), 16777619);
  return (t >>> 0).toString(16).padStart(8, "0");
}
class It {
  permits(t, r) {
    return t.origin === new URL(r).origin;
  }
}
const J = "https://relink.dev/ns/arxml/http/0.1";
async function Q(e, t, r, n, o, s, a) {
  if (e.legacyDraft4) return Ut(e, r, n, o, s, a);
  const f = e.invocation;
  if (!f) throw new N("Capability に Invocation がありません");
  const i = e.interfaceUses.map((c) => ({ routeId: nt(e.localId, c, e.interfaceUses), use: c, definition: t.find((u) => u.id === c.ref) })).filter((c) => c.definition !== void 0).filter(({ routeId: c, use: u, definition: h }) => {
    var m;
    return (o.routeId === void 0 || c === o.routeId) && (o.interfaceRef === void 0 || u.ref === o.interfaceRef) && $t((m = h.realization) == null ? void 0 : m.extension);
  });
  if (i.length === 0) throw new N("指定された HTTP Extension route がありません");
  if (i.length > 1) throw new N("InterfaceUse route が一意に選択されていません");
  const l = i[0];
  return At(f, l.definition, l.use, r, n, o, s, a);
}
async function Ut(e, t, r, n, o, s) {
  var m, U, T;
  const a = e.invocation, f = (m = e.interfaces) == null ? void 0 : m[0];
  if (!a || !f) throw new N("呼び出し可能な HTTP Interface がありません");
  const p = bt(t, f.endpoint);
  if (!s.permits(p, t)) throw new N("Runtime のネットワークポリシーにより endpoint が拒否されました");
  const i = Pt(a.result, n.accept), l = st(f.method, p, a, r, i, n.signal), c = await o.invoke(p, l);
  if (c.status < 200 || c.status >= 300) throw new N(`HTTP Interface が非成功を返しました (${c.status})`);
  if (!a.result) return { values: {} };
  if ((((T = (U = c.headers.get("content-type")) == null ? void 0 : U.split(";", 1)[0]) == null ? void 0 : T.trim().toLowerCase()) ?? "") !== (i == null ? void 0 : i.mediaType.toLowerCase())) throw new C("Response Content-Type が宣言済み Representation と一致しません");
  let h;
  try {
    h = JSON.parse(await c.text());
  } catch {
    throw new C("JSON Response の解析に失敗しました");
  }
  if (a.result.outputs.length === 1) {
    const S = a.result.outputs[0];
    if (!S || !B(h, S.type)) throw new C("Response 値が Output type と一致しません");
    return { values: { [S.name]: h }, representation: i == null ? void 0 : i.mediaType };
  }
  return { values: it(a.result.outputs, h), representation: i == null ? void 0 : i.mediaType };
}
async function At(e, t, r, n, o, s, a, f) {
  var T, S;
  const p = at((T = t.realization) == null ? void 0 : T.extension), i = ct((S = r.mapping) == null ? void 0 : S.extension);
  if (!i) throw new N("HTTP InterfaceUse に http:operation mapping がありません");
  const l = Dt(n, p.base, i.path);
  if (!f.permits(l, n)) throw new N("Runtime のネットワークポリシーにより endpoint が拒否されました");
  const c = St(e.result, s.accept), u = st(i.method, l, e, o, c, s.signal), h = await a.invoke(l, u);
  if (h.status < 200 || h.status >= 300) throw new N(`HTTP Interface が非成功を返しました (${h.status})`);
  if (!e.result) return { values: {} };
  if (h.status === 204) throw new C("Result が宣言されているため 204 Response をマッピングできません");
  if (!qt(h.headers.get("content-type"))) throw new C("JSON Result に Content-Type: application/json が必要です");
  let U;
  try {
    U = JSON.parse(await h.text());
  } catch {
    throw new C("JSON Response の解析に失敗しました");
  }
  return { values: it(e.result.outputs, U), representation: c == null ? void 0 : c.mediaType };
}
function st(e, t, r, n, o, s) {
  Lt(r.inputs, n);
  const a = new Headers();
  if (o && a.set("Accept", o.mediaType), e === "GET") {
    for (const p of r.inputs) {
      const i = n[p.name];
      if (i !== void 0) {
        if (!["string", "number", "integer", "boolean"].includes(p.type)) throw new N(`GET では ${p.type} Input を直列化できません`);
        if (t.searchParams.has(p.name)) throw new N(`既存 query と Input name が衝突しています: ${p.name}`);
        t.searchParams.append(p.name, Ct(i, p.type));
      }
    }
    return { method: e, headers: a, signal: s };
  }
  if (e !== "POST" && e !== "PUT" && e !== "PATCH") throw new N(`HTTP method の Input mapping に対応していません: ${e}`);
  const f = {};
  for (const p of r.inputs) {
    const i = n[p.name];
    if (i !== void 0) {
      if (p.type === "binary") throw new N("binary Input の JSON mapping は未対応です");
      f[p.name] = i;
    }
  }
  return a.set("Content-Type", "application/json"), { method: e, headers: a, body: JSON.stringify(f), signal: s };
}
function Lt(e, t) {
  for (const r of e) {
    const n = t[r.name];
    if (n === void 0) {
      if (r.required) throw new d(`required Input が不足しています: ${r.name}`);
      continue;
    }
    if (!B(n, r.type)) throw new d(`Input の型が一致しません: ${r.name}`);
  }
}
function Ct(e, t) {
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
function St(e, t) {
  if (!e) return;
  const r = e.representations.find((n) => n.mediaType.toLowerCase() === "application/json");
  if (!r) throw new N("Draft 5 HTTP JSON baseline には application/json Representation が必要です");
  if (t && !t.split(",").some((n) => ut(n.trim().toLowerCase(), r.mediaType.toLowerCase()))) throw new N("指定された Accept と Representation が一致しません");
  return r;
}
function Pt(e, t) {
  if (!e) return;
  const r = e.representations[0];
  if (!r) throw new N("Result Representation がありません");
  if (t && !ut(t.toLowerCase(), r.mediaType.toLowerCase())) throw new N("指定された Accept と Representation が一致しません");
  return r;
}
function it(e, t) {
  if (typeof t != "object" || t === null || Array.isArray(t)) throw new C("JSON Result は top-level object である必要があります");
  const r = t, n = {};
  for (const o of e) {
    if (!(o.name in r)) throw new C(`Response に Output がありません: ${o.name}`);
    const s = r[o.name];
    if (!B(s, o.type)) throw new C(`Output の型が一致しません: ${o.name}`);
    n[o.name] = s;
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
  var n, o;
  if (!e) return;
  if (e.namespace !== J || e.localName !== "operation") throw new N("未対応の HTTP Mapping です");
  const t = (n = e.attributes.find((s) => s.namespace === "" && s.localName === "method")) == null ? void 0 : n.value, r = (o = e.attributes.find((s) => s.namespace === "" && s.localName === "path")) == null ? void 0 : o.value;
  if (!t || !/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(t) || r === void 0) throw new N("http:operation の method/path が不正です");
  if (e.attributes.some((s) => s.namespace === "" && s.localName !== "method" && s.localName !== "path")) throw new N("http:operation の未知属性です");
  if (e.text || e.children.length > 0 || !M(r) || ft(r)) throw new N("http:operation path が不正です");
  return { kind: "http:operation", method: t, path: r, extension: e };
}
function Dt(e, t, r) {
  if (!M(e) || !M(t ?? "") || !M(r) || ft(r)) throw new N("HTTP URI reference が不正です");
  let n;
  try {
    n = new URL(e);
  } catch {
    throw new N("AR-XML retrieval URL が不正です");
  }
  const o = new URL(t ?? "", n);
  if (o.protocol !== "http:" && o.protocol !== "https:" || !o.hostname) throw new N("HTTP base context が不正です");
  const s = new URL(r, o);
  if (s.hash = "", s.protocol !== "http:" && s.protocol !== "https:" || !s.hostname) throw new N("HTTP target が不正です");
  return s;
}
function $t(e) {
  return (e == null ? void 0 : e.namespace) === J && e.localName === "api";
}
function qt(e) {
  var n;
  if (!e) return !1;
  const t = e.split(";");
  if (((n = t[0]) == null ? void 0 : n.trim().toLowerCase()) !== "application/json") return !1;
  const r = /* @__PURE__ */ new Set();
  for (const o of t.slice(1)) {
    const s = /^\s*([^=\s;]+)\s*=\s*(?:"(?:[^"\\]|\\.)*"|[^\s;]+)\s*$/.exec(o);
    if (!s || r.has(s[1].toLowerCase())) return !1;
    r.add(s[1].toLowerCase());
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
function xt(e, t) {
  const r = t.resolveCapability(e).filter((n) => n.identifier === e);
  return r.length !== 1 ? { state: "UNRESOLVED" } : { state: "RESOLVED", contract: r[0] };
}
function Mt(e, t, r) {
  var p, i;
  if (r !== "RESOLVED" || !t) return "UNVALIDATED";
  const n = t.invocation;
  if (!n && e.invocation || n && !e.invocation) return "CONFLICT";
  if (!n || !e.invocation) return "VALIDATED";
  const o = n.inputs ?? [], s = e.invocation.inputs;
  if (o.length !== s.length) return "CONFLICT";
  for (const l of o) {
    const c = s.find((u) => u.name === l.name);
    if (!c || c.type !== l.type || c.required !== l.required || c.format !== l.format || c.unit !== l.unit) return "CONFLICT";
  }
  if (!!n.result != !!e.invocation.result) return "CONFLICT";
  if (n.result && e.invocation.result) {
    if (n.result.outputs.length !== e.invocation.result.outputs.length) return "CONFLICT";
    for (const u of n.result.outputs) {
      const h = e.invocation.result.outputs.find((m) => m.name === u.name);
      if (!h || h.type !== u.type || h.format !== u.format || h.unit !== u.unit) return "CONFLICT";
    }
    const l = n.result.representations.map((u) => u.mediaType.toLowerCase()).sort(), c = e.invocation.result.representations.map((u) => u.mediaType.toLowerCase()).sort();
    if (l.length !== c.length || l.some((u, h) => u !== c[h])) return "CONFLICT";
  }
  const a = t.requirements ?? n.requirements ?? [];
  return o.some((l) => {
    var c;
    return (((c = l.constraints) == null ? void 0 : c.length) ?? 0) > 0;
  }) || s.some((l) => {
    var c;
    return (((c = l.constraints) == null ? void 0 : c.length) ?? 0) > 0;
  }) || ((p = n.result) == null ? void 0 : p.outputs.some((l) => {
    var c;
    return (((c = l.constraints) == null ? void 0 : c.length) ?? 0) > 0;
  })) === !0 || ((i = e.invocation.result) == null ? void 0 : i.outputs.some((l) => {
    var c;
    return (((c = l.constraints) == null ? void 0 : c.length) ?? 0) > 0;
  })) === !0 || a.length > 0 || e.requirements.length > 0 ? "UNVALIDATED" : "VALIDATED";
}
function Vt(e, t, r) {
  var l;
  if (e.legacyDraft4) return { contractResolution: "UNRESOLVED", projectionValidation: "UNVALIDATED", availability: "READY", routes: [] };
  const n = xt(e.semanticType, r), o = Mt(e, n.contract, n.state);
  if (!e.invocation) return { contractResolution: n.state, projectionValidation: o, routes: [] };
  const s = W(e.requirements), a = n.contract ? n.contract.requirements ?? ((l = n.contract.invocation) == null ? void 0 : l.requirements) ?? [] : [], f = n.state === "RESOLVED" ? W(a) : "UNKNOWN", p = e.interfaceUses.map((c) => jt(nt(e.localId, c, e.interfaceUses), c, t.find((u) => u.id === c.ref), o, s, f)), i = kt(p);
  return { contractResolution: n.state, projectionValidation: o, ...i ? { availability: i } : {}, routes: p };
}
function jt(e, t, r, n, o, s) {
  var u;
  if (!r) return { routeId: e, interfaceRef: t.ref, requirement: tt([o, s]), capabilityRequirement: o, contractRequirement: s, interfaceRequirement: "SATISFIED", attachment: "SATISFIED", support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "Interface が存在しません" };
  const a = W(r.requirements), f = tt([o, s, a]), p = r.attachment ? "UNKNOWN" : "SATISFIED";
  if (!r.realization) return { routeId: e, interfaceRef: t.ref, requirement: f, capabilityRequirement: o, contractRequirement: s, interfaceRequirement: a, attachment: p, support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "Realization がありません" };
  if (r.realization.extension.namespace !== "https://relink.dev/ns/arxml/http/0.1" || r.realization.extension.localName !== "api") return { routeId: e, interfaceRef: t.ref, requirement: f, capabilityRequirement: o, contractRequirement: s, interfaceRequirement: a, attachment: p, support: "UNKNOWN", availability: "UNKNOWN", reason: "未知の Realization です" };
  try {
    at(r.realization.extension);
  } catch {
    return { routeId: e, interfaceRef: t.ref, requirement: f, capabilityRequirement: o, contractRequirement: s, interfaceRequirement: a, attachment: p, support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "HTTP Realization が不正です" };
  }
  let i = "SUPPORTED", l = "";
  const c = (u = t.mapping) == null ? void 0 : u.extension;
  if (c && (c.namespace !== "https://relink.dev/ns/arxml/http/0.1" || c.localName !== "operation"))
    i = "UNKNOWN";
  else
    try {
      const h = ct(c);
      h ? l = h.method : i = "UNSUPPORTED";
    } catch {
      i = "UNSUPPORTED";
    }
  return i === "SUPPORTED" && !["GET", "POST", "PUT", "PATCH"].includes(l) && (i = "UNSUPPORTED"), n === "CONFLICT" || i === "UNSUPPORTED" || f === "UNSATISFIED" ? { routeId: e, interfaceRef: t.ref, requirement: f, capabilityRequirement: o, contractRequirement: s, interfaceRequirement: a, attachment: p, support: i, availability: "UNAVAILABLE", reason: n === "CONFLICT" ? "Capability projection が CONFLICT です" : "HTTP Mapping が未対応です" } : n === "UNVALIDATED" || f === "UNKNOWN" || p === "UNKNOWN" || i === "UNKNOWN" ? { routeId: e, interfaceRef: t.ref, requirement: f, capabilityRequirement: o, contractRequirement: s, interfaceRequirement: a, attachment: p, support: i, availability: "UNKNOWN", reason: "必要な評価が UNKNOWN です" } : { routeId: e, interfaceRef: t.ref, requirement: f, capabilityRequirement: o, contractRequirement: s, interfaceRequirement: a, attachment: p, support: i, availability: "READY" };
}
function W(e) {
  return e.length === 0 ? "SATISFIED" : "UNKNOWN";
}
function tt(e) {
  return e.includes("UNSATISFIED") ? "UNSATISFIED" : e.includes("UNKNOWN") ? "UNKNOWN" : "SATISFIED";
}
function kt(e) {
  return e.some((t) => t.availability === "READY") ? "READY" : e.some((t) => t.availability === "UNKNOWN") ? "UNKNOWN" : (e.length > 0, "UNAVAILABLE");
}
function be(e, t, r) {
  var s;
  const n = r.resolveProfile(t).filter((a) => a.identifier === t);
  return n.length !== 1 ? { resolution: "UNRESOLVED", conformance: "UNDETERMINED" } : { resolution: "RESOLVED", conformance: (((s = n[0]) == null ? void 0 : s.requiredCapabilities) ?? []).every((a) => e.includes(a)) ? "CONFORMANT" : "NON_CONFORMANT" };
}
function Ft(e, t) {
  let r;
  try {
    zt(e), r = JSON.parse(e);
  } catch (u) {
    throw u instanceof H ? u : new H(`Manifest JSON の構文が正しくありません: ${t}`, u);
  }
  if (!pt(r)) throw new A("Manifest は JSON object である必要があります");
  if (r.manifestVersion !== "0.1") throw new A("Manifest の manifestVersion は 0.1 である必要があります");
  const n = q(r, "anchor"), o = q(r, "entity"), s = q(r, "description"), a = q(r, "lifecycle"), f = x(n, "id", "anchor"), p = x(o, "id", "entity"), i = x(s, "location", "description"), l = x(a, "status", "lifecycle");
  if (!Ht.test(f)) throw new A("Manifest の anchor.id が UUID ではありません");
  if (!Wt(p)) throw new A("Manifest の entity.id は絶対 URI である必要があります");
  let c;
  try {
    c = new URL(i);
  } catch {
    throw new A(`Manifest の description.location が不正です: ${i}`);
  }
  if (c.protocol !== "https:") throw new A("Manifest の description.location は HTTPS URL である必要があります");
  if (l !== "active" && l !== "suspended" && l !== "retired") throw new A("Manifest の lifecycle.status が不正です");
  return Bt(f, t), { manifestVersion: "0.1", anchorId: f, entityId: p, descriptionLocation: c.href, lifecycleStatus: l };
}
const Ht = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function q(e, t) {
  const r = e[t];
  if (!pt(r)) throw new A(`Manifest の ${t} は object である必要があります`);
  return r;
}
function x(e, t, r) {
  const n = e[t];
  if (typeof n != "string" || n.length === 0) throw new A(`Manifest の ${r}.${t} は必須の文字列です`);
  return n;
}
function Wt(e) {
  try {
    return new URL(e).protocol.length > 0;
  } catch {
    return !1;
  }
}
function zt(e) {
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
    const o = _t(e, r);
    r = o.end;
    const s = Jt(e, r);
    if (e[s] !== ":" || t.length === 0) continue;
    const a = t[t.length - 1];
    if (a) {
      if (a.has(o.value)) throw new H(`Manifest JSON に重複した member name があります: ${o.value}`);
      a.add(o.value);
    }
  }
}
function _t(e, t) {
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
function Jt(e, t) {
  let r = t;
  for (; r < e.length && /\s/.test(e[r] ?? ""); ) r += 1;
  return r;
}
function Bt(e, t) {
  let r;
  try {
    r = new URL(t);
  } catch {
    return;
  }
  const n = r.pathname.match(/\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/manifest\/?$/i);
  if (n && n[1].toLowerCase() !== e.toLowerCase()) throw new A("Manifest の anchor.id が取得URLの UUID と一致しません");
}
function pt(e) {
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
const E = "https://relink.dev/ns/arxml/core/0.1", Kt = ["string", "number", "integer", "boolean", "binary", "object", "array"], lt = "http://www.w3.org/2000/xmlns/";
function Xt(e, t) {
  const r = e.root;
  if (!r || r.localName !== "ar-entity" || r.namespace !== E) throw new d("Draft 5 の ar-entity root が必要です");
  if (y(r, ["version"]), w(r, "version") !== "0.1") throw new d("version 属性には 0.1 が必要です");
  R(r, "ar-entity");
  const n = D(r, ["category", "identifiers", "properties", "subjects", "profiles", "interfaces", "capabilities"]), o = n.get("category"), s = o ? fe(o, "category") : void 0, a = Yt(n.get("identifiers")), f = Zt(n.get("subjects")), p = k(f.map((m) => m.id), "Subject"), i = Gt(n.get("properties")), l = Qt(n.get("profiles")), c = te(n.get("interfaces")), u = k(c.map((m) => m.id), "Interface"), h = ee(n.get("capabilities"));
  k(h.map((m) => m.localId), "Capability");
  for (const m of a) if (m.subjectRef && !p.has(m.subjectRef)) throw new d(`Identifier の subject-ref が解決できません: ${m.subjectRef}`);
  for (const m of h) {
    if (m.subjectRef && !p.has(m.subjectRef)) throw new d(`Capability の subject-ref が解決できません: ${m.subjectRef}`);
    for (const U of m.interfaceUses) if (!u.has(U.ref)) throw new d(`InterfaceUse の ref が解決できません: ${U.ref}`);
  }
  return { url: t, ...s ? { category: s } : {}, metadata: v(r), identifiers: a, properties: i.properties, propertyExtensions: i.extensions, subjects: f, profileClaims: l, interfaces: c, capabilities: h };
}
function D(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of e.children) {
    if (O(n), !t.includes(n.localName)) throw new d(`未知の Core 要素です: ${n.localName}`);
    if (r.has(n.localName)) throw new d(`Core container が重複しています: ${n.localName}`);
    r.set(n.localName, n);
  }
  return r;
}
function Yt(e) {
  return e ? (y(e, []), R(e, "identifiers"), e.children.map((t) => {
    O(t, "identifier"), y(t, ["type", "value", "subject-ref"]), $(t, "identifier");
    const r = g(w(t, "type"), "identifier/@type"), n = g(w(t, "value"), "identifier/@value");
    return { type: r, value: n, ...w(t, "subject-ref") ? { subjectRef: w(t, "subject-ref") } : {}, metadata: v(t) };
  })) : [];
}
function Gt(e) {
  if (!e) return { properties: [], extensions: [] };
  y(e, []), R(e, "properties");
  const t = [], r = [];
  for (const n of e.children) {
    if (n.namespace !== E) {
      t.push(K(n));
      continue;
    }
    O(n, "property"), y(n, ["type", "value", "unit"]), $(n, "property");
    const o = n.children.map((s) => j(s, "property"));
    r.push({ type: g(w(n, "type"), "property/@type"), value: g(w(n, "value"), "property/@value"), ...w(n, "unit") ? { unit: w(n, "unit") } : {}, ...o.length > 0 ? { extensions: o } : {}, metadata: v(n) });
  }
  return { properties: r, extensions: t };
}
function Zt(e) {
  return e ? (y(e, []), R(e, "subjects"), e.children.map((t) => (O(t, "subject"), y(t, ["id", "type"]), $(t, "subject"), { id: g(w(t, "id"), "subject/@id"), ...w(t, "type") ? { type: w(t, "type") } : {}, metadata: v(t) }))) : [];
}
function Qt(e) {
  return e ? (y(e, []), R(e, "profiles"), e.children.map((t) => (O(t, "conforms-to"), y(t, ["href"]), $(t, "conforms-to"), { href: X(w(t, "href"), "conforms-to/@href"), metadata: v(t) }))) : [];
}
function te(e) {
  return e ? (y(e, []), R(e, "interfaces"), e.children.map((t) => {
    O(t, "interface"), y(t, ["id"]), R(t, "interface");
    const r = D(t, ["attachment", "realization", "requirements"]), n = r.get("attachment"), o = r.get("realization");
    if (!n && !o) throw new d("Interface には attachment または realization が必要です");
    return { id: g(w(t, "id"), "interface/@id"), ...n ? { attachment: { extension: z(n, "attachment") } } : {}, ...o ? { realization: { extension: z(o, "realization") } } : {}, requirements: dt(r.get("requirements")), metadata: v(t) };
  })) : [];
}
function ee(e) {
  return e ? (y(e, []), R(e, "capabilities"), e.children.map((t) => {
    if (O(t, "capability"), y(t, ["id", "type", "subject-ref"]), R(t, "capability"), t.children.some((s) => s.namespace === E && ["inputs", "result", "interfaces"].includes(s.localName))) return re(t);
    const r = D(t, ["requirements", "invocation", "interface-uses"]), n = ie(r.get("invocation"));
    return { localId: g(w(t, "id"), "capability/@id"), semanticType: X(w(t, "type"), "capability/@type"), ...w(t, "subject-ref") ? { subjectRef: w(t, "subject-ref") } : {}, requirements: dt(r.get("requirements")), ...n ? { invocation: n } : {}, interfaceUses: ce(r.get("interface-uses")), metadata: v(t) };
  })) : [];
}
function re(e) {
  y(e, ["id", "type"]);
  const t = e.children.find((i) => i.namespace === E && i.localName === "inputs"), r = e.children.find((i) => i.namespace === E && i.localName === "result"), n = e.children.find((i) => i.namespace === E && i.localName === "interfaces"), o = t ? ne(t) : [], s = r ? oe(r) : void 0, a = n ? se(n) : [], f = g(w(e, "id"), "capability/@id"), p = X(w(e, "type"), "capability/@type");
  return { localId: f, semanticType: p, inputs: o, result: s, interfaces: a, requirements: [], invocation: { inputs: o, ...s ? { result: s } : {} }, interfaceUses: [], legacyDraft4: !0, contractResolution: "UNRESOLVED", projectionValidation: "UNVALIDATED", availability: "READY", metadata: v(e) };
}
function ne(e) {
  return y(e, []), R(e, "inputs"), e.children.map((t) => V(t, !0));
}
function oe(e) {
  y(e, []), R(e, "result");
  const t = e.children.find((n) => n.localName === "outputs");
  if (!t) throw new d("result には outputs が必要です");
  y(t, []), R(t, "outputs");
  const r = e.children.find((n) => n.localName === "representations");
  return { outputs: t.children.map((n) => V(n, !1)), representations: r ? ht(r) : [] };
}
function se(e) {
  return y(e, []), R(e, "interfaces"), e.children.map((t) => {
    O(t, "interface"), y(t, ["type", "method", "endpoint", "encoding"]), $(t, "interface");
    const r = w(t, "type"), n = w(t, "method");
    if (r !== "http" || n !== "GET" && n !== "POST") throw new d("Draft 4 HTTP Interface が不正です");
    const o = g(w(t, "endpoint"), "interface/@endpoint"), s = w(t, "encoding");
    if (s !== void 0 && s !== "json") throw new d("interface/@encoding が不正です");
    return { type: "http", method: n, endpoint: o, ...s ? { encoding: s } : {} };
  });
}
function ie(e) {
  if (!e) return;
  y(e, []), R(e, "invocation");
  const t = D(e, ["inputs", "result"]), r = t.get("inputs");
  let n = [];
  r && (y(r, []), R(r, "inputs"), n = r.children.map((a) => V(a, !0)), mt(n, "input"));
  const o = t.get("result"), s = o ? ae(o) : void 0;
  return { inputs: n, ...s ? { result: s } : {}, metadata: v(e) };
}
function ae(e) {
  y(e, []), R(e, "result");
  const t = D(e, ["outputs", "representations"]), r = t.get("outputs");
  if (!r) throw new d("result には outputs が必要です");
  y(r, []), R(r, "outputs");
  const n = r.children.map((a) => V(a, !1));
  if (mt(n, "output"), n.length === 0) throw new d("result の outputs は1件以上必要です");
  const o = t.get("representations"), s = o ? ht(o) : [];
  return { outputs: n, representations: s };
}
function ht(e) {
  return y(e, []), R(e, "representations"), e.children.map((t) => {
    O(t, "representation"), y(t, ["media-type"]), $(t, "representation");
    const r = g(w(t, "media-type"), "representation/@media-type");
    if (!pe(r)) throw new d("representation media-type が不正です");
    return { mediaType: r, metadata: v(t) };
  });
}
function V(e, t) {
  O(e, t ? "input" : "output"), y(e, t ? ["name", "type", "required", "format", "unit"] : ["name", "type", "format", "unit"]), R(e, t ? "input" : "output");
  const r = ue(e);
  for (const f of e.children) if (f.namespace !== E || f.localName !== "constraints") throw new d(`${t ? "input" : "output"} の未知の子要素です: ${f.localName}`);
  const n = g(w(e, "name"), `${t ? "input" : "output"}/@name`), o = w(e, "type");
  if (!o || !Kt.includes(o)) throw new d(`${t ? "input" : "output"} type が未定義です: ${o ?? ""}`);
  const s = { name: n, type: o, ...w(e, "format") ? { format: w(e, "format") } : {}, ...w(e, "unit") ? { unit: w(e, "unit") } : {}, ...r.length > 0 ? { constraints: r } : {}, metadata: v(e) };
  if (!t) return s;
  const a = w(e, "required");
  if (a !== void 0 && a !== "true" && a !== "false") throw new d("input/@required は true または false である必要があります");
  return { ...s, required: a !== "false" };
}
function dt(e) {
  return e ? (y(e, []), R(e, "requirements"), e.children.map((t) => {
    O(t, "requirement"), y(t, ["type"]);
    const r = t.children.map((n) => j(n, "requirement"));
    return R(t, "requirement"), { type: g(w(t, "type"), "requirement/@type"), extensions: r, metadata: v(t) };
  })) : [];
}
function ce(e) {
  return e ? (y(e, []), R(e, "interface-uses"), e.children.map((t) => {
    O(t, "interface-use"), y(t, ["ref"]), R(t, "interface-use");
    const n = D(t, ["mapping"]).get("mapping");
    return { ref: g(w(t, "ref"), "interface-use/@ref"), ...n ? { mapping: { extension: z(n, "mapping") } } : {}, metadata: v(t) };
  })) : [];
}
function z(e, t) {
  if (y(e, []), R(e, t), e.children.length !== 1) throw new d(`${t} には foreign Extension root が1つ必要です`);
  return j(e.children[0], t);
}
function j(e, t) {
  if (e.namespace === E || e.namespace.length === 0) throw new d(`${t} には foreign namespaced Extension が必要です`);
  return K(e);
}
function ue(e) {
  const t = e.children.filter((n) => n.namespace === E && n.localName === "constraints");
  if (t.length > 1) throw new d("constraints wrapper が重複しています");
  const r = t[0];
  return r ? (y(r, []), R(r, "constraints"), r.children.map((n) => j(n, "constraints"))) : [];
}
function O(e, t) {
  if (e.namespace !== E || t && e.localName !== t) throw new d(`Core 要素が不正です: ${e.localName}`);
}
function y(e, t) {
  for (const r of e.attributes)
    if (r.namespace !== lt && !(r.namespace !== "" && r.namespace !== E) && (r.namespace === E || !t.includes(r.localName)))
      throw new d(`未知の Core/unqualified attribute です: ${e.localName}/@${r.localName}`);
}
function v(e) {
  return e.attributes.filter((t) => t.namespace !== "" && t.namespace !== E && t.namespace !== lt).map((t) => ({ namespace: t.namespace, localName: t.localName, value: t.value }));
}
function w(e, t) {
  var r;
  return (r = e.attributes.find((n) => n.namespace === "" && n.localName === t)) == null ? void 0 : r.value;
}
function R(e, t) {
  if (e.text.trim().length > 0) throw new d(`${t} に予期しない文字データがあります`);
}
function $(e, t) {
  if (R(e, t), e.children.length > 0) throw new d(`${t} に予期しない子要素があります`);
}
function fe(e, t) {
  const r = e.text.trim();
  if (r.length === 0 || e.children.length > 0) throw new d(`${t} は空でない文字列が必要です`);
  return y(e, []), r;
}
function g(e, t) {
  if (!e || e.trim().length === 0) throw new d(`${t} は必須です`);
  return e;
}
function k(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (r.has(n)) throw new d(`${t} id が重複しています: ${n}`);
    r.add(n);
  }
  return r;
}
function mt(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (r.has(n.name)) throw new d(`${t} name が重複しています: ${n.name}`);
    r.add(n.name);
  }
}
function X(e, t) {
  var s;
  const r = g(e, t);
  let n;
  try {
    n = new URL(r);
  } catch {
    throw new d(`${t} は絶対 Semantic Identifier が必要です`);
  }
  if (!n.protocol || (n.protocol === "http:" || n.protocol === "https:") && !n.hostname) throw new d(`${t} は絶対 Semantic Identifier が必要です`);
  const o = (s = n.pathname.split("/").filter(Boolean).at(-1)) == null ? void 0 : s.toLowerCase();
  if (!o || o === "latest") throw new d(`${t} は exact-versioned identifier が必要です`);
  return r;
}
function pe(e) {
  return /^[^\s/;]+\/[^\s/;]+(?:\s*;\s*[^\s=;]+\s*=\s*(?:[^\s;]+|"[^"]*"))*$/.test(e);
}
class le {
  resolveCapability(t) {
    return [];
  }
  resolveProfile(t) {
    return [];
  }
}
class Oe {
  constructor(t = [], r = []) {
    I(this, "capabilities");
    I(this, "profiles");
    this.capabilities = t, this.profiles = r;
  }
  resolveCapability(t) {
    return this.capabilities.filter((r) => r.identifier === t);
  }
  resolveProfile(t) {
    return this.profiles.filter((r) => r.identifier === t);
  }
}
function he(e, t, r) {
  var a, f, p, i, l, c;
  const n = r.resolveProfile(t).filter((u) => u.identifier === t);
  if (n.length !== 1) return { resolution: "UNRESOLVED", conformance: "UNDETERMINED" };
  const o = n[0], s = new Set(e.capabilities.map((u) => u.semanticType));
  for (const u of o.requiredCapabilities ?? []) if (!s.has(u)) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  for (const u of o.capabilityRequirements ?? []) {
    const h = e.capabilities.find((T) => T.semanticType === u.contractIdentifier);
    if (!h) {
      if (u.required !== !1) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
      continue;
    }
    if ((((a = u.requiredInputNames) == null ? void 0 : a.length) ?? 0) > 0 && !h.invocation) return { resolution: "RESOLVED", conformance: "UNDETERMINED" };
    if ((((f = u.requiredOutputNames) == null ? void 0 : f.length) ?? 0) > 0 && !((p = h.invocation) != null && p.result)) return { resolution: "RESOLVED", conformance: "UNDETERMINED" };
    const m = new Set((i = h.invocation) == null ? void 0 : i.inputs.map((T) => T.name));
    for (const T of u.requiredInputNames ?? []) if (!m.has(T)) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
    const U = new Set((c = (l = h.invocation) == null ? void 0 : l.result) == null ? void 0 : c.outputs.map((T) => T.name));
    for (const T of u.requiredOutputNames ?? []) if (!U.has(T)) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  }
  for (const u of o.propertyRequirements ?? [])
    if (!e.properties.some((m) => m.type === u.type && (u.value === void 0 || m.value === u.value)) && u.required !== !1) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  for (const u of o.identifierRequirements ?? [])
    if (!e.identifiers.some((m) => m.type === u.type && (u.value === void 0 || m.value === u.value)) && u.required !== !1) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  for (const u of o.interfaceRequirements ?? [])
    if (!e.interfaces.some((m) => (u.id === void 0 || m.id === u.id) && (!u.requireRealization || m.realization !== void 0)) && u.required !== !1) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  return { resolution: "RESOLVED", conformance: "CONFORMANT" };
}
class de {
  permits(t, r) {
    const n = new URL(r);
    return t.protocol !== "http:" && t.protocol !== "https:" ? !1 : n.protocol !== "https:" || t.protocol === "https:";
  }
}
class Ie {
  constructor(t = {}) {
    I(this, "xmlParser");
    I(this, "resourceFetcher");
    I(this, "httpInvoker");
    I(this, "networkPolicy");
    I(this, "resourceNetworkPolicy");
    I(this, "semanticRegistry");
    this.xmlParser = t.xmlParser ?? new Et(), this.resourceFetcher = t.resourceFetcher ?? new Tt(globalThis.fetch.bind(globalThis), { credentials: t.resourceCredentials }), this.httpInvoker = t.httpInvoker ?? new gt(), this.networkPolicy = t.networkPolicy ?? new It(), this.resourceNetworkPolicy = t.resourceNetworkPolicy ?? new de(), this.semanticRegistry = t.semanticRegistry ?? new le();
  }
  /** AR-XML または明示 Manifest 経由の description を取得します。Capability は実行しません。 */
  async load(t, r = {}) {
    const n = L(t), o = await this.fetchDocumentResource(t, n.href, r, me(n.href));
    if (et(o)) {
      const s = Ft(o.body, L(o.responseUrl).href), a = L(s.descriptionLocation);
      return this.buildRuntimeDocument(await this.fetchDocumentResource(a.href, a.href, r, !1));
    }
    return this.buildRuntimeDocument(o);
  }
  async fetchDocumentResource(t, r, n, o) {
    const s = L(r);
    this.assertResourceRequest(L(t), s.href);
    const a = { signal: n.signal, credentials: n.credentials, beforeRequest: (i) => this.assertResourceRequest(L(i), s.href) };
    let f;
    try {
      f = await we(this.resourceFetcher, t, a);
    } catch (i) {
      throw o ? new G("Manifest の取得中に通信エラーが発生しました", t, void 0, i) : i;
    }
    if (f.status < 200 || f.status >= 300)
      throw o || et(f) ? new G(`Manifest の取得に失敗しました (${f.status})`, f.responseUrl, f.status, new F(f.status, f.responseUrl)) : new F(f.status, f.responseUrl);
    const p = L(f.responseUrl);
    this.assertResourceRequest(p, s.href);
    for (const i of f.redirectUrls ?? []) this.assertResourceRequest(L(i), s.href);
    return f;
  }
  buildRuntimeDocument(t) {
    const r = L(t.responseUrl);
    return new ye(Xt(this.xmlParser.parse(t.body), r.href), this.httpInvoker, this.networkPolicy, this.semanticRegistry);
  }
  assertResourceRequest(t, r) {
    if (new URL(r).protocol === "https:" && t.protocol === "http:") throw new Nt(r, t.href);
    if (!this.resourceNetworkPolicy.permits(t, r)) throw new Rt(t.href);
  }
}
function et(e) {
  var r, n;
  const t = (n = (r = e.contentType) == null ? void 0 : r.split(";", 1)[0]) == null ? void 0 : n.trim().toLowerCase();
  return t === "application/json" || (t == null ? void 0 : t.endsWith("+json")) === !0 || e.body.trimStart().startsWith("{");
}
function me(e) {
  const t = new URL(e).pathname.toLowerCase();
  return t.endsWith("/manifest") || t.endsWith("/manifest.json") || t.endsWith(".manifest");
}
function L(e) {
  let t;
  try {
    t = new URL(e);
  } catch (r) {
    throw new P("AR-XML のURLが不正です", r);
  }
  if (t.protocol !== "http:" && t.protocol !== "https:") throw new P("AR-XML のURLにはHTTP(S)を指定してください");
  return t;
}
async function we(e, t, r) {
  if (e.fetchResource) return e.fetchResource(t, r);
  if (e.fetchText) return { requestedUrl: t, responseUrl: t, status: 200, body: await e.fetchText(t, r.signal) };
  throw new P("AR-XML の取得Adapterが設定されていません");
}
class ye {
  constructor(t, r, n, o) {
    this.document = t, this.httpInvoker = r, this.networkPolicy = n, this.semanticRegistry = o;
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
    return r ? new Ne(r, this.document, this.httpInvoker, this.networkPolicy, this.semanticRegistry) : void 0;
  }
  evaluateCapability(t) {
    var r;
    return (r = this.getCapability(t)) == null ? void 0 : r.evaluation;
  }
  evaluateProfile(t) {
    return he(this.document, t, this.semanticRegistry);
  }
}
class Ne {
  constructor(t, r, n, o, s) {
    I(this, "snapshot");
    this.capability = t, this.document = r, this.httpInvoker = n, this.networkPolicy = o, this.snapshot = Vt(t, r.interfaces, s);
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
      if (this.snapshot.availability !== "READY") throw new d(`Capability route が READY ではありません: ${this.snapshot.availability ?? "UNAVAILABLE"}`);
      return Q(this.capability, this.document.interfaces, this.document.url, t, r, this.httpInvoker, this.networkPolicy);
    }
    const n = this.snapshot.routes.filter((s) => s.availability === "READY"), o = r.routeId !== void 0 ? n.find((s) => s.routeId === r.routeId) : r.interfaceRef !== void 0 ? Re(n, r.interfaceRef) : n.length === 1 ? n[0] : void 0;
    if (!o) throw new d(`READY な InterfaceUse route が一意に選択されていません: ${r.routeId ?? r.interfaceRef ?? this.snapshot.availability ?? "UNAVAILABLE"}`);
    if (r.interfaceRef !== void 0 && o.interfaceRef !== r.interfaceRef) throw new d("routeId と interfaceRef が一致しません");
    return Q(this.capability, this.document.interfaces, this.document.url, t, { ...r, routeId: o.routeId, interfaceRef: o.interfaceRef }, this.httpInvoker, this.networkPolicy);
  }
}
function Re(e, t) {
  const r = e.filter((n) => n.interfaceRef === t);
  return r.length === 1 ? r[0] : void 0;
}
class Ue {
  constructor(t = []) {
    I(this, "processors");
    this.processors = t;
  }
  find(t, r) {
    return this.processors.find((n) => n.namespace === t.namespace && n.localName === t.localName && n.slots.includes(r));
  }
}
export {
  Ie as ARRuntime,
  b as ARRuntimeError,
  ve as CapabilityError,
  Ee as ContractError,
  ge as ContractResolutionError,
  de as DefaultResourceNetworkPolicy,
  le as EmptySemanticRegistry,
  F as HTTPResponseError,
  Nt as HTTPSDowngradeError,
  Ue as InMemoryExtensionRegistry,
  Oe as InMemorySemanticRegistry,
  N as InterfaceError,
  _ as ManifestError,
  G as ManifestFetchError,
  H as ManifestParseError,
  A as ManifestValidationError,
  Rt as NetworkPolicyError,
  Y as ParseError,
  C as RepresentationError,
  Ne as RuntimeCapability,
  ye as RuntimeDocument,
  P as TransportError,
  d as ValidationError,
  Vt as evaluateCapability,
  be as evaluateProfile,
  he as evaluateProfileDocument,
  xt as resolveContract,
  Mt as validateProjection
};
