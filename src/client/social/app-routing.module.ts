import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZSocialHomeComponent } from './home/home.component';
import { ZSocialMembersComponent } from './members/members.component';
import { ZSocialSettingComponent } from './setting/setting.component';
import { ZSocialProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  {  path: 'home', component: ZSocialHomeComponent  },
  {  path: 'members', component: ZSocialMembersComponent  },
  {  path: 'profile', component: ZSocialProfileComponent  },
  {  path: 'settings', loadChildren: 'social/setting/setting.module#SocialSettingsModule'  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
