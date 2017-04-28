import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ForgottenPasswordComponent } from './forgotten-password.component';
import { NewPasswordComponent } from './new-password.component';
import { ResetEmailSentComponent } from './reset-email-sent.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'recovery/forgottenpassword', component: ForgottenPasswordComponent},
      {path: 'recovery/newpassword', component: NewPasswordComponent},
      {path: 'recovery/reset_email_sent', component: ResetEmailSentComponent}
    ])
  ],
  exports: [RouterModule]
})
export class RecoveryRoutingModule {
}
