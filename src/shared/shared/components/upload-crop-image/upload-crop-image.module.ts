import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsModalModule } from 'ng2-bs3-modal';

import { UploadCropImageComponent } from './upload-crop-image.component';

@NgModule({
  imports: [
    CommonModule,
    BsModalModule
  ],
  declarations: [UploadCropImageComponent],
  exports: [UploadCropImageComponent],
  providers: []
})

export class UploadCropImageModule {
}
