import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../../shared/shared.module";
import {ZCreatedAlbumToastComponent} from "./created-album-toast.component";



@NgModule({
  imports: [CommonModule, RouterModule, SharedModule],
  declarations: [
    ZCreatedAlbumToastComponent,
  ],
  exports: [
    ZCreatedAlbumToastComponent,
  ]
})

export class ZPictureToastModule {
}
