// this component is pork from https://github.com/dougludlow/ng2-bs3-modal

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HdModalComponent } from './components/modal';
import { HdModalHeaderComponent } from './components/modal-header';

import { HdModalBodyComponent } from './components/modal-body';
import { HdModalFooterComponent } from './components/modal-footer';
import { AutofocusDirective } from './directives/autofocus';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  imports: [
    CommonModule,
    // BrowserModule
  ],
  declarations: [
    HdModalComponent,
    HdModalHeaderComponent,
    HdModalBodyComponent,
    HdModalFooterComponent,
    AutofocusDirective
    // HdTestingComponent
  ],
  exports: [
    HdModalComponent,
    HdModalHeaderComponent,
    HdModalBodyComponent,
    HdModalFooterComponent,
    AutofocusDirective
    // HdTestingComponent
  ]
})
export class HdModalModule {
}
