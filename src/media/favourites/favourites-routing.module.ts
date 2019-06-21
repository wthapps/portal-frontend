import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ZMediaFavoriteListComponent } from './favourite-list.component';
import { ZMediaFavoriteDetailComponent } from './favourites-detail.component';
import { ZMediaAlbumDetailComponent } from '../album/album-detail.component';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'favorites',
        component: ZMediaFavoriteListComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      },
      {
        path: 'favorites/:filter',
        component: ZMediaFavoriteListComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      },
      // {
      //   path: 'favorites/:filter/:id',
      //   component: ZMediaFavoriteDetailComponent,
      //   canActivate: [AuthGuard]
      // },
      {
        path: 'album/:id',
        component: ZMediaAlbumDetailComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaFavoriteRoutingModule { }
