import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaAlbumListComponent } from './album-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'album', component: ZMediaAlbumListComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaAlbumRoutingModule {
}
