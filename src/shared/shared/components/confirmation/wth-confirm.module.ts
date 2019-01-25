import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WthConfirmComponent } from './wth-confirm.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { WthConfirmService } from './wth-confirm.service';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  imports: [
    CommonModule,
    ConfirmDialogModule
  ],
  declarations: [WthConfirmComponent],
  exports: [WthConfirmComponent, ConfirmDialogModule],
  providers: [WthConfirmService, ConfirmationService]
})

export class WthConfirmModule {
}

