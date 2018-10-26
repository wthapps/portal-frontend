import { NgModule, ModuleWithProviders } from '@angular/core';
import { ZMediaSharedLeftMenuComponent } from '@media/shared/left-menu/left-menu.component';
import { MediaUploaderComponent } from './uploader/media-uploader.component';
import { MediaViewContainerComponent } from './container/media-view-container.component';
import { MediaToolbarListComponent } from './media/media-toolbar-list.component';
import { MediaListComponent } from './media/media-list.component';
import { MediaItemComponent } from './media/media-item.component';
import { AlbumService } from './service/album.service';
import { MediaUploaderDataService } from './uploader/media-uploader-data.service';

import { AlbumModalModule } from '@shared/components/modal/album/album-modal.module';
import { ZMediaStore } from './store/media.store';
import { ZMediaSharedHeaderComponent } from './header/header.component';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '@wth/shared/shared.module';
import { AlbumDetailInfoComponent } from '../album/album-detail-info.component';
// import { ZMediaAlbumDetailComponent } from '../album/album-detail.component';
import { MediaObjectService } from './container/media-object.service';
import { SharingItemComponent } from './media/sharing-item.component';
import { ZMediaTaggingService } from '@wth/shared/shared/components/photo/modal/tagging/tagging.service';
import { SharingService } from '@wth/shared/shared/components/photo/modal/sharing/sharing.service';
import { MediaDetailInfoComponent } from '@media/shared/media/media-detail-info.component';
import { LocationCustomService } from '@media/shared/service/location-custom.service';
import { MediaModalModule } from '@media/shared/modal/modal.module';
import { MediaModalListComponent } from './media-modal-list/media-modal-list.component';

TagInputModule.withDefaults({
  tagInput: {
    placeholder: ''
  }
});

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    TagInputModule,
    // WGridListModule,
    AlbumModalModule,
    MediaModalModule,
    SharedModule
  ],
  declarations: [
    MediaUploaderComponent,
    MediaViewContainerComponent,
    MediaToolbarListComponent,
    MediaListComponent,
    MediaItemComponent,
    ZMediaSharedHeaderComponent,
    AlbumDetailInfoComponent,
    MediaDetailInfoComponent,
    MediaModalListComponent,
    // ZMediaAlbumDetailComponent,

    // new components
    SharingItemComponent,
    ZMediaSharedLeftMenuComponent
  ],
  exports: [
    AlbumModalModule,
    MediaModalModule,
    MediaUploaderComponent,
    MediaViewContainerComponent,
    MediaToolbarListComponent,
    MediaListComponent,
    MediaItemComponent,
    MediaModalListComponent,
    ZMediaSharedHeaderComponent,
    AlbumDetailInfoComponent,
    MediaDetailInfoComponent,
    // ZMediaAlbumDetailComponent,
    //
    SharingItemComponent,
    ZMediaSharedLeftMenuComponent
  ]
})
export class ZMediaSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZMediaSharedModule,
      providers: [
        AlbumService,
        ZMediaTaggingService,
        SharingService,
        ZMediaStore,
        LocationCustomService,
        MediaUploaderDataService,
        MediaObjectService
      ]
    };
  }
}
