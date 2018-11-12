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

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BsModalModule,
    PartialsPhotoTaggingModule,
    AutoCompleteModule
  ],
  declarations: [MediaAddModalComponent, MediaCreateModalComponent],
  exports: [MediaAddModalComponent, MediaCreateModalComponent],
  providers: [MediaAddModalService, MediaCreateModalService]
})
export class MediaModalModule {}
