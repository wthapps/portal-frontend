import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaSharedByMeComponent } from './shared-by-me.component';
import { ZMediaAlbumDetailComponent } from '../album/album-detail.component';
import { ZMediaSharingDetailComponent } from './sharing-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'shared-by-me', component: ZMediaSharedByMeComponent},
      {path: 'shared-by-me/:id', component: ZMediaSharingDetailComponent, outlet: 'detail'},
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaSharedByMeRoutingModule {
}
