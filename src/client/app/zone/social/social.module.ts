import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { InputSwitchModule } from 'primeng/primeng';

import { PostModule } from './post/post.module';

import { PostListComponent } from './post/post-list.component';
import { PostDetailComponent } from './post/post-detail.component';

import {
  PostComponent,
  PostHeaderComponent,
  PostBodyComponent,
  PostFooterComponent
} from './post/index';

import { PostDetailPhotoComponent } from './post/post-detail-photo.component';
import { ZSocialProfileComponent } from './profile/profile.component';

import { ZSocialHomeComponent } from './home/social-home.component';

import { Ng2HdModule } from '../shared/ng2-hd/index';

import { ZSocialCommentBoxComponent } from './post/components/sub-layout/comment-box.component';

import { ZSocialCommunityComponent } from './communities/communities.component';
import { ZSocialCommunityDetailComponent } from './communities/communities-detail.component';
import { ZSocialCommunityDetailNotificationComponent } from './communities/notification/notification.component';
import { ComMemberListComponent } from './communities/member/member-list.component';
import { ZSocialCommunityDetailAboutComponent } from './communities/about/about.component';
import { ZSocialCommunityDetailPostComponent } from './communities/post/post.component';

import { ZSocialMembersComponent } from './members/members.component';
import { ZSocialProfileAboutComponent } from './profile/about/about.component';
import { ZSocialProfilePostComponent } from './profile/post/post.component';
import { ZSocialSettingComponent } from './setting/setting.component';
import { ZSocialCommunityListComponent } from './communities/list/list.component';
import { ZSocialCommunityCoverComponent } from './communities/cover/cover.component';
import { ZSocialCommunityFormEditComponent } from './communities/form/edit.component';
import { ZSocialCommunityFormPreferenceComponent } from './communities/form/preferences.component';
import { ZSocialCommunityService } from './communities/communities.service';
import { ZoneReportComponent } from '../shared/form/report/report.component';
import { ZoneReportService } from '../shared/form/report/report.service';
import { ZSocialFavoritesComponent } from './favorites/social-favorites.component';
import { ZSocialProfileCoverComponent } from './profile/cover/cover.component';
import { ZSocialNotificationsComponent } from './notifications/notifications.component';
import { ZSocialProfileFormAboutComponent } from './profile/form/about.component';
import { ZSocialProfileFormContactComponent } from './profile/form/contact.component';
import { ZSocialProfileFormWorkEduComponent } from './profile/form/work-edu.component';
import { ZSocialProfileFormInterestComponent } from './profile/form/interest.component';
import { ZSocialProfileService } from './profile/profile.service';
import { ZSocialSearchResultComponent } from './search/search.component';
import { ZSocialPrivacyComponent } from './profile/about/components/privacy.component';
import { ZSocialComponent } from './social.component';


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
    ZSocialComponent,

    // Home
    ZSocialHomeComponent,
    ZSocialFavoritesComponent,

    //Share
    ZoneReportComponent,

    // Communities
    ZSocialCommunityComponent,
    ZSocialCommunityListComponent,
    ZSocialCommunityCoverComponent,
    ZSocialCommunityDetailComponent,
    ZSocialCommunityDetailNotificationComponent,
    ComMemberListComponent,
    ZSocialCommunityDetailAboutComponent,
    ZSocialCommunityDetailPostComponent,
    ZSocialCommunityFormEditComponent,
    ZSocialCommunityFormPreferenceComponent,

    // members
    ZSocialMembersComponent,


    // List Posts
    PostListComponent,
    PostComponent,
    PostHeaderComponent,
    PostBodyComponent,
    PostFooterComponent,
    PostDetailComponent,
    PostDetailPhotoComponent,


    // Profile
    ZSocialProfileComponent,
    ZSocialProfileAboutComponent,
    ZSocialProfilePostComponent,
    ZSocialProfileCoverComponent,
    ZSocialProfileFormAboutComponent,
    ZSocialProfileFormContactComponent,
    ZSocialProfileFormWorkEduComponent,
    ZSocialProfileFormInterestComponent,

    ZSocialSettingComponent,

    ZSocialCommentBoxComponent,
    // Notification
    ZSocialNotificationsComponent,
    // Search
    ZSocialSearchResultComponent,
    ZSocialPrivacyComponent
  ],
  exports: [
    ZSocialComponent,
    ZSocialHomeComponent,
    ZoneReportComponent
  ],
  providers: [
    ZSocialCommunityService,
    ZoneReportService,
    ZSocialProfileService
  ],
})

export class ZSocialModule {
}
