import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ZSocialPhotoComponent,
  PhotoDetailComponent
} from './index';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'photos/:id', component: PhotoDetailComponent, outlet: 'modal'},
      {path: 'posts/:postId/photos/:id', component: ZSocialPhotoComponent, outlet: 'modal'},
      {path: 'posts/:postId/photos', component: ZSocialPhotoComponent, outlet: 'modal'},
      {path: 'comments/:commentId/photos/:id', component: ZSocialPhotoComponent, outlet: 'modal'},
    ])
  ],
  exports: [RouterModule]
})
export class ZSocialPhotoRoutingModule { }
