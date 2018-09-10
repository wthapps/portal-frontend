import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@shared/services';
import { ChatPhotoDetailComponent } from './photo-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'photos/:id',
        component: ChatPhotoDetailComponent,
        outlet: 'modal',
        data: { object_type: 'photo' },
        canActivate: [AuthGuard]
      },
      {
        path: 'videos/:id',
        component: ChatPhotoDetailComponent,
        outlet: 'modal',
        data: { object_type: 'video'},
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatPhotoRoutingModule {}
