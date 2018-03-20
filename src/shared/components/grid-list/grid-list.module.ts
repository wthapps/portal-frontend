import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SliderModule } from 'primeng/primeng';
import { WGridListHeaderComponent } from './grid-list-header.component';
import { WGridListComponent } from './grid-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PipeModule } from '@wth/shared/shared/pipe/pipe.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    InfiniteScrollModule,
    PipeModule,
    SliderModule
  ],
  declarations: [
    WGridListHeaderComponent,
    WGridListComponent
  ],
  exports: [
    WGridListHeaderComponent,
    WGridListComponent
  ],
  providers: [],
})
export class WGridListModule {
}
