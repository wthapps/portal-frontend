import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaFavoriteDetailComponent } from './favourites-detail.component';
import { ZMediaFavoriteListComponent } from './favourites-list.component';
import { ZMediaFavoriteService } from './favourites.service';
import { ZMediaFavoriteRoutingModule } from './favourites-routing.module';
import { SharedModule } from '@wth/shared/shared.module';
import { CoreModule } from '@wth/core/core.module';

@NgModule({
  imports: [
    ZMediaFavoriteRoutingModule,
    ZMediaSharedModule,
    SharedModule,
    CoreModule
  ],
  declarations: [ZMediaFavoriteListComponent, ZMediaFavoriteDetailComponent],
  exports: [ZMediaFavoriteListComponent, ZMediaFavoriteDetailComponent],
  providers: [ZMediaFavoriteService]
})
export class ZMediaFavoriteModule {}
