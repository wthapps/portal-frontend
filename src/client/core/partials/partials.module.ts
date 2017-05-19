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
import { TimeFormatPipe } from '../shared/pipe/time-format.pipe';


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
    EntitySelectModule,
    PhotoModule,
    TagInputModule,
    AutoCompleteModule,
    CalendarModule,
    CoverProfileModule,

    ModalDockModule,
    Ng2Bs3ModalModule,
    CheckboxModule
  ],
  declarations: [
    SearchFormComponent,
    PhotoSearchFormComponent,
    SocialSearchFormComponent,
    HeaderComponent,
    FooterComponent,
    FooterPromotionComponent,
    PartialsNotificationsComponent,

    // Pipe
    TitleCase,
    TimeFormatPipe
  ],
  exports: [
    SearchFormComponent,
    PhotoSearchFormComponent,
    SocialSearchFormComponent,
    HeaderComponent,
    FooterComponent,
    FooterPromotionComponent,
    PartialsNotificationsComponent,
    LoadingModule,
    ToastsModule,
    TablePricingModule,
    CountryModule,
    BreadcrumbModule,
    CoreChatSupportModule,
    UploadCropImageModule,
    ZSharedModule,
    EntitySelectModule,
    PhotoModule,
    CalendarModule,
    CoverProfileModule,

    ModalDockModule,

    // Pipe
    // GroupByMonthYearPipe,
    // GroupByPipe,
    // NewlinePipe,
    TitleCase,
    TimeFormatPipe
    // UrlTransformPipe,
    // ShowLengthTransformPipe,
    // SafeHtmlPipe,
    // ScrollToBottomDirective
  ],
  providers: []
})
export class PartialsModule {
}
