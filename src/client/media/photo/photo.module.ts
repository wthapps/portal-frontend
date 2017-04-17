import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaPhotoListComponent } from './photo-list.component';
import { ZMediaPhotoDetailComponent } from './photo-detail.component';
import { PhotoEditModalComponent } from './form/photo-edit-modal.component';
import { ZMediaPhotoService } from './photo.service';
import { ZMediaPhotoRoutingModule } from './photo-routing.module';
import { ZMediaPhotoEditComponent } from './edit/edit-photo.component';

@NgModule({
  imports: [
    ZMediaPhotoRoutingModule,
    ZMediaSharedModule.forRoot()
  ],
  declarations: [
    ZMediaPhotoListComponent,
    ZMediaPhotoDetailComponent,
    ZMediaPhotoEditComponent,
    PhotoEditModalComponent
  ],
  exports: [
    ZMediaPhotoListComponent,
    ZMediaPhotoDetailComponent,
    ZMediaPhotoEditComponent,
    PhotoEditModalComponent
  ],
  providers: [
    ZMediaPhotoService
  ]
})

export class ZMediaPhotoModule {
}
