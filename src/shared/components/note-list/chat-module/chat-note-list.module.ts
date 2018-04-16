import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatNoteListComponent } from '@shared/components/note-list/chat-module/chat-note-list.component';
import { ApiBaseService } from '@shared/services';
import { FolderItemComponent } from '@shared/components/note-list/chat-module/item/folder-item.component';
import { AngularSharedModule } from '@shared/angular-shared.module';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { NoteItemComponent } from '@shared/components/note-list/chat-module/item/note-item.component';

@NgModule({
  imports: [AngularSharedModule, PipeModule],
  declarations: [ChatNoteListComponent, FolderItemComponent, NoteItemComponent],
  exports: [ChatNoteListComponent]
})
export class ChatNoteListModule {}
