import { Route } from '@angular/router';

import { ZSocialComponent } from './social.component';

import { ZSocialHomeComponent } from './home/social-home.component';
import { PostDetailPhotoComponent } from './post/post-detail-photo.component';
import { PostDetailComponent } from './post/post-detail.component';
import { ZSocialCommunityListComponent } from './communities/list/list.component';
import { ZSocialCommunityDetailPostComponent } from './communities/post/post.component';
import { ZSocialCommunityDetailNotificationComponent } from './communities/notification/notification.component';
import { ComMemberListComponent } from './communities/member/member-list.component';
import { ZSocialCommunityDetailAboutComponent } from './communities/about/about.component';
import { ZSocialCommunityComponent } from './communities/communities.component';
import { ZSocialNotificationsComponent } from './notifications/notifications.component';
import { ZSocialProfilePostComponent } from './profile/post/post.component';
import { ZSocialProfileAboutComponent } from './profile/about/about.component';
import { ZSocialProfileComponent } from './profile/profile.component';
import { ZSocialSearchResultComponent } from './search/search.component';
import { ZSocialMembersComponent } from './members/members.component';
import { ZSocialSettingComponent } from './setting/setting.component';
import { ZSocialCommunityDetailComponent } from './communities/communities-detail.component';


export const ZSocialRoutes: Route[] = [
  {
    path: 'social',
    component: ZSocialComponent,
    children: [
      {path: 'home', component: ZSocialHomeComponent},
      {path: 'posts/:id', component: PostDetailComponent},
      {path: 'photos/:id', component: PostDetailPhotoComponent},
      {
        path: 'communities',
        component: ZSocialCommunityComponent,
        children: [
          // {path: ':id/about', component: ZSocialCommunityDetailAboutComponent},
          // {path: ':id/members', component: ComMemberListComponent},
          // {path: ':id/notification', component: ZSocialCommunityDetailNotificationComponent},
          // {path: ':id/post', component: ZSocialCommunityDetailPostComponent},
          {path: ':id', component: ZSocialCommunityDetailComponent},
          {path: '', component: ZSocialCommunityListComponent}
        ]
      },
      {path: 'notifications', component: ZSocialNotificationsComponent},

      {path: 'members', component: ZSocialMembersComponent},
      {path: 'search', component: ZSocialSearchResultComponent},
      {
        path: 'profile', component: ZSocialProfileComponent,
        children: [
          {path: ':id/about', component: ZSocialProfileAboutComponent},
          {path: ':id/post', component: ZSocialProfilePostComponent},
          {path: ':id', component: ZSocialProfilePostComponent},
          {path: '', component: ZSocialProfilePostComponent}
        ]
      },
      {path: 'setting', component: ZSocialSettingComponent},
    ]
  }
];
