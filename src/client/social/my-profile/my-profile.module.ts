import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZSocialMyProfileComponent } from './my-profile.component';
import { CoreSharedModule } from '../../core/shared/shared.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    CoreSharedModule.forRoot(),
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
