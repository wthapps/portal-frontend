import { NgModule } from '@angular/core';
import { DeleteIconComponent } from './components/icon/index';
import { MultiSelectListForm } from './components/multi-select-list-form/index';
import { MultiSelectListComponent } from './components/index';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HighlightPipe } from './components/pipes/highlight.pipe';
import { Ng2DropdownModule } from 'ng2-material-dropdown';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        Ng2DropdownModule
    ],
    declarations: [
        MultiSelectListComponent,
        DeleteIconComponent,
        MultiSelectListForm,
        HighlightPipe
    ],
    exports: [
        MultiSelectListComponent,
        DeleteIconComponent,
        MultiSelectListForm,
        HighlightPipe
    ]
})
export class HdMultiSelectListModule {}


