import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatNoteListComponent } from '@shared/components/note-list/chat-module/chat-note-list.component';
import { ApiBaseService } from '@shared/services';

@NgModule({
  imports: [CommonModule],
  declarations: [ChatNoteListComponent],
  exports: [ChatNoteListComponent]
})
export class ChatNoteListModule {}
