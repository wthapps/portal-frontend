import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlbumListComponent } from './album-list.component';
import { ZMediaAlbumDetailComponent } from './album-detail.component';
import { AuthGuard } from '@wth/shared/services';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'albums',
        component: AlbumListComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      },
      {
        path: 'albums/:uuid',
        component: ZMediaAlbumDetailComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaAlbumRoutingModule {}
