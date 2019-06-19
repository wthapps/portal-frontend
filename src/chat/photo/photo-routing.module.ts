import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@shared/services';
import { ChatMediaPreviewComponent } from './chat-media-preview.component';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'preview/:id',
        component: ChatMediaPreviewComponent,
        outlet: 'modal',
        data: { object_type: 'Media::Video' },
        canActivate: [AuthGuard, SubscriptionGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatPhotoRoutingModule {}
