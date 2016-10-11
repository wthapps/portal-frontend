import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ComingsoonComponent } from './index';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    ComingsoonComponent
  ],
  exports: [
    ComingsoonComponent
  ]
})

export class ComingsoonModule {
}
