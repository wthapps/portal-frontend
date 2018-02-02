import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { EditNameModalComponent } from '@wth/shared/components/modal';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2Bs3ModalModule
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
