import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DragToSelectModule } from 'ngx-drag-to-select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SliderModule } from 'primeng/slider';
import { DirectiveModule } from '@shared/shared/directive/directive.module';
import { ZDriveharedBreadcrumbComponent } from './breadcrumb.component';

@NgModule({
  imports: [
    CommonModule,
    SliderModule,
    FormsModule,
    InfiniteScrollModule,
    DragToSelectModule.forRoot(),
    DirectiveModule
  ],
  providers: [],
  declarations: [ZDriveharedBreadcrumbComponent],
  exports: [ZDriveharedBreadcrumbComponent]
})
export class WDriveBreadcrumbModule {
}
