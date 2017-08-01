import { NgModule } from '@angular/core';

import { PipeModule } from "../../../core/shared/pipe/pipe.module";
import { ZContactHasLabel } from "./has-label.pipe";

@NgModule({
  imports: [
    PipeModule
  ],
  declarations: [
    ZContactHasLabel
  ],
  exports: [
    ZContactHasLabel
  ]
})
export class ZContactPipeModule {
}
