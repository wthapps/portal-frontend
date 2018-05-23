import { NgModule } from '@angular/core';

import { ZMediaSharedWithMeRoutingModule } from './shared-with-me-routing.module';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaSharedWithMeComponent } from './shared-with-me.component';
import { ZMediaSharedWithMeService } from './shared-with-me.service';
import { SharedModule } from '@wth/shared/shared.module';
import { WGridListModule } from '@wth/shared/components/grid-list';
import { WToolbarModule } from '@wth/shared/components/toolbar';

@NgModule({
  imports: [
    ZMediaSharedWithMeRoutingModule,
    ZMediaSharedModule,
    SharedModule,
    WGridListModule,
    WToolbarModule
  ],
  declarations: [ZMediaSharedWithMeComponent],
  exports: [ZMediaSharedWithMeComponent],
  providers: [ZMediaSharedWithMeService]
})
export class ZMediaSharedWithMeModule {}
