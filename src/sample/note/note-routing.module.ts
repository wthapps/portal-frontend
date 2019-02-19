import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NNoteListComponent } from './list/list.component';
import { NoteComponent } from './note.component';

const routes: Routes = [{
  path: '',
  component: NoteComponent,
  children: [
    // { path: '', redirectTo: 'photos', pathMatch: 'full' },
    {
      path: '',
      component: NNoteListComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoteRoutingModule {
}
