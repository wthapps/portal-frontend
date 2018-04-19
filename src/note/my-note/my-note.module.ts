import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';
import { ZNoteMyNoteComponent } from './my-note.component';
import { ZNoteMyNoteRoutingModule } from './my-note-routing.module';
// import { ZNoteMyNoteFoldersComponent } from './folders/folders.component';
// import { ZNoteMyNoteNotesComponent } from './notes/notes.component';
// import { ZNoteCreateComponent } from './notes/note-create.component';
// import { ZNoteEditComponent } from './notes/note-edit.component';
import { ModalModule } from '@wth/shared/modals/modals.module';

@NgModule({
  imports: [ModalModule, ZNoteMyNoteRoutingModule, ZNoteSharedModule],
  declarations: [
    ZNoteMyNoteComponent,
    // ZNoteMyNoteFoldersComponent,
    // ZNoteMyNoteNotesComponent
    // ZNoteCreateComponent,
    // ZNoteEditComponent
  ],
  exports: [
    ZNoteMyNoteComponent,
    // ZNoteMyNoteFoldersComponent,
    // ZNoteMyNoteNotesComponent
    // ZNoteCreateComponent,
    // ZNoteEditComponent
  ],
  providers: []
})
export class ZNoteMyNoteModule {}
