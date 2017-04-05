import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';
import { ZMediaPhotoModule } from '../photo/photo.module';

import { ZMediaAlbumService } from './album.service';
import { ZMediaAlbumComponent } from './album.component';
import { ZMediaAlbumListComponent } from './album-list.component';
import { ZMediaAlbumDetailComponent } from './album-detail.component';
import { ZMediaAlbumRoutingModule } from './album-routing.module';

@NgModule({
  imports: [
    ZMediaPhotoModule,
    ZMediaAlbumRoutingModule,
    ZMediaSharedModule.forRoot()
  ],
  declarations: [
    ZMediaAlbumComponent,
    ZMediaAlbumListComponent,
    ZMediaAlbumDetailComponent
  ],
  exports: [
    ZMediaAlbumComponent,
    ZMediaAlbumListComponent,
    ZMediaAlbumDetailComponent
  ],
  providers: [
    ZMediaAlbumService
  ]
})

export class ZMediaAlbumModule {
}
