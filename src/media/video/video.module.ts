import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { SharedModule } from '@wth/shared/shared.module';
import { CoreModule } from '@wth/core/core.module';
import { PhotoService } from '@wth/shared/services';
import { ModalModule } from '@wth/shared/modals/modals.module';
import { WGridListModule } from '@wth/shared/components/grid-list';
import { WToolbarModule } from '@wth/shared/components/toolbar';
import { ZMediaVideoRoutingModule } from '@media/video/video-routing.module';
import { ZMediaVideoListComponent } from '@media/video/video-list.component';
import { BsModalModule } from 'ng2-bs3-modal';
import { ZVideoDetailComponent } from '@media/video/video-detail.component';
// import { PhotoSandbox } from './photo.sandbox';

@NgModule({
  imports: [
    ZMediaVideoRoutingModule,
    ZMediaSharedModule,
    BsModalModule,
    ModalModule,
    SharedModule,
    CoreModule,
    WGridListModule,
    WToolbarModule
  ],
  declarations: [ZMediaVideoListComponent, ZVideoDetailComponent],
  exports: [ZMediaVideoListComponent],
  providers: [
    PhotoService
    // PhotoSandbox
  ]
})
export class ZMediaVideoModule {}
