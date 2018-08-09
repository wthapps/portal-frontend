import { NgModule } from '@angular/core';

import { PipeModule } from '../../../shared/shared/pipe/pipe.module';
import { ZContactHasGroup } from './has-group.pipe';
import { ZContactInternalUser } from './internal-user.pipe';
import { ZContactIsAll } from '@contacts/shared/pipe/is-all.pipe';
import { CanInvitePipe } from '@contacts/shared/pipe/can-invite.pipe';

@NgModule({
  imports: [PipeModule],
  declarations: [ZContactHasGroup, ZContactIsAll, ZContactInternalUser, CanInvitePipe],
  exports: [ZContactHasGroup, ZContactIsAll, ZContactInternalUser, CanInvitePipe ]
})
export class ZContactPipeModule {}
