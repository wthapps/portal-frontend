import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaMyProfileRoutingModule } from './my-profile-routing.module';
import { SharedModule } from '@wth/shared/shared.module';
import { CoreModule } from '@wth/core/core.module';


@NgModule({
  imports: [
    ZMediaMyProfileRoutingModule,
    ZMediaSharedModule,
    SharedModule,
    CoreModule

  ],
  declarations: [
  ],
  exports: [
  ],
  providers: []
})

export class ZMediaMyProfileModule {
}
