import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { UploadCropImageComponent } from './upload-crop-image.component';

@NgModule({
  imports: [
    CommonModule,
    Ng2Bs3ModalModule
  ],
  declarations: [UploadCropImageComponent],
  exports: [UploadCropImageComponent],
  providers: []
})

export class UploadCropImageModule {
}
