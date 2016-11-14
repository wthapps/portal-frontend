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
import { ZSocialPhotoDetailComponent } from './photo-detail/photo-detail.component';
import { ZSocialProfileComponent } from './profile/profile.component';
import { HdModalModule } from '../shared/ng2-hd/modal/hd-modal';
import { ZSocialCommentBoxComponent } from './post-item/post-item-layout/sub-layout/comment-box.component';
import { ZSocialHtmlComponent } from './social-html.component';
import { ZSocialCommunityDetailTempComponent } from './html/communities-detail-temp.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PostModule,
    HdModalModule
  ],
  declarations: [
    ZSocialComponent,

    // html
    ZSocialTempComponent,
    ZSocialTempDetailComponent,
    ZSocialCommunityTempComponent,
    ZSocialHtmlComponent,
    ZSocialCommunityDetailTempComponent,
    // end html


    // List Posts
    ZSocialPostListComponent,
    ZSocialPostItemComponent,
    ZSocialPostItemHeaderComponent,
    ZSocialPostItemBodyComponent,
    ZSocialPostItemFooterComponent,
    ZSocialPostDetailComponent,
    ZSocialPhotoDetailComponent,
    ZSocialProfileComponent,
    ZSocialCommentBoxComponent,
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
