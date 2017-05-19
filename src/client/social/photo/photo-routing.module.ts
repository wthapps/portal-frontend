import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZSocialPhotoComponent } from './photo.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'posts/:postId/photos/:id', component: ZSocialPhotoComponent},
      {path: 'posts/:postId/photos', component: ZSocialPhotoComponent},
      {path: 'comments/:commentId/photos/:id', component: ZSocialPhotoComponent},
    ])
  ],
  exports: [RouterModule]
})
export class ZSocialPhotoRoutingModule { }
