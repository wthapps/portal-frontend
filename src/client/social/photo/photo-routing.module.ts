import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZSocialPhotoComponent } from './photo.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'posts/:id/photos/:photoId', component: ZSocialPhotoComponent},
      {path: 'posts/:id/photos', component: ZSocialPhotoComponent},
      {path: 'comments/:commentUuid/photos', component: ZSocialPhotoComponent},
    ])
  ],
  exports: [RouterModule]
})
export class ZSocialPhotoRoutingModule { }
