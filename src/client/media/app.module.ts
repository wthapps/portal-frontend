import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ZMediaHomeModule } from './home/home.module';
import { SharedModule } from '../core/shared/shared.module';

import { ZMediaPhotoModule } from './photo/photo.module';
import { ZMediaAlbumModule } from './album/album.module';
import { ZMediaFavoriteModule } from './favourites/favourites.module';
import { ZMediaSharedWithMeModule } from './shared-with-me/shared-with-me.module';
import { ZMediaSearchModule } from './search/search.module';
import { ZMediaMyProfileModule } from './my-profile/my-profile.module';
import { MediaUploaderDataService } from './shared/uploader/media-uploader-data.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    SharedModule.forRoot(),

    AppRoutingModule,
    ZMediaHomeModule,
    ZMediaPhotoModule,
    ZMediaAlbumModule,
    ZMediaFavoriteModule,
    ZMediaSearchModule,
    ZMediaSharedWithMeModule,
    ZMediaMyProfileModule,
  ],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  },
    MediaUploaderDataService],
  bootstrap: [AppComponent]

})
export class AppModule {
}
