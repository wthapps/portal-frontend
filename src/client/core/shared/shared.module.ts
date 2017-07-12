import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CookieModule, CookieService } from 'ngx-cookie';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

import { ApiBaseService } from './services/apibase.service';
import { ServiceManager } from './services/service-manager';
import { UserService } from './services/user.service';
import { StorageService } from './services/storage.service';
import { HandlerService } from './services/handler.service';
import { WTHNavigateService } from './services/wth-navigate.service';
import { NotificationService } from './services/notification.service';
import { NotificationChannelService } from './channels/notification-channel.service';
import { AppearancesChannelService } from './channels/appearances-channel.service';
import { ChannelService } from './channels/channel.service';
import { PhotoModalDataService } from './services/photo-modal-data.service';
import { PhotoUploadService } from './services/photo-upload.service';
import { UrlService } from './services/url.service';
import { DateService } from './services/date.service';
import { ZoneReportService } from './form/report/report.service';
import { ChatCommonService } from './services/chat.common.service';
import { PhotoService } from './services/photo.service';
import { CountryService } from './components/countries/countries.service';
//// import { CommonEventService } from './services/common-event/common-event.service';

import { LoadingModule } from './components/loading/loading.module';
import { FooterModule } from './components/footer/footer.module';
import { HeaderModule } from './components/header/header.module';
import { PartialsNotificationsModule } from './components/notifications/notifications.module';
import { TablePricingModule } from './components/table-pricing/table-pricing.module';
import { ToastsModule } from './components/toast/toast-message.module';
import { CoreChatSupportModule } from './components/chat-support/chat-support.module';
import { UploadCropImageModule } from './components/upload-crop-image/upload-crop-image.module';
import { BreadcrumbModule } from './components/breadcrumb/breadcrumb.module';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CookieModule.forRoot(),

    InfiniteScrollModule
  ],
  declarations: [],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    LoadingModule,
    ToastsModule,
    ConfirmDialogModule,

    FooterModule,
    HeaderModule,
    PartialsNotificationsModule,
    TablePricingModule,
    CoreChatSupportModule,
    UploadCropImageModule,
    BreadcrumbModule
  ]
})
export class CoreSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreSharedModule,
      providers: [
        ApiBaseService,
        ServiceManager,
        UserService,
        CountryService,
        ConfirmationService,
        CookieService,
        StorageService,
        HandlerService,
        WTHNavigateService,
        NotificationService,
        NotificationChannelService,
        AppearancesChannelService,
        ChannelService,
        PhotoModalDataService,
        PhotoUploadService,
        UrlService,
        DateService,
        ZoneReportService,
        ChatCommonService,
        PhotoService,
        //// CommonEventService
      ]
    };
  }
}
