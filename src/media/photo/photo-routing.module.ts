import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ZMediaPhotoListComponent } from './photo-list.component';
import { PhotoDetailComponent } from './photo-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'photos', component: ZMediaPhotoListComponent, canActivate: [AuthGuard]},
      {path: 'photos/:id', component: PhotoDetailComponent, outlet: 'modal', canActivate: [AuthGuard]},
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaPhotoRoutingModule {
}
