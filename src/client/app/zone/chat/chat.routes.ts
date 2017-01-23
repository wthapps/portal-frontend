import { Route } from '@angular/router';
import { ZChatComponent } from './chat.component';
import { ZChatConversationComponent, ZChatNewConversationComponent } from './conversation/index';
import { ZChatContactComponent } from './contact/index';
import { ZChatHistoryComponent } from './history/index';
import { ZChatSettingComponent } from './setting/index';


export const ZChatRoutes: Route[] = [
  {
    path: 'chat',
    component: ZChatComponent,
    children: [
      {path: 'setting', component: ZChatSettingComponent},
      {path: 'history', component: ZChatHistoryComponent},
      // {path: 'conversation', component: ZChatConversationComponent},
      {path: 'conversation/:id', component: ZChatConversationComponent},
      {path: 'new', component: ZChatNewConversationComponent},
      {path: 'contact', component: ZChatContactComponent},
      {path: '', component: ZChatConversationComponent}
    ]
  }
];
