import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ZSocialSharedModule } from './shared/shared.module';
import { ZSocialHomeModule } from './home/home.module';
import { ZSocialPhotoModule } from './shared/second-routes/photo/photo.module';
import { SocialSettingsModule } from './settings/setting.module';
import { CoreModule } from '@wth/core/core.module';
import { SharedModule } from '@wth/shared/shared.module';
import { ShortcutEffects } from './shared/effects/shortcut-effects';
import { environment } from '@env/environment';
import { appReducer } from './shared/reducers/index';
import { SoProfileEffects } from './shared/effects/so-profile-effects';
import { SocialPostsEffects } from './shared/effects/social-posts-effects';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,

    AppRoutingModule,
    ZSocialHomeModule,
    SocialSettingsModule,
    ZSocialPhotoModule,
    ZSocialSharedModule.forRoot(),
    SharedModule.forRoot(),
    CoreModule.forRoot(),

    StoreModule.forRoot({app: appReducer}),
    EffectsModule.forRoot([ShortcutEffects, SoProfileEffects, SocialPostsEffects]),
    !environment.production ? StoreDevtoolsModule.instrument({maxAge: 50}) : [],

  ],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '/'
  }],
  bootstrap: [AppComponent]

})
export class AppModule { }
