import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreChatSupportComponent } from './chat-support.component';
import { ChatSupportListComponent } from './chat-support-list.component';
import { ChatSupportDetailComponent } from './chat-support-detail.component';
import { ChatSupportUserInfoComponent } from './chat-support-user-info.component';
import { ChatSupportDirective } from './chat-support.directive';
import { ChatSupportChannelService } from './shared/channel/chat-support-channel.service';
import { WthChatBoxDirective } from './shared/wth-chat-box.directive';
import { MessageService } from './message.service';
import { ChatSupportMessageComponent } from './message/message.component';
import { ChatSupportMessageListComponent } from './message/message-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CoreChatSupportComponent,
    ChatSupportListComponent,
    ChatSupportDetailComponent,
    ChatSupportUserInfoComponent,
    ChatSupportMessageListComponent,
    ChatSupportMessageComponent,
    ChatSupportDirective,
    WthChatBoxDirective
  ],
  exports: [
    CoreChatSupportComponent,
    ChatSupportListComponent,
    ChatSupportDetailComponent,
    ChatSupportUserInfoComponent,
    ChatSupportMessageListComponent,
    ChatSupportMessageComponent,
    ChatSupportDirective,
    WthChatBoxDirective
  ],
  providers: [ChatSupportChannelService, MessageService],
  entryComponents:[
    ChatSupportListComponent,
    ChatSupportUserInfoComponent,
    ChatSupportDetailComponent,
    ChatSupportMessageListComponent,
    ChatSupportMessageComponent
  ]
})

export class CoreChatSupportModule {
}
