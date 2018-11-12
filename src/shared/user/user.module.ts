import { NgModule } from '@angular/core';

import { EmailModule } from '@shared/user/components/email';
import { PhoneModule } from '@shared/user/components/phone';
import { AddressModule } from '@shared/user/components/address';
import { BasicInfoModule } from '@shared/user/components/basic-info';
import { CoverInfoModule } from '@shared/user/components/cover-info';
import { ContactInfoModule } from '@shared/user/components/contact-info';


@NgModule({
  imports: [
    EmailModule,
    PhoneModule,
    AddressModule,
    CoverInfoModule,
    BasicInfoModule,
    ContactInfoModule,
  ],
  declarations: [

  ],
  exports: [
  ],
  providers: [
  ]
})

export class UserModule {
}
