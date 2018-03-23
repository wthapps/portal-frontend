import { NgModule } from '@angular/core';
// import { ZSocialSharedModule } from '../shared/shared.module';
import { SharedModule } from '@wth/shared/shared.module';
import { MyProfileRoutingModule } from './my-profile-routing.module';
import { CommonModule } from '@angular/common';
import { ZSocialSharedModule } from '../shared/shared.module';
import { ZMyProfileComponent } from '@shared/shared/components/profile/my-profile/my-profile.component';

@NgModule({
  imports: [
    CommonModule,
    ZSocialSharedModule,
    MyProfileRoutingModule,
    SharedModule
  ],
  declarations: [],
  exports: [],
  providers: []
})
export class ZSocialMyProfileModule {}
