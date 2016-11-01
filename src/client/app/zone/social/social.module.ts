import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { ZSocialComponent } from './social.component';
import { PostModule } from "./post/post.module";


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PostModule
  ],
  declarations: [
    ZSocialComponent
  ],
  exports: [
    ZSocialComponent
  ],
  providers: [],
})

export class ZSocialModule {
}
