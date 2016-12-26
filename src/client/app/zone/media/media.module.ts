import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import {
  ZMediaComponent
} from './index';

import { ZMediaPhotoModule } from './photo/photo.module';
import { ZMediaAlbumModule } from './album/album.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ZMediaPhotoModule,
    ZMediaAlbumModule
  ],
  declarations: [
    ZMediaComponent
  ],
  exports: [
    ZMediaComponent
  ],
  providers: [
  ]
})

export class ZMediaModule {
}
