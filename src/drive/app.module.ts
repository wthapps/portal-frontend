import { DriveService } from './shared/services/drive.service';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DriveSharedModule } from './shared/shared.module';
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
import { LockUploadModalComponent } from '@shared/components/modal/lock-upload-modal.component';
import { BsModalModule } from 'ng2-bs3-modal';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { DriveStoreModule } from './shared/store';
import { NotificationEventService } from '@shared/services/notification';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageModule } from 'angular-2-local-storage';
import { DriveFolderService } from './shared/services/drive-folder.service';
import { DriveStorageService } from './shared/services/drive-storage.service';
import { DriveModalService } from './shared/services/drive-modal.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    DriveSharedModule,
    CookieModule.forRoot(),
    AppRoutingModule,
    HeaderModule,
    HeaderModule,
    WDriveHeaderModule,
    LocalStorageModule.forRoot({
      prefix: 'my-app',
      storageType: 'localStorage'
    }),
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: false
    }),
    WDriveUploadDockModule,
    PipeModule,
    DriveStoreModule,
    BsModalModule
  ],
  declarations: [AppComponent, LockUploadModalComponent],
  providers: [
    DriveService,
    DriveModalService,
    DriveStorageService,
    DriveFolderService,
    CommonEventService,
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
    WTHEmojiService,
    NotificationEventService,
    ConnectionNotificationService,
    WMessageService
  ],

  bootstrap: [AppComponent]
})
export class AppModule {}
