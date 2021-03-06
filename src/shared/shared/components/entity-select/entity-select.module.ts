import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EntitySelectComponent } from './entity-select.component';
import { BsModalModule } from 'ng2-bs3-modal';
import { HdMultiSelectListModule } from '../../ng2-hd/list/hd-list.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BsModalModule,
    HdMultiSelectListModule
  ],
  declarations: [EntitySelectComponent],
  exports: [EntitySelectComponent],
  providers: []
})

export class EntitySelectModule {
}
