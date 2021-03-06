import { NgModule, ModuleWithProviders } from '@angular/core';

import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/components/common/messageservice';

import { ModalModule } from '@shared/components/modal/modal.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TagInputModule } from 'ngx-chips';
import {
  InputSwitchModule,
  CheckboxModule,
  RadioButtonModule,
  AutoCompleteModule,
  CalendarModule,
  PanelMenuModule,
  TooltipModule
} from 'primeng/primeng';

import { MessageInvitationComponent } from './message/message-invitation.component';
import { PartialModule } from './../../shared/partials/partial.module';

import { ZChatSidebarComponent } from './sidebar/sidebar.component';
import { ZChatToolbarComponent } from './toolbar/toolbar.component';
import { ZChatContactActionsComponent } from './contact-action/contact-actions.component';
import { ConversationService } from '../../shared/services/chat/conversation.service';
import { ChatService } from './services/chat.service';
import { ChatContactService } from './services/chat-contact.service';
import { ZChatSharedHeaderComponent } from './header/header.component';
import { ChatCommonService } from '@wth/shared/services';
import { ChatMessageService } from './services/chat-message.service';
import { ChatConversationService } from './services/chat-conversation.service';
import { WthCommonModule } from '@shared/common/wth-common.module';
import { ModalDockModule } from '@shared/shared/components/modal/dock.module';
import { FileModule } from '@shared/shared/components/file/file.module';
import { WMediaSelectionModule } from '@shared/components/w-media-selection/w-media-selection.module';
import { ComponentsModule } from '@shared/components/components.module';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { WNavTabModule } from '@shared/components/w-nav-tab/w-nav-tab.module';

import { ZChatShareUserModule } from './user/user.module';
import { WTHEmojiModule } from '@shared/components/emoji/emoji.module';
import { ZSharedReportModule } from '@shared/shared/components/zone/report/report.module';
import { ZChatSharedModalModule } from './modal/chat-shared-modal.module';
import { ZChatPipeModule } from './pipe/chat-pipe.module';
import { CardUserModule } from '@shared/components/card-user/card-user.module';
import { ChatNotificationService, MemberService } from '@chat/shared/services';
import {  } from './modal/cards/chat-card-detail-modal.module';
import { ChatPipeModule } from '@shared/chat/pipe';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    WthCommonModule,
    CardUserModule,

    // custom component
    ModalDockModule,
    ModalModule,
    FileModule,
    PartialModule,
    WMediaSelectionModule,
    ComponentsModule,
    BoxNoDataModule,
    WNavTabModule,
    WTHEmojiModule,
    ZSharedReportModule,

    // Chat scoped modules
    MessagesModule,
    MessageModule,
    ZChatSharedModalModule,
    ZChatShareUserModule,
    ZChatPipeModule,
    ChatPipeModule,

    // third party libs
    TagInputModule,
    InputSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    AutoCompleteModule,
    CalendarModule,
    PanelMenuModule,
    TooltipModule
  ],
  declarations: [
    ZChatSidebarComponent,
    ZChatToolbarComponent,
    ZChatSharedHeaderComponent,
    ZChatContactActionsComponent,
    MessageInvitationComponent
  ],
  exports: [
    WthCommonModule,
    CardUserModule,

    // custom component
    ModalDockModule,
    ModalModule,
    FileModule,
    PartialModule,
    WMediaSelectionModule,
    ComponentsModule,
    BoxNoDataModule,
    WNavTabModule,
    WTHEmojiModule,
    ZSharedReportModule,

    // Chat scoped modules
    MessagesModule,
    MessageModule,
    MessageInvitationComponent,
    ZChatSharedModalModule,
    ZChatShareUserModule,
    ZChatPipeModule,

    // third party libs
    TagInputModule,
    InputSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    AutoCompleteModule,
    CalendarModule,
    PanelMenuModule,
    TooltipModule,

    ZChatSidebarComponent,
    ZChatToolbarComponent,
    ZChatSharedHeaderComponent,
    ZChatContactActionsComponent
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
        ChatNotificationService,
        MemberService
      ]
    };
  }
}
