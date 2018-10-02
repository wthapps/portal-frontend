import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZChatPhotoRoutingModule } from './photo-routing.module';
import { WMediaPreviewV1Module } from '@shared/components/w-media-preview/media-preview-v1.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatPhotoRoutingModule,
    WMediaPreviewV1Module,
  ],
  declarations: [],
  exports: [],
  providers: []
})
export class ZChatPhotoModule {}
