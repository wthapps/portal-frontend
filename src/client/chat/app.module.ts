import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from '../core/shared/shared.module';
import { ChatSharedModule } from './shared/shared.module';
import { ZChatSettingModule } from './setting/setting.module';
import { ZChatConversationModule } from './conversation/conversation.module';
import { ZChatContactModule } from './contact/contact.module';
import { ZChatContactSearchModule } from './search/contact-search.module';
import { ZChatHistoryModule } from './history/history.module';
import { ZChatProfileModule } from './profile/profile.module';
import { ZChatMyProfileModule } from './my-profile/my-profile.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    ChatSharedModule.forRoot(),
    SharedModule.forRoot(),
    ZChatSettingModule,
    ZChatConversationModule,
    ZChatContactModule,
    ZChatContactSearchModule,
    ZChatHistoryModule,
    ZChatProfileModule,
    ZChatMyProfileModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]

})
export class AppModule {
}
