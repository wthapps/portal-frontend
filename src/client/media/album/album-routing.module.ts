import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaAlbumComponent } from './album.component';
import { ZMediaAlbumListComponent } from './album-list.component';
import { ZMediaAlbumDetailComponent } from './album-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'albums',
        component: ZMediaAlbumComponent,
        children: [
          {path: ':id', component: ZMediaAlbumDetailComponent},
          {path: '', component: ZMediaAlbumListComponent},
          {path: '*', component: ZMediaAlbumListComponent}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaAlbumRoutingModule {
}
