import { NgModule } from '@angular/core';

import { SharedModule } from '@wth/shared/shared.module';


import { MySharedModule } from '../shared/shared.module';
import { MyAccountMyProfileRoutingModule } from './my-profile-routing.module';


@NgModule({
  imports: [
    MySharedModule.forRoot(),
    SharedModule,

    MyAccountMyProfileRoutingModule
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: []
})

export class MyAccountMyProfileModule {
}
