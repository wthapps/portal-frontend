import { NgModule } from '@angular/core';

import { ZSocialNewsComponent } from './news.component';
import { ZSocialSharedModule } from '../shared/shared.module';
import { ZSocialNewsRoutingModule } from './news-routing.module';
import { SharedModule } from '@shared/shared.module';
import { BoxLoadingModule } from '@wth/shared/shared/components/box-loading/box-loading.module';

@NgModule({
  imports: [SharedModule, ZSocialSharedModule, BoxLoadingModule, ZSocialNewsRoutingModule],
  declarations: [ZSocialNewsComponent],
  exports: [ZSocialNewsComponent],
  providers: []
})
export class ZSocialNewsModule {}
