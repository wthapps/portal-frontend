import { NgModule } from '@angular/core';

import { ZMediaSharedByMeRoutingModule } from './shared-by-me-routing.module';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaSharedByMeComponent } from './shared-by-me.component';
import { ZMediaSharedByMeService } from './shared-by-me.service';
import { ZMediaSharingDetailComponent } from './sharing-detail.component';
import { SharedModule } from '@wth/shared/shared.module';

@NgModule({
  imports: [
    ZMediaSharedByMeRoutingModule,
    ZMediaSharedModule.forRoot(),
    SharedModule.forRoot()
  ],
  declarations: [
    ZMediaSharedByMeComponent,
    ZMediaSharingDetailComponent
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
