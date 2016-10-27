import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})

export class LoginModule {
}
