import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SliderModule } from 'primeng/slider';
import { DragToSelectModule } from 'ngx-drag-to-select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { DirectiveModule } from '@shared/shared/directive/directive.module';
import { ZDriveharedBreadcrumbComponent } from './breadcrumb.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SliderModule,
    FormsModule,
    InfiniteScrollModule,
    DragToSelectModule.forRoot(),
    DirectiveModule
  ],
  providers: [],
  declarations: [ZDriveharedBreadcrumbComponent],
  exports: [CommonModule, RouterModule, ZDriveharedBreadcrumbComponent]
})
export class WDriveBreadcrumbModule {}
