import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZMediaRoutingModule } from './media-routing.module';
import { ZMediaComponent } from './media.component';

import { ZMediaPhotoModule } from './photo/photo.module';
import { ZSharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    ZMediaRoutingModule,
    ZMediaPhotoModule,
    ZSharedModule.forRoot()
  ],
  declarations: [
    ZMediaComponent
  ],
  exports: [
    ZMediaComponent
  ],
  providers: []
})

export class ZMediaModule {
}
