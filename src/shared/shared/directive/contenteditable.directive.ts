import { Directive, forwardRef, ElementRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ContentEditableDirective),
  multi: true
};

@Directive({
  selector: '[contenteditable]',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
  host: {
    '(input)': 'onInput($event)',
    '(keypress)': 'onKeyPress($event)'
  }
})
export class ContentEditableDirective implements ControlValueAccessor {
  public onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  @Input()
  public multiline: false;

  constructor(private elRef: ElementRef) {
  }

  /**
   * Write a new value to the element.
   */
  writeValue(obj: any): void {
    this.refreshView(obj);
  }
  /**
   * Set the function to be called when the control receives a change event.
   */
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  /**
   * Set the function to be called when the control receives a touch event.
   */
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  /**
   * This function is called when the control status changes to or from "DISABLED".
   * Depending on the value, it will enable or disable the appropriate DOM element.
   *
   * @param isDisabled
   */
  setDisabledState?(isDisabled: boolean): void {}

  onKeyPress($event: any): void {
    console.log($event, $event.keyCode, $event.keyIdentifier);
    if (!this.multiline && $event.keyCode === 13) {
      $event.preventDefault();
    }
  }

  onInput($event: any): void {
    this.onChangeCallback($event.target.textContent);
    this.onTouchedCallback();
  }

  private refreshView(model: any) {
    this.elRef.nativeElement.innerText = model;
  }
}
