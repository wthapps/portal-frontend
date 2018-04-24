import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatNoteListComponent } from '@shared/components/note-list/chat-module/chat-note-list.component';
import { ApiBaseService } from '@shared/services';
import { FolderItemComponent } from '@shared/components/note-list/chat-module/item/folder-item.component';
import { AngularSharedModule } from '@shared/angular-shared.module';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { NoteItemComponent } from '@shared/components/note-list/chat-module/item/note-item.component';
import { ChatNoteListModalComponent } from '@shared/components/note-list/chat-module/modal/note-list-modal.component';
import { BsModalModule } from 'ng2-bs3-modal';
import { TextBoxSearchComponent } from '@shared/partials/search-box';
import { PartialModule } from '@shared/partials';
import { ChatNoteSharedToolBarComponent } from '@shared/components/note-list/chat-module/toolbar/toolbar.component';
import { TooltipModule } from 'primeng/primeng';
import { ZSharedBreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { WObjectListModule } from '@shared/components/w-object-list/w-object-list.module';

@NgModule({
  imports: [
    AngularSharedModule,
    PipeModule,
    BsModalModule,
    PartialModule,
    WObjectListModule,
    TooltipModule
  ],
  declarations: [
    ChatNoteListComponent,
    FolderItemComponent,
    NoteItemComponent,
    ChatNoteSharedToolBarComponent,
    ZSharedBreadcrumbComponent,
    ChatNoteListModalComponent
  ],
  exports: [ChatNoteListComponent, ChatNoteListModalComponent]
})
export class ChatNoteListModule {}
