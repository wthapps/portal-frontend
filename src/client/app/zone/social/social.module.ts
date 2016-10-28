import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { ZSocialComponent } from './social.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    ZSocialComponent
  ],
  exports: [
    ZSocialComponent
  ],
  providers: [],
})

export class ZSocialModule {
}
