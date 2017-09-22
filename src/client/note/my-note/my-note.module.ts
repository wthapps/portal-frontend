import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';
import { ZNoteMyNoteComponent } from './my-note.component';
import { ZNoteMyNoteRoutingModule } from './my-note-routing.module';
import { ZNoteMyNoteFoldersComponent } from './folders/folders.component';
import { ZNoteMyNoteNotesComponent } from './notes/notes.component';
import { ZNoteEditModalComponent } from './notes/note-edit-modal.component';
import { ZNoteCreateComponent } from './notes/note-create.component';
import { ZNoteEditComponent } from './notes/note-edit.component';


@NgModule({
  imports: [
    ZNoteMyNoteRoutingModule,
    ZNoteSharedModule.forRoot(),
  ],
  declarations: [
    ZNoteMyNoteComponent,
    ZNoteMyNoteFoldersComponent,
    ZNoteMyNoteNotesComponent,
    ZNoteCreateComponent,
    ZNoteEditComponent,
    ZNoteEditModalComponent,
  ],
  exports: [
    ZNoteMyNoteComponent,
    ZNoteMyNoteFoldersComponent,
    ZNoteMyNoteNotesComponent,
    ZNoteCreateComponent,
    ZNoteEditComponent,
    ZNoteEditModalComponent
  ],
  providers: []
})

export class ZNoteMyNoteModule {
}
