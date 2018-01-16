import { NgModule } from '@angular/core';

import { ZSocialNewsComponent } from './news.component';
import { ZSocialSharedModule } from '../shared/shared.module';
import { ZSocialNewsRoutingModule } from './news-routing.module';
import { ZSocialNewsShareComponent } from './modal/share.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ZSocialSharedModule,
    ZSocialNewsRoutingModule
  ],
  declarations: [
    ZSocialNewsComponent,
    ZSocialNewsShareComponent
  ],
  exports: [
    ZSocialNewsComponent,
    ZSocialNewsShareComponent
  ],
  providers: [],
})
export class ZSocialNewsModule {
}
