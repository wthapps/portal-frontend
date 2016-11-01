// this component is pork from https://github.com/dougludlow/ng2-bs3-modal

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HdModalComponent } from './components/modal';
import { ModalHeaderComponent } from './components/modal-header';
import { ModalBodyComponent } from './components/modal-body';
import { ModalFooterComponent } from './components/modal-footer';
import { AutofocusDirective } from './directives/autofocus';

export * from './components/modal';
export * from './components/modal-header';
export * from './components/modal-body';
export * from './components/modal-footer';
export * from './components/modal-instance';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HdModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    AutofocusDirective
  ],
  exports: [
    HdModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    AutofocusDirective
  ]
})
export class HdModalModule {
}
