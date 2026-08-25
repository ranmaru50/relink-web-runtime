// src/renderer/HTMLRenderer.ts
import { ARButtonElement, ARDocument, ARTextElement } from "../dom/ARDocument";

/** AR-DOM を安全なブラウザ DOM へ反映する描画器です。 */
export class HTMLRenderer {
  private readonly rendered = new Map<string, HTMLElement>();
  public constructor(private readonly container: HTMLElement) {}

  public render(arDocument: ARDocument, onButtonClick: (id: string) => void): void {
    this.container.replaceChildren(); this.rendered.clear();
    for (const output of arDocument.getOutputs()) {
      const element = output instanceof ARTextElement ? document.createElement("p") : document.createElement("button");
      element.dataset.arId = output.id;
      element.textContent = output instanceof ARTextElement ? output.text : output.label;
      if (output instanceof ARButtonElement) {
        element.className = "ar-button";
        element.addEventListener("click", () => onButtonClick(output.id));
      }
      this.container.append(element); this.rendered.set(output.id, element);
    }
  }

  /** 更新済みの AR-DOM テキストを対応する表示へ反映します。 */
  public updateText(element: ARTextElement): void { const rendered = this.rendered.get(element.id); if (rendered) rendered.textContent = element.text; }
}
