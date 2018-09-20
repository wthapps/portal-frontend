import { WthCommonModule } from './../../../shared/common/wth-common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZSocialShareProfileListComponent } from './list.component';
import { ZSocialShareProfileMemberComponent } from './item/member.component';
import { ZSocialShareProfileCommunityComponent } from './item/community.component';
// import { SharedModule } from '@wth/shared/shared.module';
import { ZSocialShareFriendRequestComponent } from './item/friend_request.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZSocialSharedModule } from '@social/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WthCommonModule
    // SharedModule
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
