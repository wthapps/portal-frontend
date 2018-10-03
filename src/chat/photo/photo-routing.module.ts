import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@shared/services';
import { ZMediaPreviewComponent } from '@shared/components/w-media-preview/media-preview.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      // {
      //   path: 'photos/:id',
      //   component: ZMediaPreviewComponent,
      //   outlet: 'modal',
      //   data: { object_type: 'photo', show_menu_action: false },
      //   canActivate: [AuthGuard]
      // },
      {
        path: 'preview/:id',
        component: ZMediaPreviewComponent,
        outlet: 'modal',
        data: { object_type: 'video', show_menu_action: false },
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatPhotoRoutingModule {}
