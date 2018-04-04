import { NgModule } from '@angular/core';

import { RecoveryRoutingModule } from './recovery-routing.module';
import { ForgottenPasswordComponent } from './forgotten-password.component';
import { NewPasswordComponent } from './new-password.component';
import { ResetEmailSentComponent } from './reset-email-sent.component';
import { PortalSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [RecoveryRoutingModule, PortalSharedModule],
  declarations: [
    ForgottenPasswordComponent,
    NewPasswordComponent,
    ResetEmailSentComponent
  ],
  exports: [
    ForgottenPasswordComponent,
    NewPasswordComponent,
    ResetEmailSentComponent
  ]
})
export class RecoveryModule {}
