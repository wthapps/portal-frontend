import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// import { HeaderComponent } from './header/header.component';
import { FooterPromotionComponent, FooterComponent } from './footer/footer.component';
import { LoadingModule } from './loading/loading.module';
import { ToastsModule } from './toast/toast-message.module';
import { TablePricingModule } from './table-pricing/table-pricing.module';
import { CountryModule } from './countries/countries.module';
import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';
import { ZSharedModule } from './zone/zone.module';
import { PhotoModule } from './zone/photo/photo.module';
import { UploadCropImageModule } from './upload-crop-image/upload-crop-image.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
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
    // HeaderComponent,
    FooterComponent,
    FooterPromotionComponent
  ],
  exports: [
    // HeaderComponent,
    FooterComponent,
    FooterPromotionComponent,
    LoadingModule,
    ToastsModule,
    TablePricingModule,
    CountryModule,
    BreadcrumbModule,
    UploadCropImageModule,
    ZSharedModule,
    PhotoModule
  ],
  providers: []
})
export class PartialsModule {
}
