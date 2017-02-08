import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaFavoriteDetailComponent } from './favourites-detail.component';
import { ZMediaFavoriteListComponent } from './favourites-list.component';
import { ZMediaFavoriteService } from './favourites.service';
import { ZMediaPhotoModule } from '../photo/photo.module';
import { ZMediaFavoriteRoutingModule } from './favourites-routing.module';

@NgModule({
  imports: [
    ZMediaPhotoModule,
    ZMediaFavoriteRoutingModule,
    ZMediaSharedModule.forRoot()
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
