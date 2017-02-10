import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZChatConversationGlobalComponent } from './conversation-global.component';
import { ZChatConversationComponent } from './conversation.component';

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
    ])
  ],
  exports: [RouterModule]
})
export class ZChatConversationRoutingModule {
}
