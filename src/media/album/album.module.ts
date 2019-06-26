import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { AlbumService } from '../shared/service/album.service';
import { ZMediaAlbumComponent } from './album.component';
import { AlbumListComponent } from './album-list.component';
import { ZMediaAlbumDetailComponent } from './album-detail.component';
import { ZMediaAlbumRoutingModule } from './album-routing.module';
import { CoreModule } from '@wth/core/core.module';
import { WGridListModule } from '@wth/shared/components/grid-list';
import { WToolbarModule } from '@wth/shared/components/toolbar';
import { WUploadModule } from '@shared/components/upload/upload.module';

@NgModule({
  imports: [
    ZMediaAlbumRoutingModule,
    ZMediaSharedModule,
    CoreModule,
    // MediaModalModule,
    WToolbarModule,
    WUploadModule,
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
