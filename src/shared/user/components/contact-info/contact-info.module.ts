import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';

import { ContactInfoComponent } from './contact-info.component';
import { EmailModule } from '@shared/user/components/email';
import { PhoneModule } from '@shared/user/components/phone';
import { MediaModule } from '@shared/user/components/media';
import { AddressModule } from '@shared/user/components/address';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // third party libraries
    BsModalModule,
    PhoneModule,
    EmailModule,
    AddressModule,
    MediaModule,

  ],
  declarations: [
    ContactInfoComponent,
  ],
  exports: [
    PhoneModule,
    EmailModule,
    AddressModule,
    MediaModule,
    ContactInfoComponent,
  ],
  providers: [

  ]
})

export class ContactInfoModule {
}
