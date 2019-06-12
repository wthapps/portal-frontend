import { environment } from './../environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from '../core/core.module';
import { PortalSharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { AboutModule } from './about/about.module';
import { PageErrorsModule } from './errors/errors.module';
import { LoginModule } from './login/login.module';
import { MyAccountModule } from './my-account/my-account.module';
import { PoliciesModule } from './policies/policies.module';
import { PricingModule } from './pricing/pricing.module';
import { ProductsModule } from './products/products.module';
import { RecoveryModule } from './recovery/recovery.module';
// import { RegisterModule } from './register/register.module';
import { SubscribeModule } from './sub_unsub/subscribe.module';
import { SupportModule } from './support/support.module';
import { NotificationModule } from './notifications/notifications.module';
import { SharedServicesModule } from '@wth/shared/shared-services.module';
import { FaqModule } from '@portal/faq/faq.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { PortalStoreModule } from '@portal/store';
import { GoogleAnalyticsService } from '@shared/services/analytics/google-analytics.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,

    AppRoutingModule,
    HomeModule,
    AboutModule,
    PageErrorsModule,
    LoginModule,
    MyAccountModule,
    PoliciesModule,
    PricingModule,
    ProductsModule,
    RecoveryModule,
    // RegisterModule,
    SubscribeModule,
    SupportModule,
    NotificationModule,
    FaqModule,

    // Store
    PortalStoreModule,

    PortalSharedModule.forRoot(),
    CoreModule.forRoot(),
    SharedServicesModule.forRoot(),
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    },
    GoogleAnalyticsService
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: WthInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
