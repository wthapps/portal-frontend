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

import {
  APP_SHARED_PROVIDERS,
  DialogComponent,
  TopMessageComponent,
  LoadingComponent,
  UserService
} from './shared/index';

import {HomeComponent} from './home/home.component';
import {ProductListComponent} from './products/product-list.component';
import {ProductDetailComponent} from './products/product-detail.component';
import {ProductService} from './products/product.service';
import {DnsService} from './account/services/dns/dns.service';
import {ContactService} from './contact/contact.service';

import {
  ForgottenPasswordComponent,
  NewPasswordComponent,
  ResetEmailSentComponent,
  PasswordResetComponent,
  PasswordResetCompleteComponent
} from './account/index';

// Base href
import {WelcomeComponent} from './welcome/welcome.component';
import {ContactComponent} from './contact/contact.component';
import {AboutComponent} from './about/about.component';
import {SupportComponent} from './support/support.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AccountComponent} from './account/account.component';


@Component({
  moduleId: module.id,
  selector: 'wth-app',
  templateUrl: 'app.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    DROPDOWN_DIRECTIVES,
    CORE_DIRECTIVES,
    DialogComponent,
    TopMessageComponent,
    LoadingComponent
  ],
  providers: [
    ProductService,
    DnsService,
    ContactService,
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    APP_SHARED_PROVIDERS,
    UserService
  ]
})

@Routes([
  //{path: '/', component: HomeComponent},

  {path: '/about', component: AboutComponent},
  {path: '/support', component: SupportComponent},
  {path: '/contact', component: ContactComponent},
  {path: '/welcome', component: WelcomeComponent},

  {path: '/products/:id', component: ProductDetailComponent},
  {path: '/products', component: ProductListComponent},
  {path: '/login', component: LoginComponent},
  {path: '/signup', component: RegisterComponent},
  {path: '/account/recovery/forgottenpassword', component: ForgottenPasswordComponent},
  {path: '/account/recovery/newpassword', component: NewPasswordComponent},
  {path: '/account/reset_email_sent', component: ResetEmailSentComponent},
  {path: '/account/password_reset', component: PasswordResetComponent},
  {path: '/account/password_reset_complete', component: PasswordResetCompleteComponent},

  {path: '/account', component: AccountComponent},

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
    return this._userService.loggedIn;
  }
}
