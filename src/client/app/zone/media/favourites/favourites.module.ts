import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ZMediaFavoriteService,
  ZMediaFavoriteListComponent
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
    ZMediaFavoriteListComponent
  ],
  exports: [
    ZMediaFavoriteListComponent
  ],
  providers: [
    ZMediaFavoriteService
  ]
})

export class ZMediaFavoriteModule {
}
