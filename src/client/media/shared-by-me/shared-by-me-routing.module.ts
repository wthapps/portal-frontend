import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaSharedByMeComponent } from './shared-by-me.component';
import { ZMediaAlbumDetailComponent } from '../album/album-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'shared-by-me', component: ZMediaSharedByMeComponent},
      {path: 'shared-by-me/:uuid', component: ZMediaSharedByMeComponent},
      {path: 'shared-by-me/album/:id', component: ZMediaAlbumDetailComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaSharedByMeRoutingModule {
}
