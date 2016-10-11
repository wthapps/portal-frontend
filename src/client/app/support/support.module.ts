import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { SupportComponent } from './index';
import { SupportProductComponent } from './product/product.component';
import { SupportBillingComponent } from './billing/billing.component';
import { SupportLegalComponent } from './legal/legal.component';
import { SupportSecurityComponent } from './security/security.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    SupportComponent,
    SupportProductComponent,
    SupportBillingComponent,
    SupportLegalComponent,
    SupportSecurityComponent
  ],
  exports: [
    SupportComponent
  ]
})

export class SupportModule {
}
