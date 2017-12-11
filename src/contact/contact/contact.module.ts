import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactSharedModule } from '../shared/shared.module';
import { ZContactRoutingModule } from './contact-routing.module';

import { ZContactListComponent } from './contact-list/contact-list.component';
import { ZContactEditPageComponent } from './contact-edit/contact-edit-page.component';
import { ZContactDetailComponent } from './contact-detail/contact-detail.component';
import { ZContactEditComponent } from './contact-edit/contact-edit.component';

import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { InvitationModule } from '../../shared/shared/components/invitation/invitation.module';

@NgModule({
  imports: [
    CommonModule,
    InvitationModule,
    ZContactRoutingModule,

    ContactSharedModule.forRoot(),

    CoreModule.forRoot(),
    SharedModule.forRoot()
  ],
  declarations: [
    ZContactListComponent,
    ZContactEditPageComponent,
    ZContactDetailComponent,

    //components
    ZContactEditComponent,
  ],
  exports: [
    ZContactListComponent,
    ZContactEditPageComponent,
    ZContactDetailComponent,

    //components
    ZContactEditComponent
  ],
  providers: []
})
export class ContactModule {
}
