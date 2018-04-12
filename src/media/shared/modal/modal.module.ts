import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { CalendarModule, CheckboxModule } from 'primeng/primeng';
import { AlbumCreateModalComponent } from './album/album-create-modal.component';
import { AlbumEditModalComponent } from './album/album-edit-modal.component';
import { AlbumDeleteModalComponent } from './album/album-delete-modal.component';
import { PartialsPhotoTaggingModule } from '@wth/shared/shared/components/photo/modal/tagging/tagging.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CheckboxModule,
    CalendarModule,
    BsModalModule,
    PartialsPhotoTaggingModule
  ],
  declarations: [
    AlbumCreateModalComponent,
    AlbumDeleteModalComponent,
    AlbumEditModalComponent,
  ],
  exports: [
    AlbumCreateModalComponent,
    AlbumDeleteModalComponent,
    AlbumEditModalComponent,
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
