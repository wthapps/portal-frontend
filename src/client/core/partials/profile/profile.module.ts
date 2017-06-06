import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AutoCompleteModule } from 'primeng/primeng';

import { PartialsProfileEmailComponent } from './email/email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartialsProfilePhoneComponent } from './phone/phone.component';
import { PartialsProfileAddressComponent } from './address/address.component';
import { PartialsProfileMediaComponent } from './media/media.component';
import { PartialsProfileNoteComponent } from './note/note.component';
import { PipeModule } from '../../shared/pipe/pipe.module';
import { PhoneCodeCountriesPipe, PhoneCodeFlagPipe } from './phone/phone.pipe';

@NgModule({
  imports: [
    CommonModule,
    Ng2Bs3ModalModule,
    AutoCompleteModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule
  ],
  declarations: [
    PartialsProfileEmailComponent,
    PartialsProfilePhoneComponent,
    PartialsProfileAddressComponent,
    PartialsProfileMediaComponent,
    PartialsProfileNoteComponent,
    PhoneCodeCountriesPipe,
    PhoneCodeFlagPipe
  ],
  exports: [
    PartialsProfileEmailComponent,
    PartialsProfilePhoneComponent,
    PartialsProfileAddressComponent,
    PartialsProfileMediaComponent,
    PartialsProfileNoteComponent,
    PhoneCodeCountriesPipe,
    PhoneCodeFlagPipe
  ],
  providers: []
})

export class PartialsProfileModule {
}
