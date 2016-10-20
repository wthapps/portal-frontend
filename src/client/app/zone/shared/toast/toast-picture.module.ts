import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../../shared/shared.module";
import {ZCreatedAlbumToastComponent} from "./created-album-toast.component";
import {ZAddedToAlbumToastComponent} from "./added-to-album-toast.component";



@NgModule({
  imports: [CommonModule, RouterModule, SharedModule],
  declarations: [
    ZCreatedAlbumToastComponent,
    ZAddedToAlbumToastComponent,
  ],
  exports: [
    ZCreatedAlbumToastComponent,
    ZAddedToAlbumToastComponent,
  ]
})

export class ZPictureToastModule {
}
