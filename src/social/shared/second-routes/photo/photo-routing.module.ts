import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ZSocialPhotoComponent,
  PhotoDetailComponent
} from './index';
import { ZMediaPreviewComponent } from '@shared/components/w-media-preview/media-preview.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      // {path: 'photos/:id', redirectTo: '/home(modal:preview/:id)'},
      {path: 'posts/:postId/photos/:id', redirectTo: '/home(modal:posts/:postId/photos/:id)'},
      {path: 'posts/:postId/photos', redirectTo: '/home(modal:posts/:postId/photos)'},
      {path: 'comments/:commentId/photos/:id', redirectTo: '/home(modal:comments/:commentId/photos/:id)'},

      // {path: 'photos/:id', component: PhotoDetailComponent, outlet: 'modal'},
      { path: 'preview/:id', component: ZMediaPreviewComponent, outlet: 'modal' },
      {path: 'posts/:postId/photos/:id', component: ZSocialPhotoComponent, outlet: 'modal'},
      {path: 'posts/:postId/photos', component: ZSocialPhotoComponent, outlet: 'modal'},
      {path: 'comments/:commentId/photos/:id', component: ZSocialPhotoComponent, outlet: 'modal'},
    ])
  ],
  exports: [RouterModule]
})
export class ZSocialPhotoRoutingModule { }
