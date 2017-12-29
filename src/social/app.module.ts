import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ZSocialSharedModule } from './shared/shared.module';

import { ZSocialHomeModule } from './home/home.module';
// import { ZSocialCommunityModule } from './communities/communities.module';
import { SocialSettingsModule } from './settings/setting.module';
// import { ZSocialProfileModule } from './profile/profile.module';
// import { ZSocialSearchModule } from './search/search.module';
import { ZSocialMyProfileModule } from './my-profile/my-profile.module';
import { ZSocialPhotoModule } from './shared/second-routes/photo/photo.module';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '@wth/core/core.module';
import { SharedModule } from '@wth/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,

    AppRoutingModule,
    ZSocialHomeModule,
    // ZSocialCommunityModule,
    SocialSettingsModule,
    // ZSocialProfileModule,
    ZSocialPhotoModule,
    // ZSocialSearchModule,
    // ZSocialMyProfileModule,
    ZSocialSharedModule.forRoot(),
    SharedModule.forRoot(),
    CoreModule.forRoot(),

  ],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '/'
  }],
  bootstrap: [AppComponent]

})
export class AppModule { }
