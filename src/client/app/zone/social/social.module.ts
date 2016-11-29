import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { InputSwitchModule } from 'primeng/primeng';

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

import { ZSocialHomeComponent } from './home/social-home.component';

import { Ng2HdModule } from '../shared/ng2-hd/index';

import { ZSocialCommentBoxComponent } from './post-item/post-item-layout/sub-layout/comment-box.component';

import { ZSocialCommunityComponent } from './communities/communities.component';
import { ZSocialCommunityDetailComponent } from './communities/communities-detail.component';
import { ZSocialCommunityDetailNotificationComponent } from './communities/notification/notification.component';
import { ZSocialCommunityDetailMembersComponent } from './communities/members/members.component';
import { ZSocialCommunityDetailAboutComponent } from './communities/about/about.component';
import { ZSocialCommunityDetailPostComponent } from './communities/post/post.component';

import { ZSocialMembersComponent } from './members/members.component'
import { ZSocialProfileAboutComponent } from './profile/about/about.component';
import { ZSocialProfilePostComponent } from './profile/post/post.component';
import { ZSocialSettingComponent } from './setting/setting.component';
import { ZSocialCommunityListComponent } from './communities/list/list.component';
import { ZSocialCommunityCoverComponent } from './communities/cover/cover.component';
import { ZSocialCommunityFormEditComponent } from './communities/form/edit.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PostModule,
    Ng2HdModule,
    InputSwitchModule
  ],
  declarations: [
    ZSocialHomeComponent,

    // Communities
    ZSocialCommunityComponent,
    ZSocialCommunityListComponent,
    ZSocialCommunityCoverComponent,
    ZSocialCommunityDetailComponent,
    ZSocialCommunityDetailNotificationComponent,
    ZSocialCommunityDetailMembersComponent,
    ZSocialCommunityDetailAboutComponent,
    ZSocialCommunityDetailPostComponent,
    ZSocialCommunityFormEditComponent,

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
    ZSocialProfileAboutComponent,
    ZSocialProfilePostComponent,

    ZSocialSettingComponent,

    ZSocialCommentBoxComponent,
  ],
  exports: [
    ZSocialHomeComponent
  ],
  providers: [],
})

export class ZSocialModule {
}
