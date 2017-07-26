import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MediaUploaderComponent } from './uploader/media-uploader.component';
import { MediaViewContainerComponent } from './container/media-view-container.comoponent';
import { MediaToolbarListComponent } from './media/media-toolbar-list.component';
import { MediaListComponent } from './media/media-list.component';
import { MediaItemComponent } from './media/media-item.component';
import { ZMediaAlbumService } from '../album/album.service';
import { MediaUploaderDataService } from './uploader/media-uploader-data.service';

import { ModalDockModule } from '../../core/shared/components/modal/dock.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PartialsPhotoModule } from '../../core/shared/components/photo/photo.module';
import { PipeModule } from '../../core/shared/pipe/pipe.module';
import { ZMediaSharingService } from '../../core/shared/components/photo/modal/sharing/sharing.service';
import { ZMediaTaggingService } from '../../core/shared/components/photo/modal/tagging/tagging.service';
import { ZMediaStore } from './store/media.store';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ModalDockModule,
    InfiniteScrollModule,
    PartialsPhotoModule,
    PipeModule
  ],
  declarations: [
    MediaUploaderComponent,
    MediaViewContainerComponent,
    MediaToolbarListComponent,
    MediaListComponent,
    MediaItemComponent
  ],
  exports: [
    MediaUploaderComponent,
    MediaViewContainerComponent,
    MediaToolbarListComponent,
    MediaListComponent,
    MediaItemComponent
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
