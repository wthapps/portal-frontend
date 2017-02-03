import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';
import { ZMediaPhotoListComponent } from './photo-list.component';
import { ZMediaPhotoDetailComponent } from './photo-detail.component';
import { ZMediaPhotoFormEditComponent } from './form/form-edit-photo.component';
import { ZMediaPhotoService } from './photo.service';

@NgModule({
  imports: [
    ZMediaSharedModule.forRoot()
  ],
  declarations: [
    ZMediaPhotoListComponent,
    ZMediaPhotoDetailComponent,
    ZMediaPhotoFormEditComponent
  ],
  exports: [
    ZMediaPhotoListComponent,
    ZMediaPhotoDetailComponent,
    ZMediaPhotoFormEditComponent
  ],
  providers: [
    ZMediaPhotoService
  ]
})

export class ZMediaPhotoModule {
}
