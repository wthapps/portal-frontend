import { NgModule, ModuleWithProviders } from '@angular/core';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

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
import { ZSharedModule } from '../../shared/shared.module';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { ZMediaAlbumService } from '../album/album.service';
import { ZMediaSharingService } from './sharing/sharing.service';
import { ZSharedAutoCompleteModule } from '../../shared/auto-complete/auto-complete.module';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    InfiniteScrollModule,
    AutoCompleteModule,
    ZSharedAutoCompleteModule,
    ZSharedModule.forRoot()
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
    ZMediaSharingComponent
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

    //Module
    InfiniteScrollModule,
    AutoCompleteModule,
    ZSharedModule
  ]
})
export class ZMediaSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZMediaSharedModule,
      providers: [
        ZMediaAlbumService,
        ZMediaSharingService
      ]
    };
  }
}
