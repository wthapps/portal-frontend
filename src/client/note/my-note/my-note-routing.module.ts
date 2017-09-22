import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteMyNoteComponent } from './my-note.component';
import { ZNoteMyNoteFoldersComponent } from './folders/folders.component';
import { ZNoteMyNoteNotesComponent } from './notes/notes.component';
import { ZNoteCreateComponent } from './notes/note-create.component';
import { ZNoteEditComponent } from './notes/note-edit.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'my-note', component: ZNoteMyNoteComponent},
      {path: 'my-note/folders/:id', component: ZNoteMyNoteFoldersComponent},
      {path: 'my-note/folders', component: ZNoteMyNoteFoldersComponent},
      {path: 'my-note/notes', component: ZNoteMyNoteNotesComponent},
      {path: 'my-note/notes/create', component: ZNoteCreateComponent},
      {path: 'my-note/notes/:id/edit', component: ZNoteEditComponent},
      {path: 'my-note/notes/:id/detail', component: ZNoteEditComponent}


    ])
  ],
  exports: [RouterModule]
})
export class ZNoteMyNoteRoutingModule {
}
