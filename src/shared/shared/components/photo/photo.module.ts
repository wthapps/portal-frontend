import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
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
import { BaseObjectEditNameModalComponent } from './modal/base-object-edit-name-modal.component';
import { PhotoEditModalComponent } from './modal/photo-edit-modal.component';
import { AddToAlbumModalComponent } from './modal/add-to-album-modal.component';
import { AlbumEditModalComponent } from './modal/album-edit-modal.component';
import { AlbumDeleteModalComponent } from './modal/album-delete-modal.component';
import { AlbumCreateModalComponent } from './modal/album-create-modal.component';
import { ZMediaShareListComponent } from './list/list.component';
import { MediaListHeaderComponent } from './list/media-list-header.component';
import { ZMediaShareItemComponent } from './list/item/item.component';

import { PhotoService } from '../../services/photo.service';

import { PartialsPhotoSharingModule } from './modal/sharing/sharing.module';
import { SliderModule } from 'primeng/components/slider/slider';
import { PhotoItemPreviewComponent } from './photo-item-preview.component';
import { PartialsPhotoTaggingModule } from './modal/tagging/tagging.module';
import { BasePhotoDetailComponent } from './detail/base-photo-detail.component';
import { BoxLoadingModule } from '../box-loading/box-loading.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // BrowserAnimationsModule,

    Ng2Bs3ModalModule,
    TagInputModule,
    CalendarModule,
    CheckboxModule,
    TooltipModule,
    SliderModule,
    PipeModule,
    BoxLoadingModule,
    PartialsPhotoSharingModule,
    PartialsPhotoTaggingModule
  ],
  declarations: [
    PhotoDetailPartialComponent,
    ZMediaToolbarComponent,
    ZMediaToolbarPhotoComponent,
    ZMediaToolbarAlbumComponent,
    ZMediaToolbarAlbumDetailComponent,
    BaseObjectEditNameModalComponent,
    PhotoEditModalComponent,
    AddToAlbumModalComponent,
    AlbumEditModalComponent,
    AlbumDeleteModalComponent,
    AlbumCreateModalComponent,
    ZMediaShareListComponent,
    MediaListHeaderComponent,
    ZMediaShareItemComponent,
    PhotoItemPreviewComponent,
    BasePhotoDetailComponent
  ],
  exports: [
    BoxLoadingModule,
    PartialsPhotoSharingModule,
    PartialsPhotoTaggingModule,

    PhotoDetailPartialComponent,
    ZMediaToolbarComponent,
    ZMediaToolbarPhotoComponent,
    ZMediaToolbarAlbumComponent,
    ZMediaToolbarAlbumDetailComponent,
    BaseObjectEditNameModalComponent,
    PhotoEditModalComponent,
    AddToAlbumModalComponent,
    AlbumEditModalComponent,
    AlbumDeleteModalComponent,
    AlbumCreateModalComponent,
    ZMediaShareListComponent,
    MediaListHeaderComponent,
    ZMediaShareItemComponent,
    PhotoItemPreviewComponent,
    BasePhotoDetailComponent
  ],
  providers: [
    PhotoService
  ]
})

export class PartialsPhotoModule {
}
