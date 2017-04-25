import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZSocialProfileComponent } from './profile.component';
import { ZSocialProfileAboutComponent } from './about/about.component';
import { ZSocialProfilePostComponent } from './post/post.component';
import { ZSocialProfileFriendComponent } from './friend/friend.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'profile/:id/about', component: ZSocialProfileAboutComponent},
      {path: 'profile/:id/post', component: ZSocialProfilePostComponent},
      {path: 'profile/:id/friends', component: ZSocialProfileFriendComponent},
      {path: 'profile/:id', component: ZSocialProfilePostComponent},
    ])
  ],
  exports: [RouterModule]
})
export class ZSocialProfileRoutingModule { }
