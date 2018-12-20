import {
  NgModule, Component, ElementRef, AfterViewInit, Input, Output, EventEmitter, ContentChild, OnChanges,
  forwardRef, ViewEncapsulation, SimpleChanges
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DomHandler } from 'primeng/components/dom/domhandler';
import * as Delta from 'quill-delta/lib/delta';

declare var Quill: any;

const KEYCODE = {
  'enter': 13,
  'escape': 27
};

export const EDITOR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MiniEditorComponent),
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
  providers: [DomHandler, EDITOR_VALUE_ACCESSOR]
})
export class MiniEditorComponent implements AfterViewInit, OnChanges, ControlValueAccessor {

  @Output() onTextChange: EventEmitter<any> = new EventEmitter();
  @Output() onError: EventEmitter<any> = new EventEmitter();

  @Output() onKeyUp: EventEmitter<any> = new EventEmitter();

  @Input() style: any;

  @Input() validators: any;

  @Input() styleClass: string;

  @Input() placeholder: string;

  @Input() formats: string[];

  @Input() isDisabled = false;

  @Output() onInit: EventEmitter<any> = new EventEmitter();
  @Output() onImagePaste: EventEmitter<any> = new EventEmitter();

  value: string;
  _readonly: boolean;
  quill: any;
  editorElement: any;

  onModelChange: Function = () => {};

  onModelTouched: Function = () => {};


  constructor(public el: ElementRef, public domHandler: DomHandler) {}

  ngAfterViewInit() {
    this.editorElement = this.domHandler.findSingle(this.el.nativeElement, 'div.ui-editor-content');

    this.extendClipboard(this);

    this.quill = new Quill(this.editorElement, {
      modules: {
        toolbar: false
      },
      placeholder: this.placeholder,
      readOnly: this.readonly,
      theme: 'snow',
      formats: this.formats
    });
    this.enableOrDisableQuill(this.isDisabled);

    const keyboard = this.quill.getModule('keyboard');
    delete keyboard.bindings['13'];
    this.quill.keyboard.addBinding({ key: 'enter' }, function (range, context) {
      this.updateHtml2Model();
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


    if (this.value) {
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

  ngOnChanges(changes: SimpleChanges) {
    if (!this.quill) {
    return;
    }
    if (changes['isDisabled'] !== undefined) {
      this.enableOrDisableQuill(changes['isDisabled'].currentValue);
    }
  }

  enableOrDisableQuill(disabled) {
    if (disabled) {
      this.quill.disable();
    } else {
      this.quill.enable();
    }
  }

  focus() {
    this.quill.focus();
  }

  updateHtml2Model() {
    let html = this.editorElement.children[0].innerHTML;
    const text = this.quill.getText();

    if (html === '<p><br></p>') {
      html = null;
    }
    let status: any = {error: false};
    if (this.validators) {
      this.validators.forEach(v => {
        status = v.validate({text: text, html: html});
      });
    }
    this.onTextChange.emit({
      htmlValue: html,
      textValue: text,
      status: status
    });

    this.onModelChange(html);
    this.onModelTouched();
    return false;
  }

  extendClipboard(self) {
    const Clipboard = Quill.import('modules/clipboard');

    class PlainClipboard extends Clipboard {
      onPaste(e: any) {
        try {
          // super.onPaste(e);
          // fix flash screen while paste into editor
          console.log('on paste: ', e);
          this.container.style.position = 'fixed';
          this.container.style.zIndex = '-1';

          const dataClipboard1 = e.clipboardData.types;
          let fileClipboard: any;
          if (dataClipboard1[0].match('Files')) {
            if (e.clipboardData.items[0].type.match('image/*')) {
              fileClipboard = e.clipboardData.items[0].getAsFile();
            }
          }

          if (e.defaultPrevented || !this.quill.isEnabled()) { return; }
          const range = this.quill.getSelection();
          let delta = new Delta().retain(range.index);
          const scrollTop = this.quill.scrollingContainer.scrollTop;
          this.container.focus();
          this.quill.selection.update(Quill.sources.SILENT);
          setTimeout(() => {
            if (dataClipboard1[0].match('text/*')) {
              delta = delta.concat(this.convert()).delete(range.length);
              this.quill.updateContents(delta, Quill.sources.USER);
              this.quill.setSelection(
                delta.length() - range.length,
                Quill.sources.SILENT
              );
              this.quill.scrollingContainer.scrollTop = scrollTop;
              this.quill.focus();
            } else {
              if (fileClipboard && fileClipboard.type.match('image/*')) {
                console.log('image are pasted', fileClipboard);
                self.onImagePaste.emit(fileClipboard);
              }
            }
          }, 1);
        } catch (err) {
          console.error('A wild bug appear. Watch out!! ', err);
        }
      }
    }

    Quill.register('modules/clipboard', PlainClipboard, true);
  }

  addEmoj(icon: any) {
    const range = this.quill.getSelection(true);
    // console.debug('inside addEmoj ...', this.customEditor.editor, this.customEditor.selection, range);
    this.quill.insertText(range.index, icon, Quill.sources.USER);
    this.quill.setSelection(range.index + icon.length, Quill.sources.SILENT);
  }

  writeValue(value: any): void {
    this.value = value;

    if (this.quill) {
      if (value) {
        this.quill.pasteHTML(value);
      } else {
        this.quill.setText('');
      }
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

  set readonly(val: boolean) {
    this._readonly = val;

    if (this.quill) {
      if (this._readonly) {
        this.quill.disable();
      } else {
        this.quill.enable();
      }
    }
  }
}
