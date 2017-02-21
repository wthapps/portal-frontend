import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZSocialCommunityComponent } from './communities.component';
import { ZSocialCommunityDetailComponent } from './detail/detail.component';
import { ZSocialCommunityListComponent } from './list/list.component';
import { PostComponent } from '../shared/post/post.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      // {
      //   path: 'communities',
      //   component: ZSocialCommunityComponent,
      //   children: [
      //     // {path: ':id/about', component: ZSocialCommunityDetailAboutComponent},
      //     // {path: ':id/members', component: ComMemberListComponent},
      //     // {path: ':id/notification', component: ZSocialCommunityDetailNotificationComponent},
      //     {path: ':id/post', component: PostComponent},
      //     {path: ':id', component: ZSocialCommunityDetailComponent},
      //     {path: '', component: ZSocialCommunityListComponent}
      //   ]
      // }
    ])
  ],
  exports: [RouterModule]
})
export class ZSocialCommunityRoutingModule { }
