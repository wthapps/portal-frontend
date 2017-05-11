import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EntitySelectComponent } from './entity-select.component';
import { HdModalModule } from '../../shared/ng2-hd/modal/hd-modal.module';
import { HdMultiSelectListModule } from '../../shared/ng2-hd/list/hd-list.module';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    Ng2Bs3ModalModule,
    // HdModalModule,
    HdMultiSelectListModule
  ],
  declarations: [EntitySelectComponent],
  exports: [EntitySelectComponent],
  providers: []
})

export class EntitySelectModule {
}
