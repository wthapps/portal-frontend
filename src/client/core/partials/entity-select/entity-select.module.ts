import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EntitySelectComponent } from './entity-select.component';
import { HdModalModule } from '../../shared/ng2-hd/modal/hd-modal.module';
import { HdMultiSelectListModule } from '../../shared/ng2-hd/list/hd-list.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HdModalModule,
    HdMultiSelectListModule
  ],
  declarations: [EntitySelectComponent],
  exports: [EntitySelectComponent],
  providers: []
})

export class EntitySelectModule {
}
