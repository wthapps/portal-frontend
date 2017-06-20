import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConversationListComponent } from './conversation-list.component';
import { ConversationDetailComponent } from './conversation-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'conversations',
        component: ConversationListComponent
      },
      {
        path: 'conversations/:id',
        component: ConversationDetailComponent
      },
      {
        path: 'conversations/:id/photos',
        component: ConversationDetailComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatConversationRoutingModule {
}
