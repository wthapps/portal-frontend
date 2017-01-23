import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { ZoneComponent } from './index';
import { SharedZoneModule } from './shared/index';
import { ZPictureModule } from './picture/picture.module';
import { ZSocialModule } from './social/social.module';
import { ZMediaModule } from './media/media.module';
import { ZChatModule } from './chat/chat.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ZPictureModule,
    ZSocialModule,
    ZMediaModule,
    ZChatModule,
    SharedZoneModule.forRoot()
  ],
  declarations: [
    ZoneComponent
  ],
  exports: [
    ZoneComponent
  ]
})

export class ZoneModule {
}
