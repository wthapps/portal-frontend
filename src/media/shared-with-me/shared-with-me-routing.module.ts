import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ZMediaSharedWithMeComponent } from './shared-with-me.component';
import { ZMediaAlbumDetailComponent } from '../album/album-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'shared-with-me',
        component: ZMediaSharedWithMeComponent,
        canActivate: [AuthGuard],
        children: [
          { path: ':uuid', component: ZMediaSharedWithMeComponent },
          { path: 'album/:id', component: ZMediaAlbumDetailComponent }
        ]
      },
      {
        path: 'shared-with-me/:id',
        component: ZMediaAlbumDetailComponent,
        outlet: 'detail',
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaSharedWithMeRoutingModule {}
