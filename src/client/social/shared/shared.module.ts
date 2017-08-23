import { NgModule, ModuleWithProviders } from '@angular/core';
import { ZSocialFavoritesComponent } from './favorites/social-favorites.component';

import { CoreSharedModule } from '../../core/shared/shared.module';

import { SocialService } from './services/social.service';
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
import { Ng2HdModule } from '../../core/shared/ng2-hd/ng2-hd.module';
import { ZSocialNotificationsComponent } from '../notifications/notifications.component';
import { ZSocialMembersComponent } from '../friends/members.component';
import { SoPhotoListComponent } from './post/photo-list.component';
import { ZSocialProfileService } from '../profile/profile.service';
import { CoverProfileModule } from '../../core/shared/components/cover-profile/cover-profile.module';
import { SocialFavoriteService } from './services/social-favorites.service';
import { ZSocialShareProfileModule } from './user/list.module';
import { ZSocialShareCommunityFormEditComponent } from './form/edit-community.component';
import { ZSocialShareCommunityFormPreferenceComponent } from './form/preferences-community.component';
import { SocialDataService } from './services/social-data.service';
import { SoUserService } from "./services/social-user.service";
import { SoPostService } from "./services/social-post.service";


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CoreSharedModule.forRoot(),
    // HdModalModule,
    Ng2HdModule,
    CoverProfileModule,
    PostModule,
    ZSocialShareProfileModule
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

    // Notifications
    ZSocialNotificationsComponent,

    // Search
    // ZSocialSearchResultComponent,

    // Community
    ZSocialShareCommunityFormEditComponent,
    ZSocialShareCommunityFormPreferenceComponent

  ],
  exports: [
    ZSocialFavoritesComponent,
    SoPhotoListComponent,
    PostListComponent,
    PostComponent,
    ZSocialNotificationsComponent,

    Ng2HdModule,
    PostModule,
    ZSocialShareProfileModule,
    // Community
    ZSocialShareCommunityFormEditComponent,
    ZSocialShareCommunityFormPreferenceComponent
  ]
})
export class ZSocialSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZSocialSharedModule,
      providers: [
        SocialService,
        SoUserService,
        SoPostService,
        SoCommunityService,
        ZSocialProfileService,
        SocialFavoriteService,
        SocialDataService
      ]
    };
  }
}
