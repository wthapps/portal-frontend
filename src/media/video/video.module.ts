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
import { ZMediaPlaylistListComponent } from '@media/video/playlist-list.component';
import { WUploadModule } from '@shared/components/upload/upload.module';
import { WObjectListModule } from '@shared/components/w-object-list/w-object-list.module';
import { WMediaSelectionModule } from '@shared/components/w-media-selection/w-media-selection.module';
// import { PhotoSandbox } from './photo.sandbox';

@NgModule({
  imports: [
    ZMediaVideoRoutingModule,
    ZMediaSharedModule,
    BsModalModule,
    ModalModule,
    SharedModule,
    WUploadModule,
    CoreModule,
    WGridListModule,
    WObjectListModule,
    WToolbarModule
  ],
  declarations: [
    ZMediaVideoListComponent,
    ZVideoDetailComponent,
    ZMediaPlaylistListComponent
  ],
  exports: [ZMediaVideoListComponent],
  providers: [
    PhotoService
    // PhotoSandbox
  ]
})
export class ZMediaVideoModule {}
