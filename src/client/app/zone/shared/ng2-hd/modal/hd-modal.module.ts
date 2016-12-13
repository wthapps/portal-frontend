// this component is pork from https://github.com/dougludlow/ng2-bs3-modal

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HdModalComponent } from './components/modal';
import { ModalHeaderComponent } from './components/modal-header';

import { ModalBodyComponent } from './components/modal-body';
import { ModalFooterComponent } from './components/modal-footer';
import { AutofocusDirective } from './directives/autofocus';


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
    // HdTestingComponent
  ],
  exports: [
    HdModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    AutofocusDirective
    // HdTestingComponent
  ]
})
export class HdModalModule {
}
