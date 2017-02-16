import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

import { SharedModule } from '../core/shared/shared.module';

import { ZSocialHomeModule } from './home/home.module';
import { ZoneReportService } from './shared/form/report/report.service';
import { routes, routing } from './app.routes';
import { RouterModule } from '@angular/router';
import { ZSocialSharedModule } from './shared/shared.module';
import { ZSocialCommunityModule } from './communities/communities.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    ZSocialHomeModule,
    ZSocialSharedModule,
    ZSocialCommunityModule,
    SharedModule.forRoot(),
    routing
  ],
  declarations: [AppComponent,

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
