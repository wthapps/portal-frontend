import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZSocialSharedModule } from '../shared/shared.module';

import { ZSocialHomeComponent } from './home.component';
// import { SharedModule } from '@wth/shared/shared.module';
import { ModalModule } from '@wth/shared/modals/modals.module';
import { Ng2HdModule } from '@shared/shared/ng2-hd';
import { PostModule } from '@social/shared/second-routes/post';

@NgModule({
  imports: [CommonModule, ZSocialSharedModule, ModalModule, Ng2HdModule,
    PostModule,
    // , SharedModule
  ],
  declarations: [ZSocialHomeComponent],
  exports: [
    Ng2HdModule,
    ZSocialHomeComponent],
  providers: []
})
export class ZSocialHomeModule {}
