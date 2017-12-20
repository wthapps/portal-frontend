import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaAlbumComponent } from './album.component';
import { ZMediaAlbumListComponent } from './album-list.component';
import { ZMediaAlbumDetailComponent } from './album-detail.component';
import { AuthGuard } from '@wth/shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'albums',
        component: ZMediaAlbumComponent,
        canActivate: [AuthGuard],
        children: [
          {path: '', component: ZMediaAlbumListComponent},
          {path: '*', component: ZMediaAlbumListComponent}
        ]
      },
      {
        path: 'albums/:id', component: ZMediaAlbumDetailComponent, outlet: 'detail',
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaAlbumRoutingModule {
}
