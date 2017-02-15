import { NgModule, ModuleWithProviders } from '@angular/core';

import { SharedModule } from '../../core/shared/shared.module';

import { ZMediaShareItemComponent } from './list/item/item.component';
import { ZMediaShareListComponent } from './list/list.component';

import { ZMediaToolbarComponent } from './toolbar/toolbar.component';
import { ZMediaToolbarPhotoComponent } from './toolbar/photo/photo.component';
import { ZMediaToolbarAlbumComponent } from './toolbar/album/album.component';
import { ZMediaToolbarAlbumDetailComponent } from './toolbar/album/album-detail.component';

import { ZMediaSortbarComponent } from './sortbar/sortbar.component';
import { ZMediaFormAddToAlbumComponent } from './form/form-add-to-album.component';
import { ZMediaFormEditAlbumComponent } from './form/form-edit-album.component';
import { ZMediaUploadingComponent } from './uploading/uploading.component';
import { ZMediaSharingComponent } from './sharing/sharing.component';
import { ZMediaAlbumService } from '../album/album.service';
import { ZMediaSharingService } from './sharing/sharing.service';
import { ZMediaTaggingService } from './tagging/tagging.service';
import { ZMediaTaggingComponent } from './tagging/tagging.component';
/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ZMediaShareItemComponent,
    ZMediaShareListComponent,

    ZMediaToolbarComponent,
    ZMediaToolbarPhotoComponent,
    ZMediaToolbarAlbumComponent,
    ZMediaToolbarAlbumDetailComponent,
    //
    ZMediaSortbarComponent,
    ZMediaFormAddToAlbumComponent,
    ZMediaFormEditAlbumComponent,

    ZMediaUploadingComponent,
    ZMediaSharingComponent,
    ZMediaTaggingComponent
  ],
  exports: [
    ZMediaShareItemComponent,
    ZMediaShareListComponent,

    ZMediaToolbarComponent,
    ZMediaToolbarPhotoComponent,
    ZMediaToolbarAlbumComponent,
    ZMediaToolbarAlbumDetailComponent,
    //
    ZMediaSortbarComponent,
    ZMediaFormAddToAlbumComponent,
    ZMediaFormEditAlbumComponent,

    ZMediaUploadingComponent,
    ZMediaSharingComponent,
    ZMediaTaggingComponent,


    SharedModule
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
