import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { PlaylistModalComponent } from '@shared/shared/components/photo/modal/playlist/playlist-modal.component';
import { PlaylistCreateModalComponent } from '@shared/shared/components/photo/modal/playlist/playlist-create-modal.component';
import { PartialsPhotoTaggingModule } from '@shared/shared/components/photo/modal/tagging/tagging.module';
import { PlaylistCreateModalService } from '@shared/shared/components/photo/modal/playlist/playlist-create-modal.service';
import { PlaylistModalService } from '@shared/shared/components/photo/modal/playlist/playlist-modal.service';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BsModalModule,
    PartialsPhotoTaggingModule,
    AutoCompleteModule
  ],
  declarations: [PlaylistModalComponent, PlaylistCreateModalComponent],
  exports: [PlaylistModalComponent, PlaylistCreateModalComponent],
  providers: [PlaylistCreateModalService, PlaylistModalService]
})
export class PlaylistModalModule {}
