import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { AlbumDeleteModalComponent } from '@media/shared/modal/album-delete-modal.component';
import { CheckboxModule } from 'primeng/primeng';
import { AlbumCreateModalComponent } from '@media/shared/modal/album-create-modal.component';
import { PartialsPhotoTaggingModule } from '@wth/shared/shared/components/photo/modal/tagging/tagging.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    PartialsPhotoTaggingModule,
    BsModalModule
  ],
  declarations: [
    AlbumCreateModalComponent,
    AlbumDeleteModalComponent
  ],
  exports: [
    AlbumCreateModalComponent,
    AlbumDeleteModalComponent
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
