import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ReactiveFormsModule } from '@angular/forms';

import { ContactComponent } from './contact.component';
import { ContactService } from './contact.service';
import { ReCaptchaComponent } from '../shared/index';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    ContactComponent,
    ReCaptchaComponent
  ],
  exports: [
    ContactComponent
  ],
  providers: [
    ContactService
  ]
})

export class ContactModule {
}
