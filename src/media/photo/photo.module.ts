import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaPhotoListComponent } from './photo-list.component';
import { ZMediaPhotoRoutingModule } from './photo-routing.module';
import { PhotoDetailComponent } from './photo-detail.component';
import { SharedModule } from '@wth/shared/shared.module';
import { CoreModule } from '@wth/core/core.module';
import { PhotoService } from '@wth/shared/services';
import { ModalModule } from '@wth/shared/modals/modals.module';
// import { PhotoSandbox } from './photo.sandbox';

@NgModule({
  imports: [
    ZMediaPhotoRoutingModule,

    ZMediaSharedModule,
    ModalModule,
    SharedModule,
    CoreModule

  ],
  declarations: [
    ZMediaPhotoListComponent,
    PhotoDetailComponent
  ],
  exports: [
    ZMediaPhotoListComponent,
    PhotoDetailComponent
  ],
  providers: [
    PhotoService,
    // PhotoSandbox
  ]
})

export class ZMediaPhotoModule {
}
