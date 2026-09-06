// examples/external-consumer/src/main.ts
import { ARRuntime } from "@relink/web-runtime";

const runtime = new ARRuntime();
const status = document.querySelector("#status");

if (status) {
  status.textContent = `ARRuntimeを読み込みました: ${typeof runtime.load}`;
}
