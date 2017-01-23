import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ZMediaAlbumService,
  ZMediaAlbumListComponent,
  ZMediaAlbumDetailComponent
} from './index';

import { ZMediaSharedModule } from '../shared/shared.module';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ZMediaPhotoModule } from '../photo/photo.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ZMediaPhotoModule,
    ZMediaSharedModule.forRoot()
  ],
  declarations: [
    ZMediaAlbumListComponent,
    ZMediaAlbumDetailComponent
  ],
  exports: [
    ZMediaAlbumListComponent,
    ZMediaAlbumDetailComponent
  ],
  providers: [
    ZMediaAlbumService
  ]
})

export class ZMediaAlbumModule {
}
