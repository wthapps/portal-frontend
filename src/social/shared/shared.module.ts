import { NgModule, ModuleWithProviders } from '@angular/core';
import { ZSocialFavoritesComponent } from './favorites/social-favorites.component';

import { SocialService } from './services/social.service';
import { SoCommunityService } from './services/community.service';

import { PostModule } from './second-routes/post/post.module';

import { PostDetailComponent } from './second-routes/post/post-detail.component';
import { PostDetailPhotoComponent } from './second-routes/post/post-detail-photo.component';
import { PostListComponent } from './second-routes/post/post-list.component';
import { ZSocialMembersComponent } from '../friends/members.component';
import { ZSocialProfileService } from '../profile/profile.service';
import { SocialFavoriteService } from './services/social-favorites.service';
import { ZSocialShareProfileModule } from './user/list.module';
import { ZSocialShareCommunityFormEditComponent } from './form/edit-community.component';
import { ZSocialShareCommunityFormPreferenceComponent } from './form/preferences-community.component';
import { SocialDataService } from './services/social-data.service';
import { SoUserService } from './services/social-user.service';
import { SoPostService } from './services/social-post.service';
import { ZSocialSharedHeaderComponent } from './header/header.component';
import { StepByStepGuideModule } from './step-by-step-guide/step-by-step-guide.module';
import { Ng2HdModule } from '@wth/shared/shared/ng2-hd';
import { CoverProfileModule } from '@wth/shared/shared/components/cover-profile/cover-profile.module';
import { SharedModule } from '@wth/shared/shared.module';
import { PostComponent } from './second-routes/post/post.component';
import { PostHeaderComponent } from './second-routes/post/components/post-header.component';
import { PostBodyComponent } from './second-routes/post/components/post-body.component';
import { PostFooterComponent } from './second-routes/post/components/post-footer.component';
import { ZSocialSharedNewsFeedComponent } from './news-feed/news-feed.component';
import { ZSocialLeftMenuComponent } from './component/social-left-menu.component';
import { SoShortcutService } from './services/shortcut.service';
import { ZSocialShortcutSettingComponent } from './shortcut-setting/shortcut-setting.component';
import { MiniEditorModule } from '@wth/shared/shared/components/mini-editor/mini-editor.module';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    // HdModalModule,
    Ng2HdModule,
    CoverProfileModule,
    PostModule,
    ZSocialShareProfileModule,
    MiniEditorModule,
    SharedModule
  ],
  declarations: [
    ZSocialFavoritesComponent,

    ZSocialMembersComponent,
    // List Posts
    PostListComponent,
    PostComponent,
    PostHeaderComponent,
    PostBodyComponent,
    PostFooterComponent,
    PostDetailComponent,
    PostDetailPhotoComponent,

    // Search
    // ZSocialSearchResultComponent,

    // Community
    ZSocialShareCommunityFormEditComponent,
    ZSocialShareCommunityFormPreferenceComponent,

    ZSocialSharedHeaderComponent,
    ZSocialSharedNewsFeedComponent,
    ZSocialShortcutSettingComponent,
    //  Left menu
    ZSocialLeftMenuComponent
  ],
  exports: [
    ZSocialFavoritesComponent,
    PostListComponent,
    PostComponent,

    Ng2HdModule,
    PostModule,
    ZSocialShareProfileModule,

    StepByStepGuideModule,

    // Community
    ZSocialShareCommunityFormEditComponent,
    ZSocialShareCommunityFormPreferenceComponent,

    ZSocialSharedHeaderComponent,
    ZSocialSharedNewsFeedComponent,
    ZSocialShortcutSettingComponent,

    MiniEditorModule,

    //  Left menu
    ZSocialLeftMenuComponent
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
        SocialDataService,
        SoShortcutService
      ]
    };
  }
}
