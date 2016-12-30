import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ZMediaSharedWithMeService,
  ZMediaSharedWithMeComponent
} from './index';

import { ZMediaSharedModule } from '../shared/shared.module';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ZMediaSharedModule.forRoot()
  ],
  declarations: [
    ZMediaSharedWithMeComponent
  ],
  exports: [
    ZMediaSharedWithMeComponent
  ],
  providers: [
    ZMediaSharedWithMeService
  ]
})

export class ZMediaSharedWithMeModule {
}
