import { NgModule } from '@angular/core';

import { PipeModule } from '../../../core/shared/pipe/pipe.module';
import { ZContactHasLabel } from './has-label.pipe';
import { ZContactInternalUser } from './internal-user.pipe';

@NgModule({
  imports: [
    PipeModule
  ],
  declarations: [
    ZContactHasLabel,
    ZContactInternalUser
  ],
  exports: [
    ZContactHasLabel,
    ZContactInternalUser
  ]
})
export class ZContactPipeModule {
}
