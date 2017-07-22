import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaPhotoListComponent } from './photo-list.component';
import { PhotoDetailComponent } from './photo-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'photos', component: ZMediaPhotoListComponent},
      {path: 'photos/:id', component: PhotoDetailComponent},
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaPhotoRoutingModule {
}
