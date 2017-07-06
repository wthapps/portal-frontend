import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { TagInputModule } from 'ng2-tag-input';
import { CheckboxModule, SliderModule, CalendarModule } from 'primeng/primeng';

import { PhotoService } from '../../services/photo.service';
import { PipeModule } from '../../pipe/pipe.module';

import {
  PartialsPhotoSharingModule,
  TaggingModalComponent,
  TaggingElComponent,
  ZMediaTaggingService,
  AddToAlbumModalComponent,
  AlbumEditModalComponent,
  AlbumCreateModalComponent,
  AlbumDeleteModalComponent,
  PhotoEditModalComponent,
  BaseObjectEditNameModalComponent,
  PhotoDetailPartialComponent,

  ZMediaToolbarComponent,
  ZMediaToolbarPhotoComponent,
  ZMediaToolbarAlbumComponent,
  ZMediaToolbarAlbumDetailComponent,

  ZMediaShareListComponent,
  MediaListHeaderComponent,
  ZMediaShareItemComponent
} from './index';

@NgModule({
  imports: [
    CommonModule,
    Ng2Bs3ModalModule,
    PartialsPhotoSharingModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    CalendarModule,
    RouterModule,
    CheckboxModule,
    SliderModule,
    PipeModule
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
    ZMediaShareItemComponent
  ],
  exports: [
    PartialsPhotoSharingModule,
    PhotoDetailPartialComponent,
    TaggingModalComponent,
    ZMediaToolbarComponent,
    ZMediaToolbarPhotoComponent,
    ZMediaToolbarAlbumComponent,
    ZMediaToolbarAlbumDetailComponent,
    BaseObjectEditNameModalComponent,
    PhotoEditModalComponent,
    AddToAlbumModalComponent,
    AlbumEditModalComponent,
    AlbumCreateModalComponent,
    AlbumDeleteModalComponent,
    TaggingElComponent,
    ZMediaShareListComponent,
    MediaListHeaderComponent,
    ZMediaShareItemComponent
  ],
  providers: [
    PhotoService,
    ZMediaTaggingService
  ]
})

export class PartialsPhotoModule {
}
