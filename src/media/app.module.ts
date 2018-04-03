import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ZMediaSharedModule } from './shared/shared.module';

import { ZMediaHomeModule } from './home/home.module';
import { ZMediaAlbumModule } from './album/album.module';
import { ZMediaPhotoModule } from './photo/photo.module';
import { ZMediaFavoriteModule } from './favourites/favourites.module';
import { ZMediaSharedWithMeModule } from './shared-with-me/shared-with-me.module';
import { ZMediaSearchModule } from './search/search.module';
import { ZMediaMyProfileModule } from './my-profile/my-profile.module';
import { ZMediaSharedByMeModule } from './shared-by-me/shared-by-me.module';
import { SharedModule } from '@wth/shared/shared.module';
import { CoreModule } from '@wth/core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@env/environment';
import { StoreModule } from '@ngrx/store';

import { EffectsModule } from '@ngrx/effects';
import { appStore, appEffects } from './shared/store';
import { ModalModule } from '@wth/shared/modals/modals.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,

    ZMediaHomeModule,
    ZMediaAlbumModule,
    ZMediaPhotoModule,
    ZMediaFavoriteModule,
    ZMediaSharedWithMeModule,
    ZMediaSharedByMeModule,
    ZMediaSearchModule,
    ZMediaMyProfileModule,

    AppRoutingModule,
    ModalModule,
    ZMediaSharedModule.forRoot(),
    CoreModule.forRoot(),
    SharedModule.forRoot(),
    StoreModule.forRoot(appStore),
    EffectsModule.forRoot(appEffects),
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
