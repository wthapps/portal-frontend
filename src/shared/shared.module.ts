import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CookieModule, CookieService } from 'ngx-cookie';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { InputSwitchModule } from 'primeng/components/inputswitch/inputswitch';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { RadioButtonModule } from 'primeng/components/radiobutton/radiobutton';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { EditorModule } from 'primeng/components/editor/editor';

import { ApiBaseService } from './shared/services/apibase.service';
import { ServiceManager } from './shared/services/service-manager';
import { UserService } from './shared/services/user.service';
import { StorageService } from './shared/services/storage.service';
import { HandlerService } from './shared/services/handler.service';
import { WTHNavigateService } from './shared/services/wth-navigate.service';
import { NotificationService } from './shared/services/notification.service';
import { NotificationChannelService } from './shared/channels/notification-channel.service';
import { AppearancesChannelService } from './shared/channels/appearances-channel.service';
import { ChannelService } from './shared/channels/channel.service';
import { PhotoModalDataService } from './shared/services/photo-modal-data.service';
import { PhotoUploadService } from './shared/services/photo-upload.service';
import { UrlService } from './shared/services/url.service';
import { DateService } from './shared/services/date.service';
import { ZSharedReportService } from './shared/components/zone/report/report.service';
import { ChatCommonService } from './shared/services/chat.common.service';
import { PhotoService } from './shared/services/photo.service';
import { CountryService } from './shared/components/countries/countries.service';
import { SuggestionService } from './shared/services/suggestion.service';
import { CommonEventService } from './shared/services/common-event/common-event.service';

import { PipeModule } from './shared/pipe/pipe.module';

import { LoadingModule } from './shared/components/loading/loading.module';
import { FooterModule } from './shared/components/footer/footer.module';
import { HeaderModule } from './shared/components/header/header.module';
import { HeaderNavbarModule } from './shared/components/navbar/navbar.module';
import { PartialsNotificationsModule } from './shared/components/notifications/notifications.module';
import { TablePricingModule } from './shared/components/table-pricing/table-pricing.module';
import { ToastsModule } from './shared/components/toast/toast-message.module';
import { CoreChatSupportModule } from './shared/components/chat-support/chat-support.module';
import { UploadCropImageModule } from './shared/components/upload-crop-image/upload-crop-image.module';
import { BreadcrumbModule } from './shared/components/breadcrumb/breadcrumb.module';
import { ZSharedMenuModule } from './shared/components/menu/menu.module';
import { FileModule } from './shared/components/file/file.module';
import { DisplayLinkModule } from './shared/components/link/display-link.module';
import { ZSharedReportModule } from './shared/components/zone/report/report.module';
import { PartialsProfileModule } from './shared/components/profile/profile.module';
import { PartialsPhotoModule } from './shared/components/photo/photo.module';
import { ModalDockModule } from './shared/components/modal/dock.module';
import { EntitySelectModule } from './shared/components/entity-select/entity-select.module';
import { ReadMoreModule } from './shared/components/read-more/read-more.module';
import { CoverProfileModule } from './shared/components/cover-profile/cover-profile.module';
import { ZChatEmojiModule } from './shared/emoji/emoji.module';


import { AuthGuard } from './shared/services/auth-guard.service';
import { AuthService } from './shared/services/auth.service';
import { GenericFileService } from './shared/services/generic-file.service';
import { ShowHidePasswordModule } from './shared/components/show-hide-password/show-hide-password.module';
import { InvitationModule } from './shared/components/invitation/invitation.module';
import { WthConfirmModule } from './shared/components/confirmation/wth-confirm.module';
import { PanelMenuModule } from 'primeng/components/panelmenu/panelmenu';
import { BoxLoadingModule } from './shared/components/box-loading/box-loading.module';
import { BoxNoDataModule } from './shared/components/box-no-data/box-no-data.module';
import { DirectiveModule } from './shared/directive/directive.module';
import { HttpClientModule } from '@angular/common/http';
// import { BrowserModule } from '@angular/platform-browser';
import { WthInterceptor } from './services/wth-interceptor';
import { ClientDetectorService } from './services/client-detector.service';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

export * from './shared/components/navbar/navbar.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // BrowserModule,
    HttpClientModule,
    // BrowserAnimationsModule,
    CookieModule.forRoot(),

    InfiniteScrollModule
  ],
  declarations: [

  ],
  exports: [
    // Angular modules
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // BrowserAnimationsModule,

    // Third parties modules
    Ng2Bs3ModalModule,

    // WTHApps modules
    LoadingModule,
    ToastsModule,
    ConfirmDialogModule,
    InfiniteScrollModule,
    InputSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    AutoCompleteModule,
    CalendarModule,
    TooltipModule,
    EditorModule,
    PanelMenuModule,

    WthConfirmModule,
    BoxLoadingModule,
    BoxNoDataModule,

    FooterModule,
    HeaderModule,
    HeaderNavbarModule,
    PartialsNotificationsModule,
    TablePricingModule,
    CoreChatSupportModule,
    UploadCropImageModule,
    BreadcrumbModule,
    ZSharedMenuModule,
    FileModule,
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
    PipeModule,

    //Directive
    DirectiveModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        ApiBaseService,
        ClientDetectorService,
        ServiceManager,
        UserService,
        AuthGuard,
        AuthService,
        WthInterceptor,
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
        GenericFileService
      ]
    };
  }
}
