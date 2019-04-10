import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DragToSelectModule } from 'ngx-drag-to-select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SliderModule } from 'primeng/slider';
import { DirectiveModule } from '@shared/shared/directive/directive.module';
import { ZDriveSharedHeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SliderModule,
    FormsModule,
    RouterModule,
    InfiniteScrollModule,
    DragToSelectModule.forRoot(),
    DirectiveModule
  ],
  providers: [],
  declarations: [ZDriveSharedHeaderComponent],
  exports: [ZDriveSharedHeaderComponent]
})
export class WDriveHeaderModule {
}
