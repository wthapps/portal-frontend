import { NgModule } from '@angular/core';

import { MyAccountComponent } from './my-account.component';
import { MyAccountRoutingModule } from './my-account-routing.module';

@NgModule({
  imports: [MyAccountRoutingModule],
  declarations: [MyAccountComponent],
  exports: [MyAccountComponent]
})
export class MyAccountModule {}
