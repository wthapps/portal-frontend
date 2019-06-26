import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ZMediaSharedWithMeComponent } from './shared-with-me.component';
import { ZMediaSharingDetailComponent } from '@media/shared-by-me/sharing-detail.component';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'shared-with-me',
        component: ZMediaSharedWithMeComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      },
      {
        path: 'shared-with-me/:id',
        component: ZMediaSharingDetailComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaSharedWithMeRoutingModule {}
