import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ZChatContactComponent } from './contact.component';
import { ZChatContactOnlineComponent } from './contact-online.component';
import { ZChatContactBlackListComponent } from './contact-black-list.component';
import { ZChatContactReceiveComponent } from './contact-receive.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'contacts',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: ZChatContactComponent
          },
          {
            path: 'all',
            component: ZChatContactComponent
          },
          {
            path: 'online',
            component: ZChatContactOnlineComponent
          },
          {
            path: 'blacklist',
            component: ZChatContactBlackListComponent
          },
          {
            path: 'receive',
            component: ZChatContactReceiveComponent
          }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatContactRoutingModule {}
