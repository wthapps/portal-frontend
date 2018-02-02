import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ZSharedReportService } from './shared/components/zone/report/report.service';
import { ChatCommonService } from './services/chat.common.service';
import { PhotoService } from './services/photo.service';
import { CountryService } from './shared/components/countries/countries.service';
import { SuggestionService } from './services/suggestion.service';
import { CommonEventService } from './services/common-event/common-event.service';

import { PipeModule } from './shared/pipe/pipe.module';

import { LoadingModule } from './shared/components/loading/loading.module';
import { FooterModule } from './components/footer/footer.module';
import { HeaderModule } from './shared/components/header/header.module';
import { HeaderNavbarModule } from './shared/components/navbar/navbar.module';
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


import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { GenericFileService } from './services/generic-file.service';
import { ShowHidePasswordModule } from './shared/components/show-hide-password/show-hide-password.module';
import { InvitationModule } from './shared/components/invitation/invitation.module';
import { WthConfirmModule } from './shared/components/confirmation/wth-confirm.module';
import { PanelMenuModule } from 'primeng/components/panelmenu/panelmenu';
import { BoxLoadingModule } from './shared/components/box-loading/box-loading.module';
import { BoxNoDataModule } from './shared/components/box-no-data/box-no-data.module';
import { DirectiveModule } from './shared/directive/directive.module';
import { HttpClientModule } from '@angular/common/http';
import { WthInterceptor } from './services/wth-interceptor';
import { ClientDetectorService } from './services/client-detector.service';
import { WthConfirmService } from './shared/components/confirmation/wth-confirm.service';
import { LoadingService } from './shared/components/loading/loading.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { ToastsService } from './shared/components/toast/toast-message.service';
import { Ng2CableModule } from 'ng2-cable';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { ImageCropperModule } from '@shared/shared/components/image-cropper/image-cropper.module';
import { DomService } from '@shared/services/dom.service';
import { MenuContainerModule } from '@shared/shared/components/menu-container/menu-container.module';
import { NotificationListModule } from '@shared/shared/components/notification-list/notification-list.module';
import { ConnectionNotificationService } from '@wth/shared/services/connection-notification.service';
import { AccordionModule } from 'primeng/primeng';
import { GridListModule } from '@wth/shared/components/grid-list/grid-list.module';
import { ModalModule } from '@wth/shared/components/modal/modal.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


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
    InfiniteScrollModule,
    Ng2CableModule,

    //Custom modules
    GridListModule,
    ModalModule
  ],
  declarations: [],
  exports: [
    // Angular modules
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // BrowserAnimationsModule,

    // Third parties modules
    Ng2Bs3ModalModule,
    Ng2CableModule,

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
    DataTableModule,
    AccordionModule,

    WthConfirmModule,
    BoxLoadingModule,
    BoxNoDataModule,

    FooterModule,
    HeaderModule,
    HeaderNavbarModule,
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
    ImageCropperModule,
    MenuContainerModule,
    NotificationListModule,

    // Custom modules
    GridListModule,
    ModalModule,

    // Pipe
    PipeModule,

    // Directive
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
        LoadingService,
        ServiceManager,
        UserService,
        AuthGuard,
        AuthService,
        WthInterceptor,
        CountryService,
        ConfirmationService,
        WthConfirmService,
        CookieService,
        StorageService,
        HandlerService,
        WTHNavigateService,
        NotificationService,
        NotificationChannelService,
        ConnectionNotificationService,
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
        GenericFileService,
        ToastsService,
        MessageService,
        DomService,
      ]
    };
  }
}
