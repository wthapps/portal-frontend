import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { AlbumService } from '../shared/services/album.service';
import { ZMediaAlbumComponent } from './album.component';
import { AlbumListComponent } from './album-list.component';
import { ZMediaAlbumDetailComponent } from './album-detail.component';
import { ZMediaAlbumRoutingModule } from './album-routing.module';
import { AlbumDetailInfoComponent } from './album-detail-info.component';
import { SharedModule } from '@wth/shared/shared.module';
import { CoreModule } from '@wth/core/core.module';
import { WGridListModule } from '@wth/shared/components/grid-list';

@NgModule({
  imports: [
    ZMediaAlbumRoutingModule,
    ZMediaSharedModule,
    SharedModule,
    CoreModule,
    WGridListModule
  ],
  declarations: [
    ZMediaAlbumComponent,
    AlbumListComponent,
    // ZMediaAlbumDetailComponent,
    // AlbumDetailInfoComponent
  ],
  exports: [
    ZMediaAlbumComponent,
    AlbumListComponent,
    // ZMediaAlbumDetailComponent,
    // AlbumDetailInfoComponent
  ],
  providers: [
    AlbumService
  ]
})

export class ZMediaAlbumModule {
}
