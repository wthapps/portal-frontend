import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotePhotoDetailComponent } from './photo-detail.component';
import { AuthGuard } from '@wth/shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'photos/:id', component: NotePhotoDetailComponent, outlet: 'modal', canActivate: [AuthGuard]},
    ])
  ],
  exports: [RouterModule]
})
export class ZNotePhotoRoutingModule {
}
