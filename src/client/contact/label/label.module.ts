import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZContactSharedModule } from '../shared/shared.module';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LabelEditModalComponent } from './label-edit-modal.component';
import { LabelService } from './label.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2Bs3ModalModule,
    ZContactSharedModule.forRoot()
  ],
  declarations: [
    LabelEditModalComponent
  ],
  exports: [
    LabelEditModalComponent
  ],
  providers: [
    LabelService
  ]
})
export class ZContactLabelModule {
}
