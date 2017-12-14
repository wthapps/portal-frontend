import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZSocialSharedModule } from '../shared/shared.module';

import { ZSocialHomeComponent } from './home.component';
import { SharedModule } from '@wth/shared/shared.module';
import { ModalModule } from '@wth/shared/modals/modals.module';

@NgModule({
  imports: [
    CommonModule,
    ZSocialSharedModule,
    ModalModule,
    SharedModule
  ],
  declarations: [ZSocialHomeComponent],
  exports: [ZSocialHomeComponent],
  providers: []
})
export class ZSocialHomeModule {
}
