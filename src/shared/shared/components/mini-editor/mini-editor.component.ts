import {
  NgModule, Component, ElementRef, AfterViewInit, Input, Output, EventEmitter, ContentChild, OnChanges,
  forwardRef, ViewEncapsulation
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import { DomHandler } from 'primeng/components/dom/domhandler';
import { Header, SharedModule } from 'primeng/components/common/shared';
import { EditorModule } from 'primeng/components/editor/editor';

declare var Quill: any;

const KEYCODE = {
  'enter': 13,
  'escape': 27
}

export const EDITOR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MiniEditor),
  multi: true
};

@Component({
  selector: 'mini-editor',
  template: `
        <div [ngClass]="'mini-editor ui-widget ui-editor-container ui-corner-all'" [class]="styleClass">
          <div class="ui-editor-content" [ngStyle]="style"></div>
        </div>
    `,
  styleUrls: ['mini-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DomHandler,EDITOR_VALUE_ACCESSOR]
})
export class MiniEditor implements AfterViewInit,ControlValueAccessor {

  @Output() onTextChange: EventEmitter<any> = new EventEmitter();

  @Output() onKeyUp: EventEmitter<any> = new EventEmitter();

  @Input() style: any;

  @Input() styleClass: string;

  @Input() placeholder: string;

  @Input() formats: string[];

  @Output() onInit: EventEmitter<any> = new EventEmitter();

  value: string;

  _readonly: boolean;

  onModelChange: Function = () => {};

  onModelTouched: Function = () => {};

  quill: any;
  editorElement: any;

  constructor(public el: ElementRef, public domHandler: DomHandler) {}

  ngAfterViewInit() {
    this.editorElement = this.domHandler.findSingle(this.el.nativeElement ,'div.ui-editor-content');


    this.quill = new Quill(this.editorElement, {
      modules: {
        toolbar: false
      },
      placeholder: this.placeholder,
      readOnly: this.readonly,
      theme: 'snow',
      formats: this.formats
    });

    let keyboard = this.quill.getModule('keyboard');
    delete keyboard.bindings['13'];
    this.quill.keyboard.addBinding({ key: 'enter'}, function(range, context) {
      this.onKeyUp.emit({keyCode: KEYCODE.enter});
      return false;
    }.bind(this));

    this.quill.keyboard.addBinding({ key: 'enter', shiftKey: true }, function(range, context) {
      this.quill.insertText(range.index, '\n', {}, Quill.sources.USER);
      // Earlier scroll.deleteAt might have messed up our selection,
      // so insertText's built in selection preservation is not reliable
      this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
      this.quill.focus();
      this.updateHtml2Model();
    }.bind(this));

    this.quill.keyboard.addBinding({ key: 'escape'}, function(range, context) {
      this.onKeyUp.emit({keyCode: KEYCODE.escape});
    }.bind(this));


    if(this.value) {
      this.quill.pasteHTML(this.value);
    }

    this.quill.on('text-change', (delta, oldContents, source) => {
      if (source === 'user') {
        this.updateHtml2Model();
      }
    });


    this.onInit.emit({
      editor: this.quill
    });
  }

  focus() {
    this.quill.focus();
  }

  updateHtml2Model() {

    let html = this.editorElement.children[0].innerHTML;
    let text = this.quill.getText();
    if (html == '<p><br></p>') {
      html = null;
    }

    this.onTextChange.emit({
      htmlValue: html,
      textValue: text
    });

    this.onModelChange(html);
    this.onModelTouched();
    return false;
  }

  addEmoj(icon: any) {
    console.debug('add emoj ....', icon);
    const range = this.quill.getSelection(true);
    // console.debug('inside addEmoj ...', this.customEditor.editor, this.customEditor.selection, range);
    this.quill.insertText(range.index, icon, Quill.sources.USER);
    this.quill.setSelection(range.index + icon.length, Quill.sources.SILENT);
  }

  writeValue(value: any) : void {
    this.value = value;

    if(this.quill) {
      if(value)
        this.quill.pasteHTML(value);
      else
        this.quill.setText('');
    }
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  getQuill() {
    return this.quill;
  }

  @Input() get readonly(): boolean {
    return this._readonly;
  }

  set readonly(val:boolean) {
    this._readonly = val;

    if(this.quill) {
      if(this._readonly)
        this.quill.disable();
      else
        this.quill.enable();
    }
  }
}
