import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZSocialHomeComponent } from './home/home.component';
import { ZSocialMembersComponent } from './members/members.component';
import { ZSocialNotificationsComponent } from './notifications/notifications.component';
import { PostDetailComponent } from './shared/post/post-detail.component';
import { AuthGuard } from '../core/shared/services/auth-guard.service';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'home', component: ZSocialHomeComponent, canActivate: [AuthGuard] },
  { path: 'members', component: ZSocialMembersComponent  },
  { path: 'notifications', component: ZSocialNotificationsComponent  },
  { path: 'posts/:id', component: PostDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
