// examples/external-consumer/src/main.ts
import { ARRuntime, InMemorySemanticRegistry, type ARRuntimeOptions, type CapabilityContract } from "@relink/web-runtime";

// 公開Declarationを通じてDraft 5のSemantic Registryを利用できることも確認します。
const contract: CapabilityContract = { identifier: "https://example.test/contracts/read/1", invocation: {} };
const options: ARRuntimeOptions = { semanticRegistry: new InMemorySemanticRegistry([contract]) };
const runtime = new ARRuntime(options);
const status = document.querySelector("#status");

if (status) {
  status.textContent = `ARRuntimeを読み込みました: ${typeof runtime.load}`;
}
