import {Component} from '@angular/core';
import {HTTP_PROVIDERS, Http} from '@angular/http';
import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, Routes, Router} from '@angular/router';
import 'rxjs/Rx';   // Load all features

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

@Component({
    selector: 'wth-app',
    templateUrl: 'app/app.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ],
    providers: [
        ProductService,
        HTTP_PROVIDERS,
        ROUTER_PROVIDERS
    ]
})

@Routes([
    {path: '/', component: HomeComponent},
    {path: '/products/:id', component: ProductDetailComponent},
    {path: '/products', component: ProductListComponent},
    {path: '/login', component: LoginComponent},
    {path: '/register', component: RegisterComponent},
    {path: '/account/forgot_password', component: ForgotPasswordComponent},
    {path: '/account/reset_email_sent', component: ResetEmailSentComponent},
    {path: '/account/password_reset', component: PasswordResetComponent},
    {path: '/account/password_reset_complete', component: PasswordResetCompleteComponent}
])

export class AppComponent {
    pageTitle:string = "Welcome to WTHApps";
}