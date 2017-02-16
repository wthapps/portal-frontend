import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ConfirmDialogModule, ConfirmationService, ChipsModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';

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
import { TimeFormatPipe } from './pipe/time-format.pipe';
import { TitleCase } from './pipe/titlecase.pipe';
import { UrlTransformPipe } from './pipe/url.pipe';
import { ShowLengthTransformPipe } from './pipe/show-length.pipe';
import { SafeHtmlPipe } from './pipe/safeHtml.pipe';
import { scrollToBottomDirective } from './directive/scroll-to-bottom.directive';

import { NotificationService } from './channels/notification.service';
import { ChannelNotificationService } from './channels/channel-notification.service';
import { AppearancesChannelService } from './channels/appearances-channel.service';
import {ReadMoreComponent} from '../partials/read-more/read-more.component';
import { SoSearchService } from '../partials/header/sub/social-search.service';

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
    InfiniteScrollModule
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

    //Directive
    scrollToBottomDirective
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

    // Component
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

    //Directive
    scrollToBottomDirective
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
        ChannelNotificationService,
        AppearancesChannelService
      ]
    };
  }
}
