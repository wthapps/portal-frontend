import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';

import { AlbumDeleteModalComponent } from './album-delete-modal.component';
import { AlbumCreateModalComponent } from './album-create-modal.component';
import { AlbumEditModalComponent } from './album-edit-modal.component';

import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { CheckboxModule, CalendarModule } from 'primeng/primeng';
import { PartialsPhotoTaggingModule } from '@shared/modules/photo/components/modal/tagging/tagging.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    BsModalModule,
    CheckboxModule,
    CalendarModule,
    PartialsPhotoTaggingModule
  ],
  declarations: [
    AlbumCreateModalComponent,
    AlbumEditModalComponent,
    AlbumDeleteModalComponent
  ],
  exports: [
    BsModalModule,

    AlbumCreateModalComponent,
    AlbumEditModalComponent,
    AlbumDeleteModalComponent
  ]
})
export class AlbumModalModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AlbumModalModule,
      providers: [
      ]
    };
  }
}
