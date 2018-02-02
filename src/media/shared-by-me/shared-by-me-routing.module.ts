import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ZMediaSharedByMeComponent } from './shared-by-me.component';
import { ZMediaSharingDetailComponent } from './sharing-detail.component';
import { SharedByMePage } from './shared-by-me.page';
import { SharedByMeDetailPage } from './shared-by-me-detail.page';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'shared-by-me-new', component: SharedByMePage, canActivate: [AuthGuard]},
      {path: 'shared-by-me-new/:id', component: SharedByMeDetailPage, canActivate: [AuthGuard]},
      {path: 'shared-by-me', component: ZMediaSharedByMeComponent, canActivate: [AuthGuard]},
      {path: 'shared-by-me/:id', component: ZMediaSharingDetailComponent, outlet: 'detail', canActivate: [AuthGuard]}
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaSharedByMeRoutingModule {
}
