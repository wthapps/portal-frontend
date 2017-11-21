
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChipComponent } from './chip.component';
import {  MatCommonModule, MatChipsModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatCommonModule,
    MatChipsModule
  ],
  declarations: [
    // components
    ChipComponent
  ],
  exports: [
    // components
    ChipComponent
  ]
})

export class ChipModule {}
