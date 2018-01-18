import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZSocialCommunityListComponent } from './list/list.component';
import { ZSocialCommunityDetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: ':id', component: ZSocialCommunityDetailComponent },
      { path: '', component: ZSocialCommunityListComponent }
    ])
  ],
  exports: [RouterModule]
})
export class CommunityRoutingModule { }
