import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {ZAlbumGridComponent} from "../shared/grid_album.component";
import {ZAlbumListComponent} from "../shared/list_album.component";
import {RouterModule} from "@angular/router";
import {ZPictureGridComponent} from "../shared/grid.component";
import {ZPictureListComponent} from "../shared/list.component";
import {ZPicturePhotoTimelineComponent} from "../shared/timeline-photo.component";
import {ZPictureBarAlbumComponent} from "../shared/bar-album-control.component";



@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [
    ZPictureGridComponent,
    ZPictureListComponent,
    ZPicturePhotoTimelineComponent,
    ZPictureBarAlbumComponent,
  ],
  exports: [
    ZPicturePhotoTimelineComponent,
    ZPictureBarAlbumComponent,
  ]
})

export class ZPictureAlbumDetailModule {
}
