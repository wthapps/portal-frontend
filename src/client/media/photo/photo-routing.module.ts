import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaPhotoListComponent } from './photo-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'photo', component: ZMediaPhotoListComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaPhotoRoutingModule {
}
