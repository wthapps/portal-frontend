import {RouterConfig}       from '@angular/router';

import {
  //AccountComponent,
  ForgottenPasswordComponent,
  NewPasswordComponent,
  ResetEmailSentComponent
}                           from './index';

import {
  CanDeactivateGuard,
  AuthGuard
}                           from '../shared/index';

export const AccountRoutes:RouterConfig = [
  /*{
    path: 'account',
    component: AccountComponent,
    children: [
      {path: 'dns/add',               component: AccountServicesDNSAddComponent
        //,    canActivate: [AuthGuard]
      },
      {path: 'dns/:id',               component: AccountServicesDNSUpdateComponent},
      {path: 'dns',                   component: AccountServicesDNSComponent
        //,       canActivate: [AuthGuard]
      },

      {path: 'vpn',                   component: AccountServicesVPNComponent},

      {path: 'efax',                  component: AccountServicesEFaxComponent},

      {path: 'services',              component: AccountServicesListComponent},
      {path: 'apps/add-ons',          component: AddOnsComponent},

      {path: 'plans',                 component: PlansComponent},
      {path: 'plan-details',          component: PlanDetailsComponent},
      {path: 'billing-details',       component: BillingDetailsComponent},
      {path: 'billing-history',       component: BillingHistoryComponent},
      {path: 'payment/confirm',       component: PaymentConfirmComponent},
      {path: 'payment',               component: PaymentComponent},

      {path: 'setting/changepassword',component: ChangePasswordComponent},
      {path: 'setting/profile',       component: MyAccountComponent},
      {path: 'setting/dashboard',     component: AccountDashboardComponent}
    ]
  },*/
  {path: 'account/recovery/forgottenpassword', component: ForgottenPasswordComponent,
    canActivate: [AuthGuard]
  },
  {path: 'account/recovery/newpassword',       component: NewPasswordComponent},
  {path: 'account/recovery/reset_email_sent',  component: ResetEmailSentComponent}
];
