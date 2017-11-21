import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipeModule } from '../../pipe/pipe.module';

import { DisplayLinkComponent } from './display-link.component';


@NgModule({
  imports: [
    CommonModule,
    PipeModule
  ],
  declarations: [
    DisplayLinkComponent
  ],
  exports: [
    DisplayLinkComponent
  ],
  providers: []
})

export class DisplayLinkModule {
}
