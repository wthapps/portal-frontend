import { NgModule } from '@angular/core';

import { ZSocialShareProfileListComponent } from './list.component';
import { ZSocialShareProfileMemberComponent } from './item/member.component';
import { ZSocialShareProfileCommunityComponent } from './item/community.component';
import { SharedModule } from '@wth/shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ZSocialShareProfileListComponent,
    ZSocialShareProfileMemberComponent,
    ZSocialShareProfileCommunityComponent
  ],
  exports: [
    ZSocialShareProfileListComponent,
    ZSocialShareProfileMemberComponent,
    ZSocialShareProfileCommunityComponent
  ],
  providers: [],
})
export class ZSocialShareProfileModule {
}
