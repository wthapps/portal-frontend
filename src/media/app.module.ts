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
import { ZMediaSharingModule } from './shared-by-me/sharing.module';
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
import { SharedServicesModule } from '@wth/shared/shared-services.module';
import { ServiceModule } from '@media/shared/service/service.module';
import { MediaRenameModalComponent } from '@wth/shared/shared/components/photo/modal/media/media-rename-modal.component';
import { SharingModalComponent } from '@wth/shared/shared/components/photo/modal/sharing/sharing-modal.component';
import { TaggingModalComponent } from '@wth/shared/shared/components/photo/modal/tagging/tagging-modal.component';
import {
  AlbumCreateModalComponent,
  AlbumDeleteModalComponent,
  AlbumEditModalComponent
} from '@media/shared/modal';
import { AddToAlbumModalComponent } from '@wth/shared/shared/components/photo/modal/photo/add-to-album-modal.component';
import { PhotoEditModalComponent } from '@wth/shared/shared/components/photo/modal/photo/photo-edit-modal.component';
import { AlbumDetailInfoComponent } from '@media/album/album-detail-info.component';
import { ZMediaVideoModule } from '@media/video/video.module';
import { SharingDetailInfoComponent } from '@media/shared-by-me/sharing-detail-info.component';

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
    ZMediaSharingModule,
    ZMediaSearchModule,
    ZMediaMyProfileModule,
    ZMediaVideoModule,

    AppRoutingModule,
    ModalModule,
    ServiceModule,
    ZMediaSharedModule.forRoot(),
    CoreModule.forRoot(),
    SharedModule.forRoot(),
    SharedServicesModule.forRoot(),
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
  bootstrap: [AppComponent],
  entryComponents: [
    MediaRenameModalComponent,
    SharingModalComponent,
    TaggingModalComponent,
    AlbumCreateModalComponent,
    AlbumEditModalComponent,
    AlbumDeleteModalComponent,
    AlbumDetailInfoComponent,
    AddToAlbumModalComponent,
    PhotoEditModalComponent,
    SharingDetailInfoComponent
  ]
})
export class AppModule {}
