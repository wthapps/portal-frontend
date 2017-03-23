import { NgModule } from '@angular/core';
import { SubscribeRoutingModule } from './subscribe-routing.module';
import { SubscribeComponent } from './subscribe.component';
import { UnSubscribeComponent } from './unsubscribe.component';

@NgModule({
  imports: [
    SubscribeRoutingModule
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
