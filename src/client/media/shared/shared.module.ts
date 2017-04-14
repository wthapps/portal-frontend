import { NgModule, ModuleWithProviders } from '@angular/core';

import { SharedModule } from '../../core/shared/shared.module';
import { TagInputModule } from 'ng2-tag-input';

import { ZMediaShareItemComponent } from './list/item/item.component';
import { ZMediaShareListComponent } from './list/list.component';

import { ZMediaToolbarComponent } from './toolbar/toolbar.component';
import { ZMediaToolbarPhotoComponent } from './toolbar/photo/photo.component';
import { ZMediaToolbarAlbumComponent } from './toolbar/album/album.component';
import { ZMediaToolbarAlbumDetailComponent } from './toolbar/album/album-detail.component';

import { MediaListHeaderComponent } from './media/media-list-header.component';
import { ZMediaFormAddToAlbumComponent } from './form/form-add-to-album.component';
import { ZMediaFormEditAlbumComponent } from './form/form-edit-album.component';
import { MediaUploaderComponent } from './uploader/media-uploader.component';
import { ZMediaSharingComponent } from './sharing/sharing.component';
import { ZMediaAlbumService } from '../album/album.service';
import { ZMediaSharingService } from './sharing/sharing.service';
import { ZMediaTaggingService } from './tagging/tagging.service';
import { ZMediaTaggingComponent } from './tagging/tagging.component';
import { ZMediaFormEditNameComponent } from './form/form-edit-name.component';
import { MediaToolbarListComponent } from './media/media-toolbar-list.component';
import { MediaListComponent } from './media/media-list.component';
import { MediaViewContainerComponent } from './container/media-view-container.comoponent';
import { MediaItemComponent } from './media/media-item.component';
import { ZMediaAlbumCreateComponent } from './form/album-create.component';
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
    ZMediaShareItemComponent,
    ZMediaShareListComponent,

    ZMediaToolbarComponent,
    ZMediaToolbarPhotoComponent,
    ZMediaToolbarAlbumComponent,
    ZMediaToolbarAlbumDetailComponent,
    //
    MediaListHeaderComponent,
    ZMediaAlbumCreateComponent,
    ZMediaFormAddToAlbumComponent,
    ZMediaFormEditAlbumComponent,
    ZMediaFormEditNameComponent,

    MediaUploaderComponent,
    ZMediaSharingComponent,
    ZMediaTaggingComponent,

    MediaViewContainerComponent,
    MediaToolbarListComponent,
    MediaListComponent,
    MediaItemComponent,
  ],
  exports: [
    ZMediaShareItemComponent,
    ZMediaShareListComponent,

    ZMediaToolbarComponent,
    ZMediaToolbarPhotoComponent,
    ZMediaToolbarAlbumComponent,
    ZMediaToolbarAlbumDetailComponent,
    //
    MediaListHeaderComponent,
    ZMediaAlbumCreateComponent,
    ZMediaFormAddToAlbumComponent,
    ZMediaFormEditAlbumComponent,
    ZMediaFormEditNameComponent,

    MediaUploaderComponent,
    ZMediaSharingComponent,
    ZMediaTaggingComponent,

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
        ZMediaTaggingService
      ]
    };
  }
}
