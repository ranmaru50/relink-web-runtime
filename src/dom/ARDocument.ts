// src/dom/ARDocument.ts
import { ARXMLValidationError } from "../errors/errors";

export type AROutputElement = ARTextElement | ARButtonElement;

/** AR-DOM の全要素が持つ最小の基底型です。 */
export abstract class ARElement {
  public constructor(public readonly id: string) {}
}

/** 表示テキストを表す AR-DOM 要素です。 */
export class ARTextElement extends ARElement {
  public constructor(id: string, public text: string) { super(id); }
}

/** 押下可能なボタンを表す AR-DOM 要素です。 */
export class ARButtonElement extends ARElement {
  public constructor(id: string, public readonly label: string) { super(id); }
}

/** HTTP Action を表す AR-DOM 要素です。 */
export class ARActionElement extends ARElement {
  public constructor(
    id: string,
    public readonly type: "http",
    public readonly method: "GET" | "POST",
    public readonly endpoint: string,
  ) { super(id); }
}

/** click イベントから Action への結び付けを表します。 */
export class AREventBinding {
  public constructor(
    public readonly targetId: string,
    public readonly actionId: string,
    public readonly successTargetId?: string,
    public readonly successText?: string,
    public readonly errorTargetId?: string,
    public readonly errorText?: string,
  ) {}
}

/** ブラウザ DOM と独立した AR 文書のソース・オブ・トゥルースです。 */
export class ARDocument {
  private readonly elements = new Map<string, ARElement>();
  public readonly eventBindings: AREventBinding[] = [];

  public addOutput(element: AROutputElement): void { this.addElement(element); }
  public addAction(action: ARActionElement): void { this.addElement(action); }
  public addEventBinding(binding: AREventBinding): void { this.eventBindings.push(binding); }

  /** ID に一致する AR-DOM 要素を返します。 */
  public getElementById(id: string): ARElement | undefined { return this.elements.get(id); }

  /** レンダリング対象の出力要素だけを文書順で返します。 */
  public getOutputs(): AROutputElement[] {
    return [...this.elements.values()].filter((element): element is AROutputElement =>
      element instanceof ARTextElement || element instanceof ARButtonElement,
    );
  }

  private addElement(element: ARElement): void {
    if (this.elements.has(element.id)) throw new ARXMLValidationError(`AR-DOM element id が重複しています: ${element.id}`);
    this.elements.set(element.id, element);
  }
}
