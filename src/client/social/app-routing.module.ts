import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/shared/services/auth-guard.service';
import { ZSocialHomeComponent } from './home/home.component';
import { ZSocialMembersComponent } from './friends/members.component';
import { ZSocialNotificationsComponent } from './notifications/notifications.component';
import { PostDetailComponent } from './shared/post/post-detail.component';
import { ZSocialMyProfileComponent } from './my-profile/my-profile.component';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full', canActivate: [AuthGuard]},
  {path: 'home', component: ZSocialHomeComponent, canActivate: [AuthGuard]},
  {path: 'friends', component: ZSocialMembersComponent},
  {path: 'notifications', component: ZSocialNotificationsComponent},
  {path: 'posts/:id', component: PostDetailComponent},
  {path: 'my-profile', component: ZSocialMyProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}

