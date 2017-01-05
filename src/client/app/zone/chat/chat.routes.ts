import { Route } from '@angular/router';
import { ZChatComponent } from './chat.component';
import { ZChatConversationComponent } from './conversation/index';


export const ZChatRoutes: Route[] = [
  {
    path: 'chat',
    component: ZChatComponent,
    children: [
      {path: 'conversation', component: ZChatConversationComponent},
      {path: '', component: ZChatConversationComponent}
    ]
  }
];
