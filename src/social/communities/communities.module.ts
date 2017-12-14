import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZSocialSharedModule } from '../shared/shared.module';

import { ZSocialCommunityComponent } from './communities.component';
import { ZSocialCommunityListComponent } from './list/list.component';
import { ZSocialCommunityDetailComponent } from './detail/detail.component';
import { ZSocialCommunitySharedModule } from './shared/shared.module';
import { ZSocialCommunityFormEditComponent } from './shared/form/edit.component';
import { ZSocialCommunityFormPreferenceComponent } from './shared/form/preferences.component';
import { PostModule } from '../shared/second-routes/post/post.module';
import { Ng2HdModule } from '@wth/shared/shared/ng2-hd';
import { SharedModule } from '@wth/shared/shared.module';
import { CoreModule } from '@wth/core/core.module';

@NgModule({
  imports: [
    CommonModule,
    PostModule,
    Ng2HdModule,
    ZSocialSharedModule,
    ZSocialCommunitySharedModule,
    SharedModule,
    CoreModule

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
