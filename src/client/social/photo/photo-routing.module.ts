import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZSocialPhotoComponent } from './photo.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'posts/:id/photos/:idPhoto', component: ZSocialPhotoComponent},
    ])
  ],
  exports: [RouterModule]
})
export class ZSocialPhotoRoutingModule { }
