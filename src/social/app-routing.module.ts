import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { ZSocialHomeComponent } from './home/home.component';
import { ZSocialMembersComponent } from './friends/members.component';
import { PostDetailComponent } from './shared/second-routes/post/post-detail.component';
import { ZSocialSettingComponent } from './settings/setting.component';
import { AuthGuard } from '@wth/shared/services';
import { environment } from '@env/environment';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  { path: 'home', component: ZSocialHomeComponent, canActivate: [AuthGuard] },
  {
    path: 'friends',
    component: ZSocialMembersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    loadChildren:
      './notifications/notifications.module#ZSocialNotificationModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'my-profile',
    loadChildren: './my-profile/my-profile.module#ZSocialMyProfileModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: ZSocialSettingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'posts/:id',
    redirectTo: '/home(detail:posts/:id)',
    canActivate: [AuthGuard]
  },
  {
    path: 'posts/:id',
    component: PostDetailComponent,
    outlet: 'detail',
    canActivate: [AuthGuard]
  },
  {
    path: 'search',
    loadChildren: './search/search.module#ZSocialSearchModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: './profile/profile.module#ZSocialProfileModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'communities',
    loadChildren: './communities/communities.module#ZSocialCommunityModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'news',
    loadChildren: './news/news.module#ZSocialNewsModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false, // <-- debugging purposes only
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
