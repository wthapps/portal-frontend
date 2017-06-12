import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZSocialMyProfileComponent } from './my-profile.component';
import { SharedModule } from '../../core/shared/shared.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    SharedModule.forRoot(),
  ],
  declarations: [
    ZSocialMyProfileComponent
  ],
  exports: [
    ZSocialMyProfileComponent
  ],
  providers: []
})

export class ZSocialMyProfileModule {
}
