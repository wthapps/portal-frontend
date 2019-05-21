import { DashboardModule } from '@account/dashboard/dashboard.module';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CoreModule } from '@core/core.module';
import { environment } from '@env/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FooterModule } from '@wth/shared/partials/footer/footer.module';
import { SharedServicesModule } from '@wth/shared/shared-services.module';
import { MyAdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MyAppsModule } from './apps/apps.module';
import { ConfirmationModule } from './confirmation/confirmation.module';
import { MyMyAppsModule } from './my-apps/my-apps.module';
import { MyPaymentModule } from './payment/payment.module';
import { MyPlansModule } from './plans/plans.module';
import { MySettingModule } from './settings/setting.module';

import { MySharedModule } from './shared/shared.module';
import { appEffects, appReducers, metaReducers, MyaccountStoreModule } from './store';
import { UserModule } from '@account/users';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    DashboardModule,
    MyAppsModule,
    MyMyAppsModule,
    MyPaymentModule,
    MyPlansModule,
    MySettingModule,
    MyAdminModule,
    ConfirmationModule,
    UserModule,
    FooterModule,

    // Store
    MyaccountStoreModule,

    MySharedModule.forRoot(),
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
  declarations: [AppComponent],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
