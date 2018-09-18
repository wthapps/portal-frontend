import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZVideoDetailComponent } from './video-detail.component';
import { PhotoDetailComponent } from './photo-detail.component';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { TooltipModule } from 'primeng/primeng';
import { ImageCropperModule } from '@shared/shared/components/image-cropper/image-cropper.module';


@NgModule({
    imports: [
        CommonModule,
        ImageCropperModule,
        PipeModule,
        TooltipModule,
    ],
    declarations: [
        PhotoDetailComponent,
        ZVideoDetailComponent
    ],
    exports: [
        PhotoDetailComponent,
        ZVideoDetailComponent
    ],
    providers: [
    ],
})
export class WMediaPreviewModule {
}
