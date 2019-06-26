import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ZMediaPhotoListComponent } from './photo-list.component';
import { PhotoDetailComponent } from '@shared/components/w-media-preview/photo-detail.component';
import { SubscriptionGuard } from '@shared/guards';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'photos',
        component: ZMediaPhotoListComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      },
      {
        path: 'photos/:id',
        component: PhotoDetailComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      },
      {
        path: 'photos/:id',
        component: PhotoDetailComponent,
        outlet: 'modal',
        canActivate: [AuthGuard, SubscriptionGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaPhotoRoutingModule {}
