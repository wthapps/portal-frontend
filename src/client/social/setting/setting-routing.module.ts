import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZSocialCommunityComponent } from '../communities/communities.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '',  component: ZSocialCommunityComponent }
    ])
  ],
  exports: [RouterModule]
})
export class SocialSettingsRoutingModule { }
