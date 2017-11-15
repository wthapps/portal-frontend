import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CoreSharedModule } from '../core/shared/shared.module';
import { PortalSharedModule } from './shared/shared.module';

import { AboutModule } from './about/about.module';
import { HomeModule } from './home/home.module';
import { ContactModule } from './contact/contact.module';
import { PageErrorsModule } from './errors/errors.module';
import { LoginModule } from './login/login.module';
import { MyAccountModule } from './my-account/my-account.module';
import { PoliciesModule } from './policies/policies.module';
import { PricingModule } from './pricing/pricing.module';
import { ProductsModule } from './products/products.module';
import { RecoveryModule } from './recovery/recovery.module';
import { RegisterModule } from './register/register.module';
import { SubscribeModule } from './sub_unsub/subscribe.module';
import { SupportModule } from './support/support.module';


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    AboutModule,
    HomeModule,
    ContactModule,
    PageErrorsModule,
    LoginModule,
    MyAccountModule,
    PoliciesModule,
    PricingModule,
    ProductsModule,
    RecoveryModule,
    RegisterModule,
    SubscribeModule,
    SupportModule,
    PortalSharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [
    AppComponent
  ],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]

})
export class AppModule { }
