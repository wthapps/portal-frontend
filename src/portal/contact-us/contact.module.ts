import { NgModule } from '@angular/core';

import { ReCaptchaModule } from 'angular2-recaptcha';
import { ContactRoutingModule } from '@wth/shared/components/contact-us/contact-routing.module';
import { ContactComponent } from '@wth/shared/components/contact-us/contact.component';
import { ContactService } from '@wth/shared/components/contact-us/contact.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterModule } from '@wth/shared/partials/footer/footer.module';

// import { PortalSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    ContactRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FooterModule,
    // PortalSharedModule,
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
export class ContactUsModule {
}
