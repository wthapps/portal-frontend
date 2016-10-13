import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ZPictureComponent } from "./picture.component";
import {ZAlbumComponent} from "./album/album.component";
import {ZPictureAlbumModule} from "./album/album.module";
import {LoadingService} from "../../partials/loading/loading.service";
import {ApiBaseService} from "../../shared/services/apibase.service";
import {ZAlbumGridComponent} from "./shared/grid_album.component";



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ZPictureAlbumModule
  ],
  declarations: [
    ZPictureComponent,
    // Album Conponent
    ZAlbumComponent,
  ],
  exports: [
    ZPictureComponent
  ],
  providers: [
    // LoadingService,
    // ApiBaseService
  ],
})

export class ZPictureModule {
}
