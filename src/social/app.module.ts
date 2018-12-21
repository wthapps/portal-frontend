import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ZSocialSharedModule } from './shared/shared.module';
import { ZSocialHomeModule } from './home/home.module';
import { CoreModule } from '@wth/core/core.module';
import { ShortcutEffects } from './shared/effects/shortcut-effects';
import { environment } from '@env/environment';
import { appReducer } from './shared/reducers/index';
import { SoProfileEffects } from './shared/effects/so-profile-effects';
import { ModalModule } from '@wth/shared/modals/modals.module';
import { SocialPostsEffects } from './shared/effects/social-posts-effects';
import { SharedServicesModule } from '@wth/shared/shared-services.module';
import { WthCommonModule } from '@shared/common/wth-common.module';
import { PostModule } from '@social/shared/second-routes/post';
import { MiniEditorModule } from '@shared/shared/components/mini-editor/mini-editor.module';
import { ZSocialPhotoModule } from '@social/shared/second-routes/photo/photo.module';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,

    AppRoutingModule,
    ZSocialHomeModule,
    ModalModule,
    WthCommonModule,
    MiniEditorModule,
    // Ng2HdModule,
    PostModule,
    ZSocialPhotoModule,
    ScrollToModule.forRoot(),
    ZSocialSharedModule.forRoot(),
    SharedServicesModule.forRoot(),
    CoreModule.forRoot(),

    StoreModule.forRoot({ app: appReducer }),
    EffectsModule.forRoot([
      ShortcutEffects,
      SoProfileEffects,
      SocialPostsEffects
    ]),
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: false
    }),
    !environment.production
      ? StoreDevtoolsModule.instrument({ maxAge: 50 })
      : []
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
