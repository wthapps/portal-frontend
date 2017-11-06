import { NgModule } from '@angular/core';

import { ZMediaSharedByMeRoutingModule } from './shared-by-me-routing.module';

import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaSharedByMeComponent } from './shared-by-me.component';
import { ZMediaSharedByMeService } from './shared-by-me.service';

@NgModule({
  imports: [
    ZMediaSharedByMeRoutingModule,
    ZMediaSharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [
    ZMediaSharedByMeComponent
  ],
  exports: [
    ZMediaSharedByMeComponent
  ],
  providers: [
    ZMediaSharedByMeService
  ]
})

export class ZMediaSharedByMeModule {
}
