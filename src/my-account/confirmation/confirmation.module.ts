import { NgModule } from '@angular/core';

import { ConfirmationComponent } from './confirmation.component';
import { ConfirmationRoutingModule } from './confirmation-routing.module';

@NgModule({
  imports: [ConfirmationRoutingModule],
  declarations: [ConfirmationComponent],
  exports: [ConfirmationComponent]
})
export class ConfirmationModule {}
