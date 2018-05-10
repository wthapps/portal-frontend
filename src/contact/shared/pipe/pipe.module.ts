import { NgModule } from '@angular/core';

import { PipeModule } from '../../../shared/shared/pipe/pipe.module';
import { ZContactHasGroup } from './has-group.pipe';
import { ZContactInternalUser } from './internal-user.pipe';
import { ZContactIsAll } from '@contacts/shared/pipe/is-all.pipe';

@NgModule({
  imports: [PipeModule],
  declarations: [ZContactHasGroup, ZContactIsAll, ZContactInternalUser],
  exports: [ZContactHasGroup, ZContactIsAll, ZContactInternalUser]
})
export class ZContactPipeModule {}
