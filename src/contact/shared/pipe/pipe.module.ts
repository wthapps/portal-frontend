import { NgModule } from '@angular/core';

import { PipeModule } from '../../../shared/shared/pipe/pipe.module';
import { ZContactHasGroup } from './has-group.pipe';
import { ZContactInternalUser } from './internal-user.pipe';
import { ZContactIsAll } from '@contacts/shared/pipe/is-all.pipe';
import { CanInvitePipe } from '@contacts/shared/pipe/can-invite.pipe';
import { ContactNamePipe } from './contact-name.pipe';
import { UserPipeModule } from '@shared/user/pipe/user-pipe.module';
import { UserAddressPipe } from '@shared/user/pipe';

@NgModule({
  imports: [
    PipeModule,
    UserPipeModule,
  ],
  declarations: [
    ZContactHasGroup,
    ZContactIsAll,
    ZContactInternalUser,
    CanInvitePipe,
    ContactNamePipe
  ],
  exports: [
    ZContactHasGroup,
    ZContactIsAll,
    ZContactInternalUser,
    CanInvitePipe,
    UserAddressPipe,
    ContactNamePipe
  ]
})
export class ZContactPipeModule {}
