// demo/demo.ts
import { ARRuntime } from "../src/core/runtime";
import { loadARXML } from "../src/core/loader";
import { parseARXML } from "../src/core/parser";
import { HTMLRenderer } from "../src/renderer/HTMLRenderer";

const form = document.querySelector<HTMLFormElement>("#loader");
const urlInput = document.querySelector<HTMLInputElement>("#url");
const errorElement = document.querySelector<HTMLElement>("#error");
const content = document.querySelector<HTMLElement>("#content");
if (!form || !urlInput || !errorElement || !content) throw new Error("デモ画面の初期化に失敗しました");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); errorElement.textContent = ""; content.replaceChildren();
  try {
    const url = new URL(urlInput.value, window.location.href).href;
    const arDocument = parseARXML(await loadARXML(url));
    // 相対 endpoint は Runtime ではなく取得した AR-XML 自身の URL を基準に解決します。
    new ARRuntime(arDocument, new HTMLRenderer(content), url).mount();
  } catch (error) {
    console.error(error); errorElement.textContent = "AR-XML を読み込めませんでした。URLと内容を確認してください。";
  }
});
