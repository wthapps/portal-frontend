import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ZSocialPhotoComponent,
  PhotoDetailComponent
} from './index';
import { ZSocialPhotoRoutingModule } from './photo-routing.module';
import { ZSocialSharedModule } from '../../shared.module';
import { PhotoDetailPartialComponent } from '@shared/shared/components/photo/detail/photo-detail-partial.component';
import { ImageCropperModule } from '@shared/shared/components/image-cropper/image-cropper.module';
// import { SharedModule } from '@wth/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ImageCropperModule,
    ZSocialPhotoRoutingModule,
    ZSocialSharedModule,
    // SharedModule
  ],
  declarations: [
    // PhotoDetailPartialComponent,
    ZSocialPhotoComponent,
    PhotoDetailComponent
  ],
  exports: [
    // PhotoDetailPartialComponent,
    ZSocialPhotoComponent,
    PhotoDetailComponent
  ],
  providers: []
})
export class ZSocialPhotoModule {
}
