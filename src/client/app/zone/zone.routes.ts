import { Route } from '@angular/router';
import { ZoneComponent } from './index';
import { ZPictureComponent } from './index';

import { AuthGuard } from "../shared/services/auth-guard.service";
import { ZSocialPostDetailComponent } from './social/post-detail/post-detail.component';
import { ZSocialPhotoDetailComponent } from './social/photo-detail/photo-detail.component';

import { ZSocialHomeComponent } from './social/home/social-home.component';


import { ZSocialProfileComponent } from './social/profile/profile.component';
import { ZSocialProfileAboutComponent } from './social/profile/about/about.component';
import { ZSocialProfilePostComponent } from './social/profile/post/post.component';

import { ZSocialCommunityComponent } from './social/communities/communities.component';
import { ZSocialCommunityDetailComponent } from './social/communities/communities-detail.component';
import { ZSocialCommunityDetailNotificationComponent } from './social/communities/notification/notification.component';
import { ZSocialCommunityDetailMembersComponent } from './social/communities/members/members.component';
import { ZSocialCommunityDetailAboutComponent } from './social/communities/about/about.component';
import { ZSocialCommunityDetailPostComponent } from './social/communities/post/post.component';

import { ZSocialMembersComponent } from './social/members/members.component';
import { ZSocialSettingComponent } from './social/setting/setting.component';


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
      {path: 'social/posts/:id', component: ZSocialPostDetailComponent},
      {path: 'social/photos/:id', component: ZSocialPhotoDetailComponent},

      {path: 'social/communities', component: ZSocialCommunityComponent},

      {
        path: 'social/communities/:id',
        component: ZSocialCommunityDetailComponent,
        children: [
          {path: '', redirectTo: 'post'},
          {path: 'post', component: ZSocialCommunityDetailPostComponent},
          {path: 'about', component: ZSocialCommunityDetailAboutComponent},
          {path: 'members', component: ZSocialCommunityDetailMembersComponent},
          {path: 'notification', component: ZSocialCommunityDetailNotificationComponent}
        ]
      },

      {path: 'social/members', component: ZSocialMembersComponent},
      {path: 'social/profile', component: ZSocialProfileComponent},
      {
        path: 'social/profile/:id', component: ZSocialProfileComponent,
        children: [
          {path: 'about', component: ZSocialProfileAboutComponent},
          {path: '', component: ZSocialProfilePostComponent},
        ]
      },
      {path: 'social/setting', component: ZSocialSettingComponent},

      {path: '', component: ZPictureComponent}
    ]
  }
];



