import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TagInputComponent } from './tag-input.component';
import { TagInputFormComponent } from './tag-input-form/tag-input-form.component';
import { DeleteIconComponent } from './icon/icon';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { HighlightPipe } from './pipes/highlight.pipe';
// import { Ng2DropdownModule } from 'ng2-material-dropdown/dist/src/modules/ng2-dropdown.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2DropdownModule
  ],
  declarations: [
    TagInputComponent,
    TagInputFormComponent,
    DeleteIconComponent,
    HighlightPipe
  ],
  exports: [
    Ng2DropdownModule,
    TagInputComponent,
    TagInputFormComponent,
    DeleteIconComponent,
    HighlightPipe
  ]
})
export class HdTagInputModule {
}
