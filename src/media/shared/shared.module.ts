import { NgModule, ModuleWithProviders } from '@angular/core';
import { MediaUploaderComponent } from './uploader/media-uploader.component';
import { MediaViewContainerComponent } from './container/media-view-container.component';
import { MediaToolbarListComponent } from './media/media-toolbar-list.component';
import { MediaListComponent } from './media/media-list.component';
import { MediaItemComponent } from './media/media-item.component';
import { ZMediaAlbumService } from '../album/album.service';
import { MediaUploaderDataService } from './uploader/media-uploader-data.service';

import { ZMediaStore } from './store/media.store';
import { ZMediaSharedHeaderComponent } from './header/header.component';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '@wth/shared/shared.module';
import { ZMediaSharingService } from '@wth/shared/shared/components/photo/modal/sharing/sharing.service';
import { ZMediaTaggingService } from '@wth/shared/shared/components/photo/modal/tagging/tagging.service';
import { AlbumDetailInfoComponent } from '../album/album-detail-info.component';
import { ZMediaAlbumDetailComponent } from '../album/album-detail.component';

TagInputModule.withDefaults({
  tagInput: {
    placeholder: '',
  }
});

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    TagInputModule,
    SharedModule.forRoot()
  ],
  declarations: [
    MediaUploaderComponent,
    MediaViewContainerComponent,
    MediaToolbarListComponent,
    MediaListComponent,
    MediaItemComponent,
    ZMediaSharedHeaderComponent,
    AlbumDetailInfoComponent,
    ZMediaAlbumDetailComponent,
  ],
  exports: [
    MediaUploaderComponent,
    MediaViewContainerComponent,
    MediaToolbarListComponent,
    MediaListComponent,
    MediaItemComponent,
    ZMediaSharedHeaderComponent,
    AlbumDetailInfoComponent,
    ZMediaAlbumDetailComponent
  ]
})
export class ZMediaSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZMediaSharedModule,
      providers: [
        ZMediaAlbumService,
        ZMediaSharingService,
        ZMediaTaggingService,
        ZMediaStore,
        MediaUploaderDataService
      ]
    };
  }
}
