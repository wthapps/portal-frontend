import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZChatConversationGlobalComponent } from './conversation-global.component';
import { ZChatConversationComponent } from './conversation.component';
import { ZChatNewConversationComponent } from './new-conversation.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'conversation',
        component: ZChatConversationGlobalComponent
      },
      {
        path: 'conversation/:id',
        component: ZChatConversationComponent
      },
      {
        path: 'new_conversation',
        component: ZChatNewConversationComponent
      },
    ])
  ],
  exports: [RouterModule]
})
export class ZChatConversationRoutingModule {
}
