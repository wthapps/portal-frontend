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

import { MediaUploaderComponent } from './uploader/media-uploader.component';
import { ZMediaSharingComponent } from './sharing/sharing.component';
import { ZMediaAlbumService } from '../album/album.service';
import { ZMediaSharingService } from './sharing/sharing.service';
import { ZMediaTaggingService } from './tagging/tagging.service';
import { ZMediaTaggingComponent } from './tagging/tagging.component';
import { BaseObjectEditNameModalComponent } from './modal/base-object-edit-name-modal.component';
import { MediaToolbarListComponent } from './media/media-toolbar-list.component';
import { MediaListComponent } from './media/media-list.component';
import { MediaViewContainerComponent } from './container/media-view-container.comoponent';
import { MediaItemComponent } from './media/media-item.component';

import { AlbumCreateModalComponent } from './modal/album-create-modal.component';
import { AddToAlbumModalComponent } from './modal/add-to-album-modal.component';
import { AlbumEditModalComponent } from './modal/album-edit-modal.component';
import { PhotoDetailModalComponent } from './modal/photo-detail-modal.component';
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

    BaseObjectEditNameModalComponent,
    AddToAlbumModalComponent,
    AlbumEditModalComponent,
    AlbumCreateModalComponent,
    PhotoDetailModalComponent,


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

    BaseObjectEditNameModalComponent,
    AddToAlbumModalComponent,
    AlbumEditModalComponent,
    AlbumCreateModalComponent,
    PhotoDetailModalComponent,

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
