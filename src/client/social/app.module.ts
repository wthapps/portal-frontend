import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

import { SharedModule } from '../core/shared/shared.module';

import { ZSocialHomeModule } from './home/home.module';
import { ZSocialCommunityModule } from './communities/communities.module';
import { ZoneReportService } from './shared/form/report/report.service';
import { routes, routing } from './app.routes';
import { RouterModule } from '@angular/router';
import { ZSocialSharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { ZSocialSettingComponent } from './setting/setting.component';
import { ZSocialProfileComponent } from './profile/profile.component';
import { SocialSettingsModule } from './setting/setting.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    ZSocialHomeModule,
    ZSocialCommunityModule,
    SocialSettingsModule,
    ZSocialSharedModule,
    SharedModule.forRoot(),
    AppRoutingModule,
    RouterModule.forRoot(routes)
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
    ZoneReportService
  ],
  bootstrap: [AppComponent]

})
export class AppModule {
}
