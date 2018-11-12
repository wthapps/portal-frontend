import { NgModule } from '@angular/core';

import { ConfirmationComponent } from './confirmation.component';
import { ConfirmationRoutingModule } from './confirmation-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    ConfirmationRoutingModule,
    CommonModule
  ],
  declarations: [ConfirmationComponent],
  exports: [ConfirmationComponent]
})
export class ConfirmationModule {}
