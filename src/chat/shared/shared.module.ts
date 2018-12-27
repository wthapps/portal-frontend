import { NgModule, ModuleWithProviders } from '@angular/core';

import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/components/common/messageservice';

import { ZChatSidebarComponent } from './sidebar/sidebar.component';
import { ZChatToolbarComponent } from './toolbar/toolbar.component';
import { ZChatShareEditConversationComponent } from './modal/edit-conversation.component';
import { ZChatShareAddContactComponent } from './modal/add-contact.component';
import { ZChatShareAddToConversationComponent } from './modal/add-to-conversation.component';
import { ZChatContactActionsComponent } from './contact-action/contact-actions.component';
import { ChatMonthDayYearPipe } from './pipe/chat-month-day-year.pipe';
import { ChatGroupCouplePipe } from './pipe/chat-group-couple.pipe';
import { ChatGroupMultiplePipe } from './pipe/chat-group-multiple.pipe';
import { ChatGroupBlackListPipe } from './pipe/chat-group-black-list.pipe';
import { ChatGroupNamePipe } from './pipe/chat-group-name.pipe';
import { ChatUserNewPipe } from './pipe/chat-user-new.pipe';
import { ChatGroupMembersPipe } from './pipe/chat-group-members.pipe';
import { ChatGroupSentRequestPipe } from './pipe/chat-group-sent-request.pipe';
import { ChatGroupPendingPipe } from './pipe/chat-group-pending.pipe';
import { ChatUserOnlinePipe } from './pipe/chat-user-online.pipe';
import { ChatGroupHistoryPipe } from './pipe/chat-group-history.pipe';
import { ConversationService } from '../conversation/conversation.service';
import { ChatService } from './services/chat.service';
import { ZChatMessageModule } from './message/message.module';
import { ChatContactService } from './services/chat-contact.service';
import { ZChatSharedHeaderComponent } from './header/header.component';
import { SharedModule } from '@wth/shared/shared.module';
import { ChatCommonService } from '@wth/shared/services';
import { ZChatShareAddContactService } from '@chat/shared/modal/add-contact.service';
import { ContactListModalComponent } from '@chat/contact/contact-list-modal.component';
import { ChatMessageService } from './services/chat-message.service';
import { ChatConversationService } from './services/chat-conversation.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [SharedModule, MessagesModule, MessageModule, ZChatMessageModule],
  declarations: [
    ZChatSidebarComponent,
    ZChatToolbarComponent,
    ZChatShareEditConversationComponent,
    ZChatShareAddContactComponent,
    ZChatShareAddToConversationComponent,
    ZChatSharedHeaderComponent,
    ZChatContactActionsComponent,
    ContactListModalComponent,

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
    MessagesModule,
    MessageModule,

    ZChatMessageModule,
    ZChatSidebarComponent,
    ZChatToolbarComponent,
    ZChatShareEditConversationComponent,
    ZChatShareAddContactComponent,
    ZChatShareAddToConversationComponent,
    ZChatSharedHeaderComponent,
    ZChatContactActionsComponent,
    ContactListModalComponent,

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
export class ZChatSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZChatSharedModule,
      providers: [
        ConversationService,
        ChatService,
        ChatMessageService,
        ChatContactService,
        ChatConversationService,
        ChatCommonService,
        MessageService,
        ZChatShareAddContactService
      ]
    };
  }
}
