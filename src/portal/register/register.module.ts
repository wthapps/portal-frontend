import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReCaptchaModule } from 'angular2-recaptcha/angular2-recaptcha';

import { ShowHidePasswordModule } from '@shared/shared/components/show-hide-password/show-hide-password.module';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    ShowHidePasswordModule,
    RegisterRoutingModule,
    ReCaptchaModule
  ],
  declarations: [
    RegisterComponent
  ],
  exports: [
    RegisterComponent
  ]
})
export class RegisterModule {}
