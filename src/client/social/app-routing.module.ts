import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZSocialHomeComponent } from './home/home.component';
import { ZSocialMembersComponent } from './members/members.component';
import { ZSocialProfileComponent } from './profile/profile.component';
import { ZSocialProfileAboutComponent } from './shared/profile/about/about.component';
import { ZSocialNotificationsComponent } from './notifications/notifications.component';
import { PostDetailComponent } from './shared/post/post-detail.component';
import { AuthGuard } from '../core/shared/services/auth-guard.service';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', component: ZSocialHomeComponent, canActivate: [AuthGuard] },
  { path: 'home', component: ZSocialHomeComponent, canActivate: [AuthGuard] },
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

  // { path: 'members', component: ZSocialMembersComponent },
  // { path: 'profile', component: ZSocialProfileComponent },
  // {
  //   path: 'profile', component: ZSocialProfileComponent,
  //   children: [
  //     {path: ':id/about', component: ZSocialProfileAboutComponent},
  //     // {path: ':id/post', component: ZSocialProfilePostComponent},
  //     // {path: ':id', component: ZSocialProfilePostComponent},
  //     // {path: '', component: ZSocialProfilePostComponent}
  //   ]
  // },
  // { path: 'notifications', component: ZSocialNotificationsComponent },
  // { path: 'posts/:id', component: PostDetailComponent },
  // { path: 'settings', loadChildren: 'social/setting/setting.module#SocialSettingsModule', canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
