import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'primeng/primeng';

import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { ImageCropperModule } from '@shared/shared/components/image-cropper/image-cropper.module';
import { AlbumModalModule } from '@shared/components/modal/album/album-modal.module';
import { ZMediaPreviewComponent } from './media-preview.component';
import { PartialsPhotoModule } from '@shared/modules/photo/components/photo.module';
import { MediaRenameModalComponent } from '@shared/modules/photo/components/modal/media/media-rename-modal.component';
import { PhotoEditModalComponent } from '@shared/modules/photo/components/modal/photo/photo-edit-modal.component';
import { AddToAlbumModalComponent } from '@shared/modules/photo/components/modal/photo/add-to-album-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ImageCropperModule,
    PipeModule,
    TooltipModule,
    PartialsPhotoModule,
    AlbumModalModule
  ],
  declarations: [ZMediaPreviewComponent],
  exports: [ZMediaPreviewComponent],
  providers: [],
  entryComponents: [
    MediaRenameModalComponent,
    PhotoEditModalComponent,
    AddToAlbumModalComponent
  ]
})
export class WMediaPreviewV1Module { }
