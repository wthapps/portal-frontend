import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ZAlbumGridComponent} from "../shared/grid-album.component";
import {ZAlbumListComponent} from "../shared/list-album.component";
import {RouterModule} from "@angular/router";
import {ZAlbumComponent} from "./album.component";
import {ZAlbumDetailComponent} from "./album-detail.component";
import {ZPictureGridComponent} from "../shared/grid.component";
import {ZPictureListComponent} from "../shared/list.component";
import {ZPictureBarAlbumComponent} from "../shared/bar-album-control.component";
import {ZPictureTimelineComponent} from "../shared/timeline.component";
import {GroupByMonthYearPipe} from "../../../shared/pipe/groupby-month-year.pipe";
import {SharedModule} from "../../../shared/shared.module";
import {ZAlbumDetailInfoComponent} from "./album-detail-info.component";



@NgModule({
  imports: [CommonModule, RouterModule, SharedModule],
  declarations: [
    ZAlbumComponent,
    ZAlbumGridComponent,
    ZAlbumDetailComponent,
    ZPictureGridComponent,
    ZPictureListComponent,
    ZPictureBarAlbumComponent,
    ZPictureTimelineComponent,
    ZAlbumDetailInfoComponent
  ],
  exports: [
    ZAlbumComponent,
    ZAlbumDetailComponent,
  ]
})

export class ZPictureAlbumModule {
}
