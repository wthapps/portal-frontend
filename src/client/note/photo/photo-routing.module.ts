import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotePhotoDetailComponent } from './photo-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'photos/:id', component: NotePhotoDetailComponent, outlet: 'modal'},
    ])
  ],
  exports: [RouterModule]
})
export class ZNotePhotoRoutingModule {
}
