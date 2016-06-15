import {Component}            from '@angular/core';
import {
  ROUTER_PROVIDERS,
  ROUTER_DIRECTIVES,
  Routes,
  Router
} from '@angular/router';
import {AccountMenuComponent}    from './menu/account-menu.component';

import {
  AccountDashboardComponent,
  MyAccountComponent,
  ChangePasswordComponent,

  // payment
  AccountPlansComponent,
  AccountBillingComponent,
  AccountAddCardComponent,
  PaymentConfirmComponent,

  // Services
  AccountServicesListComponent,
  // DNS
  AccountServicesDNSComponent,
  AccountServicesDNSAddComponent,
  AccountServicesDNSUpdateComponent,
  // VPN
  AccountServicesVPNComponent,
  // EFax
  AccountServicesEFaxComponent
} from './index';

@Routes([
  {path: '/dns/add', component: AccountServicesDNSAddComponent},
  {path: '/dns/:id', component: AccountServicesDNSUpdateComponent},
  {path: '/dns', component: AccountServicesDNSComponent},

  {path: '/vpn', component: AccountServicesVPNComponent},

  {path: '/efax', component: AccountServicesEFaxComponent},

  {path: '/services', component: AccountServicesListComponent},

  {path: '/plans', component: AccountPlansComponent},
  {path: '/billing', component: AccountBillingComponent},
  {path: '/payment/confirm', component: PaymentConfirmComponent},
  {path: '/payment', component: AccountAddCardComponent},

  {path: '/setting/changepassword', component: ChangePasswordComponent},
  {path: '/setting/profile', component: MyAccountComponent},
  {path: '/setting/dashboard', component: AccountDashboardComponent},
  {path: '/', component: AccountDashboardComponent}
])
@Component({
  moduleId: module.id,
  templateUrl: 'account.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    AccountMenuComponent
  ]
})
export class AccountComponent {
  pageTitle:string = 'Account setting';
}
