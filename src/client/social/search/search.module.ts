import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZSocialSharedModule } from '../shared/shared.module';
import { ZSocialSearchResultAllComponent } from './all/search-all.component';
import { ZSocialSearchResultDetailComponent } from './detail/search-detail.component';
import { ZSocialSearchResultComponent } from './search.component';
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
    ZSocialSearchResultAllComponent,
    ZSocialSearchResultDetailComponent,
    ZSocialPostByFilterComponent,
    ZSocialPostDateFilterComponent
  ],
  exports: [
    ZSocialSearchResultComponent,
    ZSocialSearchResultAllComponent,
    ZSocialSearchResultDetailComponent,
    ZSocialPostByFilterComponent,
    ZSocialPostDateFilterComponent
  ],
  providers: []
})
export class ZSocialSearchModule {
}
