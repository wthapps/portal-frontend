import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaFavoriteDetailComponent } from './favourites-detail.component';
import { ZMediaFavoriteListComponent } from './favourites-list.component';
import { ZMediaFavoriteService } from './favourites.service';

@NgModule({
  imports: [
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
