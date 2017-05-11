import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ConfirmDialogModule, ConfirmationService, ChipsModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';
import { SliderModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
import { InputTextareaModule } from 'primeng/primeng';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

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
import { PhotoModalDataService } from './services/photo-modal-data.service';
import { PhotoUploadService } from './services/photo-upload.service';
import { WthFilterByPipe } from './pipe/wthFilterBy.pipe';
import { ArrayLengthPipe } from './pipe/array-length.pipe';
import { GroupByObjectTypePipe } from './pipe/groupby-object-type.pipe';
import { ServiceManager } from './services/service-manager';
import { ConvertByPatternPipe } from './pipe/convert.pipe';
import { AutofocusDirective } from './directive/autofocus.directive';
import { ImgFullDirective } from './directive/img-full.directive';
import { WTHNavigateService } from './services/wth-navigate.service';
import { PhotoService } from './services/photo.service';
import { PhotoItemPreviewComponent } from './components/photo/photo-item-preview.component';
import { TextAreaAutoHeightDirective } from './directive/textarea-autoheight.directive';


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
    CalendarModule,
    CheckboxModule,
    RadioButtonModule,
    InputTextareaModule
  ],
  declarations: [
    ToolbarComponent,
    NavbarComponent,
    ReadMoreComponent,
    PhotoItemPreviewComponent,

    // Pipe
    GroupByMonthYearPipe,
    GroupByObjectTypePipe,
    GroupByPipe,
    NewlinePipe,
    ConvertByPatternPipe,
    // TimeFormatPipe,
    // TitleCase,
    UrlTransformPipe,
    ShowLengthTransformPipe,
    SafeHtmlPipe,
    WthFilterByPipe,
    ArrayLengthPipe,

    //Directive
    ScrollToBottomDirective,
    AutofocusDirective,
    ImgFullDirective,
    TextAreaAutoHeightDirective
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
    CheckboxModule,
    RadioButtonModule,
    InputTextareaModule,

    // Component
    ToolbarComponent,
    NavbarComponent,
    ReadMoreComponent,
    PhotoItemPreviewComponent,


    // Pipe
    GroupByMonthYearPipe,
    GroupByObjectTypePipe,
    WthFilterByPipe,
    ArrayLengthPipe,
    GroupByPipe,
    NewlinePipe,
    // TimeFormatPipe,
    // TitleCase,
    UrlTransformPipe,
    ShowLengthTransformPipe,
    SafeHtmlPipe,
    ConvertByPatternPipe,

    //Directive
    ScrollToBottomDirective,
    AutofocusDirective,
    ImgFullDirective,
    TextAreaAutoHeightDirective
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        ApiBaseService,
        ServiceManager,
        UserService,
        NameListService,
        ConfirmationService,
        CookieService,
        StorageService,
        HandlerService,
        WTHNavigateService,
        NotificationService,
        NotificationChannelService,
        AppearancesChannelService,
        PhotoModalDataService,
        PhotoUploadService,
        PhotoService
      ]
    };
  }
}
