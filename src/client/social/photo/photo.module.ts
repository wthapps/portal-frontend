import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZSocialSharedModule } from '../shared/shared.module';

import {
  ZSocialPhotoComponent,
  PhotoDetailComponent
} from './index';
import { ZSocialPhotoRoutingModule } from './photo-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ZSocialPhotoRoutingModule,
    ZSocialSharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [
    ZSocialPhotoComponent,
    PhotoDetailComponent
  ],
  exports: [
    ZSocialPhotoComponent,
    PhotoDetailComponent
  ],
  providers: []
})
export class ZSocialPhotoModule {
}
