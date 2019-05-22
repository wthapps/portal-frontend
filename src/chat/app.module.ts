import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { StoreModule } from '@ngrx/store';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { ChatStore } from '@chat/shared/chat-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ZChatSharedModule } from './shared/shared.module';
import { ZChatSettingModule } from './setting/setting.module';
import { ZChatConversationModule } from './conversation/conversation.module';
import { ZChatContactModule } from './contact/contact.module';
import { ZChatPhotoModule } from './photo/photo.module';
import { ModalModule } from '@wth/shared/modals/modals.module';

import { environment } from '@env/environment';
import { SharedServicesModule } from '@wth/shared/shared-services.module';
import { ChatNoteListModule } from '@shared/components/note-list/chat-module/chat-note-list.module';
import { ChatStoreModule } from '@chat/store';
import { JwtIntercepter } from '@shared/services/auth/jwt-intercepter';
import { ContactSelectionModule } from '@chat/shared/selections/contact';
// import { UserCardModule } from '@shared/user/card';
import { UserEventModule } from '@shared/user/event';
import { ZChatCardModule } from './shared/modal/cards/chat-card-detail-modal.module';
import { GoogleAnalyticsService } from '@shared/services/analytics/google-analytics.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,

    AppRoutingModule,

    // ZChatHomeModule,
    ZChatCardModule,
    ZChatSettingModule,
    ZChatConversationModule,
    ZChatContactModule,
    ZChatPhotoModule,
    ChatNoteListModule,
    ContactSelectionModule,
    UserEventModule,

    AppRoutingModule,
    ModalModule,

    // Store
    ChatStoreModule,

    ZChatSharedModule.forRoot(),
    SharedServicesModule.forRoot(),
    StoreModule.forRoot(ChatStore),
    ScrollToModule.forRoot(),
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: false
    }),

    !environment.production
      ? StoreDevtoolsModule.instrument({ maxAge: 50 })
      : []
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    },
    GoogleAnalyticsService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtIntercepter, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
