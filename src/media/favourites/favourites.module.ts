import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaFavoriteDetailComponent } from './favourites-detail.component';
import { ZMediaFavoriteListComponent } from './favourite-list.component';
import { ZMediaFavoriteService } from './favourites.service';
import { ZMediaFavoriteRoutingModule } from './favourites-routing.module';
import { CoreModule } from '@wth/core/core.module';
import { WToolbarModule } from '@wth/shared/components/toolbar';
import { WGridListModule } from '@wth/shared/components/grid-list';

@NgModule({
  imports: [
    ZMediaFavoriteRoutingModule,
    ZMediaSharedModule,
    CoreModule,
    WToolbarModule,
    WGridListModule
  ],
  declarations: [ZMediaFavoriteListComponent, ZMediaFavoriteDetailComponent],
  exports: [ZMediaFavoriteListComponent, ZMediaFavoriteDetailComponent],
  providers: [ZMediaFavoriteService]
})
export class ZMediaFavoriteModule {}
