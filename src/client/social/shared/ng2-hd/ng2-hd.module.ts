// this component is pork from https://github.com/dougludlow/ng2-bs3-modal

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HdModalModule } from './modal/hd-modal.module';
import { HdMultiSelectListModule } from './list/hd-list.module';
import { HdTagInputModule } from './tag-input/tag-input.module';


@NgModule({
  imports: [
    CommonModule,
    HdModalModule,
    HdMultiSelectListModule,
    HdTagInputModule
  ],
  declarations: [],
  exports: [
    HdModalModule,
    HdMultiSelectListModule,
    HdTagInputModule
  ]
})
export class Ng2HdModule {
}
