import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from 'primeng/components/editor/editor';
import { MiniEditorComponent } from '@wth/shared/shared/components/mini-editor/mini-editor.component';
import { SharedModule } from 'primeng/components/common/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, EditorModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    SharedModule,

    MiniEditorComponent,
  ],
  declarations: [MiniEditorComponent]
})
export class MiniEditorModule {}
