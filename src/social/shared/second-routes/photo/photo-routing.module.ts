import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SocialMediaPreviewComponent } from './social-media-preview.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'photos/:id', redirectTo: '/home(modal:preview/:id)' },
      {
        path: 'preview/:id',
        component: SocialMediaPreviewComponent,
        outlet: 'modal'
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZSocialPhotoRoutingModule {}
