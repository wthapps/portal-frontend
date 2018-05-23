import {
  NgModule,
  ModuleWithProviders,
  SkipSelf,
  Optional
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService, CookieModule } from 'ngx-cookie';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';

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

import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { GenericFileService } from './services/generic-file.service';
import { HttpClientModule } from '@angular/common/http';
import { WthInterceptor } from './services/wth-interceptor';
import { ClientDetectorService } from './services/client-detector.service';
import { WthConfirmService } from './shared/components/confirmation/wth-confirm.service';
import { LoadingService } from './shared/components/loading/loading.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { ToastsService } from './shared/components/toast/toast-message.service';
import { DomService } from '@shared/services/dom.service';
import { ConnectionNotificationService } from '@wth/shared/services/connection-notification.service';
import { WObjectListService } from '@wth/shared/components/w-object-list/w-object-list.service';
import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import { WindowService } from '@wth/shared/services/window.service';
import { FileUploaderService } from '@shared/services/file/file-uploader.service';
import { ApiProxyService } from '@shared/services/apiproxy.service';
import { DirectiveModule } from '@wth/shared/shared/directive/directive.module';
import { PipeModule } from '@wth/shared/shared/pipe/pipe.module';
import { LoadingModule } from '@wth/shared/shared/components/loading/loading.module';
import { ToastsModule } from '@wth/shared/shared/components/toast/toast-message.module';
import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { BoxLoadingModule } from '@wth/shared/shared/components/box-loading/box-loading.module';
import { WthConfirmModule } from '@wth/shared/shared/components/confirmation/wth-confirm.module';
import { Ng2CableModule } from 'ng2-cable';
import { WthCommonModule } from '@wth/shared/common/wth-common.module';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [],
  declarations: [],
  exports: []
})
export class SharedServicesModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: SharedServicesModule
  ) {
    if (parentModule) {
      throw new Error(
        'SharedServicesModule is already loaded. Import it in the AppModule only'
      );
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedServicesModule,
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
        WObjectListService,
        WMediaSelectionService,
        DomService,
        ApiProxyService,
        FileUploaderService,
        WindowService
      ]
    };
  }
}