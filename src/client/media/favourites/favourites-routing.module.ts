import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaFavoriteListComponent } from './favourites-list.component';
import { ZMediaFavoriteDetailComponent } from './favourites-detail.component';
import { ZMediaAlbumDetailComponent } from '../album/album-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'favourites', component: ZMediaFavoriteListComponent},
      {path: 'favourites/:id', component: ZMediaFavoriteDetailComponent},
      {path: 'album/:id', component: ZMediaAlbumDetailComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaFavoriteRoutingModule {
}
