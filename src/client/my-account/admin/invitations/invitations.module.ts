import { NgModule } from '@angular/core';

import { MySharedModule } from '../../shared/shared.module';
import { CoreSharedModule } from '../../../core/shared/shared.module';

import { MyInvitationsComponent } from './invitations.component';
import { MyInvitationsRoutingModule } from './invitations-routing.module';
import { InvitationModule } from '../../../core/shared/components/invitation/invitation.module';
import { InvitationService } from '../../../core/shared/components/invitation/invitation.service';


@NgModule({
  imports: [
    MyInvitationsRoutingModule,
    MySharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [
    MyInvitationsComponent

  ],
  exports: [
    MyInvitationsComponent
  ],
  providers: [
  ]

})

export class MyInvitationsModule {
}
