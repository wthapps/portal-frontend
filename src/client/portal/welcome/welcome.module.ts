import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { PortalSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    WelcomeRoutingModule,
    PortalSharedModule.forRoot()
  ],
  declarations: [
    WelcomeComponent
  ],
  exports: [
    WelcomeComponent
  ]
})

export class WelcomeModule {
}
