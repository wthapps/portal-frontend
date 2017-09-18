import {
  ControlValueAccessor
} from '@angular/forms';

export class TagInputAccessor implements ControlValueAccessor {
  private _items: string[] = [];

  private _onTouchedCallback: (items: string[]) => void;

  private _onChangeCallback: (items: string[]) => void;

  get items(): string[] {
    return this._items;
  }

  set items(items: string[]) {
    this._items = items;
    this._onChangeCallback(items);
  }

  onTouched(items: any) {
    this._onTouchedCallback(items);
  }

  writeValue(items: string[]) {
    this._items = items || [];
  }

  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }
}
