import {
  NgModule, Component, ElementRef, AfterViewInit, forwardRef, Output, ContentChild, Input,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DomHandler, Editor, Header, SharedModule } from 'primeng/primeng';

declare var Quill: any;

export const EDITOR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EditorComponent),
  multi: true
};

@Component({
  moduleId: module.id,
  selector: 'h-editor',
  templateUrl: 'editor.component.html',
  styleUrls: ['editor.component.css'],
  providers: [DomHandler, EDITOR_VALUE_ACCESSOR]
})
export class EditorComponent extends Editor implements AfterViewInit, ControlValueAccessor {


  constructor(public el: ElementRef, public domHandler: DomHandler) {
    super(el, domHandler);
  }

  ngAfterViewInit() {
  //   let editorElement = this.domHandler.findSingle(this.el.nativeElement ,'div.ui-editor-content');
  //   let toolbarElement = this.domHandler.findSingle(this.el.nativeElement ,'div.ui-editor-toolbar');
  //
  //   this.quill = new Quill(editorElement, {
  //     modules: {
  //       toolbar: toolbarElement
  //     },
  //     placeholder: this.placeholder,
  //     readOnly: this.readonly,
  //     theme: 'snow',
  //     formats: this.formats
  //   });
  //
  //   if(this.value) {
  //     this.quill.pasteHTML(this.value);
  //   }
  //
  //   this.quill.on('text-change', (delta: any, oldContents: any, source: any) => {
  //     let html = editorElement.children[0].innerHTML;
  //     let text = this.quill.getText();
  //     if(html == '<p><br></p>') {
  //       html = null;
  //     }
  //
  //     this.onTextChange.emit({
  //       htmlValue: html,
  //       textValue: text,
  //       delta: delta,
  //       source: source
  //     });
  //
  //     this.onModelChange(html);
  //
  //     if(source === 'user') {
  //       this.onModelTouched();
  //     }
  //   });
  //
  //   this.quill.on('selection-change', (range: any, oldRange: any, source: any) => {
  //     console.log('changing:::', range, oldRange, source);
  //
  //     this.onSelectionChange.emit({
  //       range: range,
  //       oldRange: oldRange,
  //       source: source
  //     });
  //   });
  //
  //
  //   this.onInit.emit({
  //     editor: this.quill
  //   });
  // }
  //
  // writeValue(value: any) : void {
  //   this.value = value;
  //
  //   if(this.quill) {
  //     if(value)
  //       this.quill.pasteHTML(value);
  //     else
  //       this.quill.setText('');
  //   }
  // }
  //
  // registerOnChange(fn: Function): void {
  //   this.onModelChange = fn;
  // }
  //
  // registerOnTouched(fn: Function): void {
  //   this.onModelTouched = fn;
  // }
  //
  // getQuill() {
  //   return this.quill;
  // }
  //
  // @Input() get readonly(): boolean {
  //   return this._readonly;
  // }
  //
  // set readonly(val:boolean) {
  //   this._readonly = val;
  //
  //   if(this.quill) {
  //     if(this._readonly)
  //       this.quill.disable();
  //     else
  //       this.quill.enable();
  //   }
  }

  insertPicture() {
    console.log('inserting:::picture');
  }

  attachFiles(files: any) {

  }
}

@NgModule({
  imports: [CommonModule],
  exports: [EditorComponent,SharedModule],
  declarations: [EditorComponent]
})
export class EditorModule { }
