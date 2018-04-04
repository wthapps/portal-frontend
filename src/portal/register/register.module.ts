import { NgModule } from '@angular/core';

import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';
import { PortalSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [RegisterRoutingModule, PortalSharedModule],
  declarations: [RegisterComponent],
  exports: [RegisterComponent]
})
export class RegisterModule {}
