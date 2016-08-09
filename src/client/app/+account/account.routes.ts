import {RouterConfig}       from '@angular/router';

import {
  AccountComponent,
  ForgottenPasswordComponent,
  NewPasswordComponent,
  ResetEmailSentComponent
}                           from './index';

import {
  //AccountDashboardComponent,

  // Settings
  ProfileComponent,
  MyAccountComponent,
  PreferencesComponent,

  // Apps
  AccountAppsComponent,
  AccountAppsListComponent,
  AccountAppsDetailComponent,

  // payment
  PlansComponent,
  PlanDetailsComponent,
  BillingDetailsComponent,
  BillingHistoryComponent,
  PaymentComponent,
  PaymentEditComponent,
  PaymentConfirmComponent,
  ReceiptComponent,
  TransactionDetailsComponent,

  // Services
  AccountServicesListComponent,

  // DNS
  DNSComponent,
  DNSAddComponent,
  DNSUpdateComponent,

  // VPN
  AccountServicesVPNComponent,

  // EFax
  AccountServicesEFaxComponent
} from './index';


import {
  //CanDeactivateGuard,
  AuthGuard
}                           from '../shared/index';

export const AccountRoutes: RouterConfig = [
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard],
    children: [
      {path: 'dns/add', component: DNSAddComponent},
      {path: 'dns/:id', component: DNSUpdateComponent},
      {path: 'dns', component: DNSComponent},

      {path: 'vpn', component: AccountServicesVPNComponent},
      {path: 'efax', component: AccountServicesEFaxComponent},

      {path: 'plans', component: PlansComponent},
      {path: 'plan-details', component: PlanDetailsComponent},
      {path: 'billing-details', component: BillingDetailsComponent},
      {path: 'billing-history', component: BillingHistoryComponent},
      {path: 'transactions/:id/receipt', component: ReceiptComponent},
      {path: 'transactions/:id', component: TransactionDetailsComponent},
      {path: 'payment/confirm', component: PaymentConfirmComponent},
      {path: 'payment/edit', component: PaymentEditComponent},
      {path: 'payment', component: PaymentComponent},

      {path: 'services', component: AccountServicesListComponent},

      // Setting
      {path: 'setting/profile', component: ProfileComponent},
      {path: 'setting/account', component: MyAccountComponent},
      {path: 'setting/preferences', component: PreferencesComponent},
      {path: '', component: ProfileComponent}
    ]
  },
  {
    path: 'account/apps',
    component: AccountAppsComponent,
    canActivate: [AuthGuard],
    children: [
      {path: ':id', component: AccountAppsDetailComponent},
      {path: '', component: AccountAppsListComponent}
    ]
  },
  {path: 'account/recovery/forgottenpassword', component: ForgottenPasswordComponent},
  {path: 'account/recovery/newpassword', component: NewPasswordComponent},
  {path: 'account/recovery/reset_email_sent', component: ResetEmailSentComponent}
];
