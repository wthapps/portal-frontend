import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

import { SharedModule } from '../core/shared/shared.module';

import { ZSocialHomeModule } from './home/home.module';
import { ZSocialCommunityModule } from './communities/communities.module';
import { ZoneReportService } from './shared/form/report/report.service';
import { ZSocialSharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { ZSocialProfileComponent } from './profile/profile.component';
import { CoreModule } from '../core/core.module';
import { SocialDataService } from './shared/services/social-data.service';
import { SocialSettingsModule } from './setting/setting.module';
import { ZSocialProfileModule } from './profile/profile.module';
import { ZSocialPhotoModule } from './photo/photo.module';


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    CoreModule.forRoot(),
    SharedModule.forRoot(),
    ZSocialSharedModule,
    ZSocialHomeModule,
    ZSocialCommunityModule,
    SocialSettingsModule,
    ZSocialProfileModule,
    ZSocialPhotoModule,
    AppRoutingModule
  ],

  declarations: [AppComponent,
    // ZSocialSettingComponent,
    // ZSocialProfileComponent

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
    SocialDataService,
    ZoneReportService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
