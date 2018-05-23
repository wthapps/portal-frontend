import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ZSocialPhotoComponent,
  PhotoDetailComponent
} from './index';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'photos/:id', redirectTo: '/home(modal:photos/:id)'},
      {path: 'posts/:postId/photos/:id', redirectTo: '/home(modal:posts/:postId/photos/:id)'},
      {path: 'posts/:postId/photos', redirectTo: '/home(modal:posts/:postId/photos)'},
      {path: 'comments/:commentId/photos/:id', redirectTo: '/home(modal:comments/:commentId/photos/:id)'},

      {path: 'photos/:id', component: PhotoDetailComponent, outlet: 'modal'},
      {path: 'posts/:postId/photos/:id', component: ZSocialPhotoComponent, outlet: 'modal'},
      {path: 'posts/:postId/photos', component: ZSocialPhotoComponent, outlet: 'modal'},
      {path: 'comments/:commentId/photos/:id', component: ZSocialPhotoComponent, outlet: 'modal'},
    ])
  ],
  exports: [RouterModule]
})
export class ZSocialPhotoRoutingModule { }
