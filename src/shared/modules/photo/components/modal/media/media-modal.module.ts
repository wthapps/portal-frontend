import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { MediaRenameModalComponent } from './media-rename-modal.component';
import { PlaylistModalModule } from '../playlist/playlist-modal.module';
import { PartialsPhotoTaggingModule } from '../tagging/tagging.module';
import { MediaAddModalComponent } from './media-add-modal.component';
import { MediaCreateModalComponent } from './media-create-modal.component';
import { MediaAddModalService } from './media-add-modal.service';
import { MediaCreateModalService } from './media-create-modal.service';

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
export class MediaModalModule { }
