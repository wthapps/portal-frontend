import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from 'primeng/components/editor/editor';
import { MiniEditorComponent } from '@wth/shared/shared/components/mini-editor/mini-editor.component';
import { SharedModule } from 'primeng/components/common/shared';

@NgModule({
  imports: [CommonModule, EditorModule],
  exports: [MiniEditorComponent, SharedModule],
  declarations: [MiniEditorComponent]
})
export class MiniEditorModule { }
