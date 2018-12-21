import { NgModule } from '@angular/core';
import { AngularSharedModule } from '@shared/angular-shared.module';
import { ZSharedBreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ChatNoteListComponent } from '@shared/components/note-list/chat-module/chat-note-list.component';
import { FolderItemComponent } from '@shared/components/note-list/chat-module/item/folder-item.component';
import { NoteItemComponent } from '@shared/components/note-list/chat-module/item/note-item.component';
import { ChatNoteListModalComponent } from '@shared/components/note-list/chat-module/modal/note-list-modal.component';
import { ChatNoteSharedToolBarComponent } from '@shared/components/note-list/chat-module/toolbar/toolbar.component';
import { WNavTabModule } from '@shared/components/w-nav-tab/w-nav-tab.module';
import { WObjectListModule } from '@shared/components/w-object-list/w-object-list.module';
import { PartialModule } from '@shared/partials';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { BsModalModule } from 'ng2-bs3-modal';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    AngularSharedModule,
    PipeModule,
    BsModalModule,
    PartialModule,
    WObjectListModule,
    InfiniteScrollModule,
    BoxNoDataModule,
    BoxLoadingModule,
    WNavTabModule,
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
export class ChatNoteListModule {
}
