import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { Ng2HdModule } from '../shared/ng2-hd/index';
import { ZChatComponent } from './chat.component';

import {
  ZChatShareItemComponent,
  ZChatShareListComponent,
  ZChatToolbarComponent,
  ZChatSidebarComponent,
  ZChatChatboxComponent,
  ZChatShareUserListComponent
} from './shared/index';

import { ZChatConversationComponent } from './conversation/index';
import { ZChatContactComponent } from './contact/index';
import { ZChatHistoryComponent } from './history/index';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    Ng2HdModule
  ],
  declarations: [
    ZChatComponent,
    ZChatSidebarComponent,
    ZChatToolbarComponent,
    ZChatChatboxComponent,
    ZChatShareItemComponent,
    ZChatShareListComponent,
    ZChatShareUserListComponent,

    ZChatConversationComponent,
    ZChatContactComponent,
    ZChatHistoryComponent
  ],
  exports: [
    ZChatComponent
  ],
  providers: []
})

export class ZChatModule {
}
