import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupportComponent } from './support.component';
import { SupportProductComponent } from './product/product.component';
import { SupportBillingComponent } from './billing/billing.component';
import { SupportLegalComponent } from './legal/legal.component';
import { SupportSecurityComponent } from './security/security.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'support',
        component: SupportComponent,
        children: [
          {path: 'product', component: SupportProductComponent},
          {path: 'billing', component: SupportBillingComponent},
          {path: 'legal', component: SupportLegalComponent},
          {path: 'security', component: SupportSecurityComponent},
          {path: '', component: SupportProductComponent}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class SupportRoutingModule {
}
