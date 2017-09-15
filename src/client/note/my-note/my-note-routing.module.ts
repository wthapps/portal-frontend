import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteMyNoteComponent } from './my-note.component';
import { ZNoteMyNoteFoldersComponent } from './folders/folders.component';
import { ZNoteMyNoteNotesComponent } from './notes/notes.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'my-note', component: ZNoteMyNoteComponent},
      {path: 'my-note/folders/:id', component: ZNoteMyNoteFoldersComponent},
      {path: 'my-note/folders', component: ZNoteMyNoteFoldersComponent},
      {path: 'my-note/notes', component: ZNoteMyNoteNotesComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteMyNoteRoutingModule {
}
