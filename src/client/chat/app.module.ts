import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ZChatSharedModule } from './shared/shared.module';
import { CoreSharedModule } from '../core/shared/shared.module';

import { ZChatHomeModule } from './home/home.module';
import { ZChatSettingModule } from './setting/setting.module';
import { ZChatConversationModule } from './conversation/conversation.module';
import { ZChatContactModule } from './contact/contact.module';
import { ZChatContactSearchModule } from './search-new-contacts/contact-search.module';
import { ZChatHistoryModule } from './history/history.module';
import { ZChatProfileModule } from './profile/profile.module';
import { ZChatSearchModule } from './search/search.module';
import { ZChatPhotoModule } from './photo/photo.module';
import { ZChatMyProfileModule } from './my-profile/my-profile.module';


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,

    ZChatHomeModule,
    ZChatSettingModule,
    ZChatConversationModule,
    ZChatContactModule,
    ZChatContactSearchModule,
    ZChatHistoryModule,
    ZChatProfileModule,
    ZChatSearchModule,
    ZChatPhotoModule,
    ZChatMyProfileModule,

    ZChatSharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]

})
export class AppModule { }
