import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZNoteSettingsModalComponent } from './settings.component';
import { DropdownModule } from 'primeng/primeng';
import { BsModalModule } from 'ng2-bs3-modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsModalModule,
    DropdownModule
  ],
  exports: [BsModalModule, DropdownModule, ZNoteSettingsModalComponent],
  declarations: [ZNoteSettingsModalComponent]
})
export class ZNoteSharedSettingModule {}
