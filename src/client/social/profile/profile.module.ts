import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../core/shared/shared.module';
import { ZSocialSharedModule } from '../shared/shared.module';

import { ZSocialProfileRoutingModule } from './profile-routing.module';
import { ZSocialProfileComponent } from './profile.component';
import { ZSocialProfileAboutComponent } from './about/about.component';
import { ZSocialProfileCoverComponent } from './cover/cover.component';
import { ZSocialPrivacyComponent } from './about/components/privacy.component';
import { ZSocialProfileFormAboutComponent } from './form/about.component';
import { ZSocialProfileFormContactComponent } from './form/contact.component';
import { ZSocialProfileFormWorkEduComponent } from './form/work-edu.component';
import { ZSocialProfileFormInterestComponent } from './form/interest.component';
import { ZSocialProfilePostComponent } from './post/post.component';

@NgModule({
  imports: [
    CommonModule,
    ZSocialProfileRoutingModule,
    SharedModule.forRoot(),
    ZSocialSharedModule.forRoot()
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
    ZSocialProfileAboutComponent
  ],
  providers: []
})
export class ZSocialProfileModule {
}
