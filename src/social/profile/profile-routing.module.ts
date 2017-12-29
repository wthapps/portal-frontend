import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZSocialProfileComponent } from './profile.component';
import { ZSocialProfileAboutComponent } from './about/about.component';
import { ZSocialProfilePostComponent } from './post/post.component';
import { ZSocialProfileFriendComponent } from './friend/friend.component';
import { AuthGuard } from '@wth/shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id', component: ZSocialProfileComponent,
        children: [
          {path: 'about', component: ZSocialProfileAboutComponent},
          {path: 'post', component: ZSocialProfilePostComponent},
          {path: 'friends', component: ZSocialProfileFriendComponent},
          {path: '', component: ZSocialProfilePostComponent}
        ]
      },
    ])
  ],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
