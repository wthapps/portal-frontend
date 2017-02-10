import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../core/shared/shared.module';
import { ZSocialSharedModule } from '../shared/shared.module';

import { ZSocialHomeComponent } from './home.component';
import { ZSocialHomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ZSocialHomeRoutingModule,
    SharedModule.forRoot(),
    ZSocialSharedModule.forRoot()
  ],
  declarations: [ZSocialHomeComponent],
  exports: [ZSocialHomeComponent],
  providers: []
})
export class ZSocialHomeModule {
}
