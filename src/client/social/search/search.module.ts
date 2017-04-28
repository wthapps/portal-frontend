import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../core/shared/shared.module';
import { ZSocialSearchResultComponent } from './search.component';
import { ZSocialSearchRoutingModule } from './search-routing.module';
import { ZSocialSharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    ZSocialSharedModule.forRoot(),
    ZSocialSearchRoutingModule
  ],
  declarations: [ZSocialSearchResultComponent],
  exports: [ZSocialSearchResultComponent],
  providers: []
})
export class ZSocialSearchModule {
}
