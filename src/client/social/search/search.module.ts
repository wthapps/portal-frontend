import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../core/shared/shared.module';
import { ZSocialSearchResultComponent } from './search.component';
import { ZSocialSearchRoutingModule } from './search-routing.module';
import { ZSocialSharedModule } from '../shared/shared.module';
import { ZSocialSearchDetailComponent } from './search-detail.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    ZSocialSharedModule.forRoot(),
    ZSocialSearchRoutingModule
  ],
  declarations: [
    ZSocialSearchResultComponent,
    ZSocialSearchDetailComponent
  ],
  exports: [
    ZSocialSearchResultComponent,
    ZSocialSearchDetailComponent
  ],
  providers: []
})
export class ZSocialSearchModule {
}
