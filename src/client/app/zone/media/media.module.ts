import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import {
  ZMediaComponent,
  ZMediaService,
  ZMediaToolbarComponent,
  ZMediaPhotoListComponent,
  ZMediaPhotoShareItemComponent
} from './index';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    ZMediaComponent,
    ZMediaToolbarComponent,
    ZMediaPhotoListComponent,
    ZMediaPhotoShareItemComponent,
  ],
  exports: [
    ZMediaComponent,
    ZMediaToolbarComponent,
    ZMediaPhotoListComponent,
    ZMediaPhotoShareItemComponent
  ],
  providers: [
    ZMediaService
  ]
})

export class ZMediaModule {
}
