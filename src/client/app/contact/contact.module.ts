import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ReCaptchaModule } from 'angular2-recaptcha';

import { PartialsModule } from '../../core/partials/partials.module';

import { ContactComponent } from './contact.component';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactService } from './contact.service';

@NgModule({
  imports: [
    CommonModule,
    ContactRoutingModule,
    PartialsModule,
    FormsModule,
    ReactiveFormsModule,
    ReCaptchaModule
  ],
  declarations: [
    ContactComponent
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
