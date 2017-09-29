
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChipComponent } from './chip.component';
import {  MdCommonModule, MdChipsModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MdCommonModule,
    MdChipsModule
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
