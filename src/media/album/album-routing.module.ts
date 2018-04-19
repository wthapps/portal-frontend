import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlbumListComponent } from './album-list.component';
import { ZMediaAlbumDetailComponent } from './album-detail.component';
import { AuthGuard } from '@wth/shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'albums',
        component: AlbumListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'albums/:id',
        component: ZMediaAlbumDetailComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaAlbumRoutingModule {}
