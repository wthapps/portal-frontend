import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from 'primeng/components/editor/editor';
import { MiniEditor } from '@wth/shared/shared/components/mini-editor/mini-editor.component';
import { SharedModule } from 'primeng/components/common/shared';

@NgModule({
  imports: [CommonModule, EditorModule],
  exports: [MiniEditor, SharedModule],
  declarations: [MiniEditor]
})
export class MiniEditorModule { }
