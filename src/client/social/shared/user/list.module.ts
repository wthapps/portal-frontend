import { NgModule } from '@angular/core';

import { ZSocialShareProfileListComponent }   from './list.component';
import { CoreSharedModule } from '../../../core/shared/shared.module';
import { ZSocialShareProfileMemberComponent } from './item/member.component';
import { ZSocialShareProfileCommunityComponent } from './item/community.component';

@NgModule({
  imports: [
    CoreSharedModule.forRoot()
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
