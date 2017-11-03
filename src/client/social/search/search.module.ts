import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZSocialSearchResultComponent } from './search.component';
import { ZSocialSharedModule } from '../shared/shared.module';
import { ZSocialSearchDetailComponent } from './search-detail.component';
import { ZSocialPostByFilterComponent } from './components/post-by.component';
import { ZSocialPostDateFilterComponent } from './components/post-date.component';


@NgModule({
  imports: [
    CommonModule,
    CoreSharedModule.forRoot(),
    ZSocialSharedModule.forRoot()
  ],
  declarations: [
    ZSocialSearchResultComponent,
    ZSocialSearchDetailComponent,
    ZSocialPostDateFilterComponent,
    ZSocialPostByFilterComponent
  ],
  exports: [
    ZSocialSearchResultComponent,
    ZSocialSearchDetailComponent,
    ZSocialPostDateFilterComponent,
    ZSocialPostByFilterComponent
  ],
  providers: []
})
export class ZSocialSearchModule {
}
