import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ZContactMyProfileRoutingModule } from './my-profile-routing.module';
import { CoreModule } from '../../core/core.module';
import { WthCommonModule } from '@wth/shared/common/wth-common.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ZContactMyProfileRoutingModule,
    CoreModule,
    WthCommonModule
  ],
  declarations: [],
  exports: [],
  providers: []
})
export class MyProfileModule {}
