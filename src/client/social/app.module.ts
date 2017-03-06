import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

import { SharedModule } from '../core/shared/shared.module';

import { ZSocialHomeModule } from './home/home.module';
import { ZSocialCommunityModule } from './communities/communities.module';
import { ZoneReportService } from './shared/form/report/report.service';
import { RouterModule } from '@angular/router';
import { ZSocialSharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { ZSocialProfileComponent } from './profile/profile.component';
// import { SocialSettingsModule } from './setting/setting.module';
import { CoreModule } from '../core/core.module';
import { ZSocialHomeComponent } from './home/home.component';
import { SocialDataService } from './shared/services/social-data.service';
import { SocialSettingsModule } from './setting/setting.module';


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    CoreModule.forRoot(),
    SharedModule.forRoot(),
    // SharedModule,
    ZSocialSharedModule,
    ZSocialHomeModule,
    ZSocialCommunityModule,
    // SocialSettingsModule,
    AppRoutingModule
  ],

  declarations: [AppComponent,
    // ZSocialSettingComponent,
    ZSocialProfileComponent

    // // Communities
    // ZSocialCommunityComponent,
    // ZSocialCommunityListComponent,
    // ZSocialCommunityCoverComponent,
    // ZSocialCommunityDetailComponent,
    // // ZSocialCommunityDetailNotificationComponent,
    // ComMemberListComponent,
    // // InvitationListComponent,
    // // ZSocialCommunityDetailAboutComponent,
    // // ZSocialCommunityDetailPostComponent,
    // ZSocialCommunityFormEditComponent,
    // ZSocialCommunityFormPreferenceComponent,
  ],
  // providers: [{
  //   provide: APP_BASE_HREF,
  //   useValue: '<%= APP_BASE %>'
  // }],
  providers: [
    // ZSocialCommunityService,
    // ZSocialProfileService,
    SocialDataService,
    ZoneReportService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
