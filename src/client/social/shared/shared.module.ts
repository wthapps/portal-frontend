import { NgModule, ModuleWithProviders } from '@angular/core';
import { ZSocialFavoritesComponent } from './favorites/social-favorites.component';

import { SharedModule } from '../../core/shared/shared.module';

import { SoUserService, SocialService, SoPostService } from './services/social.service';
import { SoCommunityService } from './services/community.service';

import { PostModule } from './post/post.module';
import {
  PostComponent,
  PostHeaderComponent,
  PostBodyComponent,
  PostFooterComponent
} from './post/index';
import { PostDetailComponent } from './post/post-detail.component';
import { PostDetailPhotoComponent } from './post/post-detail-photo.component';
import { PostListComponent } from './post/post-list.component';
import { ZSocialProfileComponent } from './profile/profile.component';
import { ZSocialProfileAboutComponent } from './profile/about/about.component';
import { ZSocialProfileFormAboutComponent } from './profile/form/about.component';
import { ZSocialProfileFormContactComponent } from './profile/form/contact.component';
import { ZSocialProfileFormWorkEduComponent } from './profile/form/work-edu.component';
import { ZSocialProfileFormInterestComponent } from './profile/form/interest.component';
import { ZSocialProfileCoverComponent } from './profile/cover/cover.component';
import { ZSocialPrivacyComponent } from './profile/about/components/privacy.component';
import { ZoneReportComponent } from './form/report/report.component';
import { Ng2HdModule } from './ng2-hd/ng2-hd.module';
import { ZSocialNotificationsComponent } from '../notifications/notifications.component';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    SharedModule,
    // HdModalModule,
    Ng2HdModule,
    PostModule
  ],
  declarations: [
    ZSocialFavoritesComponent,

    // List Posts
    PostListComponent,
    PostComponent,
    PostHeaderComponent,
    PostBodyComponent,
    PostFooterComponent,
    PostDetailComponent,
    PostDetailPhotoComponent,

    // Profile
    ZSocialProfileComponent,
    ZSocialProfileAboutComponent,
    // ZSocialProfilePostComponent,
    ZSocialProfileCoverComponent,
    ZSocialProfileFormAboutComponent,
    ZSocialProfileFormContactComponent,
    ZSocialProfileFormWorkEduComponent,
    ZSocialProfileFormInterestComponent,

    //Share
    ZoneReportComponent,

    // Notifications
    ZSocialNotificationsComponent,

    // Search
    // ZSocialSearchResultComponent,
    ZSocialPrivacyComponent

  ],
  exports: [
    ZSocialFavoritesComponent,
    PostListComponent,
    ZoneReportComponent,
    ZSocialNotificationsComponent,

    Ng2HdModule,
    PostModule,
    SharedModule
  ]
})
export class ZSocialSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZSocialSharedModule,
      providers: [SocialService, SoUserService, SoPostService, SoCommunityService]
    };
  }
}
