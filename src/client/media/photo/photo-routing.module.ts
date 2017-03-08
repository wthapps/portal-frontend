import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaPhotoListComponent } from './photo-list.component';
import { ZMediaPhotoDetailComponent } from './photo-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'photo', component: ZMediaPhotoListComponent},
      {path: 'photo/:id', component: ZMediaPhotoDetailComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaPhotoRoutingModule {
}
