import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { Ng2HdModule } from '../shared/ng2-hd/index';
import { ZChatComponent } from './chat.component';
import { ZChatConversationComponent } from './index';

import {
  ZChatShareItemComponent,
  ZChatShareListComponent,
  ZChatToolbarComponent,
  ZChatSidebarComponent,
  ZChatChatboxComponent
} from './shared/index';


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
    ZChatConversationComponent
  ],
  exports: [
    ZChatComponent
  ],
  providers: []
})

export class ZChatModule {
}
