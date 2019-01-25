import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';

import { WTHEmojiModule } from './../../../shared/components/emoji/emoji.module';
import { ZChatSharedModalModule } from './../modal/chat-shared-modal.module';

import { MessageListComponent } from './message-list.component';
import { MessageItemComponent } from './message-item.component';
import { MessageItemSimpleComponent } from './messages/message-simple-item.component';
import { MessageItemActionComponent } from './messages/message-actions-item.component';
import { ChatNoteListModule } from '@shared/components/note-list/chat-module/chat-note-list.module';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { ModalModule } from '@shared/components/modal/modal.module';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ScrollDirectiveModule } from '@shared/shared/directive/scroll/scroll.directive.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';

import { DisplayLinkModule } from '@shared/shared/components/link/display-link.module';
import { ZChatMessageAssetsModule } from './assets/message-assets.module';
import { ZChatMessageEditorModule } from './editor/message-editor.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    // third party libs
    TooltipModule,

    ModalModule,
    BoxLoadingModule,
    BoxNoDataModule,
    DisplayLinkModule,
    InfiniteScrollModule,
    PipeModule,
    ScrollDirectiveModule,
    WTHEmojiModule,

    ZChatMessageEditorModule,
    ChatNoteListModule,
    ZChatMessageAssetsModule,
    ZChatSharedModalModule
  ],
  declarations: [
    MessageListComponent,
    MessageItemActionComponent,
    MessageItemSimpleComponent,
    MessageItemComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    ModalModule,
    BoxLoadingModule,
    BoxNoDataModule,
    DisplayLinkModule,
    InfiniteScrollModule,
    ScrollDirectiveModule,
    ZChatMessageAssetsModule,
    ZChatMessageEditorModule,
    ZChatSharedModalModule,
    WTHEmojiModule,

    MessageListComponent,
    MessageItemActionComponent,
    MessageItemSimpleComponent,
    MessageItemComponent
  ],
  providers: []
})
export class ZChatMessageModule {}
