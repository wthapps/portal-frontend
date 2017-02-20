import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZChatContactComponent } from './contact.component';
import { ZChatContactOnlineComponent } from './contact-online.component';
import { ZChatContactBlackListComponent } from './contact-black-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'contact',
        component: ZChatContactComponent
      },
      {
        path: 'contact/online',
        component: ZChatContactOnlineComponent
      },
      {
        path: 'contact/blacklist',
        component: ZChatContactBlackListComponent
      },
    ])
  ],
  exports: [RouterModule]
})
export class ZChatContactRoutingModule {
}
