import { NgModule } from '@angular/core';
import { MiniEditorModule } from '@wth/shared/shared/components/mini-editor/mini-editor.module';
import { ChatNoteListModule } from '@shared/components/note-list/chat-module/chat-note-list.module';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '@shared/components/modal/modal.module';
import { TooltipModule } from 'primeng/primeng';
import { MessageEditorComponent } from './message-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    ModalModule,
    TooltipModule,

    MiniEditorModule,
    ChatNoteListModule,
    PipeModule
  ],
  declarations: [MessageEditorComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    ModalModule,
    MiniEditorModule,
    ChatNoteListModule,

    MessageEditorComponent
  ],
  providers: []
})
export class ZChatMessageEditorModule {}
