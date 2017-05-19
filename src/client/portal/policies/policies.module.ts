import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartialsModule } from '../../core/partials/partials.module';

import { PoliciesRoutingModule } from './policies-routing.module';
import { PoliciesComponent } from './policies.component';
import { TermsComponent } from './terms.component';
import { PrivacyComponent } from './privacy.component';
import { CookiesComponent } from './cookies.component';


@NgModule({
  imports: [
    CommonModule,
    PoliciesRoutingModule,
    PartialsModule
  ],
  declarations: [
    PoliciesComponent,
    TermsComponent,
    CookiesComponent,
    PrivacyComponent
  ],
  exports: [
    PoliciesComponent
  ]
})

export class PoliciesModule {
}
