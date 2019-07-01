import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZDriveSharedModalFolderEditComponent } from './folder/edit.component';
import { ZDriveSharedModalFolderMoveComponent } from './folder/move.component';
import { BsModalModule } from 'ng2-bs3-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BsModalModule],
  declarations: [
    ZDriveSharedModalFolderEditComponent,
    ZDriveSharedModalFolderMoveComponent
  ],
  exports: [
    BsModalModule,
    FormsModule,
    ReactiveFormsModule,

    ZDriveSharedModalFolderEditComponent,
    ZDriveSharedModalFolderMoveComponent
  ],
  providers: []
})
export class DriveSharedModalModule {}
