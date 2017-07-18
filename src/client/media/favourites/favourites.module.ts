import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';
import { CoreSharedModule } from '../../core/shared/shared.module';

import { ZMediaFavoriteDetailComponent } from './favourites-detail.component';
import { ZMediaFavoriteListComponent } from './favourites-list.component';
import { ZMediaFavoriteService } from './favourites.service';
import { ZMediaFavoriteRoutingModule } from './favourites-routing.module';

@NgModule({
  imports: [
    ZMediaFavoriteRoutingModule,
    ZMediaSharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [
    ZMediaFavoriteListComponent,
    ZMediaFavoriteDetailComponent
  ],
  exports: [
    ZMediaFavoriteListComponent,
    ZMediaFavoriteDetailComponent
  ],
  providers: [
    ZMediaFavoriteService
  ]
})

export class ZMediaFavoriteModule {
}
