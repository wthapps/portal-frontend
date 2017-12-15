import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ZMediaSharedByMeComponent } from './shared-by-me.component';
import { ZMediaAlbumDetailComponent } from '../album/album-detail.component';
import { ZMediaSharingDetailComponent } from './sharing-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'shared-by-me', component: ZMediaSharedByMeComponent, canActivate: [AuthGuard]},
      {path: 'shared-by-me/:id', component: ZMediaSharingDetailComponent, outlet: 'detail', canActivate: [AuthGuard]},
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaSharedByMeRoutingModule {
}
