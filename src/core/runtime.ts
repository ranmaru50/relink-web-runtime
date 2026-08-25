// src/core/runtime.ts
import { executeHTTPAction } from "../actions/HTTPActionExecutor";
import { ARActionElement, ARDocument, ARTextElement } from "../dom/ARDocument";
import { ARXMLValidationError } from "../errors/errors";
import { HTMLRenderer } from "../renderer/HTMLRenderer";

/** イベントを Action に接続し、成功・失敗の AR-DOM 更新を管理します。 */
export class ARRuntime {
  public constructor(private readonly document: ARDocument, private readonly renderer: HTMLRenderer, private readonly baseUrl: string, private readonly fetcher: typeof fetch = fetch) {}
  public mount(): void { this.renderer.render(this.document, (targetId) => { void this.handleClick(targetId); }); }

  private async handleClick(targetId: string): Promise<void> {
    const binding = this.document.eventBindings.find((candidate) => candidate.targetId === targetId);
    if (!binding) return;
    const action = this.document.getElementById(binding.actionId);
    if (!(action instanceof ARActionElement)) { this.applyText(binding.errorTargetId, binding.errorText); return; }
    try { await executeHTTPAction(action, this.baseUrl, this.fetcher); this.applyText(binding.successTargetId, binding.successText); }
    catch (error) {
      // 開発者が Action 失敗の原因を追跡できるよう詳細を残します。
      console.error(error);
      this.applyText(binding.errorTargetId, binding.errorText);
    }
  }

  private applyText(targetId: string | undefined, text: string | undefined): void {
    if (!targetId || text === undefined) return;
    const target = this.document.getElementById(targetId);
    if (!(target instanceof ARTextElement)) throw new ARXMLValidationError("更新対象は text 要素である必要があります");
    target.text = text; this.renderer.updateText(target);
  }
}
