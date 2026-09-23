# Web Developer Library Guide

This guide is for web developers using the compiled `@relink/web-runtime` package from a browser application or bundler. It covers the shortest path from installation to loading an AR-XML document and explicitly invoking one Capability.

日本語版: [Web開発者向けライブラリ利用ガイド](library-guide.ja.md)

## What the library does

The Runtime reads an AR-XML description and exposes it as a `RuntimeDocument`. Loading is passive: it parses and validates the description but never calls a Capability. Network side effects start only when your application calls `RuntimeCapability.invoke()`.

You need:

- a browser application or a bundler such as Vite, Webpack, or Rollup;
- an HTTP(S) URL for the AR-XML document;
- CORS permission when the document or its HTTP endpoint is on another origin.

## 1. Install and import

```bash
npm install @relink/web-runtime
```

The package contains a precompiled browser bundle and TypeScript declarations. Import from the package root:

```ts
import { ARRuntime, InMemorySemanticRegistry } from "@relink/web-runtime";
```

The same API is available from JavaScript; remove the TypeScript type annotations.

## 2. Load a document

Register the exact Contract used by the document when you want Runtime availability evaluation and invocation. The default empty registry leaves the Contract unresolved, so a route normally remains `UNKNOWN`.

```ts
const contract = {
  identifier: "https://example.org/contracts/light/set/1",
  invocation: {
    inputs: [{ name: "on", type: "boolean", required: true }],
    result: {
      outputs: [{ name: "state", type: "boolean" }],
      representations: [{ mediaType: "application/json" }],
    },
  },
};

const runtime = new ARRuntime({
  semanticRegistry: new InMemorySemanticRegistry([contract]),
});

const documentUrl = new URL(
  "/entities/light.arxml",
  window.location.href,
).href;
const document = await runtime.load(documentUrl);

console.log(document.url);
console.log(document.capabilities.map((item) => item.localId));
```

`load()` performs resource fetching, XML parsing, Core validation, and AR-DOM exposure. It does not invoke `light` or any other Capability.

## 3. Inspect and invoke a Capability

```ts
const capability = document.getCapability("light");
if (!capability) throw new Error("Capability 'light' was not found");

console.log(capability.evaluation.availability);

if (capability.availability !== "READY") {
  throw new Error("The Capability is not ready for invocation");
}

const result = await capability.invoke(
  { on: true },
  { accept: "application/json" },
);

console.log(result.values.state);
```

`invoke()` validates the declared Input before sending the request. A JSON Result is returned as `result.values`, keyed by the declared Output names.

If the document has more than one READY `InterfaceUse` route, select one explicitly:

```ts
const route = capability.evaluation.routes.find(
  (item) => item.availability === "READY",
);
if (!route) throw new Error("No READY route");

const result = await capability.invoke(
  { on: true },
  { routeId: route.routeId, accept: "application/json" },
);
```

Routes are never selected by XML order, and a failed route is never retried automatically. `interfaceRef` may be used only when it identifies one READY route uniquely.

## 4. Minimal AR-XML shape

The following description matches the Contract and code samples above:

```xml
<ar-entity xmlns="https://relink.dev/ns/arxml/core/0.1"
           xmlns:http="https://relink.dev/ns/arxml/http/0.1"
           version="0.1">
  <interfaces>
    <interface id="web-api">
      <realization><http:api base="./api/" /></realization>
    </interface>
  </interfaces>
  <capabilities>
    <capability id="light"
                type="https://example.org/contracts/light/set/1">
      <invocation>
        <inputs><input name="on" type="boolean" /></inputs>
        <result>
          <outputs><output name="state" type="boolean" /></outputs>
          <representations>
            <representation media-type="application/json" />
          </representations>
        </result>
      </invocation>
      <interface-uses>
        <interface-use ref="web-api">
          <mapping>
            <http:operation method="POST" path="light/state" />
          </mapping>
        </interface-use>
      </interface-uses>
    </capability>
  </capabilities>
</ar-entity>
```

The Capability `type` must exactly match the Contract identifier registered in the application. `http:api` is placed on the shared Interface; `http:operation` is placed on the Capability's InterfaceUse mapping.

## 5. Handle failures

Use the error category to decide which layer failed:

```ts
import {
  InterfaceError,
  RepresentationError,
  TransportError,
  ValidationError,
} from "@relink/web-runtime";

try {
  await capability.invoke({ on: true });
} catch (error) {
  if (error instanceof ValidationError) {
    // Input or route selection is invalid.
  } else if (error instanceof InterfaceError) {
    // The HTTP route or HTTP status failed.
  } else if (error instanceof RepresentationError) {
    // The response does not match the declared Result.
  } else if (error instanceof TransportError) {
    // The AR-XML resource could not be fetched.
  }
  throw error;
}
```

The default browser HTTP adapter supports scalar GET query Inputs and JSON-object POST/PUT/PATCH bodies. Declared JSON Results require `application/json` and a top-level object containing every declared Output. Redirects are rejected by default.

## Important defaults

- Draft 5 is the default document format. Draft 4 is available only through the explicit migration option `{ documentFormat: "draft4" }`; it is not a Draft 5 conformance mode.
- The default invocation network policy allows only the document's origin.
- `load()` never performs Capability execution.
- The package is experimental and versions below `1.0.0` do not guarantee backward compatibility.

For the complete API contract, see [Public API Reference](api.md). For the normative format rules, see [AR-XML Core 0.1 Draft 5](specs/arxml-core-0.1-draft5.md).
