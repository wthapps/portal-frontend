import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WEditorComponent } from '@shared/components/w-editor/w-editor.component';
import { EditorModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EditorModule
  ],
  declarations: [
    WEditorComponent
  ],
  exports: [
    WEditorComponent
  ],
  providers: [

  ],
})
export class WEditorModule {
}
