import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { ZSharedReportComponent } from './report.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2Bs3ModalModule
  ],
  declarations: [
    ZSharedReportComponent
  ],
  exports: [
    ZSharedReportComponent
  ],
  providers: []
})

export class ZSharedReportModule {
}
