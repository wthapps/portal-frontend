// this component is pork from https://github.com/dougludlow/ng2-bs3-modal

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HdModalModule } from './modal/hd-modal.module';
import { HdMultiSelectListModule } from './list/hd-list.module';
// import { UploaderModule } from './components/uploader/uploader.module';
import { HConfirmationService } from './services/confirmation.service';
// import { ChipModule } from './components/chip/chip.module';
import { EditorModule } from './components/editor/editor.component';
// import { ConfirmDialogModule } from './components/confirmdialog/confirmdialog';

@NgModule({
  imports: [
    CommonModule,
    HdModalModule,
    HdMultiSelectListModule,
    // UploaderModule,
    // ChipModule,
    EditorModule
    // ConfirmDialogModule
  ],
  declarations: [],
  exports: [
    HdModalModule,
    HdMultiSelectListModule,
    // UploaderModule,
    // ChipModule,
    EditorModule
    // ConfirmDialogModule
  ],
  providers: [HConfirmationService]
})
export class Ng2HdModule {}
