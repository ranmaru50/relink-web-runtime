var pt = Object.defineProperty;
var lt = (e, t, r) => t in e ? pt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var O = (e, t, r) => lt(e, typeof t != "symbol" ? t + "" : t, r);
class E extends Error {
  constructor(t, r, n) {
    super(r), this.category = t, this.cause = n, this.name = t;
  }
}
class K extends E {
  constructor(t, r) {
    super("ParseError", t, r);
  }
}
class p extends E {
  constructor(t) {
    super("ValidationError", t);
  }
}
class de extends E {
  constructor(t) {
    super("ContractResolutionError", t);
  }
}
class we extends E {
  constructor(t) {
    super("ContractError", t);
  }
}
class C extends E {
  constructor(t, r) {
    super("TransportError", t, r);
  }
}
class F extends E {
  constructor(t, r) {
    super("HTTPResponseError", `AR-XML の取得に失敗しました (${t})`), this.status = t, this.url = r;
  }
}
class ht extends E {
  constructor(t, r) {
    super("HTTPSDowngradeError", "HTTPS から HTTP へのダウングレードは許可されません"), this.fromUrl = t, this.toUrl = r;
  }
}
class dt extends E {
  constructor(t) {
    super("NetworkPolicyError", "Runtime のネットワークポリシーによりドキュメント取得先が拒否されました"), this.url = t;
  }
}
class W extends E {
  constructor(t, r, n) {
    super(t, r, n);
  }
}
class Y extends W {
  constructor(t, r, n, i) {
    super("ManifestFetchError", t, i), this.url = r, this.status = n;
  }
}
class H extends W {
  constructor(t, r) {
    super("ManifestParseError", t, r);
  }
}
class A extends W {
  constructor(t) {
    super("ManifestValidationError", t);
  }
}
class d extends E {
  constructor(t) {
    super("InterfaceError", t);
  }
}
class L extends E {
  constructor(t) {
    super("RepresentationError", t);
  }
}
class me extends E {
  constructor(t) {
    super("CapabilityError", t);
  }
}
class wt {
  /** 既定の fetch はブラウザの globalThis に束縛して Illegal invocation を防ぎます。 */
  constructor(t = globalThis.fetch.bind(globalThis), r = {}) {
    this.fetcher = t, this.defaultOptions = r;
  }
  /** ブラウザのFetchリダイレクト処理後のレスポンス情報をRuntimeへ渡します。redirect先の制御はブラウザのFetch/CORS/mixed-contentに委ねます。 */
  async fetchResource(t, r = {}) {
    let n;
    const i = { signal: r.signal, redirect: "follow" }, s = r.credentials ?? this.defaultOptions.credentials;
    s !== void 0 && (i.credentials = s);
    try {
      n = await this.fetcher(t, i);
    } catch (u) {
      throw new C("AR-XML の取得中に通信エラーが発生しました", u);
    }
    const a = n.url || t, c = n.headers.get("content-type") ?? void 0;
    if (!n.ok) return { requestedUrl: t, responseUrl: a, status: n.status, body: "", contentType: c };
    try {
      return { requestedUrl: t, responseUrl: a, status: n.status, body: await n.text(), contentType: c };
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
class mt {
  /** 既定の fetch はブラウザの globalThis に束縛して Illegal invocation を防ぎます。 */
  constructor(t = globalThis.fetch.bind(globalThis)) {
    this.fetcher = t;
  }
  async invoke(t, r) {
    try {
      return await this.fetcher(t, r);
    } catch (n) {
      throw new C("HTTP 呼び出し中に通信エラーが発生しました", n);
    }
  }
}
class yt {
  parse(t) {
    const r = new DOMParser().parseFromString(t, "application/xml");
    if (r.querySelector("parsererror")) throw new K("AR-XML の XML 構文が正しくありません");
    const n = r.documentElement;
    if (!n) throw new K("AR-XML の root element がありません");
    const i = Q(n);
    return { root: i, namespace: i.namespace, rootName: i.localName, version: Nt(i, "", "version") };
  }
}
function Q(e) {
  const t = Array.from(e.children, Q), r = Array.from(e.childNodes).filter((i) => i.nodeType === Node.TEXT_NODE || i.nodeType === Node.CDATA_SECTION_NODE).map((i) => i.nodeValue ?? "").join(""), n = [];
  for (const i of Array.from(e.attributes))
    i.namespaceURI !== "http://www.w3.org/2000/xmlns/" && n.push({ namespace: i.namespaceURI ?? "", localName: i.localName, value: i.value });
  return { namespace: e.namespaceURI ?? "", localName: e.localName, attributes: n, children: t, text: r };
}
function Nt(e, t, r) {
  var n;
  return (n = e.attributes.find((i) => i.namespace === t && i.localName === r)) == null ? void 0 : n.value;
}
function Rt(e, t) {
  try {
    return new URL(t, e);
  } catch {
    throw new d("HTTP endpoint が不正です");
  }
}
class Tt {
  permits(t, r) {
    return t.origin === new URL(r).origin;
  }
}
const _ = "https://relink.dev/ns/arxml/http/0.1";
async function G(e, t, r, n, i, s, a) {
  if (e.legacyDraft4) return gt(e, r, n, i, s, a);
  const c = e.invocation;
  if (!c) throw new d("Capability に Invocation がありません");
  const o = e.interfaceUses.filter((f) => i.interfaceRef === void 0 || f.ref === i.interfaceRef).map((f) => ({ use: f, definition: t.find((N) => N.id === f.ref) })).filter((f) => f.definition !== void 0).sort((f, N) => f.use.ref.localeCompare(N.use.ref)).filter(({ definition: f }) => {
    var N;
    return Lt((N = f.realization) == null ? void 0 : N.extension);
  });
  if (o.length === 0) throw new d("HTTP Extension に対応する InterfaceUse がありません");
  let w;
  for (const f of o)
    try {
      return await bt(c, f.definition, f.use, r, n, i, s, a);
    } catch (N) {
      w = N;
    }
  throw w instanceof Error ? w : new d("利用可能な InterfaceUse route がありません");
}
async function gt(e, t, r, n, i, s) {
  var R, I, q;
  const a = e.invocation, c = (R = e.interfaces) == null ? void 0 : R[0];
  if (!a || !c) throw new d("呼び出し可能な HTTP Interface がありません");
  const u = Rt(t, c.endpoint);
  if (!s.permits(u, t)) throw new d("Runtime のネットワークポリシーにより endpoint が拒否されました");
  const o = At(a.result, n.accept), w = tt(c.method, u, a, r, o, n.signal), f = await i.invoke(u, w);
  if (f.status < 200 || f.status >= 300) throw new d(`HTTP Interface が非成功を返しました (${f.status})`);
  if (!a.result) return { values: {} };
  if ((((q = (I = f.headers.get("content-type")) == null ? void 0 : I.split(";", 1)[0]) == null ? void 0 : q.trim().toLowerCase()) ?? "") !== (o == null ? void 0 : o.mediaType.toLowerCase())) throw new L("Response Content-Type が宣言済み Representation と一致しません");
  let y;
  try {
    y = JSON.parse(await f.text());
  } catch {
    throw new L("JSON Response の解析に失敗しました");
  }
  if (a.result.outputs.length === 1) {
    const P = a.result.outputs[0];
    if (!P || !J(y, P.type)) throw new L("Response 値が Output type と一致しません");
    return { values: { [P.name]: y }, representation: o == null ? void 0 : o.mediaType };
  }
  return { values: et(a.result.outputs, y), representation: o == null ? void 0 : o.mediaType };
}
async function bt(e, t, r, n, i, s, a, c) {
  var q, P;
  const u = rt((q = t.realization) == null ? void 0 : q.extension), o = nt((P = r.mapping) == null ? void 0 : P.extension);
  if (!o) throw new d("HTTP InterfaceUse に http:operation mapping がありません");
  const w = Ut(n, u.base, o.path);
  if (!c.permits(w, n)) throw new d("Runtime のネットワークポリシーにより endpoint が拒否されました");
  const f = Ot(e.result, s.accept), N = tt(o.method, w, e, i, f, s.signal), y = await a.invoke(w, N);
  if (y.status < 200 || y.status >= 300) throw new d(`HTTP Interface が非成功を返しました (${y.status})`);
  if (!e.result) return { values: {} };
  if (y.status === 204) throw new L("Result が宣言されているため 204 Response をマッピングできません");
  if (!It(y.headers.get("content-type"))) throw new L("JSON Result に Content-Type: application/json が必要です");
  let I;
  try {
    I = JSON.parse(await y.text());
  } catch {
    throw new L("JSON Response の解析に失敗しました");
  }
  return { values: et(e.result.outputs, I), representation: f == null ? void 0 : f.mediaType };
}
function tt(e, t, r, n, i, s) {
  Et(r.inputs, n);
  const a = new Headers();
  if (i && a.set("Accept", i.mediaType), e === "GET") {
    for (const u of r.inputs) {
      const o = n[u.name];
      if (o !== void 0) {
        if (!["string", "number", "integer", "boolean"].includes(u.type)) throw new d(`GET では ${u.type} Input を直列化できません`);
        if (t.searchParams.has(u.name)) throw new d(`既存 query と Input name が衝突しています: ${u.name}`);
        t.searchParams.append(u.name, vt(o, u.type));
      }
    }
    return { method: e, headers: a, signal: s };
  }
  if (e !== "POST" && e !== "PUT" && e !== "PATCH") throw new d(`HTTP method の Input mapping に対応していません: ${e}`);
  const c = {};
  for (const u of r.inputs) {
    const o = n[u.name];
    if (o !== void 0) {
      if (u.type === "binary") throw new d("binary Input の JSON mapping は未対応です");
      c[u.name] = o;
    }
  }
  return a.set("Content-Type", "application/json"), { method: e, headers: a, body: JSON.stringify(c), signal: s };
}
function Et(e, t) {
  for (const r of e) {
    const n = t[r.name];
    if (n === void 0) {
      if (r.required) throw new p(`required Input が不足しています: ${r.name}`);
      continue;
    }
    if (!J(n, r.type)) throw new p(`Input の型が一致しません: ${r.name}`);
  }
}
function vt(e, t) {
  return t === "boolean" ? e === !0 ? "true" : "false" : String(e);
}
function J(e, t) {
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
function Ot(e, t) {
  if (!e) return;
  const r = e.representations.find((n) => n.mediaType.toLowerCase() === "application/json");
  if (!r) throw new d("Draft 5 HTTP JSON baseline には application/json Representation が必要です");
  if (t && !t.split(",").some((n) => it(n.trim().toLowerCase(), r.mediaType.toLowerCase()))) throw new d("指定された Accept と Representation が一致しません");
  return r;
}
function At(e, t) {
  if (!e) return;
  const r = e.representations[0];
  if (!r) throw new d("Result Representation がありません");
  if (t && !it(t.toLowerCase(), r.mediaType.toLowerCase())) throw new d("指定された Accept と Representation が一致しません");
  return r;
}
function et(e, t) {
  if (typeof t != "object" || t === null || Array.isArray(t)) throw new L("JSON Result は top-level object である必要があります");
  const r = t, n = {};
  for (const i of e) {
    if (!(i.name in r)) throw new L(`Response に Output がありません: ${i.name}`);
    const s = r[i.name];
    if (!J(s, i.type)) throw new L(`Output の型が一致しません: ${i.name}`);
    n[i.name] = s;
  }
  return n;
}
function rt(e) {
  var r;
  if (!e || e.namespace !== _ || e.localName !== "api") throw new d("http:api Realization がありません");
  const t = (r = e.attributes.find((n) => n.namespace === "" && n.localName === "base")) == null ? void 0 : r.value;
  if (e.attributes.some((n) => n.namespace === "" && n.localName !== "base")) throw new d("http:api の未知属性です");
  if (e.text || e.children.length > 0) throw new d("http:api に子要素や文字データは指定できません");
  return { kind: "http:api", ...t !== void 0 ? { base: t } : {}, extension: e };
}
function nt(e) {
  var n, i;
  if (!e) return;
  if (e.namespace !== _ || e.localName !== "operation") throw new d("未対応の HTTP Mapping です");
  const t = (n = e.attributes.find((s) => s.namespace === "" && s.localName === "method")) == null ? void 0 : n.value, r = (i = e.attributes.find((s) => s.namespace === "" && s.localName === "path")) == null ? void 0 : i.value;
  if (!t || !/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(t) || r === void 0) throw new d("http:operation の method/path が不正です");
  if (e.attributes.some((s) => s.namespace === "" && s.localName !== "method" && s.localName !== "path")) throw new d("http:operation の未知属性です");
  if (e.text || e.children.length > 0 || !$(r) || st(r)) throw new d("http:operation path が不正です");
  return { kind: "http:operation", method: t, path: r, extension: e };
}
function Ut(e, t, r) {
  if (!$(e) || !$(t ?? "") || !$(r) || st(r)) throw new d("HTTP URI reference が不正です");
  let n;
  try {
    n = new URL(e);
  } catch {
    throw new d("AR-XML retrieval URL が不正です");
  }
  const i = new URL(t ?? "", n);
  if (i.protocol !== "http:" && i.protocol !== "https:" || !i.hostname) throw new d("HTTP base context が不正です");
  const s = new URL(r, i);
  if (s.hash = "", s.protocol !== "http:" && s.protocol !== "https:" || !s.hostname) throw new d("HTTP target が不正です");
  return s;
}
function Lt(e) {
  return (e == null ? void 0 : e.namespace) === _ && e.localName === "api";
}
function It(e) {
  var n;
  if (!e) return !1;
  const t = e.split(";");
  if (((n = t[0]) == null ? void 0 : n.trim().toLowerCase()) !== "application/json") return !1;
  const r = /* @__PURE__ */ new Set();
  for (const i of t.slice(1)) {
    const s = /^\s*([^=\s;]+)\s*=\s*(?:"(?:[^"\\]|\\.)*"|[^\s;]+)\s*$/.exec(i);
    if (!s || r.has(s[1].toLowerCase())) return !1;
    r.add(s[1].toLowerCase());
  }
  return !0;
}
function it(e, t) {
  return e === t || e === "*/*" || e.endsWith("/*") && t.startsWith(e.slice(0, -1));
}
function $(e) {
  return !/[^\x00-\x7f]/.test(e) && !/[\\\s\u0000-\u001f\u007f]/.test(e) && !/(?:^|[^%])%(?![0-9A-Fa-f]{2})/.test(e);
}
function st(e) {
  return e.startsWith("//") || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(e);
}
function Pt(e, t) {
  const r = t.resolveCapability(e).filter((n) => n.identifier === e);
  return r.length !== 1 ? { state: "UNRESOLVED" } : { state: "RESOLVED", contract: r[0] };
}
function Ct(e, t, r) {
  var c;
  if (r !== "RESOLVED" || !t) return "UNVALIDATED";
  const n = t.invocation;
  if (!n && e.invocation || n && !e.invocation) return "CONFLICT";
  if (!n || !e.invocation) return "VALIDATED";
  const i = n.inputs ?? [], s = e.invocation.inputs;
  if (i.length !== s.length) return "CONFLICT";
  for (const u of i) {
    const o = s.find((w) => w.name === u.name);
    if (!o || o.type !== u.type || o.required !== u.required || o.format !== u.format || o.unit !== u.unit) return "CONFLICT";
  }
  if (!!n.result != !!e.invocation.result) return "CONFLICT";
  if (n.result && e.invocation.result) {
    if (n.result.outputs.length !== e.invocation.result.outputs.length) return "CONFLICT";
    for (const u of n.result.outputs) {
      const o = e.invocation.result.outputs.find((w) => w.name === u.name);
      if (!o || o.type !== u.type || o.format !== u.format || o.unit !== u.unit) return "CONFLICT";
    }
  }
  return s.some((u) => {
    var o;
    return (((o = u.constraints) == null ? void 0 : o.length) ?? 0) > 0;
  }) || ((c = e.invocation.result) == null ? void 0 : c.outputs.some((u) => {
    var o;
    return (((o = u.constraints) == null ? void 0 : o.length) ?? 0) > 0;
  })) === !0 ? "UNVALIDATED" : "VALIDATED";
}
function St(e, t, r) {
  if (e.legacyDraft4) return { contractResolution: "UNRESOLVED", projectionValidation: "UNVALIDATED", availability: "READY", routes: [] };
  const n = Pt(e.semanticType, r), i = Ct(e, n.contract, n.state);
  if (!e.invocation) return { contractResolution: n.state, projectionValidation: i, routes: [] };
  const s = e.interfaceUses.map((c) => Dt(c, t.find((u) => u.id === c.ref), i)), a = qt(s);
  return { contractResolution: n.state, projectionValidation: i, ...a ? { availability: a } : {}, routes: s };
}
function Dt(e, t, r) {
  var u;
  if (!t) return { interfaceRef: e.ref, requirement: "SATISFIED", attachment: "SATISFIED", support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "Interface が存在しません" };
  const n = t.requirements.length > 0 ? "UNKNOWN" : "SATISFIED", i = t.attachment ? "UNKNOWN" : "SATISFIED";
  if (!t.realization) return { interfaceRef: e.ref, requirement: n, attachment: i, support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "Realization がありません" };
  if (t.realization.extension.namespace !== "https://relink.dev/ns/arxml/http/0.1" || t.realization.extension.localName !== "api") return { interfaceRef: e.ref, requirement: n, attachment: i, support: "UNKNOWN", availability: "UNKNOWN", reason: "未知の Realization です" };
  try {
    rt(t.realization.extension);
  } catch {
    return { interfaceRef: e.ref, requirement: n, attachment: i, support: "UNSUPPORTED", availability: "UNAVAILABLE", reason: "HTTP Realization が不正です" };
  }
  let s = "SUPPORTED", a = "";
  const c = (u = e.mapping) == null ? void 0 : u.extension;
  if (c && (c.namespace !== "https://relink.dev/ns/arxml/http/0.1" || c.localName !== "operation"))
    s = "UNKNOWN";
  else
    try {
      const o = nt(c);
      o ? a = o.method : s = "UNSUPPORTED";
    } catch {
      s = "UNSUPPORTED";
    }
  return s === "SUPPORTED" && !["GET", "POST", "PUT", "PATCH"].includes(a) && (s = "UNSUPPORTED"), r === "CONFLICT" || s === "UNSUPPORTED" ? { interfaceRef: e.ref, requirement: n, attachment: i, support: s, availability: "UNAVAILABLE", reason: r === "CONFLICT" ? "Capability projection が CONFLICT です" : "HTTP Mapping が未対応です" } : r === "UNVALIDATED" || n === "UNKNOWN" || i === "UNKNOWN" || s === "UNKNOWN" ? { interfaceRef: e.ref, requirement: n, attachment: i, support: s, availability: "UNKNOWN", reason: "必要な評価が UNKNOWN です" } : { interfaceRef: e.ref, requirement: n, attachment: i, support: s, availability: "READY" };
}
function qt(e) {
  return e.some((t) => t.availability === "READY") ? "READY" : e.some((t) => t.availability === "UNKNOWN") ? "UNKNOWN" : (e.length > 0, "UNAVAILABLE");
}
function xt(e, t, r) {
  var s;
  const n = r.resolveProfile(t).filter((a) => a.identifier === t);
  return n.length !== 1 ? { resolution: "UNRESOLVED", conformance: "UNDETERMINED" } : { resolution: "RESOLVED", conformance: (((s = n[0]) == null ? void 0 : s.requiredCapabilities) ?? []).every((a) => e.includes(a)) ? "CONFORMANT" : "NON_CONFORMANT" };
}
function Mt(e, t) {
  let r;
  try {
    jt(e), r = JSON.parse(e);
  } catch (N) {
    throw N instanceof H ? N : new H(`Manifest JSON の構文が正しくありません: ${t}`, N);
  }
  if (!ot(r)) throw new A("Manifest は JSON object である必要があります");
  if (r.manifestVersion !== "0.1") throw new A("Manifest の manifestVersion は 0.1 である必要があります");
  const n = x(r, "anchor"), i = x(r, "entity"), s = x(r, "description"), a = x(r, "lifecycle"), c = M(n, "id", "anchor"), u = M(i, "id", "entity"), o = M(s, "location", "description"), w = M(a, "status", "lifecycle");
  if (!$t.test(c)) throw new A("Manifest の anchor.id が UUID ではありません");
  if (!Vt(u)) throw new A("Manifest の entity.id は絶対 URI である必要があります");
  let f;
  try {
    f = new URL(o);
  } catch {
    throw new A(`Manifest の description.location が不正です: ${o}`);
  }
  if (f.protocol !== "https:") throw new A("Manifest の description.location は HTTPS URL である必要があります");
  if (w !== "active" && w !== "suspended" && w !== "retired") throw new A("Manifest の lifecycle.status が不正です");
  return Ht(c, t), { manifestVersion: "0.1", anchorId: c, entityId: u, descriptionLocation: f.href, lifecycleStatus: w };
}
const $t = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function x(e, t) {
  const r = e[t];
  if (!ot(r)) throw new A(`Manifest の ${t} は object である必要があります`);
  return r;
}
function M(e, t, r) {
  const n = e[t];
  if (typeof n != "string" || n.length === 0) throw new A(`Manifest の ${r}.${t} は必須の文字列です`);
  return n;
}
function Vt(e) {
  try {
    return new URL(e).protocol.length > 0;
  } catch {
    return !1;
  }
}
function jt(e) {
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
    const i = kt(e, r);
    r = i.end;
    const s = Ft(e, r);
    if (e[s] !== ":" || t.length === 0) continue;
    const a = t[t.length - 1];
    if (a) {
      if (a.has(i.value)) throw new H(`Manifest JSON に重複した member name があります: ${i.value}`);
      a.add(i.value);
    }
  }
}
function kt(e, t) {
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
function Ft(e, t) {
  let r = t;
  for (; r < e.length && /\s/.test(e[r] ?? ""); ) r += 1;
  return r;
}
function Ht(e, t) {
  let r;
  try {
    r = new URL(t);
  } catch {
    return;
  }
  const n = r.pathname.match(/\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/manifest\/?$/i);
  if (n && n[1].toLowerCase() !== e.toLowerCase()) throw new A("Manifest の anchor.id が取得URLの UUID と一致しません");
}
function ot(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function B(e) {
  const t = e.text.trim();
  return {
    namespace: e.namespace,
    localName: e.localName,
    attributes: e.attributes.map((r) => ({ namespace: r.namespace, localName: r.localName, value: r.value })),
    children: e.children.map(B),
    ...t.length > 0 ? { text: t } : {}
  };
}
const g = "https://relink.dev/ns/arxml/core/0.1", zt = ["string", "number", "integer", "boolean", "binary", "object", "array"], at = "http://www.w3.org/2000/xmlns/";
function Wt(e, t) {
  const r = e.root;
  if (!r || r.localName !== "ar-entity" || r.namespace !== g) throw new p("Draft 5 の ar-entity root が必要です");
  if (h(r, ["version"]), l(r, "version") !== "0.1") throw new p("version 属性には 0.1 が必要です");
  m(r, "ar-entity");
  const n = S(r, ["category", "identifiers", "properties", "subjects", "profiles", "interfaces", "capabilities"]), i = n.get("category"), s = i ? se(i, "category") : void 0, a = _t(n.get("identifiers")), c = Bt(n.get("subjects")), u = k(c.map((R) => R.id), "Subject"), o = Jt(n.get("properties")), w = Xt(n.get("profiles")), f = Kt(n.get("interfaces")), N = k(f.map((R) => R.id), "Interface"), y = Yt(n.get("capabilities"));
  k(y.map((R) => R.localId), "Capability");
  for (const R of a) if (R.subjectRef && !u.has(R.subjectRef)) throw new p(`Identifier の subject-ref が解決できません: ${R.subjectRef}`);
  for (const R of y) {
    if (R.subjectRef && !u.has(R.subjectRef)) throw new p(`Capability の subject-ref が解決できません: ${R.subjectRef}`);
    for (const I of R.interfaceUses) if (!N.has(I.ref)) throw new p(`InterfaceUse の ref が解決できません: ${I.ref}`);
  }
  return { url: t, ...s ? { category: s } : {}, metadata: b(r), identifiers: a, properties: o.properties, propertyExtensions: o.extensions, subjects: c, profileClaims: w, interfaces: f, capabilities: y };
}
function S(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const n of e.children) {
    if (v(n), !t.includes(n.localName)) throw new p(`未知の Core 要素です: ${n.localName}`);
    if (r.has(n.localName)) throw new p(`Core container が重複しています: ${n.localName}`);
    r.set(n.localName, n);
  }
  return r;
}
function _t(e) {
  return e ? (h(e, []), m(e, "identifiers"), e.children.map((t) => {
    v(t, "identifier"), h(t, ["type", "value", "subject-ref"]), D(t, "identifier");
    const r = T(l(t, "type"), "identifier/@type"), n = T(l(t, "value"), "identifier/@value");
    return { type: r, value: n, ...l(t, "subject-ref") ? { subjectRef: l(t, "subject-ref") } : {}, metadata: b(t) };
  })) : [];
}
function Jt(e) {
  if (!e) return { properties: [], extensions: [] };
  h(e, []), m(e, "properties");
  const t = [], r = [];
  for (const n of e.children) {
    if (n.namespace !== g) {
      t.push(B(n));
      continue;
    }
    v(n, "property"), h(n, ["type", "value", "unit"]), D(n, "property");
    const i = n.children.map((s) => j(s, "property"));
    r.push({ type: T(l(n, "type"), "property/@type"), value: T(l(n, "value"), "property/@value"), ...l(n, "unit") ? { unit: l(n, "unit") } : {}, ...i.length > 0 ? { extensions: i } : {}, metadata: b(n) });
  }
  return { properties: r, extensions: t };
}
function Bt(e) {
  return e ? (h(e, []), m(e, "subjects"), e.children.map((t) => (v(t, "subject"), h(t, ["id", "type"]), D(t, "subject"), { id: T(l(t, "id"), "subject/@id"), ...l(t, "type") ? { type: l(t, "type") } : {}, metadata: b(t) }))) : [];
}
function Xt(e) {
  return e ? (h(e, []), m(e, "profiles"), e.children.map((t) => (v(t, "conforms-to"), h(t, ["href"]), D(t, "conforms-to"), { href: X(l(t, "href"), "conforms-to/@href"), metadata: b(t) }))) : [];
}
function Kt(e) {
  return e ? (h(e, []), m(e, "interfaces"), e.children.map((t) => {
    v(t, "interface"), h(t, ["id"]), m(t, "interface");
    const r = S(t, ["attachment", "realization", "requirements"]), n = r.get("attachment"), i = r.get("realization");
    if (!n && !i) throw new p("Interface には attachment または realization が必要です");
    return { id: T(l(t, "id"), "interface/@id"), ...n ? { attachment: { extension: z(n, "attachment") } } : {}, ...i ? { realization: { extension: z(i, "realization") } } : {}, requirements: ut(r.get("requirements")), metadata: b(t) };
  })) : [];
}
function Yt(e) {
  return e ? (h(e, []), m(e, "capabilities"), e.children.map((t) => {
    if (v(t, "capability"), h(t, ["id", "type", "subject-ref"]), m(t, "capability"), t.children.some((s) => s.namespace === g && ["inputs", "result", "interfaces"].includes(s.localName))) return Gt(t);
    const r = S(t, ["requirements", "invocation", "interface-uses"]), n = ee(r.get("invocation"));
    return { localId: T(l(t, "id"), "capability/@id"), semanticType: X(l(t, "type"), "capability/@type"), ...l(t, "subject-ref") ? { subjectRef: l(t, "subject-ref") } : {}, requirements: ut(r.get("requirements")), ...n ? { invocation: n } : {}, interfaceUses: ne(r.get("interface-uses")), metadata: b(t) };
  })) : [];
}
function Gt(e) {
  h(e, ["id", "type"]);
  const t = e.children.find((o) => o.namespace === g && o.localName === "inputs"), r = e.children.find((o) => o.namespace === g && o.localName === "result"), n = e.children.find((o) => o.namespace === g && o.localName === "interfaces"), i = t ? Zt(t) : [], s = r ? Qt(r) : void 0, a = n ? te(n) : [], c = T(l(e, "id"), "capability/@id"), u = X(l(e, "type"), "capability/@type");
  return { localId: c, semanticType: u, inputs: i, result: s, interfaces: a, requirements: [], invocation: { inputs: i, ...s ? { result: s } : {} }, interfaceUses: [], legacyDraft4: !0, contractResolution: "UNRESOLVED", projectionValidation: "UNVALIDATED", availability: "READY", metadata: b(e) };
}
function Zt(e) {
  return h(e, []), m(e, "inputs"), e.children.map((t) => V(t, !0));
}
function Qt(e) {
  h(e, []), m(e, "result");
  const t = e.children.find((n) => n.localName === "outputs");
  if (!t) throw new p("result には outputs が必要です");
  h(t, []), m(t, "outputs");
  const r = e.children.find((n) => n.localName === "representations");
  return { outputs: t.children.map((n) => V(n, !1)), representations: r ? ct(r) : [] };
}
function te(e) {
  return h(e, []), m(e, "interfaces"), e.children.map((t) => {
    v(t, "interface"), h(t, ["type", "method", "endpoint", "encoding"]), D(t, "interface");
    const r = l(t, "type"), n = l(t, "method");
    if (r !== "http" || n !== "GET" && n !== "POST") throw new p("Draft 4 HTTP Interface が不正です");
    const i = T(l(t, "endpoint"), "interface/@endpoint"), s = l(t, "encoding");
    if (s !== void 0 && s !== "json") throw new p("interface/@encoding が不正です");
    return { type: "http", method: n, endpoint: i, ...s ? { encoding: s } : {} };
  });
}
function ee(e) {
  if (!e) return;
  h(e, []), m(e, "invocation");
  const t = S(e, ["inputs", "result"]), r = t.get("inputs");
  let n = [];
  r && (h(r, []), m(r, "inputs"), n = r.children.map((a) => V(a, !0)), ft(n, "input"));
  const i = t.get("result"), s = i ? re(i) : void 0;
  return { inputs: n, ...s ? { result: s } : {}, metadata: b(e) };
}
function re(e) {
  h(e, []), m(e, "result");
  const t = S(e, ["outputs", "representations"]), r = t.get("outputs");
  if (!r) throw new p("result には outputs が必要です");
  h(r, []), m(r, "outputs");
  const n = r.children.map((a) => V(a, !1));
  if (ft(n, "output"), n.length === 0) throw new p("result の outputs は1件以上必要です");
  const i = t.get("representations"), s = i ? ct(i) : [];
  return { outputs: n, representations: s };
}
function ct(e) {
  return h(e, []), m(e, "representations"), e.children.map((t) => {
    v(t, "representation"), h(t, ["media-type"]), D(t, "representation");
    const r = T(l(t, "media-type"), "representation/@media-type");
    if (!oe(r)) throw new p("representation media-type が不正です");
    return { mediaType: r, metadata: b(t) };
  });
}
function V(e, t) {
  v(e, t ? "input" : "output"), h(e, t ? ["name", "type", "required", "format", "unit"] : ["name", "type", "format", "unit"]), m(e, t ? "input" : "output");
  const r = ie(e);
  for (const c of e.children) if (c.namespace !== g || c.localName !== "constraints") throw new p(`${t ? "input" : "output"} の未知の子要素です: ${c.localName}`);
  const n = T(l(e, "name"), `${t ? "input" : "output"}/@name`), i = l(e, "type");
  if (!i || !zt.includes(i)) throw new p(`${t ? "input" : "output"} type が未定義です: ${i ?? ""}`);
  const s = { name: n, type: i, ...l(e, "format") ? { format: l(e, "format") } : {}, ...l(e, "unit") ? { unit: l(e, "unit") } : {}, ...r.length > 0 ? { constraints: r } : {}, metadata: b(e) };
  if (!t) return s;
  const a = l(e, "required");
  if (a !== void 0 && a !== "true" && a !== "false") throw new p("input/@required は true または false である必要があります");
  return { ...s, required: a !== "false" };
}
function ut(e) {
  return e ? (h(e, []), m(e, "requirements"), e.children.map((t) => {
    v(t, "requirement"), h(t, ["type"]);
    const r = t.children.map((n) => j(n, "requirement"));
    return m(t, "requirement"), { type: T(l(t, "type"), "requirement/@type"), extensions: r, metadata: b(t) };
  })) : [];
}
function ne(e) {
  return e ? (h(e, []), m(e, "interface-uses"), e.children.map((t) => {
    v(t, "interface-use"), h(t, ["ref"]), m(t, "interface-use");
    const n = S(t, ["mapping"]).get("mapping");
    return { ref: T(l(t, "ref"), "interface-use/@ref"), ...n ? { mapping: { extension: z(n, "mapping") } } : {}, metadata: b(t) };
  })) : [];
}
function z(e, t) {
  if (h(e, []), m(e, t), e.children.length !== 1) throw new p(`${t} には foreign Extension root が1つ必要です`);
  return j(e.children[0], t);
}
function j(e, t) {
  if (e.namespace === g || e.namespace.length === 0) throw new p(`${t} には foreign namespaced Extension が必要です`);
  return B(e);
}
function ie(e) {
  const t = e.children.filter((n) => n.namespace === g && n.localName === "constraints");
  if (t.length > 1) throw new p("constraints wrapper が重複しています");
  const r = t[0];
  return r ? (h(r, []), m(r, "constraints"), r.children.map((n) => j(n, "constraints"))) : [];
}
function v(e, t) {
  if (e.namespace !== g || t && e.localName !== t) throw new p(`Core 要素が不正です: ${e.localName}`);
}
function h(e, t) {
  for (const r of e.attributes)
    if (r.namespace !== at && !(r.namespace !== "" && r.namespace !== g) && (r.namespace === g || !t.includes(r.localName)))
      throw new p(`未知の Core/unqualified attribute です: ${e.localName}/@${r.localName}`);
}
function b(e) {
  return e.attributes.filter((t) => t.namespace !== "" && t.namespace !== g && t.namespace !== at).map((t) => ({ namespace: t.namespace, localName: t.localName, value: t.value }));
}
function l(e, t) {
  var r;
  return (r = e.attributes.find((n) => n.namespace === "" && n.localName === t)) == null ? void 0 : r.value;
}
function m(e, t) {
  if (e.text.trim().length > 0) throw new p(`${t} に予期しない文字データがあります`);
}
function D(e, t) {
  if (m(e, t), e.children.length > 0) throw new p(`${t} に予期しない子要素があります`);
}
function se(e, t) {
  const r = e.text.trim();
  if (r.length === 0 || e.children.length > 0) throw new p(`${t} は空でない文字列が必要です`);
  return h(e, []), r;
}
function T(e, t) {
  if (!e || e.trim().length === 0) throw new p(`${t} は必須です`);
  return e;
}
function k(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (r.has(n)) throw new p(`${t} id が重複しています: ${n}`);
    r.add(n);
  }
  return r;
}
function ft(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (r.has(n.name)) throw new p(`${t} name が重複しています: ${n.name}`);
    r.add(n.name);
  }
}
function X(e, t) {
  var s;
  const r = T(e, t);
  let n;
  try {
    n = new URL(r);
  } catch {
    throw new p(`${t} は絶対 Semantic Identifier が必要です`);
  }
  if (!n.protocol || (n.protocol === "http:" || n.protocol === "https:") && !n.hostname) throw new p(`${t} は絶対 Semantic Identifier が必要です`);
  const i = (s = n.pathname.split("/").filter(Boolean).at(-1)) == null ? void 0 : s.toLowerCase();
  if (!i || i === "latest") throw new p(`${t} は exact-versioned identifier が必要です`);
  return r;
}
function oe(e) {
  return /^[^\s/;]+\/[^\s/;]+(?:\s*;\s*[^\s=;]+\s*=\s*(?:[^\s;]+|"[^"]*"))*$/.test(e);
}
class ae {
  resolveCapability(t) {
    return [];
  }
  resolveProfile(t) {
    return [];
  }
}
class ye {
  constructor(t = [], r = []) {
    O(this, "capabilities");
    O(this, "profiles");
    this.capabilities = t, this.profiles = r;
  }
  resolveCapability(t) {
    return this.capabilities.filter((r) => r.identifier === t);
  }
  resolveProfile(t) {
    return this.profiles.filter((r) => r.identifier === t);
  }
}
function Ne(e, t, r) {
  var a, c, u;
  const n = r.resolveProfile(t).filter((o) => o.identifier === t);
  if (n.length !== 1) return { resolution: "UNRESOLVED", conformance: "UNDETERMINED" };
  const i = n[0], s = new Set(e.capabilities.map((o) => o.semanticType));
  for (const o of i.requiredCapabilities ?? []) if (!s.has(o)) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  for (const o of i.capabilityRequirements ?? []) {
    const w = e.capabilities.find((y) => y.semanticType === o.contractIdentifier);
    if (!w) {
      if (o.required !== !1) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
      continue;
    }
    const f = new Set((a = w.invocation) == null ? void 0 : a.inputs.map((y) => y.name));
    for (const y of o.requiredInputNames ?? []) if (!f.has(y)) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
    const N = new Set((u = (c = w.invocation) == null ? void 0 : c.result) == null ? void 0 : u.outputs.map((y) => y.name));
    for (const y of o.requiredOutputNames ?? []) if (!N.has(y)) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  }
  for (const o of i.propertyRequirements ?? [])
    if (!e.properties.some((f) => f.type === o.type && (o.value === void 0 || f.value === o.value)) && o.required !== !1) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  for (const o of i.identifierRequirements ?? [])
    if (!e.identifiers.some((f) => f.type === o.type && (o.value === void 0 || f.value === o.value)) && o.required !== !1) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  for (const o of i.interfaceRequirements ?? [])
    if (!e.interfaces.some((f) => (o.id === void 0 || f.id === o.id) && (!o.requireRealization || f.realization !== void 0)) && o.required !== !1) return { resolution: "RESOLVED", conformance: "NON_CONFORMANT" };
  return { resolution: "RESOLVED", conformance: "CONFORMANT" };
}
class ce {
  permits(t, r) {
    const n = new URL(r);
    return t.protocol !== "http:" && t.protocol !== "https:" ? !1 : n.protocol !== "https:" || t.protocol === "https:";
  }
}
class Re {
  constructor(t = {}) {
    O(this, "xmlParser");
    O(this, "resourceFetcher");
    O(this, "httpInvoker");
    O(this, "networkPolicy");
    O(this, "resourceNetworkPolicy");
    O(this, "semanticRegistry");
    this.xmlParser = t.xmlParser ?? new yt(), this.resourceFetcher = t.resourceFetcher ?? new wt(globalThis.fetch.bind(globalThis), { credentials: t.resourceCredentials }), this.httpInvoker = t.httpInvoker ?? new mt(), this.networkPolicy = t.networkPolicy ?? new Tt(), this.resourceNetworkPolicy = t.resourceNetworkPolicy ?? new ce(), this.semanticRegistry = t.semanticRegistry ?? new ae();
  }
  /** AR-XML または明示 Manifest 経由の description を取得します。Capability は実行しません。 */
  async load(t, r = {}) {
    const n = U(t), i = await this.fetchDocumentResource(t, n.href, r, ue(n.href));
    if (Z(i)) {
      const s = Mt(i.body, U(i.responseUrl).href), a = U(s.descriptionLocation);
      return this.buildRuntimeDocument(await this.fetchDocumentResource(a.href, a.href, r, !1));
    }
    return this.buildRuntimeDocument(i);
  }
  async fetchDocumentResource(t, r, n, i) {
    const s = U(r);
    this.assertResourceRequest(U(t), s.href);
    const a = { signal: n.signal, credentials: n.credentials, beforeRequest: (o) => this.assertResourceRequest(U(o), s.href) };
    let c;
    try {
      c = await fe(this.resourceFetcher, t, a);
    } catch (o) {
      throw i ? new Y("Manifest の取得中に通信エラーが発生しました", t, void 0, o) : o;
    }
    if (c.status < 200 || c.status >= 300)
      throw i || Z(c) ? new Y(`Manifest の取得に失敗しました (${c.status})`, c.responseUrl, c.status, new F(c.status, c.responseUrl)) : new F(c.status, c.responseUrl);
    const u = U(c.responseUrl);
    this.assertResourceRequest(u, s.href);
    for (const o of c.redirectUrls ?? []) this.assertResourceRequest(U(o), s.href);
    return c;
  }
  buildRuntimeDocument(t) {
    const r = U(t.responseUrl);
    return new pe(Wt(this.xmlParser.parse(t.body), r.href), this.httpInvoker, this.networkPolicy, this.semanticRegistry);
  }
  assertResourceRequest(t, r) {
    if (new URL(r).protocol === "https:" && t.protocol === "http:") throw new ht(r, t.href);
    if (!this.resourceNetworkPolicy.permits(t, r)) throw new dt(t.href);
  }
}
function Z(e) {
  var r, n;
  const t = (n = (r = e.contentType) == null ? void 0 : r.split(";", 1)[0]) == null ? void 0 : n.trim().toLowerCase();
  return t === "application/json" || (t == null ? void 0 : t.endsWith("+json")) === !0 || e.body.trimStart().startsWith("{");
}
function ue(e) {
  const t = new URL(e).pathname.toLowerCase();
  return t.endsWith("/manifest") || t.endsWith("/manifest.json") || t.endsWith(".manifest");
}
function U(e) {
  let t;
  try {
    t = new URL(e);
  } catch (r) {
    throw new C("AR-XML のURLが不正です", r);
  }
  if (t.protocol !== "http:" && t.protocol !== "https:") throw new C("AR-XML のURLにはHTTP(S)を指定してください");
  return t;
}
async function fe(e, t, r) {
  if (e.fetchResource) return e.fetchResource(t, r);
  if (e.fetchText) return { requestedUrl: t, responseUrl: t, status: 200, body: await e.fetchText(t, r.signal) };
  throw new C("AR-XML の取得Adapterが設定されていません");
}
class pe {
  constructor(t, r, n, i) {
    this.document = t, this.httpInvoker = r, this.networkPolicy = n, this.semanticRegistry = i;
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
    return r ? new le(r, this.document, this.httpInvoker, this.networkPolicy, this.semanticRegistry) : void 0;
  }
  evaluateCapability(t) {
    var r;
    return (r = this.getCapability(t)) == null ? void 0 : r.evaluation;
  }
  evaluateProfile(t) {
    return xt(this.document.capabilities.map((r) => r.semanticType), t, this.semanticRegistry);
  }
}
class le {
  constructor(t, r, n, i, s) {
    O(this, "snapshot");
    this.capability = t, this.document = r, this.httpInvoker = n, this.networkPolicy = i, this.snapshot = St(t, r.interfaces, s);
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
    const n = this.snapshot.routes.filter((s) => s.availability === "READY").map((s) => s.interfaceRef).sort();
    if (this.capability.legacyDraft4) {
      if (this.snapshot.availability !== "READY") throw new p(`Capability route が READY ではありません: ${this.snapshot.availability ?? "UNAVAILABLE"}`);
      return G(this.capability, this.document.interfaces, this.document.url, t, r, this.httpInvoker, this.networkPolicy);
    }
    const i = r.interfaceRef ?? n[0];
    if (!i || !n.includes(i)) throw new p(`READY な InterfaceUse route がありません: ${r.interfaceRef ?? this.snapshot.availability ?? "UNAVAILABLE"}`);
    return G(this.capability, this.document.interfaces, this.document.url, t, { ...r, interfaceRef: i }, this.httpInvoker, this.networkPolicy);
  }
}
class Te {
  constructor(t = []) {
    O(this, "processors");
    this.processors = t;
  }
  find(t, r) {
    return this.processors.find((n) => n.namespace === t.namespace && n.localName === t.localName && n.slots.includes(r));
  }
}
export {
  Re as ARRuntime,
  E as ARRuntimeError,
  me as CapabilityError,
  we as ContractError,
  de as ContractResolutionError,
  ce as DefaultResourceNetworkPolicy,
  ae as EmptySemanticRegistry,
  F as HTTPResponseError,
  ht as HTTPSDowngradeError,
  Te as InMemoryExtensionRegistry,
  ye as InMemorySemanticRegistry,
  d as InterfaceError,
  W as ManifestError,
  Y as ManifestFetchError,
  H as ManifestParseError,
  A as ManifestValidationError,
  dt as NetworkPolicyError,
  K as ParseError,
  L as RepresentationError,
  le as RuntimeCapability,
  pe as RuntimeDocument,
  C as TransportError,
  p as ValidationError,
  St as evaluateCapability,
  xt as evaluateProfile,
  Ne as evaluateProfileDocument,
  Pt as resolveContract,
  Ct as validateProjection
};
