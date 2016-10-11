import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ReactiveFormsModule } from '@angular/forms';

import {
  ForgottenPasswordComponent,
  NewPasswordComponent,
  ResetEmailSentComponent
}                           from './index';

import {
  AccountComponent
} from './index';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    AccountComponent,
    ForgottenPasswordComponent,
    NewPasswordComponent,
    ResetEmailSentComponent
  ],
  exports: [
    AccountComponent
  ]
})

export class AccountModule {
}
