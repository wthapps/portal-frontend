import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaPhotoListComponent } from './photo-list.component';
import { ZMediaPhotoDetailComponent } from './photo-detail.component';
import { PhotoEditModalComponent } from './form/photo-edit-modal.component';
import { ZMediaPhotoRoutingModule } from './photo-routing.module';
import { ZMediaPhotoEditComponent } from './edit/edit-photo.component';
import { PhotoService } from '../../core/shared/services/photo.service';

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
    PhotoService
  ]
})

export class ZMediaPhotoModule {
}
