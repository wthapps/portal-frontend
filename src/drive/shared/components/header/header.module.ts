import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DragToSelectModule } from 'ngx-drag-to-select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SliderModule } from 'primeng/slider';
import { DirectiveModule } from '@shared/shared/directive/directive.module';
import { ZDriveSharedHeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';
import { TextboxSearchModule } from '@shared/partials/search-box/textbox-search.module';
import { CalendarModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    SliderModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    InfiniteScrollModule,
    DragToSelectModule.forRoot(),
    DirectiveModule,
    CalendarModule,
    TextboxSearchModule
  ],
  providers: [],
  declarations: [ZDriveSharedHeaderComponent],
  exports: [ZDriveSharedHeaderComponent]
})
export class WDriveHeaderModule {
}
