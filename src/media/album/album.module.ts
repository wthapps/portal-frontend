import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { AlbumService } from '../shared/services/album.service';
import { ZMediaAlbumComponent } from './album.component';
import { AlbumListComponent } from './album-list.component';
import { ZMediaAlbumDetailComponent } from './album-detail.component';
import { ZMediaAlbumRoutingModule } from './album-routing.module';
import { SharedModule } from '@wth/shared/shared.module';
import { CoreModule } from '@wth/core/core.module';
import { WGridListModule } from '@wth/shared/components/grid-list';
import { MediaModalModule } from '@media/shared/modal/modal.module';
import { WToolbarModule } from '@wth/shared/components/toolbar';

@NgModule({
  imports: [
    ZMediaAlbumRoutingModule,
    ZMediaSharedModule,
    SharedModule,
    CoreModule,
    MediaModalModule,
    WToolbarModule,
    WGridListModule
  ],
  declarations: [
    ZMediaAlbumComponent,
    AlbumListComponent,
    ZMediaAlbumDetailComponent
    // AlbumDetailInfoComponent
  ],
  exports: [
    ZMediaAlbumComponent,
    AlbumListComponent,
    ZMediaAlbumDetailComponent
    // AlbumDetailInfoComponent
  ],
  providers: [AlbumService]
})
export class ZMediaAlbumModule {}
