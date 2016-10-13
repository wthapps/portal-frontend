import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ZPictureComponent } from "./picture.component";
import {ZAlbumComponent} from "./album/album.component";
import {ZAlbumGridComponent} from "../shared/grid_album.component";



@NgModule({
  imports: [],
  declarations: [
    ZAlbumGridComponent
  ],
  exports: [
    ZAlbumGridComponent
  ]
})

export class ZPictureAlbumModule {
}
