import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ZAlbumGridComponent} from "../shared/grid_album.component";
import {ZAlbumListComponent} from "../shared/list_album.component";
import {RouterModule} from "@angular/router";



@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [
    ZAlbumGridComponent,
    ZAlbumListComponent,
  ],
  exports: [
    ZAlbumGridComponent,
    ZAlbumListComponent
  ]
})

export class ZPictureAlbumModule {
}
