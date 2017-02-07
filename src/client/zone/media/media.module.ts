import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZMediaRoutingModule } from './media-routing.module';
import { ZMediaComponent } from './media.component';

import { ZMediaPhotoModule } from './photo/photo.module';
import { ZSharedModule } from '../shared/shared.module';
import { ZMediaFavoriteModule } from './favourites/favourites.module';
import { ZMediaAlbumModule } from './album/album.module';
import { ZMediaSharedWithMeModule } from './shared-with-me/shared-with-me.module';

@NgModule({
  imports: [
    CommonModule,
    ZMediaRoutingModule,
    ZMediaPhotoModule,
    ZMediaFavoriteModule,
    ZMediaAlbumModule,
    ZMediaSharedWithMeModule,
    ZSharedModule.forRoot()
  ],
  declarations: [
    ZMediaComponent
  ],
  exports: [
    ZMediaComponent
  ],
  providers: []
})

export class ZMediaModule {
}
