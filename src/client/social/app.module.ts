import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreSharedModule } from '../core/shared/shared.module';
import { ZSocialSharedModule } from './shared/shared.module';

import { ZSocialHomeModule } from './home/home.module';
import { ZSocialCommunityModule } from './communities/communities.module';
import { SocialSettingsModule } from './settings/setting.module';
import { ZSocialProfileModule } from './profile/profile.module';
import { ZSocialPhotoModule } from './photo/photo.module';
import { ZSocialSearchModule } from './search/search.module';
import { ZSocialMyProfileModule } from './my-profile/my-profile.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    ZSocialHomeModule,
    ZSocialCommunityModule,
    SocialSettingsModule,
    ZSocialProfileModule,
    ZSocialPhotoModule,
    ZSocialSearchModule,
    ZSocialMyProfileModule,
    ZSocialSharedModule.forRoot(),
    CoreSharedModule.forRoot(),
  ],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]

})
export class AppModule { }
