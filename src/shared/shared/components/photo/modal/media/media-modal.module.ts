import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { PartialsPhotoTaggingModule } from '@shared/shared/components/photo/modal/tagging/tagging.module';
import { MediaAddModalService } from '@shared/shared/components/photo/modal/media/media-add-modal.service';
import { MediaAddModalComponent } from '@shared/shared/components/photo/modal/media/media-add-modal.component';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { MediaCreateModalComponent } from '@shared/shared/components/photo/modal/media/media-create-modal.component';
import { MediaRenameModalComponent } from './media-rename-modal.component';
import { PlaylistModalModule } from '../playlist/playlist-modal.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BsModalModule,
    PartialsPhotoTaggingModule,
    PlaylistModalModule,
    AutoCompleteModule
  ],
  declarations: [
    MediaAddModalComponent,
    MediaCreateModalComponent,
    MediaRenameModalComponent
  ],
  exports: [
    MediaAddModalComponent,
    MediaCreateModalComponent,
    MediaRenameModalComponent
  ],
  providers: [MediaAddModalService, MediaCreateModalService]
})
export class MediaModalModule {}
