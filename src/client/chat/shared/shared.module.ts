import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZChatSidebarComponent } from './sidebar/sidebar.component';
import { ZChatChatboxComponent } from './chat-box/chat-box.component';
import { ZChatShareUserListComponent } from './user-list/user-list.component';
import { ZChatShareListComponent } from './list/list.component';
import { ZChatShareItemComponent } from './list/item/item.component';
import { ZChatToolbarComponent } from './toolbar/toolbar.component';
import { ChatService } from './services/chat.service';
import { SharedModule } from '../../core/shared/shared.module';
import { ZChatEmojiModule } from './emoji/emoji.module';
import { ChatChannelService } from './channels/chat-channel.service';
import { ChatNotificationChannelService } from './channels/chat-notification-channel.service';
import { ZChatShareEditConversationComponent } from './modal/edit-conversation.component';
import { ZChatShareAddContactComponent } from './modal/add-contact.component';
import { ChatMonthDayYearPipe } from './pipe/chat-month-day-year.pipe';
import { ChatGroupCouplePipe } from './pipe/chat-group-couple.pipe';
import { ChatUserOnlinePipe } from './pipe/chat-user-online.pipe';
import { ZChatShareAddToConversationComponent } from './modal/add-to-conversation.component';
import { ChatGroupMultiplePipe } from './pipe/chat-group-multiple.pipe';
import { ChatGroupBlackListPipe } from './pipe/chat-group-black-list.pipe';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    SharedModule.forRoot(),
    ZChatEmojiModule
  ],
  declarations: [
    ZChatSidebarComponent,
    ZChatToolbarComponent,
    ZChatChatboxComponent,
    ZChatShareItemComponent,
    ZChatShareListComponent,
    ZChatShareUserListComponent,
    ZChatShareEditConversationComponent,
    ZChatShareAddContactComponent,
    ZChatShareAddToConversationComponent,
    ChatMonthDayYearPipe,
    ChatGroupCouplePipe,
    ChatGroupMultiplePipe,
    ChatGroupBlackListPipe,
    ChatUserOnlinePipe
  ],
  exports: [
    CommonModule,
    ZChatSidebarComponent,
    ZChatToolbarComponent,
    ZChatChatboxComponent,
    ZChatShareItemComponent,
    ZChatShareListComponent,
    ZChatShareUserListComponent,
    ZChatShareEditConversationComponent,
    ZChatShareAddContactComponent,
    ZChatShareAddToConversationComponent,
    ChatMonthDayYearPipe,
    ChatGroupCouplePipe,
    ChatGroupMultiplePipe,
    ChatGroupBlackListPipe,
    ChatUserOnlinePipe
  ]
})
export class ChatSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ChatSharedModule,
      providers: [ChatService, ChatChannelService, ChatNotificationChannelService]
    };
  }
}
