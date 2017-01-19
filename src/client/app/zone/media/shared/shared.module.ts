import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { Ng2HdModule } from '../../shared/ng2-hd/ng2-hd.module';
import { AutoCompleteModule } from 'primeng/primeng';

import {
  ZMediaToolbarComponent,
  ZMediaToolbarPhotoComponent,
  ZMediaToolbarAlbumComponent,
  ZMediaToolbarAlbumDetailComponent
} from './toolbar/index';

import { ZMediaSortbarComponent } from './sortbar/sortbar.component';
import { ZMediaFormAddToAlbumComponent } from './form/form-add-to-album.component';
import { ZMediaFormEditAlbumComponent } from './form/form-edit-album.component';

import { ZMediaShareItemComponent } from './list/item/item.component';
import { ZMediaShareListComponent } from './list/list.component';
import { ZMediaUploadingComponent } from './uploading/uploading.component';
import { ZMediaSharingComponent } from './sharing/sharing.component';
import { ZMediaSharingService } from './sharing/sharing.service';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    Ng2HdModule,
    ReactiveFormsModule,
    FormsModule,
    AutoCompleteModule
  ],
  declarations: [
    ZMediaToolbarComponent,
    ZMediaToolbarPhotoComponent,
    ZMediaToolbarAlbumComponent,
    ZMediaToolbarAlbumDetailComponent,

    ZMediaSortbarComponent,
    ZMediaFormAddToAlbumComponent,
    ZMediaFormEditAlbumComponent,
    ZMediaShareItemComponent,
    ZMediaShareListComponent,
    ZMediaUploadingComponent,
    ZMediaSharingComponent
  ],
  exports: [
    ZMediaToolbarComponent,
    ZMediaToolbarPhotoComponent,
    ZMediaToolbarAlbumComponent,
    ZMediaToolbarAlbumDetailComponent,

    ZMediaSortbarComponent,
    ZMediaFormAddToAlbumComponent,
    ZMediaFormEditAlbumComponent,
    ZMediaShareItemComponent,
    ZMediaShareListComponent,
    ZMediaUploadingComponent,
    ZMediaSharingComponent,

    //Module
    AutoCompleteModule
  ]
})
export class ZMediaSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZMediaSharedModule,
      providers: [ZMediaSharingService]
    };
  }
}
