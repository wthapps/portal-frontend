import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ZSocialPhotoComponent,
  PhotoDetailComponent
} from './index';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'photos/:id', component: PhotoDetailComponent},
      {path: 'posts/:postId/photos/:id', component: ZSocialPhotoComponent},
      {path: 'posts/:postId/photos', component: ZSocialPhotoComponent},
      {path: 'comments/:commentId/photos/:id', component: ZSocialPhotoComponent},
    ])
  ],
  exports: [RouterModule]
})
export class ZSocialPhotoRoutingModule { }
