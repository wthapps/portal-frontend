import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ZContactViewComponent } from '@contacts/contact/contact-edit/contact-view.component';
import { CoreModule } from '@core/core.module';
import { InvitationModule } from '@shared/shared/components/invitation/invitation.module';
import { WthCommonModule } from '@wth/shared/common/wth-common.module';


import { ContactSharedModule } from '../shared/shared.module';
import { ZContactEditPageComponent } from './contact-edit/contact-edit-page.component';
// import { ZContactDetailComponent } from './contact-detail/contact-detail.component';
import { ZContactEditComponent } from './contact-edit/contact-edit.component';

import { ZContactListComponent } from './contact-list/contact-list.component';
import { ZContactRoutingModule } from './contact-routing.module';
import { CardModule } from '@contacts/shared/card';
import { UserCardModule } from '@shared/user/card';

@NgModule({
  imports: [
    CommonModule,
    InvitationModule,
    ZContactRoutingModule,

    ContactSharedModule,

    CoreModule,
    CardModule,
    UserCardModule,
    WthCommonModule,
  ],
  declarations: [
    ZContactListComponent,
    ZContactEditPageComponent,
    // ZContactDetailComponent,

    // components
    ZContactViewComponent,
    ZContactEditComponent
  ],
  exports: [
    ZContactListComponent,
    ZContactEditPageComponent,
    // ZContactDetailComponent,

    // components
    ZContactViewComponent,
    ZContactEditComponent
  ],
  providers: []
})
export class ContactModule {
}
