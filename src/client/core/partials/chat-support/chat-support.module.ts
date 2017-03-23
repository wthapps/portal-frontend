import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreChatSupportComponent } from './chat-support.component';
import { ConversationListComponent } from './conversation/conversation-list.component';
import { ConversationCreateComponent } from './conversation/conversation-create.component';
import { ConversationEditComponent } from './conversation/conversation-edit.component';

import { ChatSupportDirective } from './chat-support.directive';
import { ChatSupportChannel } from './shared/channel/chat-support.channel';
import { AppearanceChannel } from './shared/channel/appearance.channel';

import { WthChatBoxDirective } from './shared/wth-chat-box.directive';
import { MessageService } from './message/message.service';
import { ConversationService } from './conversation/conversation.service';

import { ChatSupportMessageComponent } from './message/message.component';
import { ChatSupportMessageListComponent } from './message/message-list.component';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { NotificationChannel } from './shared/channel/notification.channel';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CoreChatSupportComponent,
    ConversationListComponent,
    ConversationCreateComponent,
    ConversationEditComponent,
    ChatSupportMessageListComponent,
    ChatSupportMessageComponent,
    ChatSupportDirective,
    WthChatBoxDirective
  ],
  exports: [
    CoreChatSupportComponent,
    ConversationListComponent,
    ConversationCreateComponent,
    ConversationEditComponent,
    ChatSupportMessageListComponent,
    ChatSupportMessageComponent,
    ChatSupportDirective,
    WthChatBoxDirective
  ],
  providers: [
    ChatSupportChannel,
    AppearanceChannel,
    NotificationChannel,
    MessageService,
    ConversationService,
    CookieService
  ],
  entryComponents:[
    ConversationListComponent,
    ConversationCreateComponent,
    ConversationEditComponent,
    ChatSupportMessageListComponent,
    ChatSupportMessageComponent
  ]
})

export class CoreChatSupportModule {
}
