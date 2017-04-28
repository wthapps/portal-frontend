import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';

import { SharedModule } from '../core/shared/shared.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AboutModule } from './about/about.module';

import { HomeModule } from './home/home.module';
import { ContactModule } from './contact/contact.module';
import { PageErrorsModule } from './errors/errors.module';
import { PoliciesModule } from './policies/policies.module';
import { PricingModule } from './pricing/pricing.module';
import { ProductsModule } from './products/products.module';
import { SupportModule } from './support/support.module';
import { WelcomeModule } from './welcome/welcome.module';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { MyAccountModule } from './my-account/my-account.module';
import { RecoveryModule } from './recovery/recovery.module';
import { SubscribeModule } from './sub_unsub/subscribe.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RecoveryModule,
    AppRoutingModule,
    PageErrorsModule,
    MyAccountModule,
    LoginModule,
    RegisterModule,
    WelcomeModule,
    SupportModule,
    ProductsModule,
    PricingModule,
    PoliciesModule,
    ContactModule,
    AboutModule,
    HomeModule,
    SubscribeModule,
    SharedModule.forRoot()
  ],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]

})
export class AppModule {
}
