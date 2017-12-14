import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZChatContactComponent } from './contact.component';
import { ZChatContactOnlineComponent } from './contact-online.component';
import { ZChatContactBlackListComponent } from './contact-black-list.component';
import { ZChatContactSentRequestComponent } from './contact-sent-request.component';
import { ZChatContactPendingComponent } from './contact-pending.component';
import { ZChatContactReceiveComponent } from './contact-receive.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'contacts',
        component: ZChatContactComponent
      },
      {
        path: 'contacts/online',
        component: ZChatContactOnlineComponent
      },
      {
        path: 'contacts/blacklist',
        component: ZChatContactBlackListComponent
      },
      {
        path: 'contacts/sent_request',
        component: ZChatContactSentRequestComponent
      },
      {
        path: 'contacts/pending',
        component: ZChatContactPendingComponent
      },
      {
        path: 'contacts/receive',
        component: ZChatContactReceiveComponent
      },
    ])
  ],
  exports: [RouterModule]
})
export class ZChatContactRoutingModule {
}
