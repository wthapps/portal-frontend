import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MySharedModule } from '../../shared/shared.module';
import { CoreSharedModule } from '../../../core/shared/shared.module';

import { MyInvitationsComponent } from './invitations.component';
import { MyInvitationsRoutingModule } from './invitations-routing.module';
import { InvitationModule } from '../../../core/shared/components/invitation/invitation.module';


@NgModule({
  imports: [
    CommonModule,
    CoreSharedModule,
    MyInvitationsRoutingModule,
    MySharedModule.forRoot(),

  ],
  declarations: [
    MyInvitationsComponent

  ],
  exports: [
    MyInvitationsComponent
  ]
})

export class MyInvitationsModule {
}
