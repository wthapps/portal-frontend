import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';

import { EditNameModalComponent } from '@wth/shared/components/modal';
import { LockUploadModalComponent } from "@shared/components/modal/lock-upload-modal.component";
import { PipeModule } from "@shared/shared/pipe/pipe.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    BsModalModule
  ],
  declarations: [
    EditNameModalComponent,
    LockUploadModalComponent
  ],
  exports: [
    EditNameModalComponent,
    LockUploadModalComponent
  ]
})
export class ModalModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ModalModule,
      providers: [
      ]
    };
  }
}
