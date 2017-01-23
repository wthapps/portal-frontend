import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterPromotionComponent, FooterComponent } from './footer/footer.component';
import { LoadingModule } from './loading/loading.module';
import { ToastsModule } from './toast/toast-message.module';
import { TablePricingModule } from './table-pricing/table-pricing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LoadingModule,
    ToastsModule,
    TablePricingModule
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
    TablePricingModule
  ],
  providers: []
})
export class PartialsModule {
}
