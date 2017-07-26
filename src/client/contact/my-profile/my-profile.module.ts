import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ZContactMyProfileRoutingModule } from './my-profile-routing.module';
import { ZContactMyProfileComponent } from './my-profile.component';
import { CoreSharedModule } from '../../core/shared/shared.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZContactMyProfileRoutingModule,
    CoreSharedModule.forRoot()
  ],
  declarations: [
    ZContactMyProfileComponent
  ],
  exports: [
    ZContactMyProfileComponent
  ],
  providers: []
})

export class ZContactMyProfileModule {
}
