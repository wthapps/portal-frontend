import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { PartialsPhotoTaggingModule } from '../tagging/tagging.module';
import { PlaylistModalComponent } from './playlist-modal.component';
import { PlaylistCreateModalComponent } from './playlist-create-modal.component';
import { PlaylistCreateModalService } from './playlist-create-modal.service';
import { PlaylistModalService } from './playlist-modal.service';


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
export class PlaylistModalModule { }
