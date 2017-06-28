import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../core/shared/shared.module';
import { ZMediaMyProfileComponent } from './my-profile.component';
import { ZMediaMyProfileRoutingModule } from './my-profile-routing.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZMediaMyProfileRoutingModule,
    SharedModule.forRoot(),
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
