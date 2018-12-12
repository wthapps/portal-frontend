import { environment } from './../environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from '../core/core.module';
import { SampleSharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { SharedServicesModule } from '@wth/shared/shared-services.module';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,

    AppRoutingModule,
    HomeModule,

    SampleSharedModule.forRoot(),
    CoreModule.forRoot(),
    SharedServicesModule.forRoot(),
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: false
    })
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    }
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: WthInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
