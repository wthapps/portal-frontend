import { NgModule } from '@angular/core';
import { SubscribeRoutingModule } from './subscribe-routing.module';
import { SubscribeComponent } from './subscribe.component';
import { UnSubscribeComponent } from './unsubscribe.component';
import { PortalSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SubscribeRoutingModule,
    PortalSharedModule.forRoot()
  ],
  declarations: [
    SubscribeComponent,
    UnSubscribeComponent
  ],
  exports: [
    SubscribeComponent,
    UnSubscribeComponent
  ]
})

export class SubscribeModule {
}
