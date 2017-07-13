import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ZContactMyProfileRoutingModule } from './my-profile-routing.module';
import { ZContactMyProfileComponent } from './my-profile.component';
import { SharedModule } from '../../core/shared/shared.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZContactMyProfileRoutingModule,
    SharedModule.forRoot()
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
