import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZSocialHomeComponent } from './home/home.component';
import { ZSocialMembersComponent } from './members/members.component';
import { ZSocialSettingComponent } from './setting/setting.component';
import { ZSocialProfileComponent } from './profile/profile.component';
import { ZSocialProfileAboutComponent } from './shared/profile/about/about.component';
import { ZSocialNotificationsComponent } from './notifications/notifications.component';
import { PostDetailComponent } from './shared/post/post-detail.component';

export const routes: Routes = [
  {  path: 'home', component: ZSocialHomeComponent  },
  {  path: 'members', component: ZSocialMembersComponent  },
  {  path: 'profile', component: ZSocialProfileComponent  },
  {
    path: 'profile', component: ZSocialProfileComponent,
    children: [
      {path: ':id/about', component: ZSocialProfileAboutComponent},
      // {path: ':id/post', component: ZSocialProfilePostComponent},
      // {path: ':id', component: ZSocialProfilePostComponent},
      // {path: '', component: ZSocialProfilePostComponent}
    ]
  },
  {  path: 'notifications', component: ZSocialNotificationsComponent  },
  { path: 'posts/:id', component: PostDetailComponent },
  {  path: 'settings', loadChildren: './social/setting/setting.module#SocialSettingsModule'  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
