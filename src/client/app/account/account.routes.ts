import { Route } from '@angular/router';

import {
  ForgottenPasswordComponent,
  NewPasswordComponent,
  ResetEmailSentComponent
} from './index';

import {
  AccountAppsComponent,
  AccountAppsListComponent,
  AccountAppsDetailComponent
} from './index';

import {
  MyAppsDetailAddComponent,
  MyAppsDetailComponent,
  MyAppsListComponent
} from './index';

import {
  PaymentConfirmComponent,
  PaymentEditComponent,
  PaymentComponent,
  PlansComponent
} from './index';

import {
  CanDeactivateGuard,
  AuthGuard
} from '../shared/index';

export const AccountRoutes: Route[] = [

  {
    path: 'account/apps',
    component: AccountAppsComponent,
    //2 canActivate: [AuthGuard],
    children: [
      {path: ':id', component: AccountAppsDetailComponent},
      {path: '', component: AccountAppsListComponent},
      {path: '**', component: AccountAppsListComponent}
    ]
  },
  {
    path: 'account/my-apps',
    component: AccountAppsComponent,
    //2 canActivate: [AuthGuard],
    children: [
      {path: ':id/add', component: MyAppsDetailAddComponent},
      {path: ':id/edit/:id_dns', component: MyAppsDetailAddComponent},
      {path: ':id', component: MyAppsDetailComponent},
      {path: '', component: MyAppsListComponent},
      {path: '**', component: MyAppsListComponent}
    ]
  },

  //{path: 'account/payment/confirm', component: PaymentConfirmComponent},
  //{path: 'account/payment/edit', component: PaymentEditComponent},
  {path: 'account/payment', component: PaymentComponent},
  {path: 'account/plans', component: PlansComponent},

  {path: 'account/recovery/forgottenpassword', component: ForgottenPasswordComponent},
  {path: 'account/recovery/newpassword', component: NewPasswordComponent},
  {path: 'account/recovery/reset_email_sent', component: ResetEmailSentComponent}
];
