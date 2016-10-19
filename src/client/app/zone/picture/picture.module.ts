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
  ZoneVideoComponent
} from './index';
import { ZAlbumComponent } from "./album/album.component";
import { ZPictureAlbumModule } from "./album/album.module";
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

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,

    // Album Module
    ZPictureAlbumModule,
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

    ZonePhotoComponent,
    ZonePhotoDetailComponent
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
