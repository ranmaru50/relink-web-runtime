// demo/demo.ts
// demo/demo.ts
import { ARRuntime, ManifestError } from "../src/index";

const form = document.querySelector<HTMLFormElement>("#loader");
const urlInput = document.querySelector<HTMLInputElement>("#url");
const errorElement = document.querySelector<HTMLElement>("#error");
const content = document.querySelector<HTMLElement>("#content");
if (!form || !urlInput || !errorElement || !content) throw new Error("デモ画面の初期化に失敗しました");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); errorElement.textContent = ""; content.replaceChildren();
  try {
    const url = new URL(urlInput.value, window.location.href).href;
    const arDocument = await new ARRuntime().load(url);
    for (const capability of arDocument.capabilities) {
      const item = document.createElement("section");
      const details = document.createElement("pre");
      details.textContent = JSON.stringify({ id: capability.localId, type: capability.semanticType, contract: capability.contractResolution, projection: capability.projectionValidation, availability: capability.availability, interfaces: capability.interfaces, representations: capability.result.representations }, null, 2);
      item.append(details);
      const control = document.createElement("button"); control.textContent = "安全な GET を呼び出す";
      control.addEventListener("click", async () => {
        try { const result = await arDocument.getCapability(capability.localId)?.invoke({}); const resultElement = document.createElement("output"); resultElement.textContent = JSON.stringify(result?.values); item.append(resultElement); }
        catch (error) { errorElement.textContent = error instanceof Error ? `${error.name}: ${error.message}` : "呼び出しに失敗しました"; }
      });
      item.append(control); content.append(item);
    }
  } catch (error) {
    console.error(error); errorElement.textContent = error instanceof ManifestError ? "Manifest を読み込めませんでした。Manifest URLと内容を確認してください。" : "AR-XML を読み込めませんでした。URLと内容を確認してください。";
  }
});
