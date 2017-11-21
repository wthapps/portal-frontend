import { NgModule, ModuleWithProviders } from '@angular/core';

import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZChatSidebarComponent } from './sidebar/sidebar.component';
import { ZChatToolbarComponent } from './toolbar/toolbar.component';
import { ZChatShareUserComponent } from './user/user.component';
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
import { ChatCommonService } from '../../core/shared/services/chat.common.service';
import { ZChatMessageModule } from './message/message.module';
import { ChatContactService } from './services/chat-contact.service';
import { ZChatSharedHeaderComponent } from './header/header.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CoreSharedModule.forRoot(),
    ZChatMessageModule
  ],
  declarations: [
    ZChatSidebarComponent,
    ZChatToolbarComponent,
    ZChatShareUserComponent,
    ZChatShareEditConversationComponent,
    ZChatShareAddContactComponent,
    ZChatShareAddToConversationComponent,
    ZChatSharedHeaderComponent,
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
    ZChatMessageModule,
    ZChatSidebarComponent,
    ZChatToolbarComponent,
    ZChatShareUserComponent,
    ZChatShareEditConversationComponent,
    ZChatShareAddContactComponent,
    ZChatShareAddToConversationComponent,
    ZChatSharedHeaderComponent,
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
export class ZChatSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZChatSharedModule,
      providers: [
        ConversationService,
        ChatService,
        ChatContactService,
        ChatCommonService
      ]
    };
  }
}
