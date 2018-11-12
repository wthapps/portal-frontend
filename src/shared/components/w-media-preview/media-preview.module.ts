import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZVideoDetailComponent } from './video-detail.component';
import { PhotoDetailComponent } from './photo-detail.component';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { TooltipModule } from 'primeng/primeng';
import { ImageCropperModule } from '@shared/shared/components/image-cropper/image-cropper.module';
import { MediaRenameModalComponent } from '@shared/shared/components/photo/modal/media/media-rename-modal.component';
import { PhotoEditModalComponent } from '@shared/shared/components/photo/modal/photo/photo-edit-modal.component';
import { AddToAlbumModalComponent } from '@shared/shared/components/photo/modal/photo/add-to-album-modal.component';
import { PartialsPhotoModule } from '@shared/shared/components/photo/photo.module';
import { AlbumModalModule } from '@shared/components/modal/album/album-modal.module';


@NgModule({
    imports: [
        CommonModule,
        ImageCropperModule,
        PipeModule,
        TooltipModule,
        PartialsPhotoModule,
        AlbumModalModule
    ],
    declarations: [
        PhotoDetailComponent,
        ZVideoDetailComponent,

        // MediaRenameModalComponent,
        // PhotoEditModalComponent,
        // AddToAlbumModalComponent
    ],
    exports: [
        PhotoDetailComponent,
        ZVideoDetailComponent,

        // MediaRenameModalComponent,
        // PhotoEditModalComponent,
        // AddToAlbumModalComponent
    ],
    providers: [
    ],
    entryComponents: [
        MediaRenameModalComponent,
        PhotoEditModalComponent,
        AddToAlbumModalComponent
    ]
})
export class WMediaPreviewModule {
}
