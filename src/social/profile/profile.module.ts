import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZSocialSharedModule } from '../shared/shared.module';

import { ZSocialProfileComponent } from './profile.component';
import { ZSocialProfileAboutComponent } from './about/about.component';
import { ZSocialProfileCoverComponent } from './cover/cover.component';
import { ZSocialPrivacyComponent } from './about/components/privacy.component';
import { ZSocialProfileFormAboutComponent } from './form/about.component';
import { ZSocialProfileFormContactComponent } from './form/contact.component';
import { ZSocialProfileFormWorkEduComponent } from './form/work-edu.component';
import { ZSocialProfileFormInterestComponent } from './form/interest.component';
import { ZSocialProfilePostComponent } from './post/post.component';
import { ZSocialProfileFriendComponent } from './friend/friend.component';
import { ZSocialProfileDataService } from './profile-data.service';
import { SharedModule } from '@wth/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ZSocialSharedModule.forRoot(),
    SharedModule.forRoot()
  ],
  declarations: [
    ZSocialProfileComponent,
    ZSocialProfileCoverComponent,
    ZSocialPrivacyComponent,
    ZSocialProfileFormAboutComponent,
    ZSocialProfileFormContactComponent,
    ZSocialProfileFormInterestComponent,
    ZSocialProfileFormWorkEduComponent,
    ZSocialProfilePostComponent,
    ZSocialProfileFriendComponent,
    ZSocialProfileAboutComponent
  ],
  exports: [
    ZSocialProfileComponent,
    ZSocialProfileCoverComponent,
    ZSocialPrivacyComponent,
    ZSocialProfileFormAboutComponent,
    ZSocialProfileFormContactComponent,
    ZSocialProfileFormWorkEduComponent,
    ZSocialProfileFormInterestComponent,
    ZSocialProfilePostComponent,
    ZSocialProfileFriendComponent,
    ZSocialProfileAboutComponent
  ],
  providers: [ZSocialProfileDataService]
})
export class ZSocialProfileModule {
}
