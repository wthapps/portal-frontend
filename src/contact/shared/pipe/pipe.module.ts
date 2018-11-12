import { NgModule } from '@angular/core';

import { PipeModule } from '../../../shared/shared/pipe/pipe.module';
import { ZContactHasGroup } from './has-group.pipe';
import { ZContactInternalUser } from './internal-user.pipe';
import { ZContactIsAll } from '@contacts/shared/pipe/is-all.pipe';
import { CanInvitePipe } from '@contacts/shared/pipe/can-invite.pipe';
import { ContactNamePipe } from './contact-name.pipe';
import { ContactAddressPipe } from './contact-address.pipe';

@NgModule({
  imports: [PipeModule],
  declarations: [
    ZContactHasGroup,
    ZContactIsAll,
    ZContactInternalUser,
    CanInvitePipe,
    ContactAddressPipe,
    ContactNamePipe
  ],
  exports: [
    ZContactHasGroup,
    ZContactIsAll,
    ZContactInternalUser,
    CanInvitePipe,
    ContactAddressPipe,
    ContactNamePipe
  ]
})
export class ZContactPipeModule {}
