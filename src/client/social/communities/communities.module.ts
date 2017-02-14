import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../core/shared/shared.module';
import { ZSocialSharedModule } from '../shared/shared.module';

import { ZSocialCommunityRoutingModule } from './communities-routing.module';
import { ZSocialCommunityComponent } from './communities.component';
import { ZSocialCommunityListComponent } from './list/list.component';
import { ZSocialCommunityDetailComponent } from './detail/detail.component';
import { ZSocialCommunitySharedModule } from './shared/shared.module';
import {ZSocialCommunityFormEditComponent} from "./shared/form/edit.component";
import {ZSocialCommunityFormPreferenceComponent} from "./shared/form/preferences.component";
import {MemberListInviteComponent} from "./member/member-list-invite.component";
import {PostListComponent} from "../post/post-list.component";
import {Ng2HdModule} from "../shared/ng2-hd/ng2-hd.module";
import {PostModule} from "../post/post.module";
import {ZSocialCommunityCoverComponent} from "./cover/cover.component";
// import {HdModalModule} from "../shared/ng2-hd/modal/hd-modal.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    ZSocialSharedModule.forRoot(),
    ZSocialCommunitySharedModule.forRoot(),
    ZSocialCommunityRoutingModule,
    Ng2HdModule,
    PostModule
  ],
  declarations: [
    ZSocialCommunityComponent,
    ZSocialCommunityListComponent,
    ZSocialCommunityDetailComponent,
    ZSocialCommunityFormEditComponent,
    ZSocialCommunityFormPreferenceComponent,
    MemberListInviteComponent,
    PostListComponent,
    ZSocialCommunityCoverComponent
  ],
  exports: [
    ZSocialCommunityComponent,
    ZSocialCommunityFormEditComponent,
    ZSocialCommunityFormPreferenceComponent
  ],
  providers: []
})
export class ZSocialCommunityModule {
}
