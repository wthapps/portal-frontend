import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';
import { CoreSharedModule } from '../../core/shared/shared.module';

import { ZMediaMyProfileComponent } from './my-profile.component';
import { ZMediaMyProfileRoutingModule } from './my-profile-routing.module';


@NgModule({
  imports: [
    ZMediaMyProfileRoutingModule,
    ZMediaSharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [
    ZMediaMyProfileComponent
  ],
  exports: [
    ZMediaMyProfileComponent
  ],
  providers: []
})

export class ZMediaMyProfileModule {
}
