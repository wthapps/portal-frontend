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
  ToastsUploadComponent,
  ZoneSharingComponent,
  ZoneTaggingComponent
} from '../shared/index';

import {
  ZonePhotoComponent,
  ZonePhotoDetailComponent,
  ZoneVideoComponent,
  ZoneFavouritesComponent
} from './index';
import { ZAlbumComponent } from "./album/album.component";
import { LoadingService } from "../../partials/loading/loading.service";
import { ApiBaseService } from "../../shared/services/apibase.service";
import { ZAlbumGridComponent } from "./shared/grid-album.component";
import { ZAlbumDetailComponent } from "./album/album-detail.component";
import { PhotoService } from "../../shared/services/picture/photo.service";
import { AlbumService } from "../../shared/services/picture/album.service";
import { DialogService } from "../../partials/dialogs/dialog.service";
import { ToastsService } from "../../partials/toast/toast-message.service";
import { GroupByMonthYearPipe } from "../../shared/pipe/groupby-month-year.pipe";

import { DataScrollerModule } from 'primeng/primeng';
import {ZPictureToastModule} from "../shared/toast/toast-picture.module";
import {ZPictureBarAlbumComponent} from "./shared/bar-album-control.component";
import {ZAlbumDetailInfoComponent} from "./album/album-detail-info.component";
import {ZPictureFormCreateAlbumComponent} from "../shared/form/form-create-album.component";
import {ZPictureFormAddToAlbumComponent} from "../shared/form/form-add-to-album.component";
import {ZPictureGridRemoveComponent} from "../shared/grid/grid-remove.component";
import {ZPictureTimelineComponent} from "../shared/timeline/timeline.component";
import {ZPictureFormEditAlbumComponent} from "../shared/form/form-edit-album.component";
import {ZAlbumListComponent} from "./shared/list-album.component";

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
    ToastsUploadComponent,
    ZoneSharingComponent,
    ZoneTaggingComponent,
    ZPictureGridRemoveComponent,

    // Photo
    ZonePhotoComponent,
    ZonePhotoDetailComponent,

    // Favourites
    ZoneFavouritesComponent,

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
    ZPictureFormEditAlbumComponent

  ],
  exports: [
    ZPictureComponent
  ],
  providers: [
    LoadingService,
    PhotoService,
    AlbumService,
    DialogService,
    ToastsService
  ],
})

export class ZPictureModule {
}
