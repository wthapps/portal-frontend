import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { RadioButtonModule } from 'primeng/components/radiobutton/radiobutton';

import { PipeModule } from '../../../shared/pipe/pipe.module';
import { CoverInfoModule } from '../cover-info';
import { BasicInfoModule } from '../basic-info';
import { ContactInfoModule } from '../contact-info';
import { FileModule } from '../../../shared/components/file/file.module';
import { ProfileComponent } from './profile.component';
import { ProfileRouting } from '@shared/user/components/profile/profile-routing';
import { WModalService } from '@shared/modal';
import { ProfileService } from '@shared/user/services';
import { NameEditModalComponent } from '@shared/user/components/cover-info/name-edit-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    BsModalModule,
    AutoCompleteModule,
    RadioButtonModule,
    
    CoverInfoModule,
    BasicInfoModule,
    ContactInfoModule,
    FileModule,
    PipeModule,
    ProfileRouting
  ],
  declarations: [
    ProfileComponent,
    
  ],
  exports: [
    ProfileComponent,
  ],
  providers: [
    ProfileService,
    WModalService,
  ],
  entryComponents: [
    NameEditModalComponent,
  ]
})

export class ProfileModule {
}
