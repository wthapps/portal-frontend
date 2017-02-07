import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';
import { ZMediaPhotoModule } from '../photo/photo.module';

import { ZMediaAlbumListComponent } from './album-list.component';
import { ZMediaAlbumDetailComponent } from './album-detail.component';
import { ZMediaAlbumService } from './album.service';

@NgModule({
  imports: [
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
