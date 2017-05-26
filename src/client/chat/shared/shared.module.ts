import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZChatSidebarComponent } from './sidebar/sidebar.component';
import { MessageEditorComponent } from './message/editor/message-editor.component';
import { MessageListComponent } from './message/message-list.component';
import { MessageItemComponent } from './message/message-item.component';
import { ZChatToolbarComponent } from './toolbar/toolbar.component';
import { ChatService } from './services/chat.service';
import { SharedModule } from '../../core/shared/shared.module';
import { ZChatEmojiModule } from './emoji/emoji.module';
import { ZChatShareEditConversationComponent } from './modal/edit-conversation.component';
import { ZChatShareAddContactComponent } from './modal/add-contact.component';
import { ZChatShareUserIconComponent } from './user/user-icon.component';
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
import { ZChatShareItemRequestComponent } from './message/item-request.component';
import { ChatUserNewPipe } from './pipe/chat-user-new.pipe';
import { ZChatShareRequestContactComponent } from './modal/request-contact.component';
import { ChatGroupMembersPipe } from './pipe/chat-group-members.pipe';
import { ChatGroupSentRequestPipe } from './pipe/chat-group-sent-request.pipe';
import { ChatGroupPendingPipe } from './pipe/chat-group-pending.pipe';
import { ConversationService } from '../conversation/conversation.service';

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
    MessageEditorComponent,
    MessageItemComponent,
    MessageListComponent,
    ZChatShareUserIconComponent,
    ZChatShareUserComponent,
    ZChatShareEditConversationComponent,
    ZChatShareAddContactComponent,
    ZChatShareAddToConversationComponent,
    ZChatContactActionsComponent,
    ZChatShareItemRequestComponent,
    ZChatShareRequestContactComponent,
    ChatMonthDayYearPipe,
    ChatGroupCouplePipe,
    ChatGroupMultiplePipe,
    ChatGroupBlackListPipe,
    ChatGroupNamePipe,
    ChatUserNewPipe,
    ChatGroupMembersPipe,
    ChatGroupSentRequestPipe,
    ChatGroupPendingPipe,
    ChatUserOnlinePipe
  ],
  exports: [
    CommonModule,
    ZChatSidebarComponent,
    ZChatToolbarComponent,
    MessageEditorComponent,
    MessageItemComponent,
    MessageListComponent,
    ZChatShareUserIconComponent,
    ZChatShareUserComponent,
    ZChatShareEditConversationComponent,
    ZChatShareAddContactComponent,
    ZChatShareAddToConversationComponent,
    ZChatContactActionsComponent,
    ZChatShareItemRequestComponent,
    ZChatShareRequestContactComponent,
    ChatMonthDayYearPipe,
    ChatGroupCouplePipe,
    ChatGroupMultiplePipe,
    ChatGroupBlackListPipe,
    ChatGroupNamePipe,
    ChatUserNewPipe,
    ChatGroupSentRequestPipe,
    ChatGroupPendingPipe,
    ChatGroupMembersPipe,
    ChatUserOnlinePipe
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
