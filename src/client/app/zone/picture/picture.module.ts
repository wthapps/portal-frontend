import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ZPictureComponent } from './picture.component';
import { SharedModule } from '../../shared/shared.module';
import {
  ZoneToolbarComponent,
  BaseMediaComponent,
  ZPictureGridComponent,
  ZPictureListComponent,
  ZoneUploadingComponent,
  ZoneSharingComponent,
  ZoneTaggingComponent
} from '../shared/index';

import {
  ZonePhotoComponent,
  ZonePhotoDetailComponent,
  ZoneVideoComponent,
  ZoneFavouritesComponent,
  ZoneSharedWithMeComponent
} from './index';
import { ZAlbumComponent } from './album/album.component';
import { LoadingService } from '../../partials/loading/loading.service';
import { ZAlbumDetailComponent } from './album/album-detail.component';
import { PhotoService } from '../../shared/services/picture/photo.service';
import { AlbumService } from '../../shared/services/picture/album.service';
import { ToastsService } from '../../partials/toast/toast-message.service';

import { DataScrollerModule } from 'primeng/primeng';
import { ZPictureToastModule } from '../shared/toast/toast-picture.module';
import { ZPictureBarAlbumComponent } from './shared/bar-album-control.component';
import { ZAlbumDetailInfoComponent } from './album/album-detail-info.component';

import { ZPictureFormCreateAlbumComponent } from '../shared/form/form-create-album.component';
import { ZPictureFormAddToAlbumComponent } from '../shared/form/form-add-to-album.component';
import { ZPictureEditPhotoComponent } from '../shared/form/form-edit-photo.component';

import { ZPictureGridRemoveComponent } from '../shared/grid/grid-remove.component';
import { ZPictureTimelineComponent } from '../shared/timeline/timeline.component';
import { ZPictureFormEditAlbumComponent } from '../shared/form/form-edit-album.component';
import { ZAlbumGridComponent } from '../shared/grid/grid-album.component';
import { ZAlbumListComponent } from '../shared/list/list-album.component';
import { ZPictureListViewComponent } from './shared/media/list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,

    // Album Module
    // ZPictureAlbumModule,
    // ZPictureFormModule,
    ZPictureToastModule,
    DataScrollerModule
  ],
  declarations: [
    ZPictureComponent,
    ZoneToolbarComponent,
    ZoneVideoComponent,
    BaseMediaComponent,
    ZPictureGridComponent,
    ZPictureListComponent,
    ZoneUploadingComponent,
    ZoneSharingComponent,
    ZoneTaggingComponent,
    ZPictureGridRemoveComponent,

    // Photo
    ZonePhotoComponent,
    ZonePhotoDetailComponent,
    ZPictureEditPhotoComponent,

    // Favourites
    ZoneFavouritesComponent,
    ZoneSharedWithMeComponent,

    // Album
    ZAlbumComponent,
    ZAlbumGridComponent,
    ZAlbumDetailComponent,
    ZPictureBarAlbumComponent,
    ZPictureTimelineComponent,
    ZAlbumDetailInfoComponent,
    ZAlbumListComponent,
    // Form
    ZPictureFormCreateAlbumComponent,
    ZPictureFormAddToAlbumComponent,
    ZPictureFormEditAlbumComponent,


    // new 14/12/2016
    ZPictureListViewComponent


  ],
  exports: [
    ZPictureComponent
  ],
  providers: [
    LoadingService,
    PhotoService,
    AlbumService,
    ToastsService
  ],
})

export class ZPictureModule {
}
