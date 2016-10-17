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



@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [
    ZAlbumComponent,
    ZAlbumGridComponent,
    ZAlbumDetailComponent,
    ZPictureGridComponent,
    ZPictureListComponent,
    ZPictureBarAlbumComponent,
  ],
  exports: [
    ZAlbumComponent,
    ZAlbumDetailComponent,
  ]
})

export class ZPictureAlbumModule {
}
