import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ZMediaPhotoService,
  ZMediaPhotoListComponent,
  ZMediaPhotoDetailComponent,
  ZMediaPhotoItemComponent,
  ZMediaPhotoFormEditComponent
} from './index';

import { ZMediaSharedModule } from '../shared/shared.module';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ZMediaSharedModule.forRoot()
  ],
  declarations: [
    ZMediaPhotoListComponent,
    ZMediaPhotoDetailComponent,
    ZMediaPhotoItemComponent,
    ZMediaPhotoFormEditComponent
  ],
  exports: [
    ZMediaPhotoListComponent,
    ZMediaPhotoDetailComponent,
    ZMediaPhotoItemComponent,
    ZMediaPhotoFormEditComponent
  ],
  providers: [
    ZMediaPhotoService
  ]
})

export class ZMediaPhotoModule {
}
