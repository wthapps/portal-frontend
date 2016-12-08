import { Route } from '@angular/router';
import { ZoneComponent } from './index';
import { ZPictureComponent } from './index';

import { AuthGuard } from "../shared/services/auth-guard.service";
import { PostDetailComponent } from './social/post/post-detail.component';
import { PostDetailPhotoComponent } from './social/post/post-detail-photo.component';

import { ZSocialHomeComponent } from './social/home/social-home.component';


import { ZSocialProfileComponent } from './social/profile/profile.component';
import { ZSocialProfileAboutComponent } from './social/profile/about/about.component';
import { ZSocialProfilePostComponent } from './social/profile/post/post.component';

import { ZSocialCommunityComponent } from './social/communities/communities.component';
import { ZSocialCommunityListComponent } from './social/communities/list/list.component';

import { ZSocialCommunityDetailComponent } from './social/communities/communities-detail.component';


import { ZSocialCommunityDetailNotificationComponent } from './social/communities/notification/notification.component';
import { ComMemberListComponent } from './social/communities/member/member-list.component';
import { ZSocialCommunityDetailAboutComponent } from './social/communities/about/about.component';
import { ZSocialCommunityDetailPostComponent } from './social/communities/post/post.component';

import { ZSocialMembersComponent } from './social/members/members.component';
import { ZSocialSettingComponent } from './social/setting/setting.component';
import { ZSocialNotificationsComponent } from './social/notifications/notifications.component';


export const ZoneRoutes: Route[] = [
  {
    path: 'zone',
    component: ZoneComponent,
    canActivate: [AuthGuard],
    children: [
      {path: 'picture', component: ZPictureComponent},
      {path: 'picture/:category', component: ZPictureComponent},
      {path: 'picture/:category/:id', component: ZPictureComponent},

      {path: 'social/home', component: ZSocialHomeComponent},
      {path: 'social/posts/:id', component: PostDetailComponent},
      {path: 'social/photos/:id', component: PostDetailPhotoComponent},

      // {path: 'social/communities', component: ZSocialCommunityComponent},

      {
        path: 'social/communities',
        component: ZSocialCommunityComponent,
        children: [
          {path: ':id/about', component: ZSocialCommunityDetailAboutComponent},
          {path: ':id/members', component: ComMemberListComponent},
          {path: ':id/notification', component: ZSocialCommunityDetailNotificationComponent},
          {path: ':id/post', component: ZSocialCommunityDetailPostComponent},
          {path: ':id', component: ZSocialCommunityDetailPostComponent},
          {path: '', component: ZSocialCommunityListComponent}
        ]
      },

      {
        path: 'social/notifications',
        component: ZSocialNotificationsComponent,
      },

      {path: 'social/members', component: ZSocialMembersComponent},
      {
        path: 'social/profile', component: ZSocialProfileComponent,
        children: [
          {path: ':id/about', component: ZSocialProfileAboutComponent},
          {path: ':id/post', component: ZSocialProfilePostComponent},
          {path: ':id', component: ZSocialProfilePostComponent},
          {path: '', component: ZSocialProfilePostComponent}
        ]
      },
      /*{
        path: 'social/profile/:id', component: ZSocialProfileComponent,
        children: [
          {path: 'about', component: ZSocialProfileAboutComponent},
          {path: '', component: ZSocialProfilePostComponent},
        ]
      },*/
      {path: 'social/setting', component: ZSocialSettingComponent},

      {path: '', component: ZPictureComponent}
    ]
  }
];



