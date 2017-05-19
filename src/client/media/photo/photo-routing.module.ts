import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaPhotoListComponent } from './photo-list.component';
import { ZMediaPhotoDetailComponent } from './photo-detail.component';
import { ZMediaPhotoEditComponent } from './edit/edit-photo.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'photos', component: ZMediaPhotoListComponent},
      {path: 'photos/:id/edit', component: ZMediaPhotoEditComponent},
      {path: 'photos/:id', component: ZMediaPhotoDetailComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaPhotoRoutingModule {
}
