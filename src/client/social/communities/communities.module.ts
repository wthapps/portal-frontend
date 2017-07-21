import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZSocialSharedModule } from '../shared/shared.module';

import { ZSocialCommunityRoutingModule } from './communities-routing.module';
import { ZSocialCommunityComponent } from './communities.component';
import { ZSocialCommunityListComponent } from './list/list.component';
import { ZSocialCommunityDetailComponent } from './detail/detail.component';
import { ZSocialCommunitySharedModule } from './shared/shared.module';
import { ZSocialCommunityFormEditComponent } from './shared/form/edit.component';
import { ZSocialCommunityFormPreferenceComponent } from './shared/form/preferences.component';
import { Ng2HdModule } from '../../core/shared/ng2-hd/ng2-hd.module';
import { PostModule } from '../shared/post/post.module';

@NgModule({
  imports: [
    CommonModule,
    ZSocialCommunityRoutingModule,
    PostModule,
    Ng2HdModule,
    ZSocialSharedModule.forRoot(),
    ZSocialCommunitySharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [
    ZSocialCommunityComponent,
    ZSocialCommunityListComponent,
    ZSocialCommunityDetailComponent,
    ZSocialCommunityFormEditComponent,
    // MemberListInviteComponent,

    // // PostListComponent,
    // ZSocialCommunityCoverComponent

    // Preferences
    ZSocialCommunityFormPreferenceComponent,

    // // Notifications
    // ZSocialNotificationsComponent

  ],
  exports: [
    ZSocialSharedModule,
    ZSocialCommunityComponent,
    ZSocialCommunityFormEditComponent,
    ZSocialCommunityDetailComponent,
    ZSocialCommunityFormPreferenceComponent
  ],
  providers: []
})
export class ZSocialCommunityModule {
}
