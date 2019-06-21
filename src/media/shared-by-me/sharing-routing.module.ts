import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ZMediaSharingListComponent } from './sharing-list.component';
import { ZMediaSharingDetailComponent } from './sharing-detail.component';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'shared-by-me',
        component: ZMediaSharingListComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      },
      {
        path: 'shared-by-me/:id',
        component: ZMediaSharingDetailComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      },
      {
        path: 'shared/:uuid',
        component: ZMediaSharingDetailComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaSharingRoutingModule {}
