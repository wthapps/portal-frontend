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
// import { ZMediaMyProfileModule } from './my-profile/my-profile.module';
import { ZMediaSharingModule } from './shared-by-me/sharing.module';
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

import { AddToAlbumModalComponent } from '@wth/shared/shared/components/photo/modal/photo/add-to-album-modal.component';
import { PhotoEditModalComponent } from '@wth/shared/shared/components/photo/modal/photo/photo-edit-modal.component';
import { AlbumDetailInfoComponent } from '@media/album/album-detail-info.component';
// import { ZMediaVideoModule } from '@media/video/video.module';
import { SharingDetailInfoComponent } from '@media/shared-by-me/sharing-detail-info.component';
import { PhotoHtmlModule } from '@media/html/photo-html.module';
import {
  AlbumCreateModalComponent,
  AlbumEditModalComponent,
  AlbumDeleteModalComponent
} from '@shared/components/modal/album';
import { WMediaPreviewModule } from '@shared/components/w-media-preview/media-preview.module';
import { ZMediaTrashModule } from '@media/trash/trash.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LocalStorageModule } from 'angular-2-local-storage';

@NgModule({
  imports: [
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
    }),
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
    // ZMediaMyProfileModule,
    WMediaPreviewModule,
    PhotoHtmlModule,
    ZMediaTrashModule,

    AppRoutingModule,
    ModalModule,
    ServiceModule,
    ZMediaSharedModule.forRoot(),
    CoreModule.forRoot(),
    SharedServicesModule.forRoot(),
    StoreModule.forRoot(appStore),
    EffectsModule.forRoot(appEffects),
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
