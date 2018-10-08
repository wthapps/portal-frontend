import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ContactSearchModule } from '@contacts/search/search.module';
import { environment } from '@env/environment';
// import { ContactHtmlModule } from '@contacts/html/contact-html.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { WthCommonModule } from '@wth/shared/common/wth-common.module';
import { ModalModule } from '@wth/shared/modals/modals.module';
import { SharedServicesModule } from '@wth/shared/shared-services.module';
import { HomeModule } from '../contact/home/home.module';

import { CoreModule } from '../core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactModule } from './contact/contact.module';
// import { MyProfileModule } from './my-profile/my-profile.module';
import { GroupModule } from './group/group.module';
import { ContactSharedModule } from './shared/shared.module';
import { ProfileModule } from '@wth/shared/user';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // Contact modules
    AppRoutingModule,
    HomeModule,
    ContactModule,
    ProfileModule,
    ContactSearchModule,
    GroupModule,
    ModalModule,
    // environment.production ? [] : ContactHtmlModule,
    ScrollToModule.forRoot(),
    ContactSharedModule.forRoot(),

    // WTHApps modules
    WthCommonModule,
    SharedServicesModule.forRoot(),
    CoreModule.forRoot(),
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
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
export class AppModule {
}
