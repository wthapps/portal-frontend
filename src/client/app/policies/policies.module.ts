import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import {
  PoliciesComponent,
  TermsComponent,
  CookiesComponent,
  PrivacyComponent
}                           from './index';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
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
