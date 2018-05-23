import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactSharedModule } from '../shared/shared.module';
import { BsModalModule } from 'ng2-bs3-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GroupEditModalComponent } from './group-edit-modal.component';
import { GroupService } from './group.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsModalModule,
    ContactSharedModule
  ],
  declarations: [GroupEditModalComponent],
  exports: [GroupEditModalComponent],
  providers: [GroupService]
})
export class GroupModule {}
