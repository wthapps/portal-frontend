import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaPreviewComponent } from '@shared/components/w-media-preview/media-preview.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'photos/:id', redirectTo: '/home(modal:preview/:id)'},
      { path: 'preview/:id', component: ZMediaPreviewComponent, outlet: 'modal' },
    ])
  ],
  exports: [RouterModule]
})
export class ZSocialPhotoRoutingModule { }
