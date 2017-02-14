import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

import { SharedModule } from '../core/shared/shared.module';

import { ZSocialHomeModule } from './home/home.module';
import { ZSocialCommunityModule } from './communities/communities.module';
import {ZoneReportService} from "./shared/form/report/report.service";
import {routes} from "./app.routes";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    ZSocialHomeModule,
    ZSocialCommunityModule,
    SharedModule.forRoot()
  ],
  declarations: [AppComponent],
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
