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
import { ZoneReportComponent } from './form/report/report.component';
import { Ng2HdModule } from './ng2-hd/ng2-hd.module';
import { ZSocialNotificationsComponent } from '../notifications/notifications.component';
import { ZSocialMembersComponent } from '../members/members.component';
import { PhotoModalDataService } from '../../core/shared/services/photo-modal-data.service';
import { SoPhotoListComponent } from './post/photo-list.component';
import { PhotoUploadService } from '../../core/shared/services/photo-upload.service';
import { ZSocialPrivacyComponent } from '../profile/about/components/privacy.component';
import { ZSocialProfileService } from '../profile/profile.service';


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
    SoPhotoListComponent,

    ZSocialMembersComponent,
    // List Posts
    PostListComponent,
    PostComponent,
    PostHeaderComponent,
    PostBodyComponent,
    PostFooterComponent,
    PostDetailComponent,
    PostDetailPhotoComponent,

    //Share
    ZoneReportComponent,

    // Notifications
    ZSocialNotificationsComponent,

    // Search
    // ZSocialSearchResultComponent,

  ],
  exports: [
    ZSocialFavoritesComponent,
    SoPhotoListComponent,
    PostListComponent,
    ZoneReportComponent,
    ZSocialNotificationsComponent,

    Ng2HdModule,
    SharedModule,
    PostModule
  ]
})
export class ZSocialSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZSocialSharedModule,
      providers: [SocialService, SoUserService, SoPostService, SoCommunityService, ZSocialProfileService]
    };
  }
}
