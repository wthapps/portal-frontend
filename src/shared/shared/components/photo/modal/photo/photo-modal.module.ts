import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { PartialsPhotoTaggingModule } from '@shared/shared/components/photo/modal/tagging/tagging.module';
import { PhotoEditModalComponent } from './photo-edit-modal.component';
import { AddToAlbumModalComponent } from './add-to-album-modal.component';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BsModalModule,
    PartialsPhotoTaggingModule,
    AutoCompleteModule,
    CalendarModule
  ],
  declarations: [AddToAlbumModalComponent, PhotoEditModalComponent],
  exports: [AddToAlbumModalComponent, PhotoEditModalComponent],
  providers: []
})
export class PhotoModalModule {}
