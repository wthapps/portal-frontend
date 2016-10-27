import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ReactiveFormsModule } from '@angular/forms';

import { RegisterComponent } from './register.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [RegisterComponent],
  exports: [RegisterComponent]
})

export class RegisterModule {
}
