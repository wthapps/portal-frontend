import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ZChatSharedModule } from './shared/shared.module';

import { ZChatHomeModule } from './home/home.module';
import { ZChatSettingModule } from './setting/setting.module';
import { ZChatConversationModule } from './conversation/conversation.module';
import { ZChatContactModule } from './contact/contact.module';
import { ZChatContactSearchModule } from './search-new-contacts/contact-search.module';
import { ZChatHistoryModule } from './history/history.module';
import { ZChatProfileModule } from './profile/profile.module';
// import { ZChatSearchModule } from './search/search.module';
import { ZChatPhotoModule } from './photo/photo.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@wth/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from '@wth/shared/modals/modals.module';
import { StoreModule } from '@ngrx/store';
import { ChatStore } from '@chat/shared/chat-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@env/environment';
import { SharedServicesModule } from '@wth/shared/shared-services.module';
import { ChatNoteListModule } from '@shared/components/note-list/chat-module/chat-note-list.module';
import { WMediaPreviewModule } from '@shared/components/w-media-preview/media-preview.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,

    AppRoutingModule,

    // ZChatHomeModule,
    ZChatSettingModule,
    ZChatConversationModule,
    ZChatContactModule,
    ZChatContactSearchModule,
    ZChatHistoryModule,
    ZChatProfileModule,
    // ZChatSearchModule,
    ZChatPhotoModule,
    // ZChatMyProfileModule,
    ChatNoteListModule,

    AppRoutingModule,
    ModalModule,
    WMediaPreviewModule,
    ZChatSharedModule.forRoot(),
    SharedServicesModule.forRoot(),
    StoreModule.forRoot(ChatStore),
    SharedModule.forRoot(),

    !environment.production
      ? StoreDevtoolsModule.instrument({ maxAge: 50 })
      : []
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
