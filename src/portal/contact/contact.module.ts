import { NgModule } from '@angular/core';

import { ReCaptchaModule } from 'angular2-recaptcha';

import { ContactComponent } from './contact.component';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactService } from './contact.service';

import { PortalSharedModule } from '../shared/shared.module';
import { FooterModule } from '../../shared/shared/components/footer/footer.module';

@NgModule({
  imports: [
    ContactRoutingModule,
    PortalSharedModule.forRoot(),
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
