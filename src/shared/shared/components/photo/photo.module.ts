import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BsModalModule } from 'ng2-bs3-modal';
import { TagInputModule } from 'ngx-chips';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';

import { PipeModule } from '../../pipe/pipe.module';

import { PhotoDetailPartialComponent } from './detail/photo-detail-partial.component';
import { ZMediaToolbarComponent } from './toolbar/toolbar.component';
import { ZMediaToolbarPhotoComponent } from './toolbar/photo/photo.component';
import { ZMediaToolbarAlbumComponent } from './toolbar/album/album.component';
import { ZMediaToolbarAlbumDetailComponent } from './toolbar/album/album-detail.component';
import { ZMediaShareListComponent } from './list/list.component';
import { MediaListHeaderComponent } from './list/media-list-header.component';
import { ZMediaShareItemComponent } from './list/item/item.component';

import { PhotoService } from '../../../services/photo.service';

import { SliderModule } from 'primeng/components/slider/slider';
import { PhotoItemPreviewComponent } from './photo-item-preview.component';
import { BasePhotoDetailComponent } from './detail/base-photo-detail.component';
import { BoxLoadingModule } from '../box-loading/box-loading.module';
import { ImageCropperModule } from '@shared/shared/components/image-cropper/image-cropper.module';

import { PartialsPhotoSharingModule } from './modal/sharing/sharing.module';
import { PartialsPhotoTaggingModule } from './modal/tagging/tagging.module';
import { MediaRenameModalComponent } from './modal/media/media-rename-modal.component';
import { PhotoEditModalComponent } from './modal/photo/photo-edit-modal.component';
import { AddToAlbumModalComponent } from './modal/photo/add-to-album-modal.component';
import { PlaylistModalModule } from '@shared/shared/components/photo/modal/playlist/playlist-modal.module';
import { MediaModalModule } from '@shared/shared/components/photo/modal/media/media-modal.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // BrowserAnimationsModule,

    BsModalModule,
    TagInputModule,
    CalendarModule,
    CheckboxModule,
    TooltipModule,
    SliderModule,
    PipeModule,
    BoxLoadingModule,
    PartialsPhotoSharingModule,
    PartialsPhotoTaggingModule,
    ImageCropperModule,
    PlaylistModalModule,
    MediaModalModule,
    PartialsPhotoTaggingModule
  ],
  declarations: [
    MediaRenameModalComponent,
    PhotoEditModalComponent,
    AddToAlbumModalComponent,

    PhotoDetailPartialComponent,
    ZMediaToolbarComponent,
    ZMediaToolbarPhotoComponent,
    ZMediaToolbarAlbumComponent,
    ZMediaToolbarAlbumDetailComponent,
    ZMediaShareListComponent,
    MediaListHeaderComponent,
    ZMediaShareItemComponent,
    PhotoItemPreviewComponent,
    BasePhotoDetailComponent
  ],
  exports: [
    MediaRenameModalComponent,
    PhotoEditModalComponent,
    AddToAlbumModalComponent,
    PartialsPhotoTaggingModule,
    PartialsPhotoSharingModule,
    PlaylistModalModule,
    MediaModalModule,

    BoxLoadingModule,
    PartialsPhotoTaggingModule,

    PhotoDetailPartialComponent,
    ZMediaToolbarComponent,
    ZMediaToolbarPhotoComponent,
    ZMediaToolbarAlbumComponent,
    ZMediaToolbarAlbumDetailComponent,
    ZMediaShareListComponent,
    MediaListHeaderComponent,
    ZMediaShareItemComponent,
    PhotoItemPreviewComponent,
    BasePhotoDetailComponent
  ],
  providers: [PhotoService]
})
export class PartialsPhotoModule {}
