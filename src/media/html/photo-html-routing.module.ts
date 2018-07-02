import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PhotoHtmlComponent } from '@media/html/photo-html.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'html',
        component: PhotoHtmlComponent,
        canActivate: []
      }
    ])
  ],
  exports: [RouterModule]
})
export class PhotoHtmlRoutingModule {}
