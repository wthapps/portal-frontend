import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { PortalSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [HomeRoutingModule, PortalSharedModule.forRoot()],
  declarations: [HomeComponent],
  exports: [HomeComponent],
  providers: []
})
export class HomeModule {}
