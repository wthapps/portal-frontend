import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SampleSharedModule } from '../shared/shared.module';
import { ReCaptchaModule } from 'angular2-recaptcha/angular2-recaptcha';

@NgModule({
  imports: [HomeRoutingModule, SampleSharedModule, ReCaptchaModule],
  declarations: [HomeComponent],
  exports: [HomeComponent],
  providers: []
})
export class HomeModule {}
