import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelEditModalComponent } from './label-edit-modal.component';
import { ZContactSharedModule } from '../shared/shared.module';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

  ]
})
export class ZContactLabelModule {
}
