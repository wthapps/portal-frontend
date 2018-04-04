import { NgModule } from '@angular/core';
import { ReCaptchaModule } from 'angular2-recaptcha';

import { AboutComponent } from './about.component';
import { AboutRoutingModule } from './about-routing.module';
import { AboutService } from './about.service';
import { PortalSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [AboutRoutingModule, PortalSharedModule, ReCaptchaModule],
  declarations: [AboutComponent],
  exports: [AboutComponent],
  providers: [AboutService]
})
export class AboutModule {}
