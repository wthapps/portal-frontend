// this component is pork from https://github.com/dougludlow/ng2-bs3-modal

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HdModalModule } from './modal/hd-modal.module';
import { HdMultiSelectListModule } from './multi-select-list/hd-multi-select-list.module';

@NgModule({
  imports: [
    CommonModule,
    HdModalModule,
    HdMultiSelectListModule
  ],
  declarations: [

  ],
  exports: [
    HdModalModule,
    HdMultiSelectListModule
  ]
})
export class Ng2HdModule {
}
