import { NgModule } from '@angular/core';
import { PhotoEditComponent } from './edit/edit-photo.component';
import { PhotoService } from '../../services/photo.service';
import { CommonModule } from '@angular/common';
import { PipeModule } from '../../pipe/pipe.module';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { PartialsPhotoSharingModule } from './modal/sharing/sharing.module';
import { TaggingModalComponent } from './modal/tagging/tagging-modal.component';
import { TaggingElComponent } from './modal/tagging/tagging-el.component';
import { ZMediaTaggingService } from './modal/tagging/tagging.service';
import { TagInputModule } from 'ng2-tag-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhotoDetailModalComponent } from './modal/photo-detail-partial.component';
import { ZMediaToolbarComponent } from './toolbar/toolbar.component';
import { ZMediaToolbarPhotoComponent } from './toolbar/photo/photo.component';
import { ZMediaToolbarAlbumComponent } from './toolbar/album/album.component';
import { ZMediaToolbarAlbumDetailComponent } from './toolbar/album/album-detail.component';
import { BaseObjectEditNameModalComponent } from './modal/base-object-edit-name-modal.component';
import { AddToAlbumModalComponent } from './modal/add-to-album-modal.component';
import { AlbumEditModalComponent } from './modal/album-edit-modal.component'
import { AlbumCreateModalComponent } from './modal/album-create-modal.component';
import { AlbumDeleteModalComponent } from './modal/album-delete-modal.component';
import { PhotoEditModalComponent } from './modal/photo-edit-modal.component';
import { CalendarModule } from 'primeng/primeng';
import { RouterModule } from '@angular/router';
import { ZMediaShareListComponent } from './list/list.component';
import { CheckboxModule } from 'primeng/primeng';
import { MediaListHeaderComponent } from './list/media-list-header.component';
import { ZMediaShareItemComponent } from './list/item/item.component';
import { SliderModule } from 'primeng/primeng';


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
    PhotoEditComponent,
    PhotoDetailModalComponent,
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
    PhotoDetailModalComponent,
    PhotoEditComponent,
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
