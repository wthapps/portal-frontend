import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ACMenuComponent } from './menu/menu.component';
import { ZChatConversationGlobalComponent } from '../conversation/conversation-global.component';
import { ZChatComponent } from '../chat.component';
import { ZChatSidebarComponent } from './sidebar/sidebar.component';
import { ZChatChatboxComponent } from './chat-box/chat-box.component';
import { ZChatShareEditConversationComponent } from './modal/edit-conversation.component';
import { ZChatConversationComponent } from '../conversation/conversation.component';
import { ZChatHistoryComponent } from '../history/history.component';
import { ZChatSettingComponent } from '../setting/setting.component';
import { ZChatShareUserListComponent } from './user-list/user-list.component';
import { ZChatShareAddContactComponent } from './modal/add-contact.component';
import { ZChatContactComponent } from '../contact/contact.component';
import { ZChatShareListComponent } from './list/list.component';
import { ZChatShareItemComponent } from './list/item/item.component';
import { ZChatToolbarComponent } from './toolbar/toolbar.component';
import { ZChatNewConversationComponent } from '../conversation/new-conversation.component';
import { ChatService } from './services/chat.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [
    ZChatComponent,
    ZChatSidebarComponent,
    ZChatToolbarComponent,
    ZChatChatboxComponent,
    ZChatShareItemComponent,
    ZChatShareListComponent,
    ZChatShareUserListComponent,
    ZChatShareEditConversationComponent,
    ZChatShareAddContactComponent,
    ZChatConversationGlobalComponent,
    ZChatConversationComponent,
    ZChatNewConversationComponent,
    ZChatContactComponent,
    ZChatHistoryComponent,
    ZChatSettingComponent
  ],
  exports: [
    CommonModule,
    ZChatComponent,
    ZChatSidebarComponent,
    ZChatToolbarComponent,
    ZChatChatboxComponent,
    ZChatShareItemComponent,
    ZChatShareListComponent,
    ZChatShareUserListComponent,
    ZChatShareEditConversationComponent,
    ZChatShareAddContactComponent,
    ZChatConversationGlobalComponent,
    ZChatConversationComponent,
    ZChatNewConversationComponent,
    ZChatContactComponent,
    ZChatHistoryComponent,
    ZChatSettingComponent
  ]
})
export class ChatSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ChatSharedModule,
      providers: [ChatService]
    };
  }
}
