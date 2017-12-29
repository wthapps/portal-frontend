import { NgModule } from '@angular/core';
import { ZSocialMyProfileComponent } from './my-profile.component';
// import { ZSocialSharedModule } from '../shared/shared.module';
import { SharedModule } from '@wth/shared/shared.module';
import { MyProfileRoutingModule } from './my-profile-routing.module';
import { CommonModule } from '@angular/common';
import { ZSocialSharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    ZSocialSharedModule,
    MyProfileRoutingModule,
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
