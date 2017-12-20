import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ZMediaFavoriteListComponent } from './favourites-list.component';
import { ZMediaFavoriteDetailComponent } from './favourites-detail.component';
import { ZMediaAlbumDetailComponent } from '../album/album-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'favourites', component: ZMediaFavoriteListComponent, canActivate: [AuthGuard]},
      {path: 'favourites/:id', component: ZMediaFavoriteDetailComponent, canActivate: [AuthGuard]},
      {path: 'album/:id', component: ZMediaAlbumDetailComponent, canActivate: [AuthGuard]}
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaFavoriteRoutingModule {
}
