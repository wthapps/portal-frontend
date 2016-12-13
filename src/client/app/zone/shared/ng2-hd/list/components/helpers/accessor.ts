import {
  ControlValueAccessor
} from '@angular/forms';

export class SearchInputAccessor implements ControlValueAccessor {
    private _items: Array<any> = new Array<any>();

    private _onTouchedCallback: (items: Array<any>) => void;

    private _onChangeCallback: (items: Array<any>) => void;

    public get items(): Array<any> {
        return this._items;
    };

    public set items(items: Array<any>) {
        this._items = items;
        // this._onChangeCallback(items);
    }

    onTouched(items) {
        this._onTouchedCallback(items);
    }

    writeValue(items: Array<any>) {
        this._items = items || [];
    }

    registerOnChange(fn: any) {
      console.log('call back', fn);
        this._onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }
}
