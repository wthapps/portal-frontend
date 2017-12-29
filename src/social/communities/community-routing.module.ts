import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZSocialCommunityListComponent } from './list/list.component';
import { ZSocialCommunityDetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: ZSocialCommunityListComponent},
      {path: ':id', component: ZSocialCommunityDetailComponent},
    ])
  ],
  exports: [RouterModule]
})
export class CommunityRoutingModule { }
