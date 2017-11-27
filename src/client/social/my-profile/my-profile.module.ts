import { NgModule } from '@angular/core';
import { ZSocialMyProfileComponent } from './my-profile.component';
import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZSocialSharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    ZSocialSharedModule,
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
