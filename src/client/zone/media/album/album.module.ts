import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaAlbumListComponent } from './album-list.component';
import { ZMediaAlbumDetailComponent } from './album-detail.component';
import { ZMediaAlbumService } from './album.service';

@NgModule({
  imports: [
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
