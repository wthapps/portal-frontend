import { DashboardModule } from '@account/dashboard/dashboard.module';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CoreModule } from '@core/core.module';
import { environment } from '@env/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SharedModule } from '@shared/shared.module';
import { FooterModule } from '@wth/shared/partials/footer/footer.module';
import { SharedServicesModule } from '@wth/shared/shared-services.module';
import { TableModule } from 'primeng/table';
import { MyAdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
// import { MyHomeModule } from './home/home.module';
import { MyAppsModule } from './apps/apps.module';
import { MyBillingModule } from './billing/billing.module';
import { ConfirmationModule } from './confirmation/confirmation.module';
import { MyMyAppsModule } from './my-apps/my-apps.module';
import { MyAccountMyProfileModule } from './my-profile/my-profile.module';
import { MyPaymentModule } from './payment/payment.module';
import { MyPlansModule } from './plans/plans.module';
import { MySettingModule } from './settings/setting.module';

import { MySharedModule } from './shared/shared.module';
import { appEffects, appReducers, metaReducers } from './store';
import { UserModule } from '@account/users';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    // MyHomeModule,
    DashboardModule,
    MyAppsModule,
    MyBillingModule,
    MyMyAppsModule,
    MyPaymentModule,
    MyPlansModule,
    MySettingModule,
    MyAdminModule,
    MyAccountMyProfileModule,
    ConfirmationModule,
    UserModule,
    FooterModule,
    MySharedModule.forRoot(),
    SharedModule.forRoot(),
    SharedServicesModule.forRoot(),
    CoreModule.forRoot(),
    StoreModule.forRoot(appReducers, { metaReducers }),
    EffectsModule.forRoot(appEffects),
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: false
    }),
    !environment.production
      ? StoreDevtoolsModule.instrument({ maxAge: 50 })
      : []
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
