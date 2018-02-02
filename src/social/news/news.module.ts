import { NgModule } from '@angular/core';

import { ZSocialNewsComponent } from './news.component';
import { ZSocialSharedModule } from '../shared/shared.module';
import { ZSocialNewsRoutingModule } from './news-routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ZSocialSharedModule,
    ZSocialNewsRoutingModule
  ],
  declarations: [
    ZSocialNewsComponent
  ],
  exports: [
    ZSocialNewsComponent
  ],
  providers: [],
})
export class ZSocialNewsModule {
}
