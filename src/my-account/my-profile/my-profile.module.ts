import { NgModule } from '@angular/core';

import { SharedModule } from '@wth/shared/shared.module';


import { MySharedModule } from '../shared/shared.module';
import { MyAccountMyProfileRoutingModule } from './my-profile-routing.module';
import { MyAccountMyProfileComponent } from './my-profile.component';


@NgModule({
  imports: [
    MySharedModule.forRoot(),
    SharedModule,

    MyAccountMyProfileRoutingModule
  ],
  declarations: [
    MyAccountMyProfileComponent
  ],
  exports: [
    MyAccountMyProfileComponent
  ],
  providers: []
})

export class MyAccountMyProfileModule {
}
