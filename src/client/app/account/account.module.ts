import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ReactiveFormsModule } from '@angular/forms';

import {
  AccountMenuComponent
} from './index';

import {
  ForgottenPasswordComponent,
  NewPasswordComponent,
  ResetEmailSentComponent
} from './index';

import {
  AccountAppsComponent,
  AccountAppsListComponent,
  AccountAppsDetailComponent
} from './index';

import {
  MyAppsDetailAddComponent,
  MyAppsDetailComponent,
  MyAppsListComponent,
  DNSComponent,
  DNSEditComponent
} from './index';

import {
  //2 PaymentConfirmComponent,
  //2 PaymentEditComponent,
  PaymentComponent,
  PlansComponent
} from './index';

import {
  AccountComponent,
  ProfileComponent,
  MyAccountComponent,
  PreferencesComponent
} from './index';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    AccountMenuComponent,

    AccountComponent,
    ProfileComponent,
    MyAccountComponent,
    PreferencesComponent,

    ForgottenPasswordComponent,
    NewPasswordComponent,
    ResetEmailSentComponent,

    AccountAppsComponent,
    AccountAppsListComponent,
    AccountAppsDetailComponent,

    MyAppsDetailAddComponent,
    MyAppsDetailComponent,
    MyAppsListComponent,
    DNSComponent,
    DNSEditComponent,

    //2 PaymentConfirmComponent,
    //2 PaymentEditComponent,
    PaymentComponent,
    PlansComponent
  ],
  exports: [
    AccountComponent
  ]
})

export class AccountModule {
}
