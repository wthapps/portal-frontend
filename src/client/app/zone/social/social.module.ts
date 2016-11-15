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

import { ZSocialPhotoDetailComponent } from './photo-detail/photo-detail.component';
import { ZSocialProfileComponent } from './profile/profile.component';
import { HdModalModule } from '../shared/ng2-hd/modal/hd-modal';
import { ZSocialCommentBoxComponent } from './post-item/post-item-layout/sub-layout/comment-box.component';
import { ZSocialHtmlComponent } from './social-html.component';

import { ZSocialCommunityComponent } from './communities/communities.component';
import { ZSocialCommunityDetailComponent } from './communities/communities-detail.component';
import { ZSocialCommunityDetailNotificationComponent } from './communities/notification/notification.component';
import { ZSocialCommunityDetailMembersComponent } from './communities/members/members.component';
import { ZSocialCommunityDetailAboutComponent } from './communities/about/about.component';
import { ZSocialCommunityDetailPostComponent } from './communities/post/post.component';

import { ZSocialMembersComponent } from './members/members.component'


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
    ZSocialHtmlComponent,
    // end html

    // Communities
    ZSocialCommunityComponent,
    ZSocialCommunityDetailComponent,
    ZSocialCommunityDetailNotificationComponent,
    ZSocialCommunityDetailMembersComponent,
    ZSocialCommunityDetailAboutComponent,
    ZSocialCommunityDetailPostComponent,

    // members
    ZSocialMembersComponent,


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
    ZSocialComponent
  ],
  providers: [],
})

export class ZSocialModule {
}
