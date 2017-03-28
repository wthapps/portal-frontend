import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../core/shared/shared.module';
import { ZSocialSharedModule } from '../shared/shared.module';

import { ZSocialPhotoComponent } from './photo.component';
import { ZSocialPhotoRoutingModule } from './photo-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ZSocialPhotoRoutingModule,
    SharedModule.forRoot(),
    ZSocialSharedModule.forRoot()
  ],
  declarations: [ZSocialPhotoComponent],
  exports: [ZSocialPhotoComponent],
  providers: []
})
export class ZSocialPhotoModule {
}
