import { NgModule } from '@angular/core';

// import { SharedModule } from '@wth/shared/shared.module';

import { MySharedModule } from '../shared/shared.module';
import { MyAccountMyProfileRoutingModule } from './my-profile-routing.module';
import { PartialsProfileModule } from '@shared/shared/components/profile/profile.module';

@NgModule({
  imports: [
    MySharedModule,
    PartialsProfileModule,
    // SharedModule,

    MyAccountMyProfileRoutingModule
  ],
  declarations: [],
  exports: [],
  providers: []
})
export class MyAccountMyProfileModule {}
