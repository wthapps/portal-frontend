import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaAlbumService } from './album.service';
import { ZMediaAlbumComponent } from './album.component';
import { ZMediaAlbumListComponent } from './album-list.component';
import { ZMediaAlbumDetailComponent } from './album-detail.component';
import { ZMediaAlbumRoutingModule } from './album-routing.module';
import { AlbumDetailInfoComponent } from './album-detail-info.component';
import { SharedModule } from '@wth/shared/shared.module';
import { CoreModule } from '@wth/core/core.module';

@NgModule({
  imports: [
    ZMediaAlbumRoutingModule,
    ZMediaSharedModule.forRoot(),
    SharedModule.forRoot(),
    CoreModule.forRoot()

  ],
  declarations: [
    ZMediaAlbumComponent,
    ZMediaAlbumListComponent,
    // ZMediaAlbumDetailComponent,
    // AlbumDetailInfoComponent
  ],
  exports: [
    ZMediaAlbumComponent,
    ZMediaAlbumListComponent,
    // ZMediaAlbumDetailComponent,
    // AlbumDetailInfoComponent
  ],
  providers: [
    ZMediaAlbumService
  ]
})

export class ZMediaAlbumModule {
}
