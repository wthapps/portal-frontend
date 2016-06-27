import {Component}            from '@angular/core';
import {
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
  PlansComponent,
  PlanDetailsComponent,
  BillingDetailsComponent,
  BillingHistoryComponent,
  PaymentComponent,
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
  AccountServicesEFaxComponent,
  AddOnsComponent
} from './index';

import {UserService, CONFIG, AuthGuard} from '../shared/index';

@Routes([
  {path: '/dns/add', component: AccountServicesDNSAddComponent,
    canActivate: [AuthGuard]
  },
  {path: '/dns/:id', component: AccountServicesDNSUpdateComponent},
  {
    path: '/dns', 
    component: AccountServicesDNSComponent,
    canActivate: [AuthGuard]
  },

  {path: '/vpn', component: AccountServicesVPNComponent},

  {path: '/efax', component: AccountServicesEFaxComponent},

  {path: '/services', component: AccountServicesListComponent},
  {path: '/apps/add-ons', component: AddOnsComponent},

  {path: '/plans', component: PlansComponent},
  {path: '/plan-details', component: PlanDetailsComponent},
  {path: '/billing-details', component: BillingDetailsComponent},
  {path: '/billing-history', component: BillingHistoryComponent},
  {path: '/payment/confirm', component: PaymentConfirmComponent},
  {path: '/payment', component: PaymentComponent},

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

  constructor(private _userService:UserService,
              private _router:Router) {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }
  }
}
