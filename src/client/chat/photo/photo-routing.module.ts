import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PhotoDetailWrapperComponent } from '../../core/partials/photo/edit/photo-detail-wrapper.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'photos/:id', component: PhotoDetailWrapperComponent},
    ])
  ],
  exports: [RouterModule]
})
export class ZChatPhotoRoutingModule {
}
