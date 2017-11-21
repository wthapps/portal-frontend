import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/shared/services/auth-guard.service';
import { ZSocialHomeComponent } from './home/home.component';
import { ZSocialMembersComponent } from './friends/members.component';
import { ZSocialNotificationsComponent } from './notifications/notifications.component';
import { PostDetailComponent } from './shared/second-routes/post/post-detail.component';
import { ZSocialMyProfileComponent } from './my-profile/my-profile.component';
import { ZSocialSearchResultComponent } from './search/search.component';
import { ZSocialSearchDetailComponent } from './search/search-detail.component';
import { ZSocialProfileComponent } from './profile/profile.component';
import { ZSocialProfileAboutComponent } from './profile/about/about.component';
import { ZSocialProfilePostComponent } from './profile/post/post.component';
import { ZSocialProfileFriendComponent } from './profile/friend/friend.component';
import { ZSocialCommunityDetailComponent } from './communities/detail/detail.component';
import { ZSocialCommunityListComponent } from './communities/list/list.component';
import { ZSocialSettingComponent } from './settings/setting.component';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full', canActivate: [AuthGuard]},
  {path: 'home', component: ZSocialHomeComponent, canActivate: [AuthGuard]},
  {path: 'friends', component: ZSocialMembersComponent},
  {path: 'notifications', component: ZSocialNotificationsComponent},
  {path: 'my-profile', component: ZSocialMyProfileComponent},
  {path: 'search', component: ZSocialSearchResultComponent},
  {path: 'search/member', component: ZSocialSearchDetailComponent},
  {path: 'search/community', component: ZSocialSearchDetailComponent},
  {path: 'search/post', component: ZSocialSearchDetailComponent},
  {path: 'profile/:id', component: ZSocialProfileComponent, children: [
      {path: 'about', component: ZSocialProfileAboutComponent},
      {path: 'post', component: ZSocialProfilePostComponent},
      {path: 'friends', component: ZSocialProfileFriendComponent},
      {path: '', redirectTo: 'post', pathMatch: 'full', canActivate: [AuthGuard]  }
    ]
  },
  {path: 'communities/:id', component: ZSocialCommunityDetailComponent},
  {path: 'settings',  component: ZSocialSettingComponent },
  {path: 'communities', component: ZSocialCommunityListComponent},
  {path: 'posts/:id', component: PostDetailComponent, outlet: 'detail'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
