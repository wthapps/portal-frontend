import { NgModule } from '@angular/core';
import { SubscriptionGuard } from './subscription-guard';


@NgModule({
  providers: [
    SubscriptionGuard,
  ]
})

export class GuardModule {}
