import {Component, AfterViewInit} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {HTTP_PROVIDERS, Http} from '@angular/http';
import {
  ROUTER_PROVIDERS,
  ROUTER_DIRECTIVES,
  Routes,
  Router
} from '@angular/router';
import 'rxjs/Rx';   // Load all features
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap';

// Base services
import {AuthHttp, tokenNotExpired} from 'angular2-jwt';
import {ApiBaseService} from './shared/services/apibase.service';
import {UserService} from './shared/services/user.service';

import {DialogService, DialogComponent} from './partials/dialogs/index';

import {HomeComponent} from './home/home.component';
import {ProductListComponent} from './products/product-list.component';
import {ProductDetailComponent} from './products/product-detail.component';
import {ProductService} from './products/product.service';
import {DnsService} from './account/services/dns/dns.service';

import {
  AccountDashboardComponent,
  ForgottenPasswordComponent,
  ResetEmailSentComponent,
  PasswordResetComponent,
  PasswordResetCompleteComponent,
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
} from './account/index';

// Base href
import {WelcomeComponent} from './welcome/welcome.component';
import {AboutComponent} from './about/about.component';
import {SupportComponent} from './support/support.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';


@Component({
  moduleId: module.id,
  selector: 'wth-app',
  templateUrl: 'app.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    DROPDOWN_DIRECTIVES,
    CORE_DIRECTIVES,
    DialogComponent
  ],
  providers: [
    ProductService,
    ApiBaseService,
    UserService,
    DnsService,
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    DialogService
  ]
})

@Routes([
  //{path: '/', component: HomeComponent},

  {path: '/welcome', component: WelcomeComponent},
  {path: '/about_us', component: AboutComponent},
  {path: '/support', component: SupportComponent},

  {path: '/products/:id', component: ProductDetailComponent},
  {path: '/products', component: ProductListComponent},
  {path: '/login', component: LoginComponent},
  {path: '/signup', component: RegisterComponent},
  {path: '/account/recovery/forgottenpassword', component: ForgottenPasswordComponent},
  {path: '/account/reset_email_sent', component: ResetEmailSentComponent},
  {path: '/account/password_reset', component: PasswordResetComponent},
  {path: '/account/password_reset_complete', component: PasswordResetCompleteComponent},

  {path: '/account/dns/add', component: AccountServicesDNSAddComponent},
  {path: '/account/dns/update/:id', component: AccountServicesDNSUpdateComponent},
  {path: '/account/dns', component: AccountServicesDNSComponent},

  {path: '/account/vpn', component: AccountServicesVPNComponent},

  {path: '/account/efax', component: AccountServicesEFaxComponent},

  {path: '/account/services', component: AccountServicesListComponent},

  {path: '/account/plans', component: AccountPlansComponent},
  {path: '/account/billing', component: AccountBillingComponent},
  {path: '/account/payment/confirm', component: PaymentConfirmComponent},
  {path: '/account/payment', component: AccountAddCardComponent},

  {path: '/account/setting/change_password', component: ChangePasswordComponent},
  {path: '/account/setting/profile', component: MyAccountComponent},
  {path: '/account/setting/dashboard', component: AccountDashboardComponent},

  {path: '/', component: HomeComponent}
])

export class AppComponent implements AfterViewInit {
  pageTitle:string = 'Welcome to WTHApps';

  ngAfterViewInit() {
    // Your jQuery code goes here
    //$('.navbar-brand').hide();
  }

  constructor(private _userService:UserService, private _router:Router) {
  }

  logout($event) {
    $event.preventDefault();

    this._userService.logout('users/sign_out')
      .subscribe(
        response => {
          this._router.navigateByUrl('/login');
        },
        error => {
          console.log('logout error:', error);
        }
      );
  }

  currentPath():string {
    return this._router._location.path();
    // return this._router._location.path() === '' ? '/' : this._router._location.path();
  }

  public isLoggedIn() {
    // Check if there's an unexpired JWT
    return this._userService.isLoggedIn();
  }
}
