import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@shared/services';
import { ConversationListComponent } from './conversation-list.component';
import { ConversationDetailComponent } from './conversation-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'conversations',
        canActivate: [AuthGuard],
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
