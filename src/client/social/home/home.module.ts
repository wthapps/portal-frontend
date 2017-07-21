import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZSocialSharedModule } from '../shared/shared.module';

import { ZSocialHomeComponent } from './home.component';
import { ZSocialHomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ZSocialHomeRoutingModule,
    ZSocialSharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [ZSocialHomeComponent],
  exports: [ZSocialHomeComponent],
  providers: []
})
export class ZSocialHomeModule {
}
