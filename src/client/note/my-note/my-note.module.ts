import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';
import { ZNoteMyNoteComponent } from './my-note.component';
import { ZNoteMyNoteRoutingModule } from './my-note-routing.module';
import { ZNoteMyNoteFoldersComponent } from './folders/folders.component';
import { ZNoteMyNoteNotesComponent } from './notes/notes.component';


@NgModule({
  imports: [
    ZNoteMyNoteRoutingModule,
    ZNoteSharedModule.forRoot(),
  ],
  declarations: [
    ZNoteMyNoteComponent,
    ZNoteMyNoteFoldersComponent,
    ZNoteMyNoteNotesComponent
  ],
  exports: [
    ZNoteMyNoteComponent,
    ZNoteMyNoteFoldersComponent,
    ZNoteMyNoteNotesComponent
  ],
  providers: []
})

export class ZNoteMyNoteModule {
}
