import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { RadioButtonModule } from 'primeng/components/radiobutton/radiobutton';

import { PipeModule } from '../../pipe/pipe.module';

import { PartialsProfileEmailComponent } from './email/email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartialsProfilePhoneComponent } from './phone/phone.component';
import { PartialsProfileAddressComponent } from './address/address.component';
import { PartialsProfileMediaComponent } from './media/media.component';
import { PartialsProfileNoteComponent } from './note/note.component';
import { PartialsProfileAvatarInfoComponent } from './avatar-info/avatar-info.component';
import { PartialsProfileAboutComponent } from './about/about.component';
import { PartialsProfileContactComponent } from './contact/contact.component';
import { PartialsProfileWorkComponent } from './work-edu/work.component';
import { PartialsProfileHobbyComponent } from './hobby/hobby.component';
import { PartialsProfileComponent } from './profile.component';
import { PartialsProfileService } from './profile.service';
import { PartialsFormModule } from '../form/partials-form.module';
import { PartialsProfileEducationComponent } from './work-edu/education.component';
import { CoverProfileModule } from '../cover-profile/cover-profile.module';
import { ZSharedPhotoModule } from '../zone/photo/photo.module';

@NgModule({
  imports: [
    CommonModule,
    Ng2Bs3ModalModule,
    AutoCompleteModule,
    RadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
    PartialsFormModule,
    CoverProfileModule,
    ZSharedPhotoModule,
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
    PartialsProfileWorkComponent,
    PartialsProfileEducationComponent,
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
    PartialsProfileWorkComponent,
    PartialsProfileEducationComponent,
    PartialsProfileHobbyComponent
  ],
  providers: [
    PartialsProfileService
  ]
})

export class PartialsProfileModule {
}
