import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import {
  ZMediaPhotoService,
  ZMediaPhotoListComponent,
  ZMediaPhotoDetailComponent,
  ZMediaPhotoItemComponent
} from './index';

import { ZMediaSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ZMediaSharedModule.forRoot()
  ],
  declarations: [
    ZMediaPhotoListComponent,
    ZMediaPhotoDetailComponent,
    ZMediaPhotoItemComponent
  ],
  exports: [
    ZMediaPhotoListComponent,
    ZMediaPhotoDetailComponent,
    ZMediaPhotoItemComponent
  ],
  providers: [
    ZMediaPhotoService
  ]
})

export class ZMediaPhotoModule {
}
