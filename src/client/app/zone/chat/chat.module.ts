import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { InputSwitchModule } from 'primeng/primeng';

import { Ng2HdModule } from '../shared/ng2-hd/index';
import { ZChatComponent } from './chat.component';

import {
  ZChatShareItemComponent,
  ZChatShareListComponent,
  ZChatToolbarComponent,
  ZChatSidebarComponent,
  ZChatChatboxComponent,
  ZChatShareUserListComponent,
  ZChatShareEditConversationComponent,
  ZChatShareAddContactComponent
} from './shared/index';

import {
  ZChatConversationComponent,
  ZChatNewConversationComponent
} from './conversation/index';
import { ZChatContactComponent } from './contact/index';
import { ZChatHistoryComponent } from './history/index';
import { ZChatSettingComponent } from './setting/index';
import { ChatService } from './shared/services/chat.service';
import { ZChatEmojiModule } from './shared/emoji/emoji.module';
import { PostModule } from '../social/post/post.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    Ng2HdModule,
    InputSwitchModule,
    ZChatEmojiModule,
    PostModule
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

    ZChatConversationComponent,
    ZChatNewConversationComponent,
    ZChatContactComponent,
    ZChatHistoryComponent,
    ZChatSettingComponent
  ],
  exports: [
    ZChatComponent
  ],
  providers: [
    ChatService
  ]
})

export class ZChatModule {
}
