import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaSharedWithMeComponent } from './shared-with-me.component';
import { ZMediaAlbumDetailComponent } from '../album/album-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'shared-with-me', component: ZMediaSharedWithMeComponent},
      {path: 'shared-with-me/:uuid', component: ZMediaSharedWithMeComponent},
      {path: 'shared-with-me/album/:id', component: ZMediaAlbumDetailComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaSharedWithMeRoutingModule {
}
