import { NgModule } from '@angular/core';

import { PipeModule } from '../../../shared/shared/pipe/pipe.module';
import { ZContactHasGroup } from './has-group.pipe';
import { ZContactInternalUser } from './internal-user.pipe';

@NgModule({
  imports: [
    PipeModule
  ],
  declarations: [
    ZContactHasGroup,
    ZContactInternalUser
  ],
  exports: [
    ZContactHasGroup,
    ZContactInternalUser
  ]
})
export class ZContactPipeModule {
}
