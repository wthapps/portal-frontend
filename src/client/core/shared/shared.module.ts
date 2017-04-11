import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ConfirmDialogModule, ConfirmationService, ChipsModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';
import { SliderModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import { ApiBaseService } from './services/apibase.service';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NameListService } from './name-list/name-list.service';
import { PartialsModule } from '../partials/partials.module';
import { UserService } from './services/user.service';
import { StorageService } from './services/storage.service';
import { HandlerService } from './services/handler.service';

import { GroupByMonthYearPipe } from './pipe/groupby-month-year.pipe';
import { GroupByPipe } from './pipe/groupby.pipe';
import { NewlinePipe } from './pipe/newline.pipe';
import { UrlTransformPipe } from './pipe/url.pipe';
import { ShowLengthTransformPipe } from './pipe/show-length.pipe';
import { SafeHtmlPipe } from './pipe/safeHtml.pipe';
import { ScrollToBottomDirective } from './directive/scroll-to-bottom.directive';

import { NotificationService } from './services/notification.service';
import { NotificationChannelService } from './channels/notification-channel.service';
import { AppearancesChannelService } from './channels/appearances-channel.service';
import { ReadMoreComponent } from '../partials/read-more/read-more.component';
import { SoSearchService } from '../partials/header/search/social-search.service';
import { PhotoModalDataService } from './services/photo-modal-data.service';
import { PhotoUploadService } from './services/photo-upload.service';
import { WthFilterByPipe } from './pipe/wthFilterBy.pipe';
import { ArrayLengthPipe } from './pipe/array-length.pipe';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PartialsModule,
    ConfirmDialogModule,
    ChipsModule,
    Ng2Bs3ModalModule,
    InputSwitchModule,
    AutoCompleteModule,
    InfiniteScrollModule,
    SliderModule,
    CalendarModule
  ],
  declarations: [
    ToolbarComponent,
    NavbarComponent,
    ReadMoreComponent,

    // Pipe
    GroupByMonthYearPipe,
    GroupByPipe,
    NewlinePipe,
    // TimeFormatPipe,
    // TitleCase,
    UrlTransformPipe,
    ShowLengthTransformPipe,
    SafeHtmlPipe,
    WthFilterByPipe,
    ArrayLengthPipe,

    //Directive
    ScrollToBottomDirective
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PartialsModule,
    ConfirmDialogModule,
    ChipsModule,
    Ng2Bs3ModalModule,
    InputSwitchModule,
    AutoCompleteModule,
    InfiniteScrollModule,
    SliderModule,
    CalendarModule,

    // Component
    ToolbarComponent,
    NavbarComponent,
    ReadMoreComponent,

    // Pipe
    GroupByMonthYearPipe,
    WthFilterByPipe,
    ArrayLengthPipe,
    GroupByPipe,
    NewlinePipe,
    // TimeFormatPipe,
    // TitleCase,
    UrlTransformPipe,
    ShowLengthTransformPipe,
    SafeHtmlPipe,

    //Directive
    ScrollToBottomDirective
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        ApiBaseService,
        UserService,
        NameListService,
        ConfirmationService,
        CookieService,
        StorageService,
        HandlerService,
        SoSearchService,
        NotificationService,
        NotificationChannelService,
        AppearancesChannelService,
        PhotoModalDataService,
        PhotoUploadService
      ]
    };
  }
}
