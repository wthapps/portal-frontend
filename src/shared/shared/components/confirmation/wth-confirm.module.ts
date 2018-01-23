import { NgModule } from '@angular/core';


import { WthConfirmComponent } from './wth-confirm.component';
import { WthConfirmService } from './wth-confirm.service';
import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    ConfirmDialogModule,
  ],
  declarations: [WthConfirmComponent],
  exports: [WthConfirmComponent],
  providers: []
})

export class WthConfirmModule {
}

