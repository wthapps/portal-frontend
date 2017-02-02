import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomeModule } from './home/home.module';
import { SharedModule } from '../core/shared/shared.module';

import { ACSharedModule } from './shared/shared.module';
import { ACSettingModule } from './setting/setting.module';
import { ACPlansModule } from './plans/plans.module';
import { ACBillingModule } from './billing/billing.module';
import { ACAppsModule } from './apps/apps.module';
import { ACMyAppsModule } from './my-apps/my-apps.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    ACMyAppsModule,
    ACAppsModule,
    ACBillingModule,
    ACPlansModule,
    ACSettingModule,
    HomeModule,
    ACSharedModule.forRoot(),
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
