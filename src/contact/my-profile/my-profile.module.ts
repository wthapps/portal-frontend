import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ZContactMyProfileRoutingModule } from './my-profile-routing.module';
import { ZContactMyProfileComponent } from './my-profile.component';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  imports: [
    ReactiveFormsModule,
    ZContactMyProfileRoutingModule,
    CoreModule,
    SharedModule
  ],
  declarations: [
    ZContactMyProfileComponent
  ],
  exports: [
    ZContactMyProfileComponent
  ],
  providers: []
})

export class MyProfileModule {
}
