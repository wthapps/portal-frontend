import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../core/shared/shared.module';
import { ZSocialSharedModule } from '../shared/shared.module';

import { ZSocialCommunityRoutingModule } from './communities-routing.module';
import { ZSocialCommunityComponent } from './communities.component';
import { ZSocialCommunityListComponent } from './list/list.component';
import { ZSocialCommunityDetailComponent } from './detail/detail.component';
import { ZSocialCommunitySharedModule } from './shared/shared.module';
import { ZSocialCommunityFormEditComponent } from './shared/form/edit.component';
import { ZSocialCommunityFormPreferenceComponent } from './shared/form/preferences.component';
import { Ng2HdModule } from '../shared/ng2-hd/ng2-hd.module';
import { PostModule } from '../shared/post/post.module';
import { ZSocialCommunityCoverComponent } from './cover/cover.component';
import { LoadingModule } from '../../core/partials/loading/loading.module';
import { LoadingService } from '../../core/partials/loading/loading.service';

@NgModule({
  imports: [
    CommonModule,
    ZSocialCommunityRoutingModule,
    PostModule,
    Ng2HdModule,
    LoadingModule,
    ZSocialSharedModule.forRoot(),
    SharedModule.forRoot(),
    ZSocialCommunitySharedModule.forRoot()
  ],
  declarations: [
    ZSocialCommunityComponent,
    ZSocialCommunityListComponent,
    ZSocialCommunityDetailComponent,
    ZSocialCommunityFormEditComponent,
    // MemberListInviteComponent,
    ZSocialCommunityCoverComponent,

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
  providers: [LoadingService]
})
export class ZSocialCommunityModule {
}
