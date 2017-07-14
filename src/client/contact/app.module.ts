import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ZContactSharedModule } from './shared/shared.module';
import { CoreSharedModule } from '../core/shared/shared.module';

import { ZContactHomeModule } from './home/home.module';
import { ZContactListModule } from './contact/contact-list/contact-list.module';
import { ZNewContactModule } from './contact/new/new-contact.module';
import { ZContactDetailModule } from './contact/contact-detail/contact-detail.module';
import { ZContactMyProfileModule } from './my-profile/my-profile.module';
import { ZContactLabelModule } from './label/label.module';



@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    ZContactSharedModule,
    ZContactHomeModule,
    ZContactListModule,
    ZNewContactModule,
    ZContactDetailModule,
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
