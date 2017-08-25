import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CookieModule, CookieService } from 'ngx-cookie';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { InputSwitchModule } from 'primeng/components/inputswitch/inputswitch';
import { RadioButtonModule } from 'primeng/components/radiobutton/radiobutton';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

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
import { ZSharedReportService } from './components/zone/report/report.service';
import { ChatCommonService } from './services/chat.common.service';
import { PhotoService } from './services/photo.service';
import { CountryService } from './components/countries/countries.service';
import { SuggestionService } from './services/suggestion.service';
import { CommonEventService } from './services/common-event/common-event.service';

import { PipeModule } from './pipe/pipe.module';

import { LoadingModule } from './components/loading/loading.module';
import { FooterModule } from './components/footer/footer.module';
import { HeaderModule } from './components/header/header.module';
import { HeaderNavbarModule } from './components/navbar/navbar.module';
import { PartialsNotificationsModule } from './components/notifications/notifications.module';
import { TablePricingModule } from './components/table-pricing/table-pricing.module';
import { ToastsModule } from './components/toast/toast-message.module';
import { CoreChatSupportModule } from './components/chat-support/chat-support.module';
import { UploadCropImageModule } from './components/upload-crop-image/upload-crop-image.module';
import { BreadcrumbModule } from './components/breadcrumb/breadcrumb.module';
import { ZSharedMenuModule } from './components/zone/menu/menu.module';
import { ZSharedPhotoModule } from './components/zone/photo/photo.module';
import { DisplayLinkModule } from './components/link/display-link.module';
import { ZSharedReportModule } from './components/zone/report/report.module';
import { PartialsProfileModule } from './components/profile/profile.module';
import { PartialsPhotoModule } from './components/photo/photo.module';
import { ModalDockModule } from './components/modal/dock.module';
import { EntitySelectModule } from './components/entity-select/entity-select.module';
import { ReadMoreModule } from './components/read-more/read-more.module';
import { CoverProfileModule } from './components/cover-profile/cover-profile.module';
import { ZChatEmojiModule } from './emoji/emoji.module';


import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { GenericeFileService } from './services/generic-file.service';
import { ShowHidePasswordModule } from './components/show-hide-password/show-hide-password.module';
import { InvitationModule } from './components/invitation/invitation.module';

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
    BrowserAnimationsModule,
    Ng2Bs3ModalModule,

    LoadingModule,
    ToastsModule,
    ConfirmDialogModule,
    InfiniteScrollModule,
    InputSwitchModule,
    RadioButtonModule,
    AutoCompleteModule,
    CalendarModule,
    TooltipModule,

    FooterModule,
    HeaderModule,
    HeaderNavbarModule,
    PartialsNotificationsModule,
    TablePricingModule,
    CoreChatSupportModule,
    UploadCropImageModule,
    BreadcrumbModule,
    ZSharedMenuModule,
    ZSharedMenuModule,
    ZSharedPhotoModule,
    DisplayLinkModule,
    ZSharedReportModule,
    PartialsProfileModule,
    PartialsPhotoModule,
    ModalDockModule,
    EntitySelectModule,
    ReadMoreModule,
    CoverProfileModule,
    ZChatEmojiModule,
    ShowHidePasswordModule,
    InvitationModule,

    // Pipe
    PipeModule
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
        AuthGuard,
        AuthService,
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
        ZSharedReportService,
        ChatCommonService,
        PhotoService,
        SuggestionService,
        CommonEventService,
        GenericeFileService
      ]
    };
  }
}
