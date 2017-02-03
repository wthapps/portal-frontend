import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZMediaComponent } from './media.component';

import { ZMediaPhotoListComponent } from './photo/photo-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'media',
        component: ZMediaComponent,
        children: [
          {path: 'photo', component: ZMediaPhotoListComponent},
          {path: '', component: ZMediaComponent}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaRoutingModule {
}
