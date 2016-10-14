import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

import { DialogComponent } from './dialog.component';
import { DialogService } from './dialog.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ConfirmDialogModule
  ],
  declarations: [DialogComponent],
  exports: [DialogComponent],
  providers: [
    DialogService,
    ConfirmationService
  ]
})

export class DialogModule {
}
