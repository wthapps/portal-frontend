import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TooltipModule } from 'primeng/tooltip';

import { ZChatPhotoRoutingModule } from './photo-routing.module';
import { WMediaPreviewV1Module } from '@shared/components/w-media-preview/media-preview-v1.module';
import { ChatMediaPreviewComponent } from './chat-media-preview.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    TooltipModule,

    ZChatPhotoRoutingModule,
    WMediaPreviewV1Module
  ],
  declarations: [ChatMediaPreviewComponent],
  exports: [ChatMediaPreviewComponent],
  providers: []
})
export class ZChatPhotoModule {}
