import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaAlbumComponent } from './album.component';
import { AlbumListComponent } from './album-list.component';
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
          {path: '', component: AlbumListComponent},
          {path: '*', component: AlbumListComponent}
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
