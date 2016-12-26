import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ZMediaAlbumService,
  ZMediaAlbumItemComponent,
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
    ZMediaAlbumListComponent,
    ZMediaAlbumItemComponent
  ],
  exports: [
    ZMediaAlbumListComponent,
    ZMediaAlbumItemComponent
  ],
  providers: [
    ZMediaAlbumService
  ]
})

export class ZMediaAlbumModule {
}
