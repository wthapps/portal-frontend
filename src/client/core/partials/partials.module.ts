import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { SearchFormComponent } from './header/sub/search-form.component';
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



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // BrowserModule,
    LoadingModule,
    ToastsModule,
    TablePricingModule,
    CountryModule,
    BreadcrumbModule,
    UploadCropImageModule,
    ZSharedModule,
    PhotoModule
  ],
  declarations: [
    SearchFormComponent,
    HeaderComponent,
    FooterComponent,
    FooterPromotionComponent,

    // Pipe
    TitleCase,
    TimeFormatPipe
  ],
  exports: [
    SearchFormComponent,
    HeaderComponent,
    FooterComponent,
    FooterPromotionComponent,
    LoadingModule,
    ToastsModule,
    TablePricingModule,
    CountryModule,
    BreadcrumbModule,
    UploadCropImageModule,
    ZSharedModule,
    PhotoModule,

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
