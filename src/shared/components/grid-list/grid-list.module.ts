import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SliderModule } from 'primeng/primeng';
import { WGridListHeaderComponent } from './grid-list-header.component';
import { WGridListComponent } from './grid-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PipeModule } from '@wth/shared/shared/pipe/pipe.module';
import { WToolbarModule } from '@wth/shared/components/toolbar';
import { WGridListItemComponent } from '@wth/shared/components/grid-list/grid-list-item.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    InfiniteScrollModule,
    SliderModule,

    // Wthapps modules
    PipeModule,
    WToolbarModule
  ],
  declarations: [
    WGridListHeaderComponent,
    WGridListItemComponent,
    WGridListComponent
  ],
  exports: [
    WGridListHeaderComponent,
    WGridListItemComponent,
    WGridListComponent
  ],
  providers: [],
})
export class WGridListModule {
}
