import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZSocialSharedModule } from '../shared/shared.module';
import { ZSocialSearchResultAllComponent } from './all/search-all.component';
import { ZSocialSearchResultDetailComponent } from './detail/search-detail.component';
import { ZSocialSearchResultComponent } from './search.component';


@NgModule({
  imports: [
    CommonModule,
    CoreSharedModule.forRoot(),
    ZSocialSharedModule.forRoot()
  ],
  declarations: [
    ZSocialSearchResultComponent,
    ZSocialSearchResultAllComponent,
    ZSocialSearchResultDetailComponent
  ],
  exports: [
    ZSocialSearchResultComponent,
    ZSocialSearchResultAllComponent,
    ZSocialSearchResultDetailComponent
  ],
  providers: []
})
export class ZSocialSearchModule {
}
