import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { CheckboxModule, TooltipModule } from 'primeng/primeng';

import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { SharedCardPageComponent } from './shared-card-page.component';
import { SharedCardPageRoutingModule } from './shared-card-page-routing';
import { CardModule, CardService } from '@contacts/shared/card';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    BsModalModule,
    CheckboxModule,
    TooltipModule,
    PipeModule,

    CardModule,
    SharedCardPageRoutingModule,
  ],
  declarations: [
    SharedCardPageComponent,
  ],
  exports: [
    SharedCardPageComponent,
  ],
  providers: [
    CardService
  ]
})
export class SharedCardPageModule {
}
