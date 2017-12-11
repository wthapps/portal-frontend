import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaMyProfileComponent } from './my-profile.component';
import { ZMediaMyProfileRoutingModule } from './my-profile-routing.module';
import { SharedModule } from '@wth/shared/shared.module';
import { CoreModule } from '@wth/core/core.module';


@NgModule({
  imports: [
    ZMediaMyProfileRoutingModule,
    ZMediaSharedModule.forRoot(),
    SharedModule.forRoot(),
    CoreModule.forRoot()

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
