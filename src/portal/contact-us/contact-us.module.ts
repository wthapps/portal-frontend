import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ReCaptchaModule } from 'angular2-recaptcha';

import { FooterModule } from '@wth/shared/partials/footer/footer.module';
import { ContactUsRoutingModule } from './contact-us-routing.module';
import { ContactUsComponent } from './contact-us.component';
import { ContactUsService } from './contact-us.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContactUsRoutingModule,
    FooterModule,
    ReCaptchaModule
  ],
  declarations: [ContactUsComponent],
  exports: [ContactUsComponent],
  providers: [ContactUsService]
})
export class ContactUsModule {}
