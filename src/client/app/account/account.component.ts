import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Routes,
  Router
} from '@angular/router';

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
  PaymentEditComponent,
  PaymentConfirmComponent,
  ReceiptComponent,
  TransactionDetailsComponent,

  // Services
  AccountServicesListComponent,
  ServicesService,

  // DNS
  AccountServicesDNSComponent,
  AccountServicesDNSAddComponent,
  AccountServicesDNSUpdateComponent,
  DnsService,

  // VPN
  AccountServicesVPNComponent,

  // EFax
  AccountServicesEFaxComponent,
  AddOnsComponent
} from './index';

import {
  UserService,
  CONFIG
  //, AuthGuard
} from '../shared/index';
import {
  ContentPresenter
} from './services/content-presenter.component';
import {
  AccountMenuViewModel
} from './menu/account-menu.viewmodel';
import {
  StreamEmitter
} from '../shared/index';


@Routes([
  {path: '/dns/add', component: AccountServicesDNSAddComponent
    //, canActivate: [AuthGuard]
  },
  {path: '/dns/:id', component: AccountServicesDNSUpdateComponent},
  {
    path: '/dns',
    component: AccountServicesDNSComponent
    //, canActivate: [AuthGuard]
  },

  {path: '/vpn', component: AccountServicesVPNComponent},

  {path: '/efax', component: AccountServicesEFaxComponent},

  {path: '/services', component: AccountServicesListComponent},
  {path: '/apps/add-ons', component: AddOnsComponent},

  {path: '/plans', component: PlansComponent},
  {path: '/plan-details', component: PlanDetailsComponent},
  {path: '/billing-details', component: BillingDetailsComponent},
  {path: '/billing-history', component: BillingHistoryComponent},
  {path: '/transactions/:id/receipt', component: ReceiptComponent},
  {path: '/transactions/:id', component: TransactionDetailsComponent},
  {path: '/payment/confirm', component: PaymentConfirmComponent},
  {path: '/payment/edit', component: PaymentEditComponent},
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
    ContentPresenter
  ],
  providers: [
    StreamEmitter,
    DnsService,
    ServicesService
  ]
})
export class AccountComponent implements OnInit, OnDestroy {
  public pageTitle:string = 'Account setting';
  public menu:AccountMenuViewModel = null;
  constructor(
    private _userService:UserService,
    private _router:Router,
    private _streamEmitter:StreamEmitter
  ) {}
  ngOnInit() : void {
    this.load();
  }
  ngOnDestroy() {
    this.unload();
  }
  private validateLogin() : boolean {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
      return false;
    }
    return true;
  }
  private load() : void {
    if (this.validateLogin()) {
      if (this.menu === null) {
        this.menu = new AccountMenuViewModel(this._streamEmitter);
      }
      this.menu.load();
    }
  }
  private unload() : void {
    if (this.menu !== null) {
      this.menu.unload();
    }
  }
}
