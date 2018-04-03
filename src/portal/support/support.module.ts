import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportComponent } from './support.component';
import { SupportProductComponent } from './product/product.component';
import { SupportBillingComponent } from './billing/billing.component';
import { SupportLegalComponent } from './legal/legal.component';
import { SupportSecurityComponent } from './security/security.component';
import { SupportRoutingModule } from './support-routing.module';
import { PortalSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [SupportRoutingModule, PortalSharedModule.forRoot()],
  declarations: [
    SupportComponent,
    SupportProductComponent,
    SupportBillingComponent,
    SupportLegalComponent,
    SupportSecurityComponent
  ],
  exports: [SupportComponent]
})
export class SupportModule {}
