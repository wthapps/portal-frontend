import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { CalendarModule, CheckboxModule } from 'primeng/primeng';
import { AlbumCreateModalComponent } from '@media/shared/modal/album/album-create-modal.component';
import { AlbumEditModalComponent } from './album/album-edit-modal.component';
import { AlbumDeleteModalComponent } from './album/album-delete-modal.component';
import { PhotoEditModalComponent } from './photo/photo-edit-modal.component';
import { AddToAlbumModalComponent } from './photo/add-to-album-modal.component';
import { MediaRenameModalComponent } from './media/media-rename-modal.component';
import { PartialsPhotoSharingModule } from '@media/shared/modal/sharing/sharing.module';
import { PartialsPhotoTaggingModule } from '@media/shared/modal/tagging/tagging.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CheckboxModule,
    CalendarModule,
    PartialsPhotoTaggingModule,
    BsModalModule,
    PartialsPhotoSharingModule,
    PartialsPhotoTaggingModule,
  ],
  declarations: [
    AlbumCreateModalComponent,
    AlbumDeleteModalComponent,
    AlbumEditModalComponent,
    PhotoEditModalComponent,
    AddToAlbumModalComponent,
    MediaRenameModalComponent
  ],
  exports: [
    AlbumCreateModalComponent,
    AlbumDeleteModalComponent,
    AlbumEditModalComponent,
    PhotoEditModalComponent,
    AddToAlbumModalComponent,
    MediaRenameModalComponent
  ]
})
export class MediaModalModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MediaModalModule,
      providers: [
      ]
    };
  }
}
