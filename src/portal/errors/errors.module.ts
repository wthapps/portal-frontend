import { NgModule } from '@angular/core';
import { Page404Component } from './page404.component';
import { Page500Component } from './page500.component';
import { PageErrorsRoutingModule } from './errors-routing.module';
import { PortalSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [PageErrorsRoutingModule, PortalSharedModule.forRoot()],
  declarations: [Page404Component, Page500Component],
  exports: [Page404Component, Page500Component]
})
export class PageErrorsModule {}
