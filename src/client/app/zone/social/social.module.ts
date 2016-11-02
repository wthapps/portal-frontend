import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { ZSocialComponent } from './social.component';
import { ZSocialTempComponent } from './social-temp.component';
import { PostModule } from "./post/post.module";


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PostModule
  ],
  declarations: [
    ZSocialComponent,
    ZSocialTempComponent
  ],
  exports: [
    ZSocialComponent,
    ZSocialTempComponent
  ],
  providers: [],
})

export class ZSocialModule {
}
