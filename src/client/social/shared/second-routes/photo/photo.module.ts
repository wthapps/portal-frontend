import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ZSocialPhotoComponent,
  PhotoDetailComponent
} from './index';
import { ZSocialPhotoRoutingModule } from './photo-routing.module';
import { ZSocialSharedModule } from '../../shared.module';
import { CoreSharedModule } from '../../../../core/shared/shared.module';

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
