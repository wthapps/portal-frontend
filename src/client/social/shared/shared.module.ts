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
import { Ng2HdModule } from '../../core/shared/ng2-hd/ng2-hd.module';
import { ZSocialNotificationsComponent } from '../notifications/notifications.component';
import { ZSocialMembersComponent } from '../friends/members.component';
import { SoPhotoListComponent } from './post/photo-list.component';
import { ZSocialProfileService } from '../profile/profile.service';
import { CoverProfileModule } from '../../core/partials/cover-profile/cover-profile.module';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    SharedModule,
    // HdModalModule,
    Ng2HdModule,
    CoverProfileModule,
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
    PostComponent,
    ZoneReportComponent,
    ZSocialNotificationsComponent,

    Ng2HdModule,
    CoverProfileModule,
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
