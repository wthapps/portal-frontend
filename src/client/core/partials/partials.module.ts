import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterPromotionComponent, FooterComponent } from './footer/footer.component';
import { LoadingModule } from './loading/loading.module';
import { ToastsModule } from './toast/toast-message.module';
import { TablePricingModule } from './table-pricing/table-pricing.module';
import { CountryModule } from './countries/countries.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LoadingModule,
    ToastsModule,
    TablePricingModule,
    CountryModule
  ],
  declarations: [
    FooterComponent,
    FooterPromotionComponent
  ],
  exports: [
    FooterComponent,
    FooterPromotionComponent,
    LoadingModule,
    ToastsModule,
    TablePricingModule,
    CountryModule
  ],
  providers: []
})
export class PartialsModule {
}
