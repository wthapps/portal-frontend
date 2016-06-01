import {Component, AfterViewInit} from '@angular/core';
import {HTTP_PROVIDERS, Http} from '@angular/http';
import {
    ROUTER_PROVIDERS, 
    ROUTER_DIRECTIVES, 
    Routes, 
    Router
} from '@angular/router';
import 'rxjs/Rx';   // Load all features

// Base services
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import {ApiBaseService} from './shared/services/apibase.service';
import {UserService} from './shared/services/user.service';


import {HomeComponent} from './home/home.component';
import {ProductListComponent} from './products/product-list.component';
import {ProductDetailComponent} from './products/product-detail.component';
import {ProductService} from './products/product.service';

import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';

import {ForgotPasswordComponent} from './account/forgot-password.component';
import {ResetEmailSentComponent} from './account/reset-email-sent.component';
import {PasswordResetComponent} from './account/password-reset.component';
import {PasswordResetCompleteComponent} from './account/password-reset-complete.component';

// Account
import {AccountServicesListComponent} from './account/services/services-list.component';
import {MyAccountComponent} from './account/setting/my-account.component';
import {ChangePasswordComponent} from './account/setting/change-password.component';
import {AccountDashboardComponent} from './account/dashboard.component';

// Account Services
import {AccountServicesDNSComponent} from './account/services/dns/dns.component';
import {AccountServicesDNSAddComponent} from './account/services/dns/dns-add.component';
import {AccountServicesDNSUpdateComponent} from './account/services/dns/dns-update.component';

import {AccountServicesVPNComponent} from './account/services/vpn/vpn.component';

import {AccountServicesEFaxComponent} from './account/services/efax/efax.component';

// Account Payment
import {AccountPlansComponent, AccountBillingComponent, AccountAddCardComponent} from './account/payment/index';

// Services
import {ServicesComponent} from './services/services.component';
import {ApplicationsComponent} from './apps/apps.component';
import {SupportComponent} from './support/support.component';
import {LoginComponent} from './login/login.component';


@Component({
    selector: 'wth-app',
    templateUrl: 'app/app.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ],
    providers: [
        ProductService,  
        ApiBaseService,  
        UserService,    
        HTTP_PROVIDERS,
        ROUTER_PROVIDERS
    ]
})

@Routes([
    {path: '/', component: HomeComponent},

    {path: '/services', component: ServicesComponent},
    {path: '/apps', component: ApplicationsComponent},
    {path: '/support', component: SupportComponent},

    {path: '/products/:id', component: ProductDetailComponent},
    {path: '/products', component: ProductListComponent},
    {path: '/login', component: LoginComponent},
    {path: '/signup', component: RegisterComponent},
    {path: '/account/forgot_password', component: ForgotPasswordComponent},
    {path: '/account/reset_email_sent', component: ResetEmailSentComponent},
    {path: '/account/password_reset', component: PasswordResetComponent},
    {path: '/account/password_reset_complete', component: PasswordResetCompleteComponent},

    {path: '/account/change_password', component: ChangePasswordComponent},
    {path: '/account/setting', component: MyAccountComponent},

    {path: '/account/dns/add', component: AccountServicesDNSAddComponent},
    {path: '/account/dns/update', component: AccountServicesDNSUpdateComponent},
    {path: '/account/dns', component: AccountServicesDNSComponent},

    {path: '/account/vpn', component: AccountServicesVPNComponent},
        
    {path: '/account/efax', component: AccountServicesEFaxComponent},

    {path: '/account/services', component: AccountServicesListComponent},

    {path: '/account/plans', component: AccountPlansComponent},
    {path: '/account/billing', component: AccountBillingComponent},
    {path: '/account/add_card', component: AccountAddCardComponent},

    {path: '/account', component: AccountDashboardComponent}


])

export class AppComponent implements AfterViewInit {
    pageTitle:string = "Welcome to WTHApps";

    ngAfterViewInit() {
        // Your jQuery code goes here
        //$('.navbar-brand').hide();
    }
    
    constructor(private _userService: UserService, private _router: Router){ }

    logout($event){ 
        $event.preventDefault();
            
        console.log("loggedout:");
        this._userService.logout('users/sign_out')
            .subscribe(
                response => {
                    localStorage.removeItem('jwt');
                    this._router.navigateByUrl('/login');
                },
                error => {
                    console.log("logout error:", error);
                }
            );              
    }

    currentPath(): string{
        return this._router._location.path();
        // return this._router._location.path() === '' ? '/' : this._router._location.path();
    }

    public isLoggedIn() {
        // Check if there's an unexpired JWT
        return this._userService.isLoggedIn();
    }
}