import {RouterConfig}       from '@angular/router';

import {
  AccountComponent,
  ForgottenPasswordComponent,
  NewPasswordComponent,
  ResetEmailSentComponent
}                           from './index';

import {
  AccountDashboardComponent,
  MyAccountComponent,
  ChangePasswordComponent,

  // payment
  /*PlansComponent,
  PlanDetailsComponent,
  BillingDetailsComponent,
  BillingHistoryComponent,
  PaymentComponent,
  PaymentEditComponent,
  PaymentConfirmComponent,
  ReceiptComponent,
  TransactionDetailsComponent,*/

  // Services
  AccountServicesListComponent,
  //ServicesService,

  // DNS
  /*AccountServicesDNSComponent,
  AccountServicesDNSAddComponent,
  AccountServicesDNSUpdateComponent,
  DnsService,*/

  // VPN
  /*AccountServicesVPNComponent,*/

  // EFax
  /*AccountServicesEFaxComponent,
  AddOnsComponent*/
} from './index';


import {
  //CanDeactivateGuard,
  AuthGuard
}                           from '../shared/index';

export const AccountRoutes:RouterConfig = [
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard],
    children: [
      /*{
        path: 'dns/add', component: AccountServicesDNSAddComponent
        //, canActivate: [AuthGuard]
      },
      {path: 'dns/:id', component: AccountServicesDNSUpdateComponent},
      {
        path: 'dns',
        component: AccountServicesDNSComponent
        //, canActivate: [AuthGuard]
      },

      {path: 'vpn', component: AccountServicesVPNComponent},

      {path: 'efax', component: AccountServicesEFaxComponent},

      {path: 'apps/add-ons', component: AddOnsComponent},

      {path: 'plans', component: PlansComponent},
      {path: 'plan-details', component: PlanDetailsComponent},
      {path: 'billing-details', component: BillingDetailsComponent},
      {path: 'billing-history', component: BillingHistoryComponent},
      {path: 'transactions/:id/receipt', component: ReceiptComponent},
      {path: 'transactions/:id', component: TransactionDetailsComponent},
      {path: 'payment/confirm', component: PaymentConfirmComponent},
      {path: 'payment/edit', component: PaymentEditComponent},
      {path: 'payment', component: PaymentComponent},*/

      {path: 'services', component: AccountServicesListComponent},
      {path: 'setting/changepassword', component: ChangePasswordComponent},
      {path: 'setting/profile', component: MyAccountComponent},
      {path: 'setting/dashboard', component: AccountDashboardComponent},
      {path: '', component: AccountDashboardComponent}
    ]
  },
  {path: 'account/recovery/forgottenpassword', component: ForgottenPasswordComponent},
  {path: 'account/recovery/newpassword',       component: NewPasswordComponent},
  {path: 'account/recovery/reset_email_sent',  component: ResetEmailSentComponent}
];
