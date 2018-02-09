import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';

import { EditNameModalComponent } from '@wth/shared/components/modal';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsModalModule
  ],
  declarations: [
    EditNameModalComponent
  ],
  exports: [
    EditNameModalComponent
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
