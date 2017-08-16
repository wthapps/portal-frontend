import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ZMediaSharedModule } from './shared/shared.module';
import { CoreSharedModule } from '../core/shared/shared.module';

import { ZMediaHomeModule } from './home/home.module';
import { ZMediaAlbumModule } from './album/album.module';
import { ZMediaPhotoModule } from './photo/photo.module';
import { ZMediaFavoriteModule } from './favourites/favourites.module';
import { ZMediaSharedWithMeModule } from './shared-with-me/shared-with-me.module';
import { ZMediaSearchModule } from './search/search.module';
import { ZMediaMyProfileModule } from "./my-profile/my-profile.module";


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    ZMediaHomeModule,
    ZMediaAlbumModule,
    ZMediaPhotoModule,
    ZMediaFavoriteModule,
    ZMediaSharedWithMeModule,
    ZMediaSearchModule,
    ZMediaMyProfileModule,
    ZMediaSharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]

})
export class AppModule { }
