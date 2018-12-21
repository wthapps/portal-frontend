import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingNodataComponent } from '@shared/samples/loading-nodata/loading-nodata.component';
import { LoadingNodataService } from '@shared/samples/loading-nodata/loading-nodata.service';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    BoxLoadingModule,
    BoxNoDataModule,
    InfiniteScrollModule
  ],
  declarations: [LoadingNodataComponent],
  exports: [
    LoadingNodataComponent
  ],
  providers: [
    LoadingNodataService
  ]
})
export class SamplesModule {
}
