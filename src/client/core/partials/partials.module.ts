import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { CalendarModule } from 'primeng/primeng';

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
import { TimeFormatPipe } from '../shared/pipe/time-format.pipe';
import { CoreChatSupportModule } from './chat-support/chat-support.module';
import { EntitySelectComponent } from './entity-select/entity-select.component';
import { EntitySelectModule } from './entity-select/entity-select.module';
import { PhotoSearchFormComponent } from './header/search/photo-search-form.component';
import { PhotoSearchResultComponent } from './header/search/photo-search-result.component';



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
    CalendarModule
  ],
  declarations: [
    SearchFormComponent,
    PhotoSearchFormComponent,
    PhotoSearchResultComponent,
    HeaderComponent,
    FooterComponent,
    FooterPromotionComponent,

    // Pipe
    TitleCase,
    TimeFormatPipe
  ],
  exports: [
    SearchFormComponent,
    PhotoSearchFormComponent,
    PhotoSearchResultComponent,
    HeaderComponent,
    FooterComponent,
    FooterPromotionComponent,
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

    // Pipe
    // GroupByMonthYearPipe,
    // GroupByPipe,
    // NewlinePipe,
    TimeFormatPipe,
    TitleCase
    // UrlTransformPipe,
    // ShowLengthTransformPipe,
    // SafeHtmlPipe,
    // ScrollToBottomDirective
  ],
  providers: []
})
export class PartialsModule {
}
