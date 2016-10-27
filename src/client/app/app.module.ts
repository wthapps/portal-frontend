import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

import { AboutModule } from './about/about.module';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { ProductsModule } from './products/products.module';
import { PricingModule } from './pricing/pricing.module';
import { ContactModule } from './contact/contact.module';
import { SupportModule } from './support/support.module';
import { PoliciesModule } from './policies/policies.module';
import { WelcomeModule } from './welcome/welcome.module';
import { ComingsoonModule } from './comingsoon/comingsoon.module';

import { AccountModule } from './account/account.module';

import { ToastsModule } from './partials/toast/toast-message.module';
import { LoadingModule } from './partials/loading/loading.module';

import {
  AuthGuard,
  AuthService,
  CanDeactivateGuard
} from './shared/index';

import { ZoneModule } from './zone/zone.module';

import { SharedModule } from './shared/shared.module';
import { LoadingDirective } from "./shared/directive/loading.directive";
import { LoadingModalDirective } from "./shared/directive/loading-modal.directive";

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    AboutModule,
    HomeModule,
    LoginModule,
    RegisterModule,
    ProductsModule,
    PricingModule,
    ContactModule,
    SupportModule,
    PoliciesModule,
    WelcomeModule,
    ComingsoonModule,

    AccountModule,

    ToastsModule,
    LoadingModule,

    ZoneModule,
    SharedModule.forRoot(),
  ],
  declarations: [
    AppComponent,
  ],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  },
    AuthGuard,
    AuthService,
    CanDeactivateGuard
  ],
  bootstrap: [AppComponent]

})

export class AppModule {
}
