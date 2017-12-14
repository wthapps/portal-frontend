import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactSharedModule } from '../shared/shared.module';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GroupEditModalComponent } from './group-edit-modal.component';
import { GroupService } from './group.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2Bs3ModalModule,
    ContactSharedModule
  ],
  declarations: [
    GroupEditModalComponent
  ],
  exports: [
    GroupEditModalComponent
  ],
  providers: [
    GroupService
  ]
})
export class GroupModule {
}
