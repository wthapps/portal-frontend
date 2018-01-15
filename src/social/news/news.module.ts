import { NgModule } from '@angular/core';

import { ZSocialNewsComponent } from './news.component';
import { ZSocialSharedModule } from '../shared/shared.module';
import { ZSocialNewsRoutingModule } from './news-routing.module';

@NgModule({
  imports: [
    ZSocialSharedModule,
    ZSocialNewsRoutingModule
  ],
  declarations: [ZSocialNewsComponent],
  exports: [ZSocialNewsComponent],
  providers: [],
})
export class ZSocialNewsModule {
}
