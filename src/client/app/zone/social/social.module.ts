import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { ZSocialComponent } from './social.component';
import { ZSocialTempComponent } from './social-temp.component';
import { ZSocialTempDetailComponent } from './social-temp-detail.component';

import { PostModule } from "./post/post.module";

import { ZSocialPostListComponent } from "./post-list/post-list.component";
import { ZSocialPostDetailComponent } from './post-detail/post-detail.component';

import {
  ZSocialPostItemComponent,
  ZSocialPostItemHeaderComponent,
  ZSocialPostItemBodyComponent,
  ZSocialPostItemFooterComponent
} from "./post-item/index";

import { ZSocialCommunityTempComponent } from './communities-temp.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PostModule
  ],
  declarations: [
    ZSocialComponent,
    ZSocialTempComponent,
    ZSocialTempDetailComponent,
    ZSocialCommunityTempComponent,
    // List Posts
    ZSocialPostListComponent,
    ZSocialPostItemComponent,
    ZSocialPostItemHeaderComponent,
    ZSocialPostItemBodyComponent,
    ZSocialPostItemFooterComponent,
    ZSocialPostDetailComponent

  ],
  exports: [
    ZSocialComponent,
    ZSocialTempComponent,
    ZSocialTempDetailComponent
  ],
  providers: [],
})

export class ZSocialModule {
}
