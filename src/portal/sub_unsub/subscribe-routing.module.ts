import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SubscribeComponent } from './subscribe.component';
import { UnSubscribeComponent } from './unsubscribe.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'subscribe', component: SubscribeComponent },
      { path: 'unsubscribe', component: UnSubscribeComponent }
    ])
  ],
  exports: [RouterModule]
})
export class SubscribeRoutingModule {}
