import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from '../core/shared/shared.module';
import { ZContactSharedModule } from './shared/shared.module';

import { ZContactListModule } from './contact-list/contact-list.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    ZContactSharedModule,
    ZContactListModule,
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
