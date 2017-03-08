import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaAlbumListComponent } from './album-list.component';
import { ZMediaAlbumDetailComponent } from './album-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'album', component: ZMediaAlbumListComponent},
      {path: 'album/:id', component: ZMediaAlbumDetailComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaAlbumRoutingModule {
}
