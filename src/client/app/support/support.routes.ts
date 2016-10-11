import { Route } from '@angular/router';

import { SupportComponent } from './index';
import { SupportProductComponent } from './product/product.component';
import { SupportBillingComponent } from './billing/billing.component';
import { SupportLegalComponent } from './legal/legal.component';
import { SupportSecurityComponent } from './security/security.component';

export const SupportRoutes: Route[] = [
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
];
