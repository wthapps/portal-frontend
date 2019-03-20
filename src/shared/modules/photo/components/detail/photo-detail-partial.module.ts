import { PhotoModalModule } from './../modal/photo/photo-modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { TagInputModule } from 'ngx-chips';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';

import { BasePhotoDetailComponent } from '../detail/base-photo-detail.component';
import { ImageCropperModule } from '@shared/shared/components/image-cropper/image-cropper.module';

import { PartialsPhotoSharingModule } from '../modal/sharing/sharing.module';
import { PartialsPhotoTaggingModule } from '../modal/tagging/tagging.module';
import { MediaModalModule } from '../modal/media/media-modal.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { PhotoService } from '@shared/services';
import { PhotoDetailPartialComponent } from './photo-detail-partial.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    BsModalModule,
    TagInputModule,
    CalendarModule,
    CheckboxModule,
    TooltipModule,
    PipeModule,
    BoxLoadingModule,
    ImageCropperModule,
    MediaModalModule,
    PhotoModalModule
  ],
  declarations: [PhotoDetailPartialComponent, BasePhotoDetailComponent],
  exports: [
    PartialsPhotoTaggingModule,
    PartialsPhotoSharingModule,
    PhotoDetailPartialComponent,

    BoxLoadingModule,
    PartialsPhotoTaggingModule,
    MediaModalModule,
    PhotoModalModule,

    BasePhotoDetailComponent
  ],
  providers: [PhotoService]
})
export class PhotoDetailPartialModule { }
