import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // { path: '', component: AppComponent },
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule'
  },
  {
    path: 'media',
    loadChildren: './media/media.module#MediaModule'
  },
  {
    path: 'note',
    loadChildren: './note/note.module#NoteModule'
  },
  {
    path: 'drive',
    loadChildren: './drive/drive.module#DriveModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
