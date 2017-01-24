import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AboutModule } from './about/about.module';
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared/shared.module';

import { ContactModule } from './contact/contact.module';
import { PageErrorsModule } from './errors/errors.module';
import { PoliciesModule } from './policies/policies.module';
import { PricingModule } from './pricing/pricing.module';
import { ProductsModule } from './products/products.module';
import { SupportModule } from './support/support.module';
import { WelcomeModule } from './welcome/welcome.module';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    PageErrorsModule,
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
