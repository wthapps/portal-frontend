import { NgModule, ModuleWithProviders } from '@angular/core';
import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZNoteSharedToolBarComponent } from './toolbar/toolbar.component';
import { ZNoteSharedActionBarComponent } from './toolbar/actions-bar.component';
import { NoteListComponent } from './list/note-list.component';
import { NoteItemComponent } from './list/item/note-item.component';
import { FolderItemComponent } from './list/item/folder-item.component';

import { ZNoteService } from './services/note.service';
import { NoteEditModalComponent } from './modal/note/note-edit-modal.component';
import { ZNoteSharedModalNoteViewComponent } from './modal/note/view.component';

import { ZNoteSharedModalFolderEditComponent } from './modal/folder/edit.component';
import { Ng2HdModule } from '../../core/shared/ng2-hd/ng2-hd.module';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    Ng2HdModule,
    CoreSharedModule.forRoot()
  ],
  declarations: [
    ZNoteSharedToolBarComponent,
    ZNoteSharedActionBarComponent,
    NoteListComponent,
    NoteItemComponent,
    FolderItemComponent,

    NoteEditModalComponent,
    ZNoteSharedModalNoteViewComponent,
    ZNoteSharedModalFolderEditComponent,
  ],
  exports: [
    CoreSharedModule,
    ZNoteSharedToolBarComponent,
    ZNoteSharedActionBarComponent,
    NoteListComponent,
    NoteItemComponent,
    FolderItemComponent,

    NoteEditModalComponent,
    ZNoteSharedModalNoteViewComponent,
    ZNoteSharedModalFolderEditComponent
  ]
})
export class ZNoteSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZNoteSharedModule,
      providers: [
        ZNoteService
      ]
    };
  }
}
