import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import {
  ZMediaComponent,
  ZMediaService,
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
    ZMediaPhotoListComponent,
    ZMediaPhotoShareItemComponent
  ],
  exports: [
    ZMediaComponent,
    ZMediaPhotoListComponent,
    ZMediaPhotoShareItemComponent
  ],
  providers: [
    ZMediaService
  ]
})

export class ZMediaModule {
}
