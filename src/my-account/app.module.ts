import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { MySharedModule } from './shared/shared.module';
import { SharedModule } from '@shared/shared.module';
import { CoreModule } from '@core/core.module';

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
import { FooterModule } from '@wth/shared/partials/footer/footer.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '@env/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducers, metaReducers, appEffects } from './store';
import { ConfirmationModule } from './confirmation/confirmation.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,

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
    ConfirmationModule,

    FooterModule,
    MySharedModule.forRoot(),
    SharedModule.forRoot(),
    CoreModule.forRoot(),
    StoreModule.forRoot(appReducers, { metaReducers }),
    EffectsModule.forRoot(appEffects),
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
