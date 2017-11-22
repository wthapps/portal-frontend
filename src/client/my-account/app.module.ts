import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { MySharedModule } from './shared/shared.module';
import { CoreSharedModule } from '../core/shared/shared.module';

import { MyHomeModule } from './home/home.module';
import { MyAppsModule } from './apps/apps.module';
import { MyBillingModule } from './billing/billing.module';
import { MyMyAppsModule } from './my-apps/my-apps.module';
import { MyPaymentModule } from './payment/payment.module';
import { MySettingModule } from './settings/setting.module';
import { MyPlansModule } from './plans/plans.module';
import { MyAdminModule } from './admin/admin.module';
import { WelcomeModule } from './welcome/welcome.module';
import { MyAccountMyProfileModule } from './my-profile/my-profile.module';


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    MyHomeModule,
    MyAppsModule,
    MyBillingModule,
    MyMyAppsModule,
    MyPaymentModule,
    MyPlansModule,
    MySettingModule,
    MyAdminModule,
    MyAccountMyProfileModule,
    WelcomeModule,

    MySharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]

})
export class AppModule { }
