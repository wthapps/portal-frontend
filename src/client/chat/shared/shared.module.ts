import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZChatSidebarComponent } from './sidebar/sidebar.component';
import { MessageEditorComponent } from './message/editor/message-editor.component';
import { MessageListComponent } from './message/message-list.component';
import { MessageItemComponent } from './message/message-item.component';
import { ZChatToolbarComponent } from './toolbar/toolbar.component';
import { ChatService } from './services/chat.service';
import { SharedModule } from '../../core/shared/shared.module';
import { ZChatEmojiModule } from '../../core/shared/emoji/emoji.module';
import { ZChatShareEditConversationComponent } from './modal/edit-conversation.component';
import { ZChatShareAddContactComponent } from './modal/add-contact.component';
import { ZChatShareUserComponent } from './user/user.component';

import { ChatMonthDayYearPipe } from './pipe/chat-month-day-year.pipe';
import { ChatGroupCouplePipe } from './pipe/chat-group-couple.pipe';
import { ChatUserOnlinePipe } from './pipe/chat-user-online.pipe';
import { ZChatShareAddToConversationComponent } from './modal/add-to-conversation.component';
import { ChatGroupMultiplePipe } from './pipe/chat-group-multiple.pipe';
import { ChatGroupBlackListPipe } from './pipe/chat-group-black-list.pipe';
import { ZChatContactActionsComponent } from './contact-action/contact-actions.component';
import { ChatCommonService } from '../../core/shared/services/chat.common.service';
import { ChatGroupNamePipe } from './pipe/chat-group-name.pipe';
import { ChatUserNewPipe } from './pipe/chat-user-new.pipe';
import { ChatGroupMembersPipe } from './pipe/chat-group-members.pipe';
import { ChatGroupSentRequestPipe } from './pipe/chat-group-sent-request.pipe';
import { ChatGroupPendingPipe } from './pipe/chat-group-pending.pipe';
import { ConversationService } from '../conversation/conversation.service';
import { ChatGroupHistoryPipe } from './pipe/chat-group-history.pipe';
import { ZChatMessageModule } from "./message/message.module";

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    SharedModule.forRoot(),
    ZChatMessageModule
  ],
  declarations: [
    ZChatSidebarComponent,
    ZChatToolbarComponent,
    ZChatShareUserComponent,
    ZChatShareEditConversationComponent,
    ZChatShareAddContactComponent,
    ZChatShareAddToConversationComponent,
    ZChatContactActionsComponent,
    ChatMonthDayYearPipe,
    ChatGroupCouplePipe,
    ChatGroupMultiplePipe,
    ChatGroupBlackListPipe,
    ChatGroupNamePipe,
    ChatUserNewPipe,
    ChatGroupMembersPipe,
    ChatGroupSentRequestPipe,
    ChatGroupPendingPipe,
    ChatUserOnlinePipe,
    ChatGroupHistoryPipe
  ],
  exports: [
    CommonModule,
    ZChatMessageModule,
    ZChatSidebarComponent,
    ZChatToolbarComponent,
    ZChatShareUserComponent,
    ZChatShareEditConversationComponent,
    ZChatShareAddContactComponent,
    ZChatShareAddToConversationComponent,
    ZChatContactActionsComponent,
    ChatMonthDayYearPipe,
    ChatGroupCouplePipe,
    ChatGroupMultiplePipe,
    ChatGroupBlackListPipe,
    ChatGroupNamePipe,
    ChatUserNewPipe,
    ChatGroupSentRequestPipe,
    ChatGroupPendingPipe,
    ChatGroupMembersPipe,
    ChatUserOnlinePipe,
    ChatGroupHistoryPipe
  ]
})
export class ChatSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ChatSharedModule,
      providers: [ConversationService, ChatService, ChatCommonService]
    };
  }
}
