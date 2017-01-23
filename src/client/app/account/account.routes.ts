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
  // PaymentEditComponent,
  PaymentComponent,
  PlansComponent,
  BillingDetailsComponent,
  BillingHistoryComponent,
  ReceiptComponent,
  TransactionDetailsComponent
} from './index';

import {
  AccountComponent,
  ProfileComponent,
  MyAccountComponent,
  PreferencesComponent
} from './index';



import {
  CanDeactivateGuard,
  AuthGuard
} from '../shared/index';

export const AccountRoutes: Route[] = [
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard],
    children: [

      {path: 'billing-details', component: BillingDetailsComponent},
      {path: 'billing-history', component: BillingHistoryComponent},
      {path: 'transactions/:id/receipt', component: ReceiptComponent},
      {path: 'transactions/:id', component: TransactionDetailsComponent},
      // {path: 'services', component: AccountServicesListComponent},

      // Setting
      {
        path: 'setting/profile', component: ProfileComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'setting/account', component: MyAccountComponent,
        canDeactivate: [CanDeactivateGuard]
      },

      {
        path: 'setting/preferences', component: PreferencesComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {path: '', component: ProfileComponent}
    ]
  },

  {
    path: 'account/apps',
    component: AccountAppsComponent,
    canActivate: [AuthGuard],
    children: [
      {path: ':id', component: AccountAppsDetailComponent},
      {path: '', component: AccountAppsListComponent},
      {path: '**', component: AccountAppsListComponent}
    ]
  },
  {
    path: 'account/my-apps',
    component: AccountAppsComponent,
    canActivate: [AuthGuard],
    children: [
      {path: ':id/add', component: MyAppsDetailAddComponent},
      {path: ':id/edit/:id_dns', component: MyAppsDetailAddComponent},
      {path: ':id', component: MyAppsDetailComponent},
      {path: '', component: MyAppsListComponent},
      {path: '**', component: MyAppsListComponent}
    ]
  },

  {path: 'account/payment/confirm', component: PaymentConfirmComponent},
  // {path: 'account/payment/edit', component: PaymentEditComponent},
  {path: 'account/payment', component: PaymentComponent},
  {path: 'account/plans', component: PlansComponent},

  {path: 'account/recovery/forgottenpassword', component: ForgottenPasswordComponent},
  {path: 'account/recovery/newpassword', component: NewPasswordComponent},
  {path: 'account/recovery/reset_email_sent', component: ResetEmailSentComponent}
];
