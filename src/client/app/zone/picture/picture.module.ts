import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ZPictureComponent } from './picture.component';
import { SharedModule } from '../../shared/shared.module';
import { ZoneToolbarComponent,
  BaseMediaComponent,
  ZPictureGridComponent,
  ZPictureListComponent,
  ZoneUploadingComponent,
  ToastsUploadComponent
} from '../shared/index';
import { ZonePhotoComponent, ZoneVideoComponent } from './index';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    ZPictureComponent,
    ZoneToolbarComponent,
    ZonePhotoComponent,
    ZoneVideoComponent,
    BaseMediaComponent,
    ZPictureGridComponent,
    ZPictureListComponent,
    ZoneUploadingComponent,
    ToastsUploadComponent
  ],
  exports: [
    ZPictureComponent
  ]
})

export class ZPictureModule {
}
