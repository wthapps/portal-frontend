import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Ng2HdModule } from '@shared/shared/ng2-hd/ng2-hd.module';
import { SharedModule } from '@shared/shared.module';
import { ZNoteSharedToolBarComponent } from './toolbar/toolbar.component';
import { ZNoteSharedActionBarComponent } from './toolbar/actions-bar.component';
import { NoteListComponent } from './list/note-list.component';
import { NoteItemComponent } from './list/item/note-item.component';
import { FolderItemComponent } from './list/item/folder-item.component';

import { ZNoteService } from './services/note.service';
// import { NoteEditModalComponent } from './modal/note/note-edit-modal.component';
import { ZNoteSharedModalNoteViewComponent } from './modal/note/view.component';

import { ZNoteSharedModalFolderEditComponent } from './modal/folder/edit.component';
import { ZNoteSharedModalFolderMoveComponent } from './modal/folder/move.component';

import { ZNoteSharedModalSharingComponent } from './modal/sharing/sharing.component';
import { ZFolderService } from './services/folder.service';
import { MixedEntityService } from './mixed-enity/mixed-entity.service';
import { ZNoteSharedTrashActionBarComponent } from './toolbar/trash/trash-actions-bar.component';
import { ZNoteSharedBreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ZNoteSharedLeftMenuComponent } from './toolbar/left-menu.component';
import { ZNoteSharedHeaderComponent } from './header/header.component';
import { ModalModule } from '@shared/modals/modals.module';
import { ZNoteContainerComponent } from '@notes/shared/containers/note-container.component';
import { StoreModule } from '@ngrx/store/store';
import { ZNoteShareProgressComponent } from '@notes/shared/progress/note-progress.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [Ng2HdModule, CommonModule, ModalModule, SharedModule],
  declarations: [
    ZNoteSharedToolBarComponent,
    ZNoteSharedActionBarComponent,
    NoteListComponent,
    NoteItemComponent,
    FolderItemComponent,
    ZNoteContainerComponent,

    // NoteEditModalComponent,
    ZNoteSharedModalNoteViewComponent,
    ZNoteSharedModalFolderEditComponent,
    ZNoteSharedModalFolderMoveComponent,
    ZNoteSharedTrashActionBarComponent,
    ZNoteSharedModalSharingComponent,
    ZNoteSharedBreadcrumbComponent,
    ZNoteSharedHeaderComponent,
    ZNoteShareProgressComponent,
    ZNoteSharedLeftMenuComponent
  ],
  exports: [
    SharedModule,
    ModalModule,
    ZNoteSharedToolBarComponent,
    ZNoteSharedActionBarComponent,
    NoteListComponent,
    NoteItemComponent,
    FolderItemComponent,
    ZNoteSharedHeaderComponent,
    ZNoteContainerComponent,

    // NoteEditModalComponent,
    ZNoteSharedModalNoteViewComponent,
    ZNoteSharedModalFolderEditComponent,
    ZNoteSharedModalFolderMoveComponent,
    ZNoteSharedTrashActionBarComponent,
    ZNoteSharedModalSharingComponent,
    ZNoteSharedBreadcrumbComponent,
    ZNoteShareProgressComponent,
    ZNoteSharedLeftMenuComponent
  ]
})
export class ZNoteSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZNoteSharedModule,
      providers: [ZNoteService, ZFolderService, MixedEntityService]
    };
  }
}
