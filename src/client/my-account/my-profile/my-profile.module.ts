import { NgModule } from '@angular/core';

import { CoreSharedModule } from '../../core/shared/shared.module';

import { MySharedModule } from '../shared/shared.module';
import { MyAccountMyProfileRoutingModule } from './my-profile-routing.module';
import { MyAccountMyProfileComponent } from './my-profile.component';


@NgModule({
  imports: [
    MySharedModule.forRoot(),
    CoreSharedModule,

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
