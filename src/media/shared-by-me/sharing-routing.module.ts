import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ZMediaSharingListComponent } from './sharing-list.component';
import { ZMediaSharingDetailComponent } from './sharing-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'shared-by-me',
        component: ZMediaSharingListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'shared-by-me/:id',
        component: ZMediaSharingDetailComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'shared/:uuid',
        component: ZMediaSharingDetailComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaSharingRoutingModule {}
