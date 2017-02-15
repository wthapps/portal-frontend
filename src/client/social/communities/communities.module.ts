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
import {Ng2HdModule} from "../shared/ng2-hd/ng2-hd.module";
import {PostModule} from "../shared/post/post.module";
import {ZSocialCommunityCoverComponent} from "./cover/cover.component";
import { HdModalHeaderComponent } from '../shared/ng2-hd/modal/components/modal-header';

@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    ZSocialSharedModule.forRoot(),
    // ZSocialSharedModule,
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
    // MemberListInviteComponent,
    ZSocialCommunityCoverComponent,
    ZSocialCommunityFormPreferenceComponent

    // // PostListComponent,
    // ZSocialCommunityCoverComponent
  ],
  exports: [
    ZSocialSharedModule,
    ZSocialCommunityComponent,
    ZSocialCommunityFormEditComponent,
    ZSocialCommunityDetailComponent
  ],
  providers: []
})
export class ZSocialCommunityModule {
}
