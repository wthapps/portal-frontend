import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';

import { ZContactSharedModule } from './shared/shared.module';
import { CoreSharedModule } from '../core/shared/shared.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ZContactHomeModule } from './home/home.module';
import { ZContactModule } from './contact/contact.module';
import { ZContactLabelModule } from './label/label.module';
import { ZContactMyProfileModule } from './my-profile/my-profile.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,

    ZContactHomeModule,
    ZContactModule,
    ZContactMyProfileModule,
    ZContactLabelModule,

    ZContactSharedModule.forRoot(),
    CoreSharedModule.forRoot()
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
