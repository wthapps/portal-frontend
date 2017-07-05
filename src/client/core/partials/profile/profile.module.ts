import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AutoCompleteModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';

import { PartialsProfileEmailComponent } from './email/email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartialsProfilePhoneComponent } from './phone/phone.component';
import { PartialsProfileAddressComponent } from './address/address.component';
import { PartialsProfileMediaComponent } from './media/media.component';
import { PartialsProfileNoteComponent } from './note/note.component';
import { PipeModule } from '../../shared/pipe/pipe.module';
import { PartialsProfileAvatarInfoComponent } from './avatar-info/avatar-info.component';
import { PartialsProfileAboutComponent } from './about/about.component';
import { PartialsProfileContactComponent } from './contact/contact.component';
import { PartialsProfileWorkEduComponent } from './work-edu/work-edu.component';
import { PartialsProfileHobbyComponent } from './hobby/hobby.component';
import { PartialsProfileComponent } from './profile.component';
import { PartialsProfileService } from './profile.service';

@NgModule({
  imports: [
    CommonModule,
    Ng2Bs3ModalModule,
    AutoCompleteModule,
    RadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule
  ],
  declarations: [
    PartialsProfileComponent,
    PartialsProfileAvatarInfoComponent,
    PartialsProfileAboutComponent,
    PartialsProfileEmailComponent,
    PartialsProfilePhoneComponent,
    PartialsProfileAddressComponent,
    PartialsProfileMediaComponent,
    PartialsProfileNoteComponent,
    PartialsProfileContactComponent,
    PartialsProfileWorkEduComponent,
    PartialsProfileHobbyComponent
  ],
  exports: [
    PartialsProfileComponent,
    PartialsProfileAvatarInfoComponent,
    PartialsProfileAboutComponent,
    PartialsProfileEmailComponent,
    PartialsProfilePhoneComponent,
    PartialsProfileAddressComponent,
    PartialsProfileMediaComponent,
    PartialsProfileNoteComponent,
    PartialsProfileContactComponent,
    PartialsProfileWorkEduComponent,
    PartialsProfileHobbyComponent
  ],
  providers: [
    PartialsProfileService
  ]
})

export class PartialsProfileModule {
}
