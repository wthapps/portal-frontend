import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { TagInputModule } from 'ng2-tag-input';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';

import { PipeModule } from '../../pipe/pipe.module';

import { PhotoDetailPartialComponent } from './detail/photo-detail-partial.component';
import { TaggingModalComponent } from './modal/tagging/tagging-modal.component';
import { TaggingElComponent } from './modal/tagging/tagging-el.component';
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
import { ZMediaTaggingService } from './modal/tagging/tagging.service';

import { PartialsPhotoSharingModule } from './modal/sharing/sharing.module';
import { SliderModule } from 'primeng/components/slider/slider';
import { PhotoItemPreviewComponent } from './photo-item-preview.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2Bs3ModalModule,
    TagInputModule,
    CalendarModule,
    CheckboxModule,
    SliderModule,
    PipeModule,
    PartialsPhotoSharingModule
  ],
  declarations: [
    PhotoDetailPartialComponent,
    TaggingModalComponent,
    TaggingElComponent,
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
    PhotoItemPreviewComponent
  ],
  exports: [
    PartialsPhotoSharingModule,

    PhotoDetailPartialComponent,
    TaggingModalComponent,
    TaggingElComponent,
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
    PhotoItemPreviewComponent
  ],
  providers: [
    PhotoService,
    ZMediaTaggingService
  ]
})

export class PartialsPhotoModule {
}
