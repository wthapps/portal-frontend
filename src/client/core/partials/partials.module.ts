import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarModule } from 'primeng/primeng';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { CheckboxModule } from 'primeng/primeng';

import { SearchFormComponent } from './header/search/search-form.component';
import { HeaderComponent } from './header/header.component';
import { FooterPromotionComponent, FooterComponent } from './footer/footer.component';
import { LoadingModule } from './loading/loading.module';
import { ToastsModule } from './toast/toast-message.module';
import { TablePricingModule } from './table-pricing/table-pricing.module';
import { CountryModule } from './countries/countries.module';
import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';
import { ZSharedModule } from './zone/zone.module';
import { PhotoModule } from './zone/photo/photo.module';
import { UploadCropImageModule } from './upload-crop-image/upload-crop-image.module';
import { TitleCase } from '../shared/pipe/titlecase.pipe';
import { CoreChatSupportModule } from './chat-support/chat-support.module';
import { EntitySelectModule } from './entity-select/entity-select.module';
import { PhotoSearchFormComponent } from './header/search/photo-search-form.component';
import { TagInputModule } from 'ng2-tag-input';
import { AutoCompleteModule } from 'primeng/primeng';
import { ModalDockModule } from './modal/dock.module';
import { SocialSearchFormComponent } from './header/search/social-search-form.component';
import { CoverProfileModule } from './cover-profile/cover-profile.module';
import { PartialsNotificationsComponent } from './notifications/notifications.component';
import { PartialsProfileModule } from './profile/profile.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UndoNotificationComponent } from './header/notification/undo-notification.component';
import { NotificationItemComponent } from './notifications/item/notification-item.component';
import { ChatSearchFormComponent } from './header/search/chat-search-form.component';
import { TextBoxSearchComponent } from './header/search/components/textbox-search.component';
import { DisplayLinkComponent } from './link/display-link.component';
import { PipeModule } from '../shared/pipe/pipe.module';
import { PartialsFormModule } from './form/partials-form.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // BrowserModule,
    LoadingModule,
    ToastsModule,
    TablePricingModule,
    CountryModule,
    BreadcrumbModule,
    CoreChatSupportModule,
    UploadCropImageModule,
    ZSharedModule,
    InfiniteScrollModule,
    EntitySelectModule,
    PhotoModule,
    TagInputModule,
    AutoCompleteModule,
    CalendarModule,
    CoverProfileModule,
    PartialsProfileModule,
    PipeModule,
    PartialsFormModule,

    ModalDockModule,
    Ng2Bs3ModalModule,
    CheckboxModule
  ],
  declarations: [
    SearchFormComponent,
    PhotoSearchFormComponent,
    SocialSearchFormComponent,
    ChatSearchFormComponent,
    TextBoxSearchComponent,
    HeaderComponent,
    FooterComponent,
    FooterPromotionComponent,
    PartialsNotificationsComponent,
    NotificationItemComponent,
    UndoNotificationComponent,
    DisplayLinkComponent,

    // Pipe
    TitleCase,
  ],
  exports: [
    SearchFormComponent,
    PhotoSearchFormComponent,
    SocialSearchFormComponent,
    ChatSearchFormComponent,
    TextBoxSearchComponent,
    HeaderComponent,
    FooterComponent,
    FooterPromotionComponent,
    PartialsNotificationsComponent,
    DisplayLinkComponent,
    LoadingModule,
    ToastsModule,
    TablePricingModule,
    CountryModule,
    BreadcrumbModule,
    CoreChatSupportModule,
    UploadCropImageModule,
    ZSharedModule,
    InfiniteScrollModule,
    EntitySelectModule,
    PhotoModule,
    CalendarModule,
    CoverProfileModule,
    NotificationItemComponent,
    UndoNotificationComponent,
    PartialsProfileModule,
    ModalDockModule,
    PartialsFormModule,

    // Pipe
    // GroupByMonthYearPipe,
    // GroupByPipe,
    // NewlinePipe,
    TitleCase,
    // UrlTransformPipe,
    // ShowLengthTransformPipe,
    // SafeHtmlPipe,
    // ScrollToBottomDirective
  ],
  providers: []
})
export class PartialsModule {
}
