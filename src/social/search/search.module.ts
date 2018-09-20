import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZSocialSharedModule } from '../shared/shared.module';
import { ZSocialSearchResultAllComponent } from './all/search-all.component';
import { ZSocialSearchResultDetailComponent } from './detail/search-detail.component';
// import { ZSocialSearchResultComponent } from './search.component';
import { ZSocialPostByFilterComponent } from './components/post-by.component';
import { ZSocialPostDateFilterComponent } from './components/post-date.component';
// import { SharedModule } from '@wth/shared/shared.module';
import { SearchRoutingModule } from './search-routing.module';
import { PostModule } from '@social/shared/second-routes/post';

@NgModule({
  imports: [
    CommonModule,
    ZSocialSharedModule,
    PostModule,
    SearchRoutingModule,
    // SharedModule
  ],
  declarations: [
    // ZSocialSearchResultComponent,
    ZSocialSearchResultAllComponent,
    ZSocialSearchResultDetailComponent,
    ZSocialPostByFilterComponent,
    ZSocialPostDateFilterComponent
  ],
  exports: [
    // ZSocialSearchResultComponent,
    ZSocialSearchResultAllComponent,
    ZSocialSearchResultDetailComponent,
    ZSocialPostByFilterComponent,
    ZSocialPostDateFilterComponent
  ],
  providers: []
})
export class ZSocialSearchModule {}
