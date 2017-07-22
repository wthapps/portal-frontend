import { NgModule, ModuleWithProviders } from '@angular/core';

import { SharedModule } from '../../core/shared/shared.module';
import { TagInputModule } from 'ng2-tag-input';
import { MediaUploaderComponent } from './uploader/media-uploader.component';
import { ZMediaAlbumService } from '../album/album.service';
import { MediaToolbarListComponent } from './media/media-toolbar-list.component';
import { MediaListComponent } from './media/media-list.component';
import { MediaViewContainerComponent } from './container/media-view-container.comoponent';
import { MediaItemComponent } from './media/media-item.component';

import { MediaUploaderDataService } from './uploader/media-uploader-data.service';
import { ZMediaSharingService } from '../../core/shared/components/photo/modal/sharing/sharing.service';
import { ZMediaTaggingService } from '../../core/shared/components/photo/modal/tagging/tagging.service';
/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    SharedModule,
    TagInputModule
    // HdTagInputModule
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
    MediaItemComponent,

    SharedModule,
    // HdTagInputModule,
    TagInputModule
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
        MediaUploaderDataService
      ]
    };
  }
}
