import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PartialsModule } from '../../core/partials/partials.module';
import { RecoveryRoutingModule } from './recovery-routing.module';
import { ForgottenPasswordComponent } from './forgotten-password.component';
import { NewPasswordComponent } from './new-password.component';
import { ResetEmailSentComponent } from './reset-email-sent.component';

@NgModule({
  imports: [
    CommonModule,
    RecoveryRoutingModule,
    PartialsModule,
    ReactiveFormsModule
  ],
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

export class RecoveryModule {
}
