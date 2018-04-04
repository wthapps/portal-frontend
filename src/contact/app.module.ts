import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { CoreModule } from '../core/core.module';
import { HomeModule } from '../contact/home/home.module';
import { ContactModule } from './contact/contact.module';
import { MyProfileModule } from './my-profile/my-profile.module';
import { GroupModule } from './group/group.module';
import { SettingsModule } from './settings/contact-settings.module';
import { ContactSharedModule } from './shared/shared.module';
import { APP_BASE_HREF } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from '@wth/shared/modals/modals.module';
import { SharedServicesModule } from '@wth/shared/shared-services.module';
import { WthCommonModule } from '@wth/shared/common/wth-common.module';
import { environment } from '@env/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    BrowserAnimationsModule,
    HttpClientModule,

    // Contact modules
    AppRoutingModule,
    HomeModule,
    ContactModule,
    MyProfileModule,
    GroupModule,
    SettingsModule,
    ModalModule,
    ContactSharedModule.forRoot(),

    // WTHApps modules
    WthCommonModule,
    SharedServicesModule.forRoot(),
    CoreModule.forRoot()
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
