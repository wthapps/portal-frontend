import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@shared/services';
import { ConversationListComponent } from './conversation-list.component';
import { ConversationDetailComponent } from './conversation-detail.component';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'conversations',
        canActivate: [AuthGuard, SubscriptionGuard],
        children: [
          {
            path: '',
            component: ConversationListComponent
          },
          {
            path: ':id',
            component: ConversationDetailComponent
          },
          {
            path: ':id/photos',
            component: ConversationDetailComponent
          }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatConversationRoutingModule {}
