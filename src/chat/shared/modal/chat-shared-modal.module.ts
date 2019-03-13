import { NgModule } from '@angular/core';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from '@shared/components/modal/modal.module';
import {
  TooltipModule,
  InputSwitchModule,
  CheckboxModule,
  RadioButtonModule,
  AutoCompleteModule,
  CalendarModule,
  PanelMenuModule
} from 'primeng/primeng';

import { MiniEditorModule } from '@wth/shared/shared/components/mini-editor/mini-editor.module';
import { ChatNoteListModule } from '@shared/components/note-list/chat-module/chat-note-list.module';

import { ZChatShareAddToConversationComponent } from './add-to-conversation.component';
import { ZChatShareEditConversationComponent } from './edit-conversation.component';
import { ZChatShareRequestContactComponent } from './request-contact.component';
import { ZChatShareUserModule } from '../user/user.module';
import { ZChatPipeModule } from '../pipe/chat-pipe.module';
import { TagInputModule } from 'ngx-chips';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // third party libs
    TagInputModule,
    InputSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    AutoCompleteModule,
    CalendarModule,
    PanelMenuModule,
    TooltipModule,

    ModalModule,
    TooltipModule,
    PipeModule,
    ZChatPipeModule,
    BoxLoadingModule,

    ZChatShareUserModule
  ],
  declarations: [
    ZChatShareAddToConversationComponent,
    ZChatShareEditConversationComponent,
    ZChatShareRequestContactComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputSwitchModule,

    ModalModule,
    MiniEditorModule,
    ChatNoteListModule,
    ZChatShareUserModule,
    ZChatPipeModule,

    ZChatShareAddToConversationComponent,
    ZChatShareEditConversationComponent,
    ZChatShareRequestContactComponent
  ],
  providers: []
})
export class ZChatSharedModalModule {}
