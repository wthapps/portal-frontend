import { NgModule, ModuleWithProviders } from '@angular/core';
import { ZSocialFavoritesComponent } from './favorites/social-favorites.component';

import { SocialService } from './services/social.service';
import { SoCommunityService } from './services/community.service';

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
// import { SharedModule } from '@wth/shared/shared.module';
import { ZSocialSharedNewsFeedComponent } from './news-feed/news-feed.component';
import { ZSocialLeftMenuComponent } from './component/social-left-menu.component';
import { SoShortcutService } from './services/shortcut.service';
import { ZSocialShortcutSettingComponent } from './shortcut-setting/shortcut-setting.component';
import { MiniEditorModule } from '@wth/shared/shared/components/mini-editor/mini-editor.module';
import { ZSocialCoverComponent } from '@social/shared/cover/cover.component';
import { BoxLoadingModule } from '@wth/shared/shared/components/box-loading/box-loading.module';
import { WthCommonModule } from '@shared/common/wth-common.module';
import { ModalModule } from '@shared/components/modal/modal.module';
import { WMediaSelectionModule } from '@shared/components/w-media-selection/w-media-selection.module';
import { ComponentsModule } from '@shared/components/components.module';
import { FileModule } from '@shared/shared/components/file/file.module';
import { PartialModule } from '@shared/partials';
import { ModalDockModule } from '@shared/shared/components/modal/dock.module';
import { ZSharedMenuModule } from '@shared/shared/components/menu/menu.module';
import { WNavTabModule } from '@shared/components/w-nav-tab/w-nav-tab.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { InputSwitchModule, CheckboxModule, RadioButtonModule,
   AutoCompleteModule, CalendarModule, PanelMenuModule, TooltipModule } from 'primeng/primeng';
import { ZSharedReportModule } from '@shared/shared/components/zone/report/report.module';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { WTHEmojiModule } from '@shared/components/emoji/emoji.module';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // Wth common module
    WthCommonModule,

    // custom component
    Ng2HdModule,
    ModalModule,
    PipeModule,
    WMediaSelectionModule,
    ComponentsModule,
    FileModule,
    PartialModule,
    // PartialsProfileModule,
    CoverProfileModule,
    ModalDockModule,
    ZSharedMenuModule,
    WNavTabModule,
    ZSharedReportModule,

    ZSocialShareProfileModule,
    MiniEditorModule,
    BoxLoadingModule,
    WTHEmojiModule,

    // third party libs
    TagInputModule,
    InputSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    AutoCompleteModule,
    CalendarModule,
    PanelMenuModule,
    TooltipModule,


    // SharedModule
  ],
  declarations: [
    ZSocialFavoritesComponent,

    ZSocialMembersComponent,

    // Search
    // ZSocialSearchResultComponent,

    // Community
    ZSocialShareCommunityFormEditComponent,
    ZSocialShareCommunityFormPreferenceComponent,

    ZSocialSharedHeaderComponent,
    ZSocialSharedNewsFeedComponent,
    ZSocialShortcutSettingComponent,
    //  Left menu
    ZSocialLeftMenuComponent,

    ZSocialCoverComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // Wth common module
    WthCommonModule,

    // custom component
    Ng2HdModule,
    ModalModule,
    WMediaSelectionModule,
    ComponentsModule,
    FileModule,
    PartialModule,
    // PartialsProfileModule,
    CoverProfileModule,
    ModalDockModule,
    ZSharedMenuModule,
    WNavTabModule,
    ZSharedReportModule,


    PipeModule,
    ZSocialShareProfileModule,
    MiniEditorModule,
    BoxLoadingModule,
    WTHEmojiModule,

    // third party libs
    TagInputModule,
    InputSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    AutoCompleteModule,
    CalendarModule,
    PanelMenuModule,
    TooltipModule,


    ZSocialFavoritesComponent,

    // Ng2HdModule,
    // ZSocialShareProfileModule,

    StepByStepGuideModule,

    // Community
    ZSocialShareCommunityFormEditComponent,
    ZSocialShareCommunityFormPreferenceComponent,

    ZSocialSharedHeaderComponent,
    ZSocialSharedNewsFeedComponent,
    ZSocialShortcutSettingComponent,

    MiniEditorModule,

    //  Left menu
    ZSocialLeftMenuComponent,

    ZSocialCoverComponent
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
