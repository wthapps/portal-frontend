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


import { ZMediaToolbarComponent } from './toolbar/toolbar.component';
import { ZMediaToolbarPhotoComponent } from './toolbar/photo/photo.component';
import { ZMediaToolbarAlbumComponent } from './toolbar/album/album.component';
import { ZMediaToolbarAlbumDetailComponent } from './toolbar/album/album-detail.component';
import { ZMediaShareListComponent } from './list/list.component';
import { MediaListHeaderComponent } from './list/media-list-header.component';
import { ZMediaShareItemComponent } from './list/item/item.component';


import { SliderModule } from 'primeng/components/slider/slider';
import { PhotoItemPreviewComponent } from './photo-item-preview.component';
import { ImageCropperModule } from '@shared/shared/components/image-cropper/image-cropper.module';

import { PartialsPhotoSharingModule } from './modal/sharing/sharing.module';
import { PartialsPhotoTaggingModule } from './modal/tagging/tagging.module';
import { PhotoModalModule } from './modal/photo/photo-modal.module';
import { PhotoDetailPartialModule } from './detail/photo-detail-partial.module';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { PhotoService } from '@shared/services';
import { PlaylistModalModule } from './modal/playlist/playlist-modal.module';
import { MediaModalModule } from './modal/media/media-modal.module';

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
    ImageCropperModule,
    PlaylistModalModule,
    MediaModalModule,
    PhotoModalModule,
    PhotoDetailPartialModule,
    PartialsPhotoTaggingModule
  ],
  declarations: [

    ZMediaToolbarComponent,
    ZMediaToolbarPhotoComponent,
    ZMediaToolbarAlbumComponent,
    ZMediaToolbarAlbumDetailComponent,
    ZMediaShareListComponent,
    MediaListHeaderComponent,
    ZMediaShareItemComponent,
    PhotoItemPreviewComponent
  ],
  exports: [
    PartialsPhotoTaggingModule,
    PartialsPhotoSharingModule,
    PhotoDetailPartialModule,

    PlaylistModalModule,
    MediaModalModule,
    PhotoModalModule,

    BoxLoadingModule,
    PartialsPhotoTaggingModule,

    ZMediaToolbarComponent,
    ZMediaToolbarPhotoComponent,
    ZMediaToolbarAlbumComponent,
    ZMediaToolbarAlbumDetailComponent,
    ZMediaShareListComponent,
    MediaListHeaderComponent,
    ZMediaShareItemComponent,
    PhotoItemPreviewComponent
  ],
  providers: [PhotoService]
})
export class PartialsPhotoModule { }
