import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZSocialPhotoRoutingModule } from './photo-routing.module';
import { WMediaPreviewV1Module } from '@shared/components/w-media-preview/media-preview-v1.module';

@NgModule({
  imports: [
    CommonModule,
    ZSocialPhotoRoutingModule,
    WMediaPreviewV1Module
  ],
  declarations: [
  ],
  exports: [
    WMediaPreviewV1Module
  ],
  providers: []
})
export class ZSocialPhotoModule {
}
