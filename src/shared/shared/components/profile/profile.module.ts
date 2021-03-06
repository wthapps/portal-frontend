import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalModule } from 'ng2-bs3-modal';
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
import { FileModule } from '../file/file.module';
import { PartialsBasicInfoComponent } from './basic-info/basic-info.component';

@NgModule({
  imports: [
    CommonModule,
    BsModalModule,
    AutoCompleteModule,
    RadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
    PartialsFormModule,
    CoverProfileModule,
    FileModule,
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
    PartialsProfileHobbyComponent,

    PartialsBasicInfoComponent
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
    PartialsProfileHobbyComponent,

    PartialsBasicInfoComponent
  ],
  providers: [
    PartialsProfileService
  ]
})

export class PartialsProfileModule {
}
