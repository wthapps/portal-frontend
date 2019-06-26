import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';
import { ZNoteMyNoteComponent } from './my-note.component';
import { ZNoteMyNoteRoutingModule } from './my-note-routing.module';
// import { ZNoteMyNoteFoldersComponent } from './folders/folders.component';
// import { ZNoteMyNoteNotesComponent } from './notes/notes.component';
// import { ZNoteCreateComponent } from './notes/note-create.component';
// import { ZNoteEditComponent } from './notes/note-edit.component';
import { ModalModule } from '@wth/shared/modals/modals.module';
import { ZNotePublicViewComponent } from '@notes/detail/public-view.component';

@NgModule({
  imports: [ModalModule, ZNoteMyNoteRoutingModule, ZNoteSharedModule],
  declarations: [ZNoteMyNoteComponent, ZNotePublicViewComponent],
  exports: [ZNoteMyNoteComponent],
  providers: []
})
export class ZNoteMyNoteModule {}
