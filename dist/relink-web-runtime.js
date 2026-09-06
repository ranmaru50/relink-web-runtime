var q = Object.defineProperty;
var D = (e, t, r) => t in e ? q(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var T = (e, t, r) => D(e, typeof t != "symbol" ? t + "" : t, r);
class p extends Error {
  constructor(t, r, n) {
    super(r), this.category = t, this.cause = n, this.name = t;
  }
}
class $ extends p {
  constructor(t, r) {
    super("ParseError", t, r);
  }
}
class u extends p {
  constructor(t) {
    super("ValidationError", t);
  }
}
class Rt extends p {
  constructor(t) {
    super("ContractResolutionError", t);
  }
}
class bt extends p {
  constructor(t) {
    super("ContractError", t);
  }
}
class E extends p {
  constructor(t, r) {
    super("TransportError", t, r);
  }
}
class M extends p {
  constructor(t, r) {
    super("HTTPResponseError", `AR-XML の取得に失敗しました (${t})`), this.status = t, this.url = r;
  }
}
class H extends p {
  constructor(t, r) {
    super("HTTPSDowngradeError", "HTTPS から HTTP へのダウングレードは許可されません"), this.fromUrl = t, this.toUrl = r;
  }
}
class j extends p {
  constructor(t) {
    super("NetworkPolicyError", "Runtime のネットワークポリシーによりドキュメント取得先が拒否されました"), this.url = t;
  }
}
class k extends p {
  constructor(t, r, n) {
    super(t, r, n);
  }
}
class v extends k {
  constructor(t, r, n, o) {
    super("ManifestFetchError", t, o), this.url = r, this.status = n;
  }
}
class x extends k {
  constructor(t, r) {
    super("ManifestParseError", t, r);
  }
}
class d extends k {
  constructor(t) {
    super("ManifestValidationError", t);
  }
}
class b extends p {
  constructor(t) {
    super("InterfaceError", t);
  }
}
class g extends p {
  constructor(t) {
    super("RepresentationError", t);
  }
}
class gt extends p {
  constructor(t) {
    super("CapabilityError", t);
  }
}
class J {
  /** 既定の fetch はブラウザの globalThis に束縛して Illegal invocation を防ぎます。 */
  constructor(t = globalThis.fetch.bind(globalThis), r = {}) {
    this.fetcher = t, this.defaultOptions = r;
  }
  /** ブラウザのFetchリダイレクト処理後のレスポンス情報をRuntimeへ渡します。redirect先の制御はブラウザのFetch/CORS/mixed-contentに委ねます。 */
  async fetchResource(t, r = {}) {
    let n;
    const o = { signal: r.signal, redirect: "follow" }, a = r.credentials ?? this.defaultOptions.credentials;
    a !== void 0 && (o.credentials = a);
    try {
      n = await this.fetcher(t, o);
    } catch (i) {
      throw new E("AR-XML の取得中に通信エラーが発生しました", i);
    }
    const c = n.url || t, s = n.headers.get("content-type") ?? void 0;
    if (!n.ok) return { requestedUrl: t, responseUrl: c, status: n.status, body: "", contentType: s };
    try {
      return { requestedUrl: t, responseUrl: c, status: n.status, body: await n.text(), contentType: s };
    } catch (i) {
      throw new E("AR-XML 応答の読み取り中に通信エラーが発生しました", i);
    }
  }
  /** 旧ResourceFetcher APIを維持し、成功時の本文だけを返します。 */
  async fetchText(t, r) {
    const n = await this.fetchResource(t, { signal: r });
    if (n.status < 200 || n.status >= 300) throw new M(n.status, n.responseUrl);
    return n.body;
  }
}
class W {
  /** 既定の fetch はブラウザの globalThis に束縛して Illegal invocation を防ぎます。 */
  constructor(t = globalThis.fetch.bind(globalThis)) {
    this.fetcher = t;
  }
  async invoke(t, r) {
    try {
      return await this.fetcher(t, r);
    } catch (n) {
      throw new E("HTTP 呼び出し中に通信エラーが発生しました", n);
    }
  }
}
class X {
  parse(t) {
    const r = new DOMParser().parseFromString(t, "application/xml");
    if (r.querySelector("parsererror")) throw new $("AR-XML の XML 構文が正しくありません");
    const n = r.documentElement;
    return { namespace: n.namespaceURI, rootName: n.localName, version: n.getAttribute("version"), category: V(l(n, "category")), profileClaims: m(l(n, "profiles"), "conforms-to").map((o) => ({ href: o.getAttribute("href") ?? "" })), capabilities: m(l(n, "capabilities"), "capability").map(F) };
  }
}
function F(e) {
  const t = l(e, "result"), r = m(l(e, "inputs"), "input").map((i) => ({ name: i.getAttribute("name") ?? "", type: i.getAttribute("type") ?? "", required: i.getAttribute("required") === "true", format: w(i, "format"), unit: w(i, "unit") })), n = m(l(t, "outputs"), "output").map((i) => ({ name: i.getAttribute("name") ?? "", type: i.getAttribute("type") ?? "", format: w(i, "format"), unit: w(i, "unit") })), o = m(l(t, "representations"), "representation").map((i) => ({ mediaType: i.getAttribute("media-type") ?? "" })), a = m(l(t, "errors"), "error").map((i) => ({ type: i.getAttribute("type") ?? "" })), c = m(l(e, "requirements"), "require").map((i) => ({ type: i.getAttribute("type") ?? "" })), s = m(l(e, "interfaces"), "interface").map((i) => {
    const h = l(i, "authentication");
    return { type: i.getAttribute("type") ?? "", method: w(i, "method"), endpoint: w(i, "endpoint"), encoding: w(i, "encoding"), authentication: h ? { type: h.getAttribute("type") ?? "", scope: w(h, "scope") } : void 0 };
  });
  return { id: w(e, "id"), type: w(e, "type"), inputs: r, outputs: n, representations: o, errors: a, requirements: c, interfaces: s, hasResult: t !== void 0 };
}
function l(e, t) {
  return m(e, t)[0];
}
function m(e, t) {
  return e ? Array.from(e.children).filter((r) => r.localName === t) : [];
}
function w(e, t) {
  return e.getAttribute(t) ?? void 0;
}
function V(e) {
  var r;
  return ((r = e == null ? void 0 : e.textContent) == null ? void 0 : r.trim()) || void 0;
}
function G(e, t) {
  try {
    return new URL(t, e);
  } catch {
    throw new b("HTTP endpoint が不正です");
  }
}
class B {
  permits(t, r) {
    return t.origin === new URL(r).origin;
  }
}
async function Y(e, t, r, n, o, a) {
  const c = K(e.result.representations, n.accept), s = e.interfaces[0];
  if (!s) throw new b("呼び出し可能な HTTP Interface がありません");
  const i = G(t, s.endpoint);
  if (!a.permits(i, t)) throw new b("Runtime のネットワークポリシーにより endpoint が拒否されました");
  const h = _(s, i, e, r, c, n.signal), f = await o.invoke(i, h);
  if (f.status < 200 || f.status >= 300) throw new b(`HTTP Interface が非成功を返しました (${f.status})`);
  if (f.status === 204) {
    if (e.result.outputs.length > 0) throw new g("required Output があるため 204 Response をマッピングできません");
    return { values: {}, representation: c.mediaType };
  }
  const R = Q(f.headers.get("content-type"));
  if (!O(c.mediaType, R)) throw new g(`Response Content-Type が宣言済み Representation と一致しません: ${R || "未指定"}`);
  const P = await Z(f, R);
  return { values: tt(e.result.outputs, P, R), representation: c.mediaType };
}
function _(e, t, r, n, o, a) {
  z(r, n);
  const c = new Headers({ Accept: o.mediaType });
  if (e.method === "GET") {
    for (const i of r.inputs) {
      const h = n[i.name];
      if (h !== void 0) {
        if (["object", "array", "binary"].includes(i.type)) throw new b(`GET では ${i.type} Input を直列化できません`);
        t.searchParams.set(i.name, String(h));
      }
    }
    return { method: "GET", headers: c, signal: a };
  }
  if (e.encoding !== "json") throw new b('POST Interface には encoding="json" が必要です');
  c.set("Content-Type", "application/json");
  const s = {};
  for (const i of r.inputs) n[i.name] !== void 0 && (s[i.name] = n[i.name]);
  return { method: "POST", headers: c, body: JSON.stringify(s), signal: a };
}
function z(e, t) {
  for (const r of e.inputs) {
    const n = t[r.name];
    if (n === void 0) {
      if (r.required) throw new u(`required Input が不足しています: ${r.name}`);
      continue;
    }
    if (!S(n, r.type)) throw new u(`Input の型が一致しません: ${r.name}`);
  }
}
function S(e, t) {
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
      return e instanceof Blob;
  }
}
function K(e, t) {
  if (e.length === 0) throw new b("Result Representation がありません");
  const r = t ? e.find((n) => O(t, n.mediaType) && L(n.mediaType)) : e.find((n) => L(n.mediaType));
  if (!r) throw new b("互換性のある Result Representation がありません");
  return r;
}
function L(e) {
  return e === "application/json" || e === "application/octet-stream" || e === "application/pdf" || e.startsWith("text/") || e.startsWith("image/");
}
function Q(e) {
  var t;
  return ((t = e == null ? void 0 : e.split(";", 1)[0]) == null ? void 0 : t.trim().toLowerCase()) ?? "";
}
function O(e, t) {
  return e === t || e.endsWith("/*") && t.startsWith(e.slice(0, -1));
}
async function Z(e, t) {
  if (t === "application/json")
    try {
      return JSON.parse(await e.text());
    } catch {
      throw new g("JSON Response の解析に失敗しました");
    }
  return t.startsWith("text/") ? e.text() : e.blob();
}
function tt(e, t, r) {
  if (e.length === 0) return {};
  if (e.length === 1) {
    const o = e[0];
    if (!o || !S(t, o.type)) throw new g("Response 値が Output type と一致しません");
    return { [o.name]: t };
  }
  if (r !== "application/json" || typeof t != "object" || t === null || Array.isArray(t)) throw new g("複数 Output は JSON object でのみマッピングできます");
  const n = {};
  for (const o of e) {
    const a = t[o.name];
    if (a === void 0) throw new g(`Response に Output がありません: ${o.name}`);
    if (!S(a, o.type)) throw new g(`Output の型が一致しません: ${o.name}`);
    n[o.name] = a;
  }
  return n;
}
function et(e, t) {
  let r;
  try {
    ot(e), r = JSON.parse(e);
  } catch (P) {
    throw P instanceof x ? P : new x(`Manifest JSON の構文が正しくありません: ${t}`, P);
  }
  if (!I(r)) throw new d("Manifest は JSON object である必要があります");
  if (r.manifestVersion !== "0.1") throw new d("Manifest の manifestVersion は 0.1 である必要があります");
  const n = A(r, "anchor"), o = A(r, "entity"), a = A(r, "description"), c = A(r, "lifecycle"), s = U(n, "id", "anchor"), i = U(o, "id", "entity"), h = U(a, "location", "description"), f = U(c, "status", "lifecycle");
  if (!rt.test(s)) throw new d("Manifest の anchor.id が UUID ではありません");
  if (!nt(i)) throw new d("Manifest の entity.id は絶対 URI である必要があります");
  let R;
  try {
    R = new URL(h);
  } catch {
    throw new d(`Manifest の description.location が不正です: ${h}`);
  }
  if (R.protocol !== "https:") throw new d("Manifest の description.location は HTTPS URL である必要があります");
  if (f !== "active" && f !== "suspended" && f !== "retired") throw new d("Manifest の lifecycle.status が不正です");
  return at(s, t), { manifestVersion: "0.1", anchorId: s, entityId: i, descriptionLocation: R.href, lifecycleStatus: f };
}
const rt = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function A(e, t) {
  const r = e[t];
  if (!I(r)) throw new d(`Manifest の ${t} は object である必要があります`);
  return r;
}
function U(e, t, r) {
  const n = e[t];
  if (typeof n != "string" || n.length === 0) throw new d(`Manifest の ${r}.${t} は必須の文字列です`);
  return n;
}
function nt(e) {
  try {
    return new URL(e).protocol.length > 0;
  } catch {
    return !1;
  }
}
function ot(e) {
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
    const o = st(e, r);
    r = o.end;
    const a = it(e, r);
    if (e[a] !== ":" || t.length === 0) continue;
    const c = t[t.length - 1];
    if (c) {
      if (c.has(o.value)) throw new x(`Manifest JSON に重複した member name があります: ${o.value}`);
      c.add(o.value);
    }
  }
}
function st(e, t) {
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
function it(e, t) {
  let r = t;
  for (; r < e.length && /\s/.test(e[r] ?? ""); ) r += 1;
  return r;
}
function at(e, t) {
  let r;
  try {
    r = new URL(t);
  } catch {
    return;
  }
  const n = r.pathname.match(/\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/manifest\/?$/i);
  if (n && n[1].toLowerCase() !== e.toLowerCase()) throw new d("Manifest の anchor.id が取得URLの UUID と一致しません");
}
function I(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
const ct = "https://relink.dev/ns/arxml/core/0.1", ut = ["string", "number", "integer", "boolean", "binary", "object", "array"];
function ht(e, t) {
  if (e.rootName !== "ar-entity") throw new u("ar-entity 要素が必要です");
  if (e.namespace !== ct) throw new u("AR-XML Core Namespace が正しくありません");
  if (e.version !== "0.1") throw new u("version 属性には 0.1 が必要です");
  const r = /* @__PURE__ */ new Set(), n = e.capabilities.map((o) => {
    if (!o.id) throw new u("capability 要素には id 属性が必要です");
    if (r.has(o.id)) throw new u(`capability id が重複しています: ${o.id}`);
    if (r.add(o.id), !o.type) throw new u("capability 要素には type 属性が必要です");
    if (C(o.inputs, "input"), C(o.outputs, "output"), !o.hasResult) throw new u("capability 要素には result 要素が必要です");
    const a = /* @__PURE__ */ new Set();
    for (const s of o.outputs) {
      if (a.has(s.name)) throw new u(`output name が重複しています: ${s.name}`);
      a.add(s.name);
    }
    for (const s of o.representations) if (!pt(s.mediaType)) throw new u("representation media-type が不正です");
    const c = o.interfaces.map((s) => {
      if (s.type !== "http") throw new u("未対応の interface type です");
      if (s.method !== "GET" && s.method !== "POST") throw new u("interface method は GET または POST である必要があります");
      if (!s.endpoint) throw new u("http interface には endpoint 属性が必要です");
      if (s.encoding !== void 0 && s.encoding !== "json") throw new u("未対応の interface encoding です");
      return { type: "http", method: s.method, endpoint: s.endpoint, encoding: s.encoding, authentication: s.authentication };
    });
    if (c.length === 0) throw new u("capability には interface が必要です");
    return { localId: o.id, semanticType: o.type, inputs: o.inputs, result: { outputs: o.outputs, representations: o.representations, errors: o.errors }, requirements: o.requirements, interfaces: c, contractResolution: "UNRESOLVED", projectionValidation: "UNVALIDATED", availability: "READY" };
  });
  for (const o of e.profileClaims) if (!o.href) throw new u("conforms-to 要素には href 属性が必要です");
  return { url: t, category: e.category, profileClaims: e.profileClaims, capabilities: n };
}
function C(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (!n.name || !n.type) throw new u(`${t} 要素には name と type 属性が必要です`);
    if (r.has(n.name)) throw new u(`${t} name が重複しています: ${n.name}`);
    if (r.add(n.name), !ut.includes(n.type)) throw new u(`${t} type が未定義です: ${n.type}`);
  }
}
function pt(e) {
  return /^[^\s/]+\/[^\s/]+$/.test(e);
}
class ft {
  /** 初回URLと最終URLを検査し、HTTPS起点のHTTP化を拒否します。 */
  permits(t, r) {
    const n = new URL(r);
    return t.protocol !== "http:" && t.protocol !== "https:" ? !1 : n.protocol !== "https:" || t.protocol === "https:";
  }
}
class Tt {
  constructor(t = {}) {
    T(this, "xmlParser");
    T(this, "resourceFetcher");
    T(this, "httpInvoker");
    T(this, "networkPolicy");
    T(this, "resourceNetworkPolicy");
    this.xmlParser = t.xmlParser ?? new X(), this.resourceFetcher = t.resourceFetcher ?? new J(globalThis.fetch.bind(globalThis), { credentials: t.resourceCredentials }), this.httpInvoker = t.httpInvoker ?? new W(), this.networkPolicy = t.networkPolicy ?? new B(), this.resourceNetworkPolicy = t.resourceNetworkPolicy ?? new ft();
  }
  /** URL から AR-XML または明示指定された Manifest 経由の AR-XML を取得します。 */
  async load(t, r = {}) {
    const n = y(t), o = await this.fetchDocumentResource(t, n.href, r, lt(n.href));
    if (N(o)) {
      const a = y(o.responseUrl), c = et(o.body, a.href), s = y(c.descriptionLocation), i = await this.fetchDocumentResource(s.href, s.href, r, !1);
      return this.buildRuntimeDocument(i);
    }
    return this.buildRuntimeDocument(o);
  }
  /** 取得結果を検証し、HTTPS・ネットワークポリシーを各通信境界へ適用します。 */
  async fetchDocumentResource(t, r, n, o) {
    const a = y(r);
    this.assertResourceRequest(y(t), a.href);
    const c = { signal: n.signal, credentials: n.credentials, beforeRequest: (h) => this.assertResourceRequest(y(h), a.href) };
    let s;
    try {
      s = await wt(this.resourceFetcher, t, c);
    } catch (h) {
      throw o ? new v("Manifest の取得中に通信エラーが発生しました", t, void 0, h) : h;
    }
    if (s.status < 200 || s.status >= 300)
      throw o || N(s) ? new v(`Manifest の取得に失敗しました (${s.status})`, s.responseUrl, s.status, new M(s.status, s.responseUrl)) : new M(s.status, s.responseUrl);
    const i = y(s.responseUrl);
    this.assertResourceRequest(i, a.href);
    for (const h of s.redirectUrls ?? []) this.assertResourceRequest(y(h), a.href);
    return s;
  }
  /** 最終 AR-XML 表現を既存の parser と validation へ渡します。 */
  buildRuntimeDocument(t) {
    const r = y(t.responseUrl);
    return new dt(ht(this.xmlParser.parse(t.body), r.href), this.httpInvoker, this.networkPolicy);
  }
  /** 通信前および取得後に、HTTPS不変条件とRuntimeのリソースポリシーを検証します。 */
  assertResourceRequest(t, r) {
    if (new URL(r).protocol === "https:" && t.protocol === "http:") throw new H(r, t.href);
    if (!this.resourceNetworkPolicy.permits(t, r)) throw new j(t.href);
  }
}
function N(e) {
  var r, n;
  const t = (n = (r = e.contentType) == null ? void 0 : r.split(";", 1)[0]) == null ? void 0 : n.trim().toLowerCase();
  return t === "application/json" || (t == null ? void 0 : t.endsWith("+json")) === !0 || e.body.trimStart().startsWith("{");
}
function lt(e) {
  const t = new URL(e).pathname.toLowerCase();
  return t.endsWith("/manifest") || t.endsWith("/manifest.json") || t.endsWith(".manifest");
}
function y(e) {
  let t;
  try {
    t = new URL(e);
  } catch (r) {
    throw new E("AR-XML のURLが不正です", r);
  }
  if (t.protocol !== "http:" && t.protocol !== "https:") throw new E("AR-XML のURLにはHTTP(S)を指定してください");
  return t;
}
async function wt(e, t, r) {
  if (e.fetchResource) return e.fetchResource(t, r);
  if (e.fetchText) return { requestedUrl: t, responseUrl: t, status: 200, body: await e.fetchText(t, r.signal) };
  throw new E("AR-XML の取得Adapterが設定されていません");
}
class dt {
  constructor(t, r, n) {
    this.document = t, this.httpInvoker = r, this.networkPolicy = n;
  }
  get url() {
    return this.document.url;
  }
  get category() {
    return this.document.category;
  }
  get profileClaims() {
    return this.document.profileClaims;
  }
  get capabilities() {
    return this.document.capabilities;
  }
  getCapability(t) {
    const r = this.document.capabilities.find((n) => n.localId === t);
    return r ? new yt(r, this.document.url, this.httpInvoker, this.networkPolicy) : void 0;
  }
}
class yt {
  constructor(t, r, n, o) {
    this.capability = t, this.documentUrl = r, this.httpInvoker = n, this.networkPolicy = o;
  }
  get definition() {
    return this.capability;
  }
  async invoke(t, r = {}) {
    if (this.capability.availability !== "READY") throw new u("Capability は READY ではありません");
    return Y(this.capability, this.documentUrl, t, r, this.httpInvoker, this.networkPolicy);
  }
}
export {
  Tt as ARRuntime,
  p as ARRuntimeError,
  gt as CapabilityError,
  bt as ContractError,
  Rt as ContractResolutionError,
  ft as DefaultResourceNetworkPolicy,
  M as HTTPResponseError,
  H as HTTPSDowngradeError,
  b as InterfaceError,
  k as ManifestError,
  v as ManifestFetchError,
  x as ManifestParseError,
  d as ManifestValidationError,
  j as NetworkPolicyError,
  $ as ParseError,
  g as RepresentationError,
  yt as RuntimeCapability,
  dt as RuntimeDocument,
  E as TransportError,
  u as ValidationError
};
