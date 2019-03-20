import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // { path: '', component: AppComponent },
  // { path: '', redirectTo: '/note', pathMatch: 'full' },
  {
    path: 'media',
    loadChildren: './media/media.module#MediaModule'
  },
  {
    path: 'note',
    loadChildren: './note/note.module#NoteModule'
  },
  {
    path: 'test',
    loadChildren: './test/test.module#TestModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
