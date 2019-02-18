import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaMyProfileRoutingModule } from './my-profile-routing.module';
import { CoreModule } from '@wth/core/core.module';
import { PartialsProfileModule } from '@shared/shared/components/profile/profile.module';

@NgModule({
  imports: [
    ZMediaMyProfileRoutingModule,
    ZMediaSharedModule,
    PartialsProfileModule,
    CoreModule
  ],
  declarations: [],
  exports: [],
  providers: []
})
export class ZMediaMyProfileModule {}
