import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BsModalModule } from 'ng2-bs3-modal';

import { WObjectListModule } from '@shared/components/w-object-list/w-object-list.module';

import { WMediaSelectionComponent } from './w-media-selection.component';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { PartialModule } from '@shared/partials';

import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { WNavTabModule } from '@shared/components/w-nav-tab/w-nav-tab.module';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*',
  autoProcessQueue: false
};

@NgModule({
  imports: [
    CommonModule,
    BsModalModule,
    DropzoneModule,
    WObjectListModule,
    PipeModule,
    BoxNoDataModule,
    BoxLoadingModule,
    PartialModule,
    WNavTabModule
  ],
  declarations: [WMediaSelectionComponent],
  exports: [WMediaSelectionComponent],
  providers: [
    DatePipe,
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ]
})
export class WMediaSelectionModule {}
