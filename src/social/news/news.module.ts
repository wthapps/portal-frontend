import { NgModule } from '@angular/core';

import { ZSocialNewsComponent } from './news.component';
import { ZSocialSharedModule } from '../shared/shared.module';
import { ZSocialNewsRoutingModule } from './news-routing.module';
import { BoxLoadingModule } from '@wth/shared/shared/components/box-loading/box-loading.module';
import { PostModule } from '@social/shared/second-routes/post';
import { ZSocialSharedNewsFeedComponent } from '@social/shared/news-feed/news-feed.component';

@NgModule({
  imports: [
    PostModule,
    ZSocialSharedModule,
    BoxLoadingModule,
    ZSocialNewsRoutingModule
  ],
  declarations: [
    ZSocialNewsComponent,
    ZSocialSharedNewsFeedComponent
  ],
  exports: [ZSocialNewsComponent,
    ZSocialSharedNewsFeedComponent
  ],
  providers: []
})
export class ZSocialNewsModule { }
