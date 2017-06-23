import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PhotoDetailModalComponent } from '../../core/partials/photo/modal/photo-detail-modal.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'photos/:id', component: PhotoDetailModalComponent},
    ])
  ],
  exports: [RouterModule]
})
export class ZChatPhotoRoutingModule {
}
