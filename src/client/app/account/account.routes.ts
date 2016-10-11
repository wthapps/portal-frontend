import { Route }       from '@angular/router';

import {
  ForgottenPasswordComponent,
  NewPasswordComponent,
  ResetEmailSentComponent
}                           from './index';

import {
  CanDeactivateGuard,
  AuthGuard
}                           from '../shared/index';

export const AccountRoutes: Route[] = [
  {path: 'account/recovery/forgottenpassword', component: ForgottenPasswordComponent},
  {path: 'account/recovery/newpassword', component: NewPasswordComponent},
  {path: 'account/recovery/reset_email_sent', component: ResetEmailSentComponent}
];
