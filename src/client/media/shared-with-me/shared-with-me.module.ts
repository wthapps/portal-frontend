import { NgModule } from '@angular/core';

import { ZMediaSharedWithMeRoutingModule } from './shared-with-me-routing.module';

import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaSharedWithMeComponent } from './shared-with-me.component';
import { ZMediaSharedWithMeService } from './shared-with-me.service';

@NgModule({
  imports: [
    ZMediaSharedWithMeRoutingModule,
    ZMediaSharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [
    ZMediaSharedWithMeComponent
  ],
  exports: [
    ZMediaSharedWithMeComponent
  ],
  providers: [
    ZMediaSharedWithMeService
  ]
})

export class ZMediaSharedWithMeModule {
}
