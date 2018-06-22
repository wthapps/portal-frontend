import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactSharedModule } from '../shared/shared.module';
import { ZContactRoutingModule } from './contact-routing.module';

import { ZContactListComponent } from './contact-list/contact-list.component';
import { ZContactEditPageComponent } from './contact-edit/contact-edit-page.component';
import { ZContactDetailComponent } from './contact-detail/contact-detail.component';
import { ZContactEditComponent } from './contact-edit/contact-edit.component';

import { CoreModule } from '../../core/core.module';
import { InvitationModule } from '../../shared/shared/components/invitation/invitation.module';
import { WthCommonModule } from '@wth/shared/common/wth-common.module';
import { ZContactUserDetailComponent } from '@contacts/contact/user-detail/contact-user-detail.component';
import { ZContactViewComponent } from '@contacts/contact/contact-edit/contact-view.component';

@NgModule({
  imports: [
    CommonModule,
    InvitationModule,
    ZContactRoutingModule,

    ContactSharedModule,

    CoreModule,
    WthCommonModule
  ],
  declarations: [
    ZContactListComponent,
    ZContactEditPageComponent,
    ZContactDetailComponent,
    ZContactUserDetailComponent,

    //components
    ZContactViewComponent,
    ZContactEditComponent

  ],
  exports: [
    ZContactListComponent,
    ZContactEditPageComponent,
    ZContactDetailComponent,

    //components
    ZContactViewComponent,
    ZContactEditComponent
  ],
  providers: []
})
export class ContactModule {}
