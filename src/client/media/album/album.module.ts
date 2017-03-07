import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';
import { ZMediaPhotoModule } from '../photo/photo.module';

import { ZMediaAlbumService } from './album.service';
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
