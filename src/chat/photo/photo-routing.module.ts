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
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatPhotoRoutingModule {}
