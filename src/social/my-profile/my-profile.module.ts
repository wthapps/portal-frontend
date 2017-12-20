import { NgModule } from '@angular/core';
import { ZSocialMyProfileComponent } from './my-profile.component';
import { ZSocialSharedModule } from '../shared/shared.module';
import { SharedModule } from '@wth/shared/shared.module';


@NgModule({
  imports: [
    ZSocialSharedModule,
    SharedModule,
  ],
  declarations: [
    ZSocialMyProfileComponent
  ],
  exports: [
    ZSocialMyProfileComponent
  ],
  providers: []
})

export class ZSocialMyProfileModule {
}
