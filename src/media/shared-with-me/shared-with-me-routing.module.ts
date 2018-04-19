import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ZMediaSharedWithMeComponent } from './shared-with-me.component';
import { ZMediaSharingDetailComponent } from '@media/shared-by-me/sharing-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'shared-with-me',
        component: ZMediaSharedWithMeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'shared-with-me/:id',
        component: ZMediaSharingDetailComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaSharedWithMeRoutingModule {}
