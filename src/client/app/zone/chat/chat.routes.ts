import { Route } from '@angular/router';
import { ZChatComponent } from './chat.component';
import { ZChatConversationComponent } from './conversation/index';
import { ZChatContactComponent } from './contact/index';
import { ZChatHistoryComponent } from './history/index';


export const ZChatRoutes: Route[] = [
  {
    path: 'chat',
    component: ZChatComponent,
    children: [
      {path: 'history', component: ZChatHistoryComponent},
      {path: 'conversation', component: ZChatConversationComponent},
      {path: 'contact', component: ZChatContactComponent},
      {path: '', component: ZChatConversationComponent}
    ]
  }
];
