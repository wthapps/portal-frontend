import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {ZPictureFormCreateAlbumComponent} from "./form-create-album.component";
import {ZPictureFormAddToAlbumComponent} from "./form-add-to-album.component";
import {SharedModule} from "../../../shared/shared.module";



@NgModule({
  imports: [CommonModule, RouterModule, SharedModule],
  declarations: [
    ZPictureFormCreateAlbumComponent,
    ZPictureFormAddToAlbumComponent,
  ],
  exports: [
    ZPictureFormCreateAlbumComponent,
    ZPictureFormAddToAlbumComponent,
  ]
})

export class ZPictureFormModule {
}
