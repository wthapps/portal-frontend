import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import {
  ZMediaService,
  ZMediaToolbarComponent,
  ZMediaPhotoListComponent,
  ZMediaPhotoShareItemComponent
} from '../index';
import { ZMediaPhotoDetailComponent } from './photo-detail.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    ZMediaToolbarComponent,
    ZMediaPhotoListComponent,
    ZMediaPhotoDetailComponent,
    ZMediaPhotoShareItemComponent,
  ],
  exports: [
    ZMediaToolbarComponent,
    ZMediaPhotoListComponent,
    ZMediaPhotoDetailComponent,
    ZMediaPhotoShareItemComponent
  ],
  providers: [
    ZMediaService
  ]
})

export class ZMediaPhotoModule {
}
