import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ImageCropperComponent } from './image-cropper.component';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BoxLoadingModule
  ],
  declarations: [
    ImageCropperComponent
  ],
  exports: [
    ImageCropperComponent
  ]
})
export class ImageCropperModule {
}
