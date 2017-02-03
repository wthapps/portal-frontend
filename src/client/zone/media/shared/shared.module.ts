import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { ReactiveFormsModule } from '@angular/forms';

import { ZMediaShareItemComponent } from './list/item/item.component';
import { ZMediaShareListComponent } from './list/list.component';

// import { ZMediaToolbarComponent } from './toolbar/toolbar.component';
// import { ZMediaToolbarPhotoComponent } from './toolbar/photo/photo.component';
// import { ZMediaToolbarAlbumComponent } from './toolbar/album/album.component';
// import { ZMediaToolbarAlbumDetailComponent } from './toolbar/album/album-detail.component';
// import { ZMediaSortbarComponent } from './sortbar/sortbar.component';
// import { ZMediaFormAddToAlbumComponent } from './form/form-add-to-album.component';
// import { ZMediaFormEditAlbumComponent } from './form/form-edit-album.component';
// import { ZMediaUploadingComponent } from './uploading/uploading.component';
// import { ZMediaSharingComponent } from './sharing/sharing.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    Ng2Bs3ModalModule,
    InfiniteScrollModule,
    ReactiveFormsModule
  ],
  declarations: [
    ZMediaShareItemComponent,
    ZMediaShareListComponent,

    // ZMediaToolbarComponent,
    // ZMediaToolbarPhotoComponent,
    // ZMediaToolbarAlbumComponent,
    // ZMediaToolbarAlbumDetailComponent,
    //
    // ZMediaSortbarComponent,
    // ZMediaFormAddToAlbumComponent,
    // ZMediaFormEditAlbumComponent,
    //
    // ZMediaUploadingComponent,
    // ZMediaSharingComponent
  ],
  exports: [
    ZMediaShareItemComponent,
    ZMediaShareListComponent,

    // ZMediaToolbarComponent,
    // ZMediaToolbarPhotoComponent,
    // ZMediaToolbarAlbumComponent,
    // ZMediaToolbarAlbumDetailComponent,
    //
    // ZMediaSortbarComponent,
    // ZMediaFormAddToAlbumComponent,
    // ZMediaFormEditAlbumComponent,
    //
    // ZMediaUploadingComponent,
    // ZMediaSharingComponent,

    //Module
    CommonModule,
    RouterModule,
    Ng2Bs3ModalModule,
    InfiniteScrollModule,
    ReactiveFormsModule
  ]
})
export class ZMediaSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZMediaSharedModule,
      providers: []
    };
  }
}
