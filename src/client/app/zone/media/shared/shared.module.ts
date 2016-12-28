import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Ng2HdModule } from '../../shared/ng2-hd/ng2-hd.module';

import {
  ZMediaToolbarComponent,
  ZMediaToolbarPhotoComponent
} from './toolbar/index';
import { ZMediaSortbarComponent } from './sortbar/sortbar.component';
import { ZMediaFormAddToAlbumComponent } from './form/form-add-to-album.component';
import { ZMediaFormEditAlbumComponent } from './form/form-edit-album.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ZMediaShareItemComponent } from './list/item/item.component';
import { ZMediaShareListComponent } from './list/list.component';
import { ZMediaUploadingComponent } from './uploading/uploading.component';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    Ng2HdModule,
    ReactiveFormsModule
  ],
  declarations: [
    ZMediaToolbarComponent,
    ZMediaToolbarPhotoComponent,

    ZMediaSortbarComponent,
    ZMediaFormAddToAlbumComponent,
    ZMediaFormEditAlbumComponent,
    ZMediaShareItemComponent,
    ZMediaShareListComponent,
    ZMediaUploadingComponent
  ],
  exports: [
    ZMediaToolbarComponent,
    ZMediaToolbarPhotoComponent,

    ZMediaSortbarComponent,
    ZMediaFormAddToAlbumComponent,
    ZMediaFormEditAlbumComponent,
    ZMediaShareItemComponent,
    ZMediaShareListComponent,
    ZMediaUploadingComponent
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
