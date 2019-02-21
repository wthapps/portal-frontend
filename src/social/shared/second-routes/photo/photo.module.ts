import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZSocialPhotoRoutingModule } from './photo-routing.module';
import { WMediaPreviewV1Module } from '@shared/components/w-media-preview/media-preview-v1.module';
import { SocialMediaPreviewComponent } from './social-media-preview.component';

@NgModule({
  imports: [
    CommonModule,
    ZSocialPhotoRoutingModule,
    WMediaPreviewV1Module
  ],
  declarations: [
    SocialMediaPreviewComponent
  ],
  exports: [
    WMediaPreviewV1Module,

    SocialMediaPreviewComponent
  ],
  providers: []
})
export class ZSocialPhotoModule {
}
