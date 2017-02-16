import { NgModule } from '@angular/core';
import { DeleteIconComponent } from './components/icon/index';
import { SearchFormComponent } from './components/search-form/index';
import { ListComponent } from './components/index';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HighlightPipe } from './components/pipes/highlight.pipe';
// import { Ng2DropdownModule } from 'ng2-material-dropdown/dist/src/modules/ng2-dropdown.module';
import { Ng2DropdownModule } from 'ng2-material-dropdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2DropdownModule
  ],
  declarations: [
    ListComponent,
    DeleteIconComponent,
    SearchFormComponent,
    HighlightPipe
  ],
  exports: [
    ListComponent,
    DeleteIconComponent,
    SearchFormComponent,
    HighlightPipe
  ]
})
export class HdMultiSelectListModule {
}


