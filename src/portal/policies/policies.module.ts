import { NgModule } from '@angular/core';

import { PoliciesRoutingModule } from './policies-routing.module';
import { PoliciesComponent } from './policies.component';
import { TermsComponent } from './terms.component';
import { PrivacyComponent } from './privacy.component';

import { PortalSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [PoliciesRoutingModule, PortalSharedModule],
  declarations: [PoliciesComponent, TermsComponent, PrivacyComponent],
  exports: [PoliciesComponent]
})
export class PoliciesModule {}
