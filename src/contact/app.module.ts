import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { HomeModule } from '../contact/home/home.module';
import { ContactModule } from './contact/contact.module';
import { MyProfileModule } from './my-profile/my-profile.module';
import { GroupModule } from './group/group.module';
// import { SettingsModule } from './settings/contact-settings.module';
import { ContactSharedModule } from './shared/shared.module';
import { APP_BASE_HREF } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HeaderNavbarModule } from '../shared/shared/components/navbar/navbar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // Contact modules
    AppRoutingModule,
    HomeModule,
    ContactModule,
    MyProfileModule,
    GroupModule,
    // SettingsModule,
    ContactSharedModule.forRoot(),

    // WTHApps modules
    HeaderNavbarModule,
    SharedModule.forRoot(),
    CoreModule.forRoot(),
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
export class AppModule { }
