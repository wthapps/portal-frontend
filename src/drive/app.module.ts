import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SampleSharedModule } from './shared/shared.module';
import { CookieModule } from 'ngx-cookie';
import { WDriveUploadDockModule } from './shared/components/drive-upload-dock/drive-upload-dock.module';
import {
  CommonEventService,
  AuthService,
  UserService,
  ServiceManager,
  StorageService,
  UrlService,
  ChatCommonService,
  HandlerService,
  WMessageService,
  WTHNavigateService,
  NotificationService
} from '@shared/services';
import { FileDriveUploadService } from '@shared/services/file-drive-upload.service';
import { HeaderModule } from '@shared/partials/header';
import { WDriveHeaderModule } from './shared/components/header/header.module';
import { WindowService } from '@shared/services/window.service';
import { ChannelService } from '@shared/channels/channel.service';
import { ConnectionNotificationService } from '@shared/services/connection-notification.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { PageVisibilityService } from '@shared/services/page-visibility.service';
import { WebsocketService } from '@shared/channels/websocket.service';
import { WHttpClientService } from '@shared/services/w-http-client.service';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';

@NgModule({
  imports: [
    SampleSharedModule,
    CookieModule.forRoot(),
    AppRoutingModule,
    HeaderModule,
    HeaderModule,
    WDriveHeaderModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: false
    }),
    WDriveUploadDockModule
  ],
  declarations: [
    AppComponent,
  ],
  providers: [CommonEventService,
    FileDriveUploadService,
    AuthService,
    WindowService,
    ChannelService,
    UserService,
    ServiceManager,
    StorageService,
    UrlService,
    ChatCommonService,
    WTHNavigateService,
    NotificationService,
    HandlerService,
    PageVisibilityService,
    WebsocketService,
    WHttpClientService,
    WTHEmojiService
    ,
    ConnectionNotificationService,
    WMessageService],


  bootstrap: [AppComponent]
})
export class AppModule {
}
