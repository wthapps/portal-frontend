import { NgModule } from '@angular/core';

import { ZMediaSharedWithMeRoutingModule } from './shared-with-me-routing.module';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaSharedWithMeComponent } from './shared-with-me.component';
import { ZMediaSharedWithMeService } from './shared-with-me.service';
import { SharedModule } from '@wth/shared/shared.module';

@NgModule({
  imports: [
    ZMediaSharedWithMeRoutingModule,
    ZMediaSharedModule.forRoot(),
    SharedModule.forRoot()
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
