import { NgModule } from '@angular/core';

import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';
import { PortalSharedModule } from '../shared/shared.module';
import { ReCaptchaModule } from 'angular2-recaptcha/angular2-recaptcha';

@NgModule({
  imports: [RegisterRoutingModule, PortalSharedModule, ReCaptchaModule],
  declarations: [RegisterComponent],
  exports: [RegisterComponent]
})
export class RegisterModule {}
