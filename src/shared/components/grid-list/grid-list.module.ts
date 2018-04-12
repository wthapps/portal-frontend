import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { WGridListHeaderComponent } from './grid-list-header.component';
import { WGridListComponent } from './grid-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PipeModule } from '@wth/shared/shared/pipe/pipe.module';
import { WToolbarModule } from '@wth/shared/components/toolbar';
import { WGridListItemComponent } from '@wth/shared/components/grid-list/grid-list-item.component';
import { SliderModule } from 'primeng/components/slider/slider';
import { BoxLoadingModule } from '@wth/shared/shared/components/box-loading/box-loading.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    InfiniteScrollModule,
    SliderModule,

    // Wthapps modules
    PipeModule,
    WToolbarModule,
    BoxLoadingModule
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
  providers: []
})
export class WGridListModule {}
