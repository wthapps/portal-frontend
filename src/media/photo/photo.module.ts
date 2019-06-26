import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaPhotoListComponent } from './photo-list.component';
import { ZMediaPhotoRoutingModule } from './photo-routing.module';
import { CoreModule } from '@wth/core/core.module';
import { PhotoService } from '@wth/shared/services';
import { ModalModule } from '@wth/shared/modals/modals.module';
import { WGridListModule } from '@wth/shared/components/grid-list';
import { WToolbarModule } from '@wth/shared/components/toolbar';
import { WObjectListModule } from '@shared/components/w-object-list/w-object-list.module';
import { WUploadModule } from '@shared/components/upload/upload.module';
import { WMediaPreviewModule } from '@shared/components/w-media-preview/media-preview.module';

@NgModule({
  imports: [
    ZMediaPhotoRoutingModule,

    ZMediaSharedModule,
    ModalModule,
    CoreModule,
    WGridListModule,
    WMediaPreviewModule,
    WUploadModule,
    WToolbarModule
  ],
  declarations: [ZMediaPhotoListComponent],
  exports: [ZMediaPhotoListComponent],
  providers: [
    PhotoService
    // PhotoSandbox
  ]
})
export class ZMediaPhotoModule {}
