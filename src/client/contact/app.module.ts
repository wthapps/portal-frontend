import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from '../core/shared/shared.module';
import { ZContactSharedModule } from './shared/shared.module';

import { ZContactHomeModule } from './home/home.module';
import { ZContactListModule } from './contact/contact-list/contact-list.module';
import { ZContactDetailModule } from './contact/contact-detail/contact-detail.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    ZContactSharedModule,
    ZContactHomeModule,
    ZContactListModule,
    ZContactDetailModule,
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
