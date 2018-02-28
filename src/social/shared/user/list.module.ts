import { NgModule } from '@angular/core';

import { ZSocialShareProfileListComponent } from './list.component';
import { ZSocialShareProfileMemberComponent } from './item/member.component';
import { ZSocialShareProfileCommunityComponent } from './item/community.component';
import { SharedModule } from '@wth/shared/shared.module';
import { ZSocialShareFriendRequestComponent } from './item/friend_request.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ZSocialShareProfileListComponent,
    ZSocialShareProfileMemberComponent,
    ZSocialShareFriendRequestComponent,
    ZSocialShareProfileCommunityComponent
  ],
  exports: [
    ZSocialShareProfileListComponent,
    ZSocialShareProfileMemberComponent,
    ZSocialShareFriendRequestComponent,
    ZSocialShareProfileCommunityComponent
  ],
  providers: [],
})
export class ZSocialShareProfileModule {
}
