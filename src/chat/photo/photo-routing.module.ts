import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@shared/services';
import { ChatPhotoDetailComponent } from './photo-detail.component';
import { ZVideoDetailComponent } from '@shared/components/w-media-preview/video-detail.component';

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
        component: ZVideoDetailComponent,
        outlet: 'modal',
        data: { object_type: 'video', show_menu_action: false},
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatPhotoRoutingModule {}
