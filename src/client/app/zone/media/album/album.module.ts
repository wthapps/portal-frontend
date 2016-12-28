import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ZMediaAlbumService,
  ZMediaAlbumListComponent
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
    ZMediaAlbumListComponent
  ],
  exports: [
    ZMediaAlbumListComponent
  ],
  providers: [
    ZMediaAlbumService
  ]
})

export class ZMediaAlbumModule {
}
