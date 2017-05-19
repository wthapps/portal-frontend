import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';
import { ZMediaPhotoModule } from '../photo/photo.module';

import { ZMediaAlbumService } from './album.service';
import { ZMediaAlbumComponent } from './album.component';
import { ZMediaAlbumListComponent } from './album-list.component';
import { ZMediaAlbumDetailComponent } from './album-detail.component';
import { ZMediaAlbumRoutingModule } from './album-routing.module';
import { AlbumDetailInfoComponent } from './album-detail-info.component';

@NgModule({
  imports: [
    ZMediaPhotoModule,
    ZMediaAlbumRoutingModule,
    ZMediaSharedModule.forRoot()
  ],
  declarations: [
    ZMediaAlbumComponent,
    ZMediaAlbumListComponent,
    ZMediaAlbumDetailComponent,
    AlbumDetailInfoComponent
  ],
  exports: [
    ZMediaAlbumComponent,
    ZMediaAlbumListComponent,
    ZMediaAlbumDetailComponent,
    AlbumDetailInfoComponent
  ],
  providers: [
    ZMediaAlbumService
  ]
})

export class ZMediaAlbumModule {
}
