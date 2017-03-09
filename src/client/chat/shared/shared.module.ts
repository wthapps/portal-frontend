import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZChatSidebarComponent } from './sidebar/sidebar.component';
import { ZChatChatboxComponent } from './chat-box/chat-box.component';
import { ZChatShareUserIconComponent } from './user/user-icon.component';
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
import { ZChatContactActionsComponent } from './contact-action/contact-actions.component';
import { ChatCommonService } from './services/chat.common.service';
import { ChatGroupNamePipe } from './pipe/chat-group-name.pipe';
import { ZChatShareItemRequestComponent } from './list/item/item-request.component';

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
    ZChatShareUserIconComponent,
    ZChatShareEditConversationComponent,
    ZChatShareAddContactComponent,
    ZChatShareAddToConversationComponent,
    ZChatContactActionsComponent,
    ZChatShareItemRequestComponent,
    ChatMonthDayYearPipe,
    ChatGroupCouplePipe,
    ChatGroupMultiplePipe,
    ChatGroupBlackListPipe,
    ChatGroupNamePipe,
    ChatUserOnlinePipe
  ],
  exports: [
    CommonModule,
    ZChatSidebarComponent,
    ZChatToolbarComponent,
    ZChatChatboxComponent,
    ZChatShareItemComponent,
    ZChatShareListComponent,
    ZChatShareUserIconComponent,
    ZChatShareEditConversationComponent,
    ZChatShareAddContactComponent,
    ZChatShareAddToConversationComponent,
    ZChatContactActionsComponent,
    ZChatShareItemRequestComponent,
    ChatMonthDayYearPipe,
    ChatGroupCouplePipe,
    ChatGroupMultiplePipe,
    ChatGroupBlackListPipe,
    ChatGroupNamePipe,
    ChatUserOnlinePipe
  ]
})
export class ChatSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ChatSharedModule,
      providers: [ChatService, ChatChannelService, ChatNotificationChannelService, ChatCommonService]
    };
  }
}
